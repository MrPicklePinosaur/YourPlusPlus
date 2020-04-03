interface Token {
    type: TokenTypes;
    value: any;
}

enum TokenTypes {
    NUMBER,
    POSITIVE,
    NEGATIVE,
    MULTIPLICATION,
    DIVISION,
    EOF
}

class CalcInterpreter {

    script: string;
    ip: number = -1; //instruction pointer
    curChar: string;

    tokens: Token[] = [];

    constructor(script: string) {
        this.script = script;
        this.nextChar();
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

        return {type: TokenTypes.NUMBER, value: parseInt(soFar)}
    }

    
    nextToken(): Token {
        var token: Token = null;
        while(true) { //keep searching until a valid token is found

            if ((/\d/).test(this.curChar)) { //if the current character is a number
                return this.handleInteger();
            } else if (this.curChar == '+') {
                token = {type: TokenTypes.POSITIVE, value: null};
            } else if (this.curChar == '-') {
                token = {type: TokenTypes.NEGATIVE, value: null};
            } else if ((/[\*x]/).test(this.curChar)) {
                token = {type: TokenTypes.MULTIPLICATION, value: null};
            } else if (this.curChar == '/') {
                token = {type: TokenTypes.DIVISION, value: null};
            } else if (this.curChar == null) {
                return {type: TokenTypes.EOF, value: null};
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

            if (token.type == TokenTypes.POSITIVE) {
                token = this.nextToken();
                this.comp(token, TokenTypes.NUMBER);
                sum += token.value;
            } else if (token.type == TokenTypes.NEGATIVE) {
                token = this.nextToken();
                this.comp(token, TokenTypes.NUMBER);
                sum -= token.value;
            } else if (token.type == TokenTypes.EOF) { //reached end of file
                break;
            } else { //invalid token
                throw SyntaxError("Invalid Token");
            }
        }

        return sum;
    }

    comp(token: Token, tokenType: TokenTypes) {

        if (token.type != tokenType) {
            throw SyntaxError("invalid syntax");
        }
    }

}

document.getElementById('run-button').addEventListener('click',function() {
    var script = (<HTMLInputElement>document.getElementById('editor')).value;

    //run code
    var interpreter = new CalcInterpreter(script);
    var buildOutput: number = null;
    
    try {
        buildOutput = interpreter.evaluate();
    } catch(e) {

    }

    var out = document.getElementById('output');

    if (buildOutput != null) { //if the output was not null
        out.textContent = buildOutput.toString();
    } else {
        out.textContent = 'ERROR';
    }
    
});