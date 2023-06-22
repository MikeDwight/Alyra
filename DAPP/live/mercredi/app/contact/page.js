"use client"
import { ThemeContextProvider, useThemeContext } from '../context/theme'
import React from 'react'

const contact = () => {

  const { color, setColor } = useThemeContext()

  return (
    <div>
      <h1 style={{'color': color}}>Hello</h1>
      <button onClick={() => setColor('Blue')}>Blue</button>
    </div>
  )
}

export default contact