import { Token } from 'core/types/token.types';

export type ASTNode = BinopASTNode | LeafASTNode;

export interface BinopASTNode extends Token {
    left: ASTNode,
    right: ASTNode
}

export interface LeafASTNode extends Token {

}

//search about type guards
export const isBinopNode = (node: ASTNode): node is BinopASTNode => {
    const cast = <BinopASTNode>node; 
    return cast.left != undefined && cast.right != undefined;
}
