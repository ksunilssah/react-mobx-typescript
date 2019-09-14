import React from 'react';
import CheckBox  from '../Checkbox';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';

initializeIcons();

const App: React.FC = () => {
  return (
    <div className="App">
        <CheckBox />
    </div>
  );
}

export default App;
