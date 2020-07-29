import { Token, TokenType, TokenMatch } from 'core/types/token.types';

export class Interpreter {

    private cur_pos: number = 0;
    private cur_token: Token;
    private source: string;

    get cur_char(): string {
        return this.source[this.cur_pos];
    }

    constructor(source: string) {
        this.source = source;
        this.cur_token = this.nextToken();
    }

    
    advancePos() {
        this.cur_pos += 1;
    } 

    nextToken(): Token {

        for (const tm of this.tokenMatcher) {
            if (tm.condition()) return tm.resolve(); 
        }

        //if nothing matches
        throw new Error(`Invalid token at position ${this.cur_pos}`);

    }

    //takes in an expected token type and checks to see if it matches the current token
    eatToken(expectedType: TokenType) {

        //if the token type matches, advancej
        if (this.cur_token.type === expectedType) {
            this.cur_token = this.nextToken();
        } else {
            throw new Error(`Invalid syntax at position ${this.cur_pos}`);
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

    //Describes conditions for a token to match, note
    private tokenMatcher: TokenMatch[] = [

        {
            type: TokenType.EOF,
            condition: () => this.cur_pos >= this.source.length,
            resolve: () => ({ type: TokenType.EOF, value: '' })
        },

        {
            type: TokenType.ADDITION,
            condition: () => this.cur_char === '+',
            resolve: () => {
                this.advancePos();
                return { type: TokenType.ADDITION, value: '' }
            }
        },

        {
            type: TokenType.SUBTRACTION,
            condition: () => this.cur_char === '-',
            resolve: () => {
                this.advancePos();
                return { type: TokenType.SUBTRACTION, value: '' }
            }
        },
        
        {
            type: TokenType.INTEGER,
            condition: () => /\d/.test(this.cur_char),
            resolve: () => {
                let integer = '';

                while (/\d/.test(this.cur_char)) {
                    integer += this.cur_char;
                    this.advancePos();
                }

                return { type: TokenType.INTEGER, value: integer }
            }
        },

        {
            type: TokenType.WHITESPACE,
            condition: () => /\s/.test(this.cur_char),
            resolve: () => {
                let whitespace = '';

                while (/\s/.test(this.cur_char)) {
                    whitespace += this.cur_char;
                    this.advancePos();
                }

                return { type: TokenType.WHITESPACE, value: whitespace }
            }
        },

    ]


}