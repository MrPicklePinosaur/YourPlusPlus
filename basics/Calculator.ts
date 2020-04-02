interface Token {
    type: string;
    value: any;
}

const TokenTypes = {
    NUMBER: 'NUMBER',
    ADDITION: 'ADDITION',
    EOF: 'EOF'
}

class CalcInterpreter {

    script: string;
    ip: number = 0; //instruction pointer
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
        var soFar: string;

        while (true) {
            //if reach end of file or hit a non number
            if (this.curChar || !(/\d/).test(this.curChar)) { break; }
            soFar += this.curChar;
            this.nextChar();
        }
        return {type: TokenTypes.NUMBER, value: parseInt(soFar)}
    }

    evaluate() {

        var semantics = [TokenTypes.NUMBER,TokenTypes.NUMBER,TokenTypes.NUMBER];
        var tokens = [];
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
        console.log(tokens);
        
    }

}

document.getElementById('run-button').addEventListener('click',function() {
    var script = (<HTMLInputElement>document.getElementById('editor')).value;

    //run code
    var interpreter = new CalcInterpreter(script);
    var buildOutput = interpreter.evaluate();

    var out = document.getElementById('output');
    //out.textContent = buildOutput.toString();
});