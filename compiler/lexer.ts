class Lexer {

    //tokenizer capture types (start_trigger: end_trigger)
    static capture = {
        '\'': '\'',
        '"': '"',
        '[': ']'
    }

    static tokenize(script: string): string[] {
        script += ' ';

        var tokenized: string[] = [];   
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
                    tokenized.push(curString);
                }

                if (char == ';') { //push new line character
                    tokenized.push(char);
                }
                
                curString = '';
                continue;
            }
            
            curString += char;
        }

        return tokenized;
   }
   
}

