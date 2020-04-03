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
    EOF,
    OPENBRACKET,
    CLOSEBRACKET
}

class CalcInterpreter {

    script: string;
    ip: number = -1; //position of character (instruction pointer, prob rename later)
    curChar: string;

    tokens: Token[] = [];
    curToken: Token;

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
                return this.newToken(TokenTypes.EOF, null);
            } else if (this.curChar == '(') {
                token = this.newToken(TokenTypes.OPENBRACKET, null);
            } else if (this.curChar == ')') {
                token = this.newToken(TokenTypes.CLOSEBRACKET, null);
            }

            this.nextChar();
            if (token != null) {
                return token;
            }

        }
    }

    evalFactor(): number {

        var ans = 0;

        this.curToken = this.nextToken();

        if (this.curToken.type == TokenTypes.NUMBER) {
            ans = this.curToken.value;
        } else if (this.curToken.type == TokenTypes.OPENBRACKET) {
            ans = this.evalExpr();
            this.comp(this.curToken,TokenTypes.CLOSEBRACKET);
        } else {
            throw SyntaxError("Invalid Factor");
        }

        this.curToken = this.nextToken();

        return ans;
    }

    evalTerm(): number {

        var ans = this.evalFactor();

        while (true) {

            if (this.curToken.type != TokenTypes.MULTIPLICATION && this.curToken.type != TokenTypes.DIVISION) {
                break;
            }

            if (this.curToken.type == TokenTypes.MULTIPLICATION) {
                ans *= this.evalFactor();
            } else if (this.curToken.type == TokenTypes.DIVISION) {
                var divisor = this.evalFactor()
                if (divisor == 0) {
                    throw Error(`Division by Zero`);
                }
                ans /= divisor;
            } 


        }

        return ans;
    }


    evalExpr(): number {
        var ans = this.evalTerm();

        while (true) {
            if (this.curToken.type != TokenTypes.ADDITION && this.curToken.type != TokenTypes.SUBTRACTION) {
                break;
            }
            
            if (this.curToken.type == TokenTypes.ADDITION) {
                ans += this.evalTerm();
            } else if (this.curToken.type == TokenTypes.SUBTRACTION) {
                ans -= this.evalTerm();
            } 

        }

        return ans;
    }

    comp(token: Token, tokenType: TokenTypes) {

        if (token.type != tokenType) {
            throw SyntaxError(`Invalid syntax at position ${token.position}`);
        }
    }

}

document.getElementById('run-button').addEventListener('click',function() {
    var script = (<HTMLInputElement>document.getElementById('editor')).value;

    //run code
    var interpreter = new CalcInterpreter(script);
    var buildOutput: string = null;
    
    try {
        buildOutput = interpreter.evalExpr().toString();
    } catch(e) {
        //todo: add syntax highlighting for the position with the error
        buildOutput = `ERROR: ${e}`
    }

    var out = document.getElementById('output');
    out.textContent = buildOutput;
    
});