"use client"
import { useState, useEffect } from 'react'

const jeu = () => {
// state

    const[number, setNumber] = useState(0)

    useEffect(() => {
      console.log('Number à changé') // ce qui se passe quand :
    }, [number]) // NUMBER est changé

// comportement

const increment = () => {
  setNumber(number + 1)
}
const decrement = () => {
  setNumber(number - 1)
}

// affichage
  return (
    <>
      <button onClick={() => increment()}>+ 1</button>
      <button onClick={() => decrement()}>- 1</button>
      <div>{number}</div>
    </>
  )
}

export default jeu