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
        var sum = 0;
        var token: Token = this.nextToken();

        this.comp(token, TokenTypes.NUMBER);
        sum += token.value;

        while (true) {
            token = this.nextToken();

            if (token.type == TokenTypes.ADDITION) {
                token = this.nextToken();
                this.comp(token, TokenTypes.NUMBER);
                sum += token.value;
            } else if (token.type == TokenTypes.SUBTRACTION) {
                token = this.nextToken();
                this.comp(token, TokenTypes.NUMBER);
                sum -= token.value;
            } else if (token.type == TokenTypes.EOF) { //reached end of file
                break;
            } else { //invalid token
                throw SyntaxError(`Unknown Token at position ${token.position}`);
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
        buildOutput = interpreter.evaluate().toString();
    } catch(e) {
        buildOutput = `ERROR: ${e}`
    }

    var out = document.getElementById('output');
    out.textContent = buildOutput;
    
});