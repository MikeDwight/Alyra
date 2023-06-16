'use client'

import { useThemeContext } from "../context/theme"

const cv = () => {

  const {color, setColor} = useThemeContext();

  return (
    <>
    <h1 style={{'color': color}}>Main Page</h1>
    <p>Current color : {color}</p>
    <button onClick={() => setColor('blue')}>Set color to blue</button>
    <button onClick={() => setColor('yellow')}>Set color to Yellow</button>
    <button onClick={() => setColor('red')}>Set color to Red</button>
    </>
  )
}

export default cv