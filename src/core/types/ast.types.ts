import { Token } from 'core/types/token.types';

export type ASTNode = BinopASTNode | UnopASTNode | LeafASTNode;

export interface BinopASTNode extends Token {
    left: ASTNode,
    right: ASTNode
}

export interface UnopASTNode extends Token {
    child: ASTNode
}

export interface LeafASTNode extends Token {

}

//search about type guards
export const isBinopNode = (node: ASTNode): node is BinopASTNode => {
    const cast = <BinopASTNode>node; 
    return cast.left != undefined && cast.right != undefined;
}

export const isUnopNode = (node: ASTNode): node is UnopASTNode => {
    const cast = <UnopASTNode>node;
    return cast.child != undefined;
}
