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

