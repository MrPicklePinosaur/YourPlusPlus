var TokenTypes;
(function (TokenTypes) {
    TokenTypes[TokenTypes["NUMBER"] = 0] = "NUMBER";
    TokenTypes[TokenTypes["POSITIVE"] = 1] = "POSITIVE";
    TokenTypes[TokenTypes["NEGATIVE"] = 2] = "NEGATIVE";
    TokenTypes[TokenTypes["EOF"] = 3] = "EOF";
})(TokenTypes || (TokenTypes = {}));
var CalcInterpreter = /** @class */ (function () {
    function CalcInterpreter(script) {
        this.ip = -1; //instruction pointer
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
    CalcInterpreter.prototype.evaluate = function () {
        //var semantics = [TokenTypes.NUMBER,TokenTypes.ADDITION,TokenTypes.NUMBER];
        var tokens = [];
        this.nextChar();
        for (var i = 0; i < this.script.length; i++) {
            if ((/\d/).test(this.curChar)) { //if the current character is a number
                tokens.push(this.handleInteger());
                continue;
            }
            else if (this.curChar == '+') {
                tokens.push({ type: TokenTypes.POSITIVE, value: null });
            }
            else if (this.curChar == '-') {
                tokens.push({ type: TokenTypes.NEGATIVE, value: null });
            }
            else if (!this.curChar) { //if null, we have reached end of file
                break;
            }
            this.nextChar();
        }
        //check to see if syntax is valid
        var sum = 0;
        var positive = true;
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i].type == TokenTypes.POSITIVE) {
                positive = true;
            }
            else if (tokens[i].type == TokenTypes.NEGATIVE) {
                positive = (positive == null ? false : !positive);
            }
            else if (tokens[i].type == TokenTypes.NUMBER && positive != null) { //make sure there is a sign preceding
                sum += ((positive ? 1 : -1) * tokens[i].value);
                positive = null; //reset sign 
            }
            else {
                return null; //throw error thingy
            }
        }
        return sum;
    };
    return CalcInterpreter;
}());
document.getElementById('run-button').addEventListener('click', function () {
    var script = document.getElementById('editor').value;
    //run code
    var interpreter = new CalcInterpreter(script);
    var buildOutput = interpreter.evaluate();
    var out = document.getElementById('output');
    if (buildOutput) { //if the output was not null
        out.textContent = buildOutput.toString();
    }
    else {
        out.textContent = 'ERROR';
    }
});
