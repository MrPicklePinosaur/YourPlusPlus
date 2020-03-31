interface Token {
    type: string;
    value: any;
}

class CalcInterpreter {

    script: string;
    ip: number = 0; //instruction pointer
    curToken: Token;

    constructor(script: string) {
        this.script = script;
    }

    step(): Token {
        this.ip += 1;

        if (this.ip > this.script.length-1) { //EOF if finished
            return {type: 'EOF', value: null}
        }

        var cur = this.script.charAt(this.ip).toString();
        
        if (/\d/.test(cur)) { //if current char is a number
            return {type: 'NUMBER', value: parseInt(cur,10)}
        }
        if (/\+/.test(cur)) {
            return {type: "ADDITION", value: null}
        }

    }

    eatToken(type: string): void {
        if (this.curToken.type == type) {
            this.curToken = this.step();
        } else {
            throw "Error in parsing!";
        }
    }

    evaluate(): number {
        this.curToken = this.step();

        var semantic = ["NUMBER","ADDITION","NUMBER"];
        var results = [];
        for (var i = 0; i < semantic.length; i++) {
            results.push(this.eatToken(semantic[i]));
        }
        return results[0]+results[2];
    }





}