export enum TokenType {
    INTEGER,
    ADDITION,
    SUBTRACTION,
    MULTIPLICATION,
    DIVISION,
    WHITESPACE,
    EOF,
}

export type Token = {
    type: TokenType,
    value: string 
}

