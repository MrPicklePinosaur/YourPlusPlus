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
    EOF
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
            }

            this.nextChar();
            if (token != null) {
                return token;
            }

        }
    }

    evaluate(): number {
        var product = 1;
        this.curToken = this.nextToken();

        this.comp(this.curToken, TokenTypes.NUMBER);
        product = this.curToken.value;

        while (true) {

            if (this.curToken.type != TokenTypes.MULTIPLICATION && this.curToken.type != TokenTypes.DIVISION) {
                break;
            }

            this.curToken = this.nextToken();


            if (this.curToken.type == TokenTypes.MULTIPLICATION) {
                this.curToken = this.nextToken();
                this.comp(this.curToken, TokenTypes.NUMBER);
                product *= this.curToken.value;
            } else if (this.curToken.type == TokenTypes.DIVISION) {
                this.curToken = this.nextToken();
                this.comp(this.curToken, TokenTypes.NUMBER);
                if (this.curToken.value == 0) {
                    throw Error(`Division by Zero`);
                }
                product /= this.curToken.value;
            } 

        }

        return product;
    }


    evalBedmas(): number {
        var sum = 0;

        sum += this.evaluate();

        while (true) {
            if (this.curToken.type != TokenTypes.ADDITION && this.curToken.type != TokenTypes.SUBTRACTION) {
                break;
            }
            
            this.curToken = this.nextToken();

            if (this.curToken.type == TokenTypes.ADDITION) {
                sum += this.evaluate();
            } else if (this.curToken.type == TokenTypes.SUBTRACTION) {
                sum -= this.evaluate();
            } 
        }

        return sum;
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
        buildOutput = interpreter.evalBedmas().toString();
    } catch(e) {
        //todo: add syntax highlighting for the position with the error
        buildOutput = `ERROR: ${e}`
    }

    var out = document.getElementById('output');
    out.textContent = buildOutput;
    
});