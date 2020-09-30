import React from 'react'

function handleRandomColor() {
//   Found this little random hex color snippet from CSS Tricks!
  const newColor = Math.floor(Math.random()*16777215).toString(16);
  return `#${newColor}`;
}

function RandomColorButton (props) {
  return (
  <button className="random" onClick={() => {
    let color = handleRandomColor();
    props.setBgColor(color)
  }}>
    Random
  </button>
  )
}

export default RandomColorButton
