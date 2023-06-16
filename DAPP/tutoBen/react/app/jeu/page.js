"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

const jeu = () => {

    const [number, setNumber] = useState(0)

    useEffect(() => {
        return () => {
            alert("Le composant est démonté")
        }
    }, [])

    const increment = () => {
        setNumber(number + 1)
    }

    const decrement = () => {
        setNumber(number - 1)
    }

    return (
        <>
        <div>{number}</div>
        <button onClick={() => increment()}>Increment</button>
        <button onClick={() => decrement()}>Decrement</button>
        <Link href="/">Accueil</Link>
        </>
    )
}

export default jeu