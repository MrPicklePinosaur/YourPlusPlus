export enum TokenType {
    INTEGER,
    ADDITION,
    SUBTRACTION,
    WHITESPACE,
    EOF,
}

export type Token = {
    type: TokenType,
    value: string 
}

export interface TokenMatch {
    type: TokenType,
    condition: (() => boolean),
    resolve: (() => Token) 
} 
