class Parser {
    static semantics = JSON.parse('semantics');

    static verifySyntax(tokenized: string[]) {
        var line = '';
        for (var i = 0; i < tokenized.length; i++) {
            var token = tokenized[i];

            if (token == ';') {
                
                //handle parse tree shit here


                line = '';
            } 
            line += token;
        }
    }
}