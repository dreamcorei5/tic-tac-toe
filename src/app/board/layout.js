'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

const Board = () => {
  const { user } = useUser();
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [consecutiveWins, setConsecutiveWins] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const winner = calculateWinner(squares);
    if (winner) {
      updateScore(winner);
      setGameOver(true);
    } else if (!squares.includes(null)) {
      setGameOver(true); // กระดานเต็มแล้ว
    }
  }, [squares]);

  const handleClick = (i) => {
    if (gameOver || squares[i]) {
      return;
    }
    const newSquares = squares.slice();
    newSquares[i] = 'X';
    setSquares(newSquares);
    setXIsNext(false);

    if (!calculateWinner(newSquares) && newSquares.includes(null)) {
      setTimeout(() => botMove(newSquares), 500);
    }
  };

  const botMove = (newSquares) => {
    let availableSquares = [];
    newSquares.forEach((square, index) => {
      if (square === null) {
        availableSquares.push(index);
      }
    });

    const randomIndex = availableSquares[Math.floor(Math.random() * availableSquares.length)];
    newSquares[randomIndex] = 'O';
    setSquares(newSquares);
    setXIsNext(true);
  };

  const updateScore = async (winner) => {
    if (winner === 'X') {
      setPlayerScore(playerScore + 1);
      setConsecutiveWins(consecutiveWins + 1);
      if (consecutiveWins + 1 === 3) {
        setPlayerScore(playerScore + 2); // เพิ่มคะแนนพิเศษ 1 คะแนน
        await saveScore(user.email, 1);
        setConsecutiveWins(0); // รีเซ็ตการนับการชนะติดต่อกัน
      }
      await saveScore(user.email, 1);
    } else if (winner === 'O') {
      setPlayerScore(playerScore - 1);
      setBotScore(botScore + 1);
      setConsecutiveWins(0); // รีเซ็ตการนับการชนะติดต่อกัน
      await saveScore(user.email, -1);
    }
  };

  const saveScore = async (email, score) => {
    try {
      await fetch('/api/save-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, score }),
      });
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const resetBoard = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameOver(false);
  };

  const renderSquare = (i) => {
    return (
      <button className="square" onClick={() => handleClick(i)}>
        {squares[i]}
      </button>
    );
  };

  const winner = calculateWinner(squares);

  return (
    <div className="container mx-auto p-4">
      {user && <p>Player: {user.name}</p>}
      <div className="scoreboard">
        <p>Player Score: {playerScore}</p>
      </div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      {gameOver && <button onClick={resetBoard}>Restart</button>}
    </div>
  );
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export default Board;