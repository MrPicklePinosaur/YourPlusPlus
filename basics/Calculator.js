var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TokenTypes;
(function (TokenTypes) {
    TokenTypes[TokenTypes["NUMBER"] = 0] = "NUMBER";
    TokenTypes[TokenTypes["ADDITION"] = 1] = "ADDITION";
    TokenTypes[TokenTypes["SUBTRACTION"] = 2] = "SUBTRACTION";
    TokenTypes[TokenTypes["MULTIPLICATION"] = 3] = "MULTIPLICATION";
    TokenTypes[TokenTypes["DIVISION"] = 4] = "DIVISION";
    TokenTypes[TokenTypes["EOF"] = 5] = "EOF";
    TokenTypes[TokenTypes["OPENBRACKET"] = 6] = "OPENBRACKET";
    TokenTypes[TokenTypes["CLOSEBRACKET"] = 7] = "CLOSEBRACKET";
})(TokenTypes || (TokenTypes = {}));
var ScriptError = /** @class */ (function (_super) {
    __extends(ScriptError, _super);
    function ScriptError(name, message, position) {
        var _this = _super.call(this, message) || this;
        _this.name = name;
        _this.message = message;
        _this.position = position;
        return _this;
    }
    return ScriptError;
}(Error));
var CalcLexer = /** @class */ (function () {
    function CalcLexer(script) {
        this.ip = -1; //position of character (instruction pointer, prob rename later)
        this.script = script;
        this.nextChar();
    }
    CalcLexer.prototype.newToken = function (type, value) {
        return { type: type, value: value, position: this.ip };
    };
    CalcLexer.prototype.nextChar = function () {
        this.ip += 1;
        if (this.ip > this.script.length - 1) {
            this.curChar = null;
        }
        else {
            this.curChar = this.script.charAt(this.ip).toString();
        }
    };
    CalcLexer.prototype.handleInteger = function () {
        var soFar = '';
        while (true) {
            //if reach end of file or hit a non number
            if (!this.curChar || !(/\d/).test(this.curChar)) {
                break;
            }
            soFar += this.curChar;
            this.nextChar();
        }
        return this.newToken(TokenTypes.NUMBER, parseInt(soFar));
    };
    CalcLexer.prototype.nextToken = function () {
        var token = null;
        while (true) { //keep searching until a valid token is found
            if ((/\d/).test(this.curChar)) { //if the current character is a number
                return this.handleInteger();
            }
            else if (this.curChar == '+') {
                token = this.newToken(TokenTypes.ADDITION, null);
            }
            else if (this.curChar == '-') {
                token = this.newToken(TokenTypes.SUBTRACTION, null);
            }
            else if ((/[\*x]/).test(this.curChar)) {
                token = this.newToken(TokenTypes.MULTIPLICATION, null);
            }
            else if (this.curChar == '/') {
                token = this.newToken(TokenTypes.DIVISION, null);
            }
            else if (this.curChar == null) {
                token = this.newToken(TokenTypes.EOF, null);
            }
            else if (this.curChar == '(') {
                token = this.newToken(TokenTypes.OPENBRACKET, null);
            }
            else if (this.curChar == ')') {
                token = this.newToken(TokenTypes.CLOSEBRACKET, null);
            }
            this.nextChar();
            if (token != null) {
                return token;
            }
        }
    };
    return CalcLexer;
}());
var CalcParser = /** @class */ (function () {
    function CalcParser(lexer) {
        this.tokens = [];
        this.lexer = lexer;
    }
    // SYNTAX-DIRECTION INTERPRETER CODE
    CalcParser.prototype.evalFactor = function () {
        var ans = 0;
        this.curToken = this.lexer.nextToken();
        if (this.curToken.type == TokenTypes.NUMBER) {
            ans = this.curToken.value;
        }
        else if (this.curToken.type == TokenTypes.OPENBRACKET) {
            ans = this.evalExpr();
            this.comp(this.curToken, TokenTypes.CLOSEBRACKET);
        }
        else {
            throw new ScriptError('Syntax Error', 'Invalid Factor', this.curToken.position);
        }
        this.curToken = this.lexer.nextToken();
        return ans;
    };
    CalcParser.prototype.evalTerm = function () {
        var ans = this.evalFactor();
        while (true) {
            if (this.curToken.type != TokenTypes.MULTIPLICATION && this.curToken.type != TokenTypes.DIVISION) {
                break;
            }
            if (this.curToken.type == TokenTypes.MULTIPLICATION) {
                ans *= this.evalFactor();
            }
            else if (this.curToken.type == TokenTypes.DIVISION) {
                var divisor = this.evalFactor();
                if (divisor == 0) {
                    throw new ScriptError('Math Error', 'Division by Zero', this.curToken.position);
                }
                ans /= divisor;
            }
        }
        return ans;
    };
    CalcParser.prototype.evalExpr = function () {
        var ans = this.evalTerm();
        while (true) {
            if (this.curToken.type != TokenTypes.ADDITION && this.curToken.type != TokenTypes.SUBTRACTION) {
                break;
            }
            if (this.curToken.type == TokenTypes.ADDITION) {
                ans += this.evalTerm();
            }
            else if (this.curToken.type == TokenTypes.SUBTRACTION) {
                ans -= this.evalTerm();
            }
        }
        return ans;
    };
    CalcParser.prototype.comp = function (token, tokenType) {
        if (token.type != tokenType) {
            throw new ScriptError('Syntax Error', 'Invalid syntax at position', token.position);
        }
    };
    return CalcParser;
}());
var CalcInterpreter = /** @class */ (function () {
    function CalcInterpreter() {
    }
    //INTERMEDIATE REPRESENTATION INTERPRETER CODE
    CalcInterpreter.prototype.visitTree = function (tree) {
        this.visit(tree.root);
    };
    CalcInterpreter.prototype.visit = function (node) {
        if (node == null) {
            throw new ScriptError("NullException", "Node attempting to visit is null", node.token.position);
        }
        var binop = [TokenTypes.ADDITION, TokenTypes.SUBTRACTION, TokenTypes.MULTIPLICATION, TokenTypes.DIVISION];
        if (binop.indexOf(node.type) != -1) {
            return this.visit_BinOp(node);
        }
        else if (node.type == TokenTypes.NUMBER) {
            return this.visit_Number(node);
        }
        else {
            throw new ScriptError("", "Invalid node type", node.token.position);
        }
    };
    CalcInterpreter.prototype.visit_BinOp = function (node) {
        if (node.type == TokenTypes.ADDITION) {
            return this.visit(node.left) + this.visit(node.right);
        }
        else if (node.type == TokenTypes.SUBTRACTION) {
            return this.visit(node.left) - this.visit(node.right);
        }
        else if (node.type == TokenTypes.MULTIPLICATION) {
            return this.visit(node.left) * this.visit(node.right);
        }
        else if (node.type == TokenTypes.DIVISION) {
            return this.visit(node.left) / this.visit(node.right);
        }
        else {
            throw new ScriptError("", "BinOp not found", node.token.position);
        }
    };
    CalcInterpreter.prototype.visit_Number = function (node) {
        var val = node.value;
        if (val == null) {
            throw new ScriptError("NullException", "Number node value is null", node.token.position);
        }
        return val;
    };
    return CalcInterpreter;
}());
var AST = /** @class */ (function () {
    function AST() {
    }
    return AST;
}());
var ASTNode = /** @class */ (function () {
    function ASTNode(token) {
        this.token = token;
        this.type = token.type;
        this.value = token.value;
    }
    ASTNode.prototype.isLeaf = function () {
        return (this.left == null && this.right == null) ? true : false;
    };
    return ASTNode;
}());
var raw_input = '';
var isError = false;
document.getElementById('run-button').addEventListener('click', function () {
    //Build an AST
    var ast = new AST();
    //var one = new ASTNode();
    var editor = document.getElementById('editor');
    var script = editor.innerHTML;
    //run code
    var lexer = new CalcLexer(script);
    var interpreter = new CalcParser(lexer);
    var buildOutput = null;
    try {
        buildOutput = interpreter.evalExpr().toString();
    }
    catch (e) {
        //todo: add syntax highlighting for the position with the error
        buildOutput = e + " at position " + e.position;
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
