var TokenTypes;
(function (TokenTypes) {
    TokenTypes[TokenTypes["NUMBER"] = 0] = "NUMBER";
    TokenTypes[TokenTypes["ADDITION"] = 1] = "ADDITION";
    TokenTypes[TokenTypes["EOF"] = 2] = "EOF";
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
    CalcInterpreter.prototype.eat = function (tokenType) {
    };
    CalcInterpreter.prototype.evaluate = function () {
        var semantics = [TokenTypes.NUMBER, TokenTypes.ADDITION, TokenTypes.NUMBER];
        var tokens = [];
        this.nextChar();
        for (var i = 0; i < this.script.length; i++) {
            if ((/\d/).test(this.curChar)) { //if the current character is a number
                tokens.push(this.handleInteger());
            }
            else if (this.curChar == '+') {
                tokens.push({ type: TokenTypes.ADDITION, value: null });
            }
            else if (!this.curChar) { //if null, we have reached end of file
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
    };
    return CalcInterpreter;
}());
document.getElementById('run-button').addEventListener('click', function () {
    var script = document.getElementById('editor').value;
    //run code
    var interpreter = new CalcInterpreter(script);
    var buildOutput = interpreter.evaluate();
    var out = document.getElementById('output');
    out.textContent = buildOutput.toString();
});
