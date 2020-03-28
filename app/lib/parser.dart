

class Parser {

  int ip = 0;

  void main() {
    String script = 
    """
      String mysting = 'Hello world';
      if (True) {
        print("Yes);
      }
    """;
    parse(script.split("\n"));
  }

  void parse(List<String> script) {

    while (ip != script.length) {



      ip += 1;
    }

  }


}