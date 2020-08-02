import { Token } from 'core/types/token.types';

export interface ASTNode extends Token {
    left: ASTNode | null,
    right: ASTNode | null,
}
