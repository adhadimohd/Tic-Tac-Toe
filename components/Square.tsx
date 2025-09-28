
import React from 'react';
import { SquareValue } from '../types';

interface SquareProps {
  value: SquareValue;
  onClick: () => void;
  isWinning: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onClick, isWinning }) => {
  const textColor = value === 'X' ? 'text-blue-400' : 'text-pink-400';
  const winningBg = isWinning ? 'bg-green-500/30' : 'bg-gray-800 hover:bg-gray-700';

  return (
    <button
      className={`w-24 h-24 md:w-32 md:h-32 m-1 flex items-center justify-center rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 ${winningBg}`}
      onClick={onClick}
    >
      <span className={`text-6xl md:text-7xl font-bold ${textColor}`}>
        {value}
      </span>
    </button>
  );
};

export default Square;
