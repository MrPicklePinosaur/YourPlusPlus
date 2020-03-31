class Lexer {
    /*
    static tokenize(script: string, tokenDelimiter: string, lineDelimiter: string): string[] {
        var split = script.split(new RegExp(`[${tokenDelimiter}(${lineDelimiter})]`));
        return split;
    } 
    */

    //tokenizer capture types (start_trigger: end_trigger)
    static capture = {
        '\'': '\'',
        '"': '"',
        '[': ']'
    }

    static tokenize(script: string): string[] {
        script += ' ';

        var tokened: string[] = [];   
        var curString = '';
        var capture_mode = null;

        for (var i = 0; i < script.length; i++) {
            var char = script.charAt(i).toString();

            for (var k of Object.keys(Lexer.capture)) {

                if (char == k && capture_mode == null) { //opening capture character
                    capture_mode = [k, Lexer.capture[k]];
                    break;
                } else if (capture_mode != null && char == capture_mode[1]) { //exiting capture character
                    capture_mode = null;
                    break;
                }
            }

            if ((char == ' ' || char == ';') && capture_mode == null) { //default tokenizer (if we are in capture mode, we dont wanna tokenize by whitespace, etc strings)
                
                if (curString.length > 0) { //push current string if its not empty
                    tokened.push(curString);
                }

                if (char == ';') { //push new line character
                    tokened.push(char);
                }
                
                curString = '';
                continue;
            }
            
            curString += char;
        }

        return tokened;
   }
   
   /*
    static test() {
        var script = 'int a = 1\nint a = 2\nint c = a + b';
        console.log(Lexer.tokenize(script,' ','\n'));
        
    }
    */
}

