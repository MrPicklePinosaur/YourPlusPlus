import { Parser } from 'core/parser';
import { visit } from 'core/interpreter';

export const runSource = (source: string): Promise<string> => {
    return new Promise((resolve, reject) => {

        try {
            const intp = new Parser(source);
            const ast = intp.evaluateExpr();

            const result = visit(ast);
            resolve(`${result}`);

        } catch(err) {
            reject(err);
        }

    });
}