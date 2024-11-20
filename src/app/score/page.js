'use client'

import { useState, useEffect } from 'react'

export default function Scores() {
  const [scores, setScores] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch('/api/score')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        console.log('data', data)
        setScores(Array.isArray(data.body) ? data.body : [])
        setIsLoading(false)
      } catch (error) {
        // console.error('Failed to fetch scores:', error)
        setIsLoading(false)
      }
    }

    fetchScores()
  }, [])

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Player Scores</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((user, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}