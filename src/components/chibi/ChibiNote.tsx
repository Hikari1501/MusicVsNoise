/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface ChibiNoteProps {
  id: string;
  x: number; // percentage
  y: number; // percentage
  value: number; // 25 Inspiration
  onCollect: (id: string) => void;
}

export const ChibiNote: React.FC<ChibiNoteProps> = ({ id, x, y, value, onCollect }) => {
  const [collected, setCollected] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (collected) return;
    setCollected(true);
    onCollect(id);
  };

  return (
    <div
      onClick={handleClick}
      className={`absolute z-30 cursor-pointer select-none transition-transform duration-200 ${
        collected ? 'scale-150 opacity-0 pointer-events-none' : 'hover:scale-125'
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="relative group flex items-center justify-center">
        {/* Glowing backdrop halo */}
        <div className="absolute w-12 h-12 rounded-full bg-amber-400/30 blur-md group-hover:bg-amber-300/50 animate-pulse" />

        {/* Music Note SVG */}
        <svg viewBox="0 0 40 40" className="w-10 h-10 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-bounce-subtle">
          {/* Note head 1 */}
          <ellipse cx="14" cy="28" rx="6" ry="4.5" fill="#FACC15" transform="rotate(-20 14 28)" />
          {/* Note head 2 */}
          <ellipse cx="26" cy="24" rx="6" ry="4.5" fill="#FACC15" transform="rotate(-20 26 24)" />
          {/* Stems */}
          <line x1="19" y1="26" x2="19" y2="10" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="31" y1="22" x2="31" y2="6" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Beam bar */}
          <polygon points="18,12 32,8 32,5 18,9" fill="#D97706" />
          {/* Sparkles */}
          <polygon points="34,14 36,12 34,10 32,12" fill="#FEF08A" />
        </svg>

        {/* Value badge */}
        <span className="absolute -bottom-2 bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full shadow border border-amber-300">
          +{value}♪
        </span>
      </div>
    </div>
  );
};
