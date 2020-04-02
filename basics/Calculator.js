var TokenTypes;
(function (TokenTypes) {
    TokenTypes[TokenTypes["NUMBER"] = 0] = "NUMBER";
    TokenTypes[TokenTypes["POSITIVE"] = 1] = "POSITIVE";
    TokenTypes[TokenTypes["NEGATIVE"] = 2] = "NEGATIVE";
    TokenTypes[TokenTypes["MULTIPLICATION"] = 3] = "MULTIPLICATION";
    TokenTypes[TokenTypes["DIVISION"] = 4] = "DIVISION";
    TokenTypes[TokenTypes["EOF"] = 5] = "EOF";
})(TokenTypes || (TokenTypes = {}));
var CalcInterpreter = /** @class */ (function () {
    function CalcInterpreter(script) {
        this.ip = -1; //instruction pointer
        this.tokens = [];
        this.script = script;
    }
    CalcInterpreter.prototype.nextChar = function () {
        this.ip += 1;
        if (this.ip > this.script.length - 1) {
            this.curChar = null;
        }
        else {
            this.curChar = this.script.charAt(this.ip).toString();
        }
    };
    CalcInterpreter.prototype.handleInteger = function () {
        var soFar = '';
        while (true) {
            //if reach end of file or hit a non number
            if (!this.curChar || !(/\d/).test(this.curChar)) {
                break;
            }
            soFar += this.curChar;
            this.nextChar();
        }
        return { type: TokenTypes.NUMBER, value: parseInt(soFar) };
    };
    CalcInterpreter.prototype.nextToken = function () {
        this.nextChar();
        if ((/\d/).test(this.curChar)) { //if the current character is a number
            return this.handleInteger();
        }
        else if (this.curChar == '+') {
            return { type: TokenTypes.POSITIVE, value: null };
        }
        else if (this.curChar == '-') {
            return { type: TokenTypes.NEGATIVE, value: null };
        }
        else if ((/[\*x]/).test(this.curChar)) {
            return { type: TokenTypes.MULTIPLICATION, value: null };
        }
        else if (this.curChar == '/') {
            return { type: TokenTypes.DIVISION, value: null };
        }
        /*else if (!this.curChar) { //if null, we have reached end of file
            return {type: TokenTypes.EOF, value: null};
        } */
        return null;
    };
    CalcInterpreter.prototype.expr = function () {
        //check to see if syntax is valid
        var sum = 0;
        var positive = true;
        var curToken = this.nextToken();
        while (curToken) { //while curToken is not null
            console.log(curToken);
            if (curToken.type == TokenTypes.POSITIVE) {
                positive = true;
            }
            else if (curToken.type == TokenTypes.NEGATIVE) {
                positive = (positive == null ? false : !positive);
            }
            else if (curToken.type == TokenTypes.NUMBER && positive != null) { //make sure there is a sign preceding
                sum += ((positive ? 1 : -1) * curToken.value);
                positive = null; //reset sign 
            }
            curToken = this.nextToken();
        }
        return sum;
    };
    return CalcInterpreter;
}());
document.getElementById('run-button').addEventListener('click', function () {
    var script = document.getElementById('editor').value;
    //run code
    var interpreter = new CalcInterpreter(script);
    var buildOutput = interpreter.expr();
    var out = document.getElementById('output');
    if (buildOutput) { //if the output was not null
        out.textContent = buildOutput.toString();
    }
    else {
        out.textContent = 'ERROR';
    }
});
