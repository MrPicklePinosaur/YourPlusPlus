export enum TokenType {
    INTEGER,
    ADDITION,
    EOF,

}

export type Token = {
    type: TokenType,
    value: string
}