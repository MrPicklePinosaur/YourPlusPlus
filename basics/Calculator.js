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
        this.nextChar();
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
        var token = null;
        while (true) { //keep searching until a valid token is found
            if ((/\d/).test(this.curChar)) { //if the current character is a number
                return this.handleInteger();
            }
            else if (this.curChar == '+') {
                token = { type: TokenTypes.POSITIVE, value: null };
            }
            else if (this.curChar == '-') {
                token = { type: TokenTypes.NEGATIVE, value: null };
            }
            else if ((/[\*x]/).test(this.curChar)) {
                token = { type: TokenTypes.MULTIPLICATION, value: null };
            }
            else if (this.curChar == '/') {
                token = { type: TokenTypes.DIVISION, value: null };
            }
            else if (this.curChar == null) {
                return { type: TokenTypes.EOF, value: null };
            }
            this.nextChar();
            if (token != null) {
                return token;
            }
        }
    };
    CalcInterpreter.prototype.evaluate = function () {
        var sum = 0;
        var token = this.nextToken();
        this.comp(token, TokenTypes.NUMBER);
        sum += token.value;
        while (true) {
            token = this.nextToken();
            if (token.type == TokenTypes.POSITIVE) {
                token = this.nextToken();
                this.comp(token, TokenTypes.NUMBER);
                sum += token.value;
            }
            else if (token.type == TokenTypes.NEGATIVE) {
                token = this.nextToken();
                this.comp(token, TokenTypes.NUMBER);
                sum -= token.value;
            }
            else if (token.type == TokenTypes.EOF) { //reached end of file
                break;
            }
            else { //invalid token
                throw SyntaxError("Invalid Token");
            }
        }
        return sum;
    };
    CalcInterpreter.prototype.comp = function (token, tokenType) {
        if (token.type != tokenType) {
            throw SyntaxError("invalid syntax");
        }
    };
    return CalcInterpreter;
}());
document.getElementById('run-button').addEventListener('click', function () {
    var script = document.getElementById('editor').value;
    //run code
    var interpreter = new CalcInterpreter(script);
    var buildOutput = null;
    try {
        buildOutput = interpreter.evaluate();
    }
    catch (e) {
    }
    var out = document.getElementById('output');
    if (buildOutput != null) { //if the output was not null
        out.textContent = buildOutput.toString();
    }
    else {
        out.textContent = 'ERROR';
    }
});
