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
    }

    nextChar(): void {
        this.ip += 1;
        if (this.ip > this.script.length-1) {
            this.curChar = null;
        } else {
            this.curChar = this.script.charAt(this.ip).toString();
        }

    }

    handleInteger(): Token {
        var soFar: string = '';

        while (true) {
            //if reach end of file or hit a non number
            if (!this.curChar || !(/\d/).test(this.curChar)) { break; }
            soFar += this.curChar;
            this.nextChar();
        }

        return {type: TokenTypes.NUMBER, value: parseInt(soFar)}
    }

    evaluate(): number {

        //var semantics = [TokenTypes.NUMBER,TokenTypes.ADDITION,TokenTypes.NUMBER];

        this.nextChar();
        for (var i = 0; i < this.script.length; i++) {

            if ((/\d/).test(this.curChar)) { //if the current character is a number
                this.tokens.push(this.handleInteger());
                continue;
            } else if (this.curChar == '+') {
                this.tokens.push({type: TokenTypes.POSITIVE, value: null});
            } else if (this.curChar == '-') {
                this.tokens.push({type: TokenTypes.NEGATIVE, value: null});
            } else if ((/[\*x]/).test(this.curChar)) {
                this.tokens.push({type: TokenTypes.MULTIPLICATION, value: null});
            } else if (this.curChar == '/') {
                this.tokens.push({type: TokenTypes.DIVISION, value: null});
            } else if (!this.curChar) { //if null, we have reached end of file
                //tokens.push({type: TokenTypes.EOF, value: null});
                break;
            }

            this.nextChar();
        }
        /*
        //check to see if syntax is valid
        var sum = 0;
        var positive = true;
        for (var i = 0; i < this.tokens.length; i++) {
            if (this.tokens[i].type == TokenTypes.POSITIVE) {
                positive = true;
            } else if (this.tokens[i].type == TokenTypes.NEGATIVE) {
                positive = (positive == null ? false : !positive);
            } else if (this.tokens[i].type == TokenTypes.NUMBER && positive != null) { //make sure there is a sign preceding
                sum += ((positive ? 1 : -1)*this.tokens[i].value);
                positive = null; //reset sign 
            } else {
                return null; //throw error thingy
            }
        }*/

        //alternate implementation
        var curToken;
        var sum;
        try {
            curToken = this.eat(TokenTypes.NUMBER);
            sum += curToken.value;
            while (this.tokens.length > 0 && (curToken.type == TokenTypes.POSITIVE || curToken.type == TokenTypes.NEGATIVE)) {
                
                if (curToken.type == TokenTypes.POSITIVE) {
                    curToken = this.eat(TokenTypes.POSITIVE);
                    sum += curToken.value;
                } else if (curToken.type == TokenTypes.NEGATIVE) {
                    curToken = this.eat(TokenTypes.NEGATIVE);
                    sum -= curToken.value;
                }
                curToken = this.eat(TokenTypes.NUMBER);
            }
        } catch (error) {
            return null;
        }

        return sum;
    }

    eat(tokenType: TokenTypes): Token { //checks tokens for correct syntax
        var token = this.tokens.shift();
        if (token.type != tokenType) {
            throw SyntaxError("Syntax Error");
        }
        var nextToken = this.tokens[0];
        if (nextToken == null) {
            throw RangeError("Reached end of file");
        }
        return nextToken;
        
    }

}

document.getElementById('run-button').addEventListener('click',function() {
    var script = (<HTMLInputElement>document.getElementById('editor')).value;

    //run code
    var interpreter = new CalcInterpreter(script);
    var buildOutput = interpreter.evaluate();

    var out = document.getElementById('output');

    if (buildOutput) { //if the output was not null
        out.textContent = buildOutput.toString();
    } else {
        out.textContent = 'ERROR';
    }
    
});