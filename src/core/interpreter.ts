import { Token, TokenType } from 'core/types/token.types';

export class Interpreter {

    private cur_pos: number = 0;
    private cur_token: Token;
    private source: string;

    constructor(source: string) {
        this.source = source;
        this.cur_token = this.nextToken();
    }

    advancePos() {
        this.cur_pos += 1;
    } 

    nextToken(): Token {

        //if we reach end of file
        if (this.cur_pos == this.source.length) {
            return {
                type: TokenType.EOF,
                value: ''
            }
        }

        const cur_char: string = this.source[this.cur_pos];

        if (cur_char === '+') {
            this.advancePos();
            return {
                type: TokenType.ADDITION,
                value: cur_char
            }
        }

        if (/\d/.test(cur_char)) {
            this.advancePos();
            return {
                type: TokenType.INTEGER,
                value: cur_char
            }
        }

        throw(`Invalid token at position ${this.cur_pos}`);
    }

    //takes in an expected token type and checks to see if it matches the current token
    eatToken(expectedType: TokenType) {

        //if the token type matches, advancej
        if (this.cur_token.type === expectedType) {
            this.cur_token = this.nextToken();
        } else {
            throw(`Invalid syntax at position ${this.cur_pos}`);
        }

    }

    evaluateAddition(): number {

        const left = this.cur_token;
        this.eatToken(TokenType.INTEGER);

        const operator = this.cur_token;
        this.eatToken(TokenType.ADDITION);

        const right = this.cur_token;
        this.eatToken(TokenType.INTEGER);

        return parseInt(left.value) + parseInt(right.value);

    }

}