import React, { useState } from 'react';
import SwitchColorButton from './switchColorButton';
import RandomColorButton from './randomColorButton';

import './App.css';

function App() {

  const [bgColor, setBgColor ] = useState('')
  const colors = ['red', 'blue', 'yellow', 'green'];

  const rootStyle = {
    backgroundColor: bgColor
  }

  return (
    // if you need to use JS in JSX, wrap bit in {} so React knows to watch for JS
    <div className='react-root' style={rootStyle}>
      <div className='centered'>
        <h1>Color Picker</h1>
        {/* Could list these out individually, but can also map to grab multiple items from an array */}
        {colors.map(currentColor => <SwitchColorButton bgColor={currentColor} setBgColor={setBgColor} key={currentColor} /> )}
        {/* separate button to handle logic for random color! */}
        <RandomColorButton setBgColor={setBgColor} />
        <h2>{ bgColor.toUpperCase() }</h2>
      </div>
    </div>
  );
}

export default App;
