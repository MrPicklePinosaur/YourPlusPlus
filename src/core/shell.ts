import { Interpreter } from 'core/interpreter';

export const runSource = (source: string): Promise<string> => {
    return new Promise((resolve, reject) => {

        try {
            const intp = new Interpreter(source);
            const result = intp.evaluate();

            resolve(`${result}`);

        } catch(err) {
            reject(err);
        }

    });
}