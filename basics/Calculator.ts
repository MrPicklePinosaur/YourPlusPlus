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

    /*
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

        
        /*else if (!this.curChar) { //if null, we have reached end of file
            return {type: TokenTypes.EOF, value: null};
        } 
    }

    expr(): number {
        //check to see if syntax is valid
        var sum = 0;
        var positive = true;
        var curToken = this.nextToken();

        while (curToken) { //while curToken is not null
            console.log(curToken)
            if (curToken.type == TokenTypes.POSITIVE) {
                positive = true;
            } else if (curToken.type == TokenTypes.NEGATIVE) {
                positive = (positive == null ? false : !positive);
            } else if (curToken.type == TokenTypes.NUMBER && positive != null) { //make sure there is a sign preceding
                sum += ((positive ? 1 : -1)*curToken.value);
                positive = null; //reset sign 
            }
            curToken = this.nextToken();

        }
        console.log(`sum ${sum}`);
        return sum;
    }
    */

    
    evaluate(): number {

        //var semantics = [TokenTypes.NUMBER,TokenTypes.ADDITION,TokenTypes.NUMBER];
        //lexify
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
                this.tokens.push({type: TokenTypes.EOF, value: null});
                break;
            }

            this.nextChar();
        }

        
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
        }
        return sum;
    }
    
        



}

document.getElementById('run-button').addEventListener('click',function() {
    var script = (<HTMLInputElement>document.getElementById('editor')).value;

    //run code
    var interpreter = new CalcInterpreter(script);
    var buildOutput = interpreter.evaluate();

    var out = document.getElementById('output');

    if (buildOutput != null) { //if the output was not null
        out.textContent = buildOutput.toString();
    } else {
        out.textContent = 'ERROR';
    }
    
});