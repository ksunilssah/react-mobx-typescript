import React from 'react';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import AddBirds from '../Copmonents/Birds/AddBirds';
initializeIcons();

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <AddBirds></AddBirds>
      </div>
    );
  }
}

export default App;
