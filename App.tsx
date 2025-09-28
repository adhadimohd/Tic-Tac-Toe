
import React, { useState, useEffect } from 'react';
import { SquareValue, Player } from './types';
import Square from './components/Square';

const calculateWinner = (squares: SquareValue[]): { winner: Player | null; line: number[] | null } => {
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
      return { winner: squares[a] as Player, line: lines[i] };
    }
  }
  return { winner: null, line: null };
};

const App: React.FC = () => {
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true); // Player is 'X'
  const { winner, line: winningLine } = calculateWinner(board);
  const isDraw = !winner && board.every(Boolean);

  // Effect for computer's turn
  useEffect(() => {
    if (!isPlayerTurn && !winner && !isDraw) {
      const timeoutId = setTimeout(() => {
        const computerMove = findBestMove(board);
        if (computerMove !== null) {
          handleClick(computerMove);
        }
      }, 700); // Delay for computer's "thinking" time

      return () => clearTimeout(timeoutId);
    }
  }, [isPlayerTurn, board, winner, isDraw]);

  const findBestMove = (currentBoard: SquareValue[]): number | null => {
    const emptySquares = currentBoard.map((sq, i) => sq === null ? i : null).filter(i => i !== null) as number[];

    // 1. Check if computer ('O') can win in the next move
    for (const move of emptySquares) {
      const boardCopy = [...currentBoard];
      boardCopy[move] = 'O';
      if (calculateWinner(boardCopy).winner === 'O') {
        return move;
      }
    }

    // 2. Check if player ('X') is about to win and block them
    for (const move of emptySquares) {
      const boardCopy = [...currentBoard];
      boardCopy[move] = 'X';
      if (calculateWinner(boardCopy).winner === 'X') {
        return move;
      }
    }
    
    // 3. Strategy: Take the center if it's available
    if (emptySquares.includes(4)) {
      return 4;
    }

    // 4. Strategy: Take a random corner
    const corners = [0, 2, 6, 8].filter(i => emptySquares.includes(i));
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    // 5. Strategy: Take a random side
    const sides = [1, 3, 5, 7].filter(i => emptySquares.includes(i));
    if (sides.length > 0) {
        return sides[Math.floor(Math.random() * sides.length)];
    }

    return emptySquares.length > 0 ? emptySquares[0] : null;
  };


  const handleClick = (i: number) => {
    // Prevent move if square is taken, game is over, or it's not the player's turn
    if (board[i] || winner || (isPlayerTurn && board[i] !== null)) {
      return;
    }
    
    const newBoard = board.slice();
    newBoard[i] = isPlayerTurn ? 'X' : 'O';
    setBoard(newBoard);
    setIsPlayerTurn(!isPlayerTurn);
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
  };

  const renderSquare = (i: number) => {
    return (
      <Square
        value={board[i]}
        onClick={() => {
            if (isPlayerTurn) {
                handleClick(i)
            }
        }}
        isWinning={winningLine?.includes(i) ?? false}
      />
    );
  };

  let status: string;
  if (winner) {
    status = winner === 'X' ? 'You Win!' : 'Computer Wins!';
  } else if (isDraw) {
    status = "It's a Draw!";
  } else {
    status = isPlayerTurn ? 'Your Turn (X)' : 'Computer is thinking...';
  }

  const statusColor = winner === 'X' ? 'text-blue-400' : winner === 'O' ? 'text-pink-400' : 'text-white';


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-mono">
      <div className="flex flex-col items-center bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-500">
          Tic Tac Toe
        </h1>
        <p className="text-lg text-gray-400 mb-6">Player (X) vs. Computer (O)</p>
        
        <div className={`text-2xl md:text-3xl font-semibold mb-4 transition-colors duration-500 ${statusColor}`}>
          {status}
        </div>

        <div className="grid grid-cols-3 gap-1">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>

        {(winner || isDraw) && (
          <button
            onClick={handleReset}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
          >
            Play Again
          </button>
        )}
      </div>
       <footer className="absolute bottom-4 text-gray-500 text-sm">
        Crafted by a World-Class Senior Frontend React Engineer
      </footer>
    </div>
  );
};

export default App;
