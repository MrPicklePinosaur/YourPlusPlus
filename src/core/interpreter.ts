import { ASTNode, LeafASTNode, BinopASTNode, isBinopNode } from 'core/types/ast.types';
import { TokenType } from 'core/types/token.types';

export const visit = (node: ASTNode): number => {

    if (isBinopNode(node)) {
        return visitBinOp(node);        
        
    } else {
        return visitLeaf(node);
    }
}

//handles binary operators
export const visitBinOp = (node: BinopASTNode): number => {

    switch(node.type) {
        case TokenType.ADDITION:
            return visit(node.left) + visit(node.right);
        case TokenType.SUBTRACTION:
            return visit(node.left) - visit(node.right);
        case TokenType.MULTIPLICATION:
            return visit(node.left) * visit(node.right);
        case TokenType.DIVISION:
            const right = visit(node.right);
            if (right === 0) throw new Error(`Division by zero`);
            return visit(node.left) / right;
        default:
            throw new Error(`Invalid node type: ${node.type}`);
    }

}

export const visitLeaf = (node: LeafASTNode): number => {

    //assumed to be integer lol
    return parseInt(node.value);
}
