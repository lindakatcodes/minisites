import React from 'react'

function SwitchColorButton (props) {
  return (
  <button className = {props.bgColor} onClick={() => props.setBgColor(props.bgColor)}>
    {props.bgColor}
  </button>
  )
}

export default SwitchColorButton