import React from 'react';
import logo from './logo.svg';
import './App.css';
import { CheckboxBasicExample } from './checkbox';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';

initializeIcons();

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <CheckboxBasicExample />
      </header>
    </div>
  );
}

export default App;
