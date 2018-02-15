import React, { Component } from 'react';
import './App.css';
import IdeasContainer from './components/IdeasContainer'

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="app-header">
          <h1>Idea Board</h1>
        </div>
        <IdeasContainer />
      </div>
    );
  }
}

export default App;
