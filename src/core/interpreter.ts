import { Token, TokenType } from 'core/types/token.types';
import { threadId } from 'worker_threads';

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

    evaluate(): number {

        const left = this.cur_token;
        this.eatToken(TokenType.INTEGER); //problem: we cannot have whitespace as before first int

        let result = parseInt(left.value);

        while (this.cur_token.type !== TokenType.EOF) {
            
            this.eatToken(TokenType.ADDITION);

            const right = this.cur_token;
            this.eatToken(TokenType.INTEGER);
            
            result += parseInt(right.value);
        }

        return result;
    }

    //Describes conditions for a token to match, note
    //current problems: if two tokens have the same / overlapping conditions, then one may never be called
    private tokenMatcher: { condition: () => boolean, resolve: () => Token }[] = [

        {
            condition: () => this.cur_pos >= this.source.length,
            resolve: () => ({ type: TokenType.EOF, value: '' })
        },

        {
            condition: () => this.cur_char === '+',
            resolve: () => {
                this.advancePos();
                return { type: TokenType.ADDITION, value: '' }
            }
        },

        {
            condition: () => this.cur_char === '-',
            resolve: () => {
                this.advancePos();
                return { type: TokenType.SUBTRACTION, value: '' }
            }
        },
        
        {
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