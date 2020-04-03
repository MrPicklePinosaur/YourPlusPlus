var TokenTypes;
(function (TokenTypes) {
    TokenTypes[TokenTypes["NUMBER"] = 0] = "NUMBER";
    TokenTypes[TokenTypes["ADDITION"] = 1] = "ADDITION";
    TokenTypes[TokenTypes["SUBTRACTION"] = 2] = "SUBTRACTION";
    TokenTypes[TokenTypes["MULTIPLICATION"] = 3] = "MULTIPLICATION";
    TokenTypes[TokenTypes["DIVISION"] = 4] = "DIVISION";
    TokenTypes[TokenTypes["EOF"] = 5] = "EOF";
})(TokenTypes || (TokenTypes = {}));
var CalcInterpreter = /** @class */ (function () {
    function CalcInterpreter(script) {
        this.ip = -1; //position of character (instruction pointer, prob rename later)
        this.tokens = [];
        this.script = script;
        this.nextChar();
    }
    CalcInterpreter.prototype.newToken = function (type, value) {
        return { type: type, value: value, position: this.ip };
    };
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
        return this.newToken(TokenTypes.NUMBER, parseInt(soFar));
    };
    CalcInterpreter.prototype.nextToken = function () {
        var token = null;
        while (true) { //keep searching until a valid token is found
            if ((/\d/).test(this.curChar)) { //if the current character is a number
                return this.handleInteger();
            }
            else if (this.curChar == '+') {
                token = this.newToken(TokenTypes.ADDITION, null);
            }
            else if (this.curChar == '-') {
                token = this.newToken(TokenTypes.SUBTRACTION, null);
            }
            else if ((/[\*x]/).test(this.curChar)) {
                token = this.newToken(TokenTypes.MULTIPLICATION, null);
            }
            else if (this.curChar == '/') {
                token = this.newToken(TokenTypes.DIVISION, null);
            }
            else if (this.curChar == null) {
                return this.newToken(TokenTypes.EOF, null);
            }
            this.nextChar();
            if (token != null) {
                return token;
            }
        }
    };
    CalcInterpreter.prototype.evaluate = function () {
        var product = 1;
        this.curToken = this.nextToken();
        this.comp(this.curToken, TokenTypes.NUMBER);
        product = this.curToken.value;
        this.curToken = this.nextToken();
        while (true) {
            if (this.curToken.type != TokenTypes.MULTIPLICATION && this.curToken.type != TokenTypes.DIVISION) {
                break;
            }
            if (this.curToken.type == TokenTypes.MULTIPLICATION) {
                this.curToken = this.nextToken();
                this.comp(this.curToken, TokenTypes.NUMBER);
                product *= this.curToken.value;
            }
            else if (this.curToken.type == TokenTypes.DIVISION) {
                this.curToken = this.nextToken();
                this.comp(this.curToken, TokenTypes.NUMBER);
                if (this.curToken.value == 0) {
                    throw Error("Division by Zero");
                }
                product /= this.curToken.value;
            }
            this.curToken = this.nextToken();
        }
        return product;
    };
    CalcInterpreter.prototype.evalBedmas = function () {
        var sum = 0;
        sum += this.evaluate();
        while (true) {
            if (this.curToken.type != TokenTypes.ADDITION && this.curToken.type != TokenTypes.SUBTRACTION) {
                break;
            }
            if (this.curToken.type == TokenTypes.ADDITION) {
                sum += this.evaluate();
            }
            else if (this.curToken.type == TokenTypes.SUBTRACTION) {
                sum -= this.evaluate();
            }
        }
        return sum;
    };
    CalcInterpreter.prototype.comp = function (token, tokenType) {
        if (token.type != tokenType) {
            throw SyntaxError("Invalid syntax at position " + token.position);
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
        buildOutput = interpreter.evalBedmas().toString();
    }
    catch (e) {
        //todo: add syntax highlighting for the position with the error
        buildOutput = "ERROR: " + e;
    }
    var out = document.getElementById('output');
    out.textContent = buildOutput;
});
