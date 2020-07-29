import React, { Component } from 'react';
import { runSource } from 'core/shell';

interface State {
  source: '',
  output: string,
}


class App extends Component<{},State> {
  
  state: Readonly<State> = {
    source: '',
    output: 'Your output will show up here!'
  }

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    runSource(this.state.source)
      .then(result => {
        this.setState({
          output: result
        })

      })
      .catch(error => {
        this.setState({
          output: `${error}`
        })

      })

  }

  private handleChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.currentTarget;

    this.setState(prevState => ({
      ...prevState,
      [id]: value
    }) as Pick<State, keyof State>);

  }

  render() {
    return (
      <div className="App">

        <h1>YourPlusPlus!</h1>

        <form onSubmit={this.handleSubmit}>

          <textarea id="source" onChange={this.handleChange}></textarea>
          <button>Run!</button>

        </form>
        
      <p className="output">{this.state.output}</p>

      </div>
    );
  }

}


export default App;
