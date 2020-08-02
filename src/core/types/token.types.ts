export enum TokenType {
    INTEGER,
    ADDITION,
    SUBTRACTION,
    MULTIPLICATION,
    DIVISION,
    LEFT_BRACKET,
    RIGHT_BRACKET,
    WHITESPACE,
    EOF,
}

export interface Token {
    type: TokenType,
    value: string 
}

