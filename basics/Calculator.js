var CalcInterpreter = /** @class */ (function () {
    function CalcInterpreter(script) {
        this.ip = 0; //instruction pointer
        this.script = script;
    }
    CalcInterpreter.prototype.step = function () {
        if (this.ip > this.script.length - 1) { //EOF if finished
            return { type: 'EOF', value: null };
        }
        var cur = this.script.charAt(this.ip).toString();
        this.ip += 1;
        if (/\d/.test(cur)) { //if current char is a number
            return { type: 'NUMBER', value: parseInt(cur, 10) };
        }
        if (/\+/.test(cur)) {
            return { type: "ADDITION", value: null };
        }
    };
    CalcInterpreter.prototype.eatToken = function (type) {
        if (this.curToken.type == type) {
            this.curToken = this.step();
        }
        else {
            throw Error("Error in parsing!");
        }
    };
    CalcInterpreter.prototype.evaluate = function () {
        this.curToken = this.step();
        var semantic = ["NUMBER", "ADDITION", "NUMBER"];
        var results = [];
        var i = 0;
        while (true) {
            results.push(this.curToken.value);
            //console.log(`${this.curToken.type}, ${this.curToken.value}`);
            try {
                this.eatToken(semantic[i]);
            }
            catch (err) {
                console.log("BREAK " + i);
                break;
            }
            i += 1;
        }
        //console.log(`${results[0]}, ${results[2]}`);
        return results[0] + results[2];
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
