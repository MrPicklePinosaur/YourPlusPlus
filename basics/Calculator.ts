interface Token {
    type: TokenTypes;
    value: any;
    position: number;
}

enum TokenTypes {
    NUMBER,
    ADDITION,
    SUBTRACTION,
    MULTIPLICATION,
    DIVISION,
    SUPERSCRIPT,
    EOF,
    OPENBRACKET,
    CLOSEBRACKET,
}

enum ParseMode {
    VALUE,
    UNOP,
    BINOP
}

class ScriptError extends Error {
    position: number;

    constructor(name: string, message: string, position: number) {
        super(message);
        this.name = name;
        this.message = message;
        this.position = position;
    }
}

class CalcLexer {

    script: string;
    ip: number = -1; //position of character (instruction pointer, prob rename later)
    curChar: string;

    constructor(script: string) {
        this.script = script;
        this.nextChar();
    }

    newToken(type: TokenTypes, value: any): Token {
        return {type: type, value: value, position: this.ip};
    }

    nextChar(): void {
        this.ip += 1;
        if (this.ip > this.script.length-1) {
            this.curChar = null;
        } else {
            this.curChar = this.script.charAt(this.ip).toString();
        }
    }

    handleInteger(): Token { //handle multi character numbers
        var soFar: string = '';

        while (true) {
            //if reach end of file or hit a non number
            if (!this.curChar || !(/\d/).test(this.curChar)) { break; }
            soFar += this.curChar;
            this.nextChar();
        }

        return this.newToken(TokenTypes.NUMBER, parseInt(soFar));
    }
    
    nextToken(): Token {
        var token: Token = null;
        while(true) { //keep searching until a valid token is found

            if ((/\d/).test(this.curChar)) { //if the current character is a number
                return this.handleInteger();
            } else if (this.curChar == '+') {
                token = this.newToken(TokenTypes.ADDITION, null);
            } else if (this.curChar == '-') {
                token = this.newToken(TokenTypes.SUBTRACTION, null);
            } else if ((/[\*x]/).test(this.curChar)) {
                token = this.newToken(TokenTypes.MULTIPLICATION, null);
            } else if (this.curChar == '/') {
                token = this.newToken(TokenTypes.DIVISION, null);
            } else if (this.curChar == null) {
                token = this.newToken(TokenTypes.EOF, null);
            } else if (this.curChar == '(') {
                token = this.newToken(TokenTypes.OPENBRACKET, null);
            } else if (this.curChar == ')') {
                token = this.newToken(TokenTypes.CLOSEBRACKET, null);
            } else if (this.curChar == '^') {
                token = this.newToken(TokenTypes.SUPERSCRIPT, null);
            }

            this.nextChar();
            if (token != null) {
                return token;
            }

        }
    }
}

class CalcParser {

    lexer: CalcLexer;
    tokens: Token[] = [];
    curToken: Token;

    constructor(lexer: CalcLexer) {
        this.lexer = lexer;
    }

    /*
    parseExpr - addition and subtraction
    parseTerm - multiplication and division and unary operators
    parseExpo - exponenets
    parseFactor - brackets 
    */

    parseFactor(): ASTNode {

        this.curToken = this.lexer.nextToken();
        var curNode: ASTNode;

        if (this.curToken.type == TokenTypes.ADDITION || this.curToken.type == TokenTypes.SUBTRACTION) {
            return new ASTNode(this.curToken,ParseMode.UNOP,this.parseFactor(),null);
        } else if (this.curToken.type == TokenTypes.NUMBER) {
            curNode = new ASTNode(this.curToken,ParseMode.VALUE,null,null);
        } else if (this.curToken.type == TokenTypes.OPENBRACKET) {
            curNode = this.parseExpr();
            this.comp(this.curToken,TokenTypes.CLOSEBRACKET);
        } else {
            throw new ScriptError('Syntax Error','Invalid Factor',this.curToken.position);
        }

        this.curToken = this.lexer.nextToken();

        return curNode;
    }

    parseExpo(): ASTNode {
        var curNode = this.parseFactor();
        var op_token: Token;

        while(true) {
            if (this.curToken.type != TokenTypes.SUPERSCRIPT) { break; }

            curNode = new ASTNode(this.curToken,ParseMode.BINOP,curNode,this.parseFactor());
        }

        return curNode;
    }


    parseTerm(): ASTNode {

        var curNode = this.parseExpo();
        var op_token: Token;

        while (true) {

            if (this.curToken.type != TokenTypes.MULTIPLICATION && this.curToken.type != TokenTypes.DIVISION) {
                break;
            }

            if (this.curToken.type == TokenTypes.MULTIPLICATION) {
                op_token = this.curToken;
                var right = this.parseExpo();
            } else if (this.curToken.type == TokenTypes.DIVISION) {
                op_token = this.curToken;
                var right = this.parseExpo();
                if (right.value == 0) {
                    throw new ScriptError('Math Error','Division by Zero',this.curToken.position);
                }
            } 
            curNode = new ASTNode(op_token,ParseMode.BINOP,curNode,right);
        }

        return curNode;
    }


    parseExpr(): ASTNode {
        var curNode = this.parseTerm();
        var op_token: Token;

        while (true) {
            if (this.curToken.type != TokenTypes.ADDITION && this.curToken.type != TokenTypes.SUBTRACTION) {
                break;
            }
            
            if (this.curToken.type == TokenTypes.ADDITION) {
                op_token = this.curToken;
                var right = this.parseTerm();

            } else if (this.curToken.type == TokenTypes.SUBTRACTION) {
                op_token = this.curToken;
                var right = this.parseTerm();
            } 

            
            curNode = new ASTNode(op_token,ParseMode.BINOP,curNode,right);
        }

        return curNode;
    }

    comp(token: Token, tokenType: TokenTypes) {

        if (token.type != tokenType) {
            throw new ScriptError('Syntax Error','Invalid syntax at position', token.position);
        }
    }
}

class CalcInterpreter {
    //TODO: MAKE THIS CLASS STATAIC LATER
    
    //INTERMEDIATE REPRESENTATION INTERPRETER CODE
    visitTree(tree: AST): number {
        return this.visit(tree.root);
    }

    visit(node: ASTNode): number {
        if (node == null) {
            throw new ScriptError("NullException","Node attempting to visit is null",node.token.position);
        }

        if (node.parseMode == ParseMode.BINOP) {
            return this.visit_BinOp(node);
        } else if (node.parseMode == ParseMode.UNOP) {
            return this.visit_UnOp(node);
        } else if (node.parseMode == ParseMode.VALUE) {
            return this.visit_Value(node);
        } else {
            throw new ScriptError("","Invalid node type",node.token.position);
        }
    }

    visit_BinOp(node: ASTNode): number { 
        if (node.type == TokenTypes.ADDITION) {
            return this.visit(node.left) + this.visit(node.right);
        } else if (node.type == TokenTypes.SUBTRACTION) {
            return this.visit(node.left) - this.visit(node.right);
        } else if (node.type == TokenTypes.MULTIPLICATION) {
            return this.visit(node.left) * this.visit(node.right);
        } else if (node.type == TokenTypes.DIVISION) {
            return this.visit(node.left) / this.visit(node.right);
        } else if (node.type == TokenTypes.SUPERSCRIPT) {
            return Math.pow(this.visit(node.left),this.visit(node.right));
        } else {
            throw new ScriptError("","BinOp not found",node.token.position);
        }
    }

    visit_UnOp(node: ASTNode): number {

        if (node.right != null) { 
            throw new ScriptError("","Invalid node format, UnOp node should not have a right child",node.token.position); 
        }

        if (node.type == TokenTypes.SUBTRACTION) {
            return -1*this.visit(node.left) || -1;
        } else if (node.type == TokenTypes.ADDITION) {
            return this.visit(node.left) || 1;
        } else {
            throw new ScriptError("","UnOp not found",node.token.position);
        }
    }

    visit_Value(node: ASTNode) {
        var val = node.value;
        if (val == null) {       
            throw new ScriptError("NullException","Value node value is null",node.token.position);
        }
        return val;
    }


}

class AST {

    root: ASTNode;

    contents() {
        var result = this.traverse(this.root);
        //result = (result.length > 0) ? result.slice(0,result.length-1) : result;
        return `<${result}>`;
    }

    traverse(node: ASTNode): string {
        var str = '';//`op:${node.type},`;
        if (node.isLeaf()) {
            console.log(node);
            return `${node.value}`;
        }
        if (node.left != null) { str += `(${this.traverse(node.left)})`; }
        if (node.right != null) { str += `(${this.traverse(node.right)})`; }
        
        return str;
    }
}

class ASTNode {

    token: Token;
    parseMode: ParseMode;
    type: TokenTypes;
    value: any; 
    left: ASTNode;
    right: ASTNode;

    constructor(token: Token, parseMode: ParseMode, left: ASTNode, right: ASTNode) {
        this.token = token;
        this.parseMode = parseMode;
        this.type = token.type;
        this.value = token.value;
        this.left = left;
        this.right = right;
    }
    
    isLeaf(): Boolean {
        return (this.left == null && this.right == null) ? true : false;
    }
}

var raw_input = '';
var isError = false;
document.getElementById('run-button').addEventListener('click',function() {
    //Build an AST
    var ast = new AST();

    //var one = new ASTNode();




    var editor = (<HTMLInputElement>document.getElementById('editor'));
    var script = editor.innerHTML;

    //run code
    var lexer = new CalcLexer(script);
    var parser = new CalcParser(lexer);
    var interpreter = new CalcInterpreter();
    var buildOutput: string = null;
    
    try {
        //buildOutput = interpreter.parseExpr().toString();
        var root = parser.parseExpr();
        var ast = new AST();
        ast.root = root;
        console.log(ast.contents());

        buildOutput = interpreter.visitTree(ast).toString();


    } catch(e) {
        //todo: add syntax highlighting for the position with the error
        buildOutput = `${e} at position ${e.position}`

        /*
        raw_input = script;
        editor.innerHTML = `${script.slice(0,e.position)}<span class="underline">${script.slice(e.position,e.position+1)}</span>${script.slice(e.position+1,script.length)}`
        isError = true;
        */
    }

    var out = document.getElementById('output');
    out.textContent = buildOutput; 
});


/*
document.getElementById('editor').addEventListener('input', function() {//wipe textunderlines after edit
    if (isError) {
        var editor = (<HTMLInputElement>document.getElementById('editor'));
        editor.innerHTML = raw_input;
        isError = false;
    }
});
*/
