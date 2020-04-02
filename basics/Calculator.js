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
    CalcInterpreter.prototype.evaluate = function () {
        //var semantics = [TokenTypes.NUMBER,TokenTypes.ADDITION,TokenTypes.NUMBER];
        //lexify
        this.nextChar();
        for (var i = 0; i < this.script.length; i++) {
            if ((/\d/).test(this.curChar)) { //if the current character is a number
                this.tokens.push(this.handleInteger());
                continue;
            }
            else if (this.curChar == '+') {
                this.tokens.push({ type: TokenTypes.POSITIVE, value: null });
            }
            else if (this.curChar == '-') {
                this.tokens.push({ type: TokenTypes.NEGATIVE, value: null });
            }
            else if ((/[\*x]/).test(this.curChar)) {
                this.tokens.push({ type: TokenTypes.MULTIPLICATION, value: null });
            }
            else if (this.curChar == '/') {
                this.tokens.push({ type: TokenTypes.DIVISION, value: null });
            }
            else if (!this.curChar) { //if null, we have reached end of file
                this.tokens.push({ type: TokenTypes.EOF, value: null });
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
        var sum = 0;
        this.curToken = this.getFirstToken();
        sum += this.eat(TokenTypes.NUMBER).value;
        try {
            while (true) {
                if (this.curToken.type == TokenTypes.POSITIVE) {
                    this.eat(TokenTypes.POSITIVE);
                    sum += this.eat(TokenTypes.NUMBER).value;
                }
                else if (this.curToken.type == TokenTypes.NEGATIVE) {
                    this.eat(TokenTypes.NEGATIVE);
                    sum -= this.eat(TokenTypes.NUMBER).value;
                }
                else { //if we reach a wrong expression
                    throw SyntaxError("Invalid Syntax");
                }
            }
        }
        catch (e) {
            if (e instanceof RangeError) {
                // do nothing
            }
            else if (e instanceof SyntaxError) {
                return null;
            }
        }
        console.log(sum);
        return sum;
    };
    CalcInterpreter.prototype.eat = function (tokenType) {
        var oldToken = this.curToken;
        if (oldToken.type != tokenType) {
            throw SyntaxError("Invalid Syntax");
        }
        this.tokens.shift(); //pop first token
        this.curToken = this.getFirstToken();
        return oldToken;
    };
    CalcInterpreter.prototype.getFirstToken = function () {
        var firstToken = this.tokens[0];
        if (firstToken.type == TokenTypes.EOF) { //if null
            throw RangeError("End of file reached");
        }
        return firstToken;
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
