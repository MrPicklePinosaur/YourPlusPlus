interface Token {
    type: TokenTypes;
    value: any;
}

enum TokenTypes {
    NUMBER,
    ADDITION,
    EOF
}

class CalcInterpreter {

    script: string;
    ip: number = -1; //instruction pointer
    curChar: string;

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

    eat(tokenType: TokenTypes) {

    }

    evaluate(): number {

        var semantics = [TokenTypes.NUMBER,TokenTypes.ADDITION,TokenTypes.NUMBER];
        var tokens = [];

        this.nextChar();
        for (var i = 0; i < this.script.length; i++) {

            if ((/\d/).test(this.curChar)) { //if the current character is a number
                tokens.push(this.handleInteger());
            } else if (this.curChar == '+') {
                tokens.push({type: TokenTypes.ADDITION, value: null});
            } else if (!this.curChar) { //if null, we have reached end of file
                break;
            }

            this.nextChar();
        }

        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i].type != semantics[i]) {
                return null;
            }
        }
        return tokens[0].value + tokens[2].value;

        
    }

}

document.getElementById('run-button').addEventListener('click',function() {
    var script = (<HTMLInputElement>document.getElementById('editor')).value;

    //run code
    var interpreter = new CalcInterpreter(script);
    var buildOutput = interpreter.evaluate();

    var out = document.getElementById('output');
    out.textContent = buildOutput.toString();
});