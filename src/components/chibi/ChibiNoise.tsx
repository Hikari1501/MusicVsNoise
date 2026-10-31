/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NoiseType, PronunciationItem } from '../../types/game';

interface ChibiNoiseProps {
  type: NoiseType;
  hp: number;
  maxHp: number;
  promptItem: PronunciationItem;
  state: 'walking' | 'eating' | 'hit' | 'defeated';
  onListenPreview?: (text: string) => void;
  className?: string;
}

export const ChibiNoise: React.FC<ChibiNoiseProps> = ({
  type,
  hp,
  maxHp,
  promptItem,
  state,
  onListenPreview,
  className = '',
}) => {
  const hpPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const isHit = state === 'hit';
  const isEating = state === 'eating';

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Pronunciation Target Banner: displays ONLY words, phrases, or sentences per user instructions */}
      <div className="relative -mb-1 z-20 group">
        <div className="bg-slate-900/95 border-2 border-rose-500/80 rounded-md px-2.5 py-1 shadow-lg flex items-center justify-center gap-1.5 min-w-[70px] max-w-[240px] sm:max-w-[280px] backdrop-blur-sm animate-pulse-subtle">
          <span className="text-[11px] font-extrabold text-amber-200 tracking-wide leading-tight text-center whitespace-normal break-words">
            {promptItem.text}
          </span>
          {/* Subtle audio model listen icon if student wants to preview */}
          {onListenPreview && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onListenPreview(promptItem.text);
              }}
              title="Listen to pronunciation preview"
              className="text-slate-400 hover:text-cyan-300 transition-colors p-0.5 rounded shrink-0 focus:outline-none"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            </button>
          )}
        </div>
        {/* Pointer arrow down to monster */}
        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-rose-500/80 mx-auto" />
      </div>

      {/* HP Bar */}
      <div className="w-14 h-1.5 bg-slate-900/90 rounded-full border border-slate-700 overflow-hidden mb-1 shadow-sm">
        <div
          className={`h-full transition-all duration-150 ${
            hpPercent > 50 ? 'bg-purple-400' : hpPercent > 25 ? 'bg-amber-400' : 'bg-rose-500'
          }`}
          style={{ width: `${hpPercent}%` }}
        />
      </div>

      {/* Chibi Noise Monster SVG */}
      <div
        className={`w-16 h-16 relative transition-transform duration-100 ${
          isHit
            ? 'scale-110 brightness-150 filter'
            : isEating
            ? 'animate-pulse'
            : 'animate-wiggle-subtle'
        }`}
      >
        {type === 'normal' && (
          /* Normal Noise: 10 HP, purple static fuzzy cloud creature with cute angry eyes */
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Discordant sound aura */}
            <circle cx="50" cy="50" r="42" fill="rgba(168, 85, 247, 0.2)" />
            
            {/* Fluffy jagged static body */}
            <path
              d="M50 20 C62 18, 74 25, 78 36 C86 42, 88 56, 82 66 C86 78, 74 86, 62 84 C52 90, 38 88, 30 82 C20 84, 14 74, 18 64 C12 52, 16 38, 26 32 C30 20, 42 18, 50 20 Z"
              fill={isHit ? '#F43F5E' : '#9333EA'}
              stroke="#6B21A8"
              strokeWidth="2.5"
            />
            {/* Static spikes / fuzz */}
            <polygon points="50,14 46,22 54,22" fill="#C084FC" />
            <polygon points="76,28 70,34 80,38" fill="#C084FC" />
            <polygon points="24,28 20,38 30,34" fill="#C084FC" />

            {/* Static Antenna */}
            <line x1="50" y1="14" x2="50" y2="6" stroke="#C084FC" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="50" cy="5" r="3.5" fill="#F43F5E" />

            {/* Cartoon Eyes */}
            <ellipse cx="38" cy="48" rx="7" ry="9" fill="#FFFFFF" stroke="#4C1D95" strokeWidth="2" />
            <circle cx="39" cy="49" r="4" fill="#1E1B4B" />
            <circle cx="41" cy="47" r="1.5" fill="#FFFFFF" />

            <ellipse cx="62" cy="48" rx="7" ry="9" fill="#FFFFFF" stroke="#4C1D95" strokeWidth="2" />
            <circle cx="61" cy="49" r="4" fill="#1E1B4B" />
            <circle cx="63" cy="47" r="1.5" fill="#FFFFFF" />

            {/* Grumpy Zigzag Mouth */}
            {isEating ? (
              <polygon points="36,65 42,59 48,67 54,59 60,67 64,62 60,72 40,72" fill="#4C1D95" />
            ) : (
              <path d="M38 64 L44 60 L50 65 L56 60 L62 64" fill="none" stroke="#4C1D95" strokeWidth="2.5" strokeLinecap="round" />
            )}

            {/* Noise static sparks */}
            <path d="M12 45 L18 48 L14 52" fill="none" stroke="#E879F9" strokeWidth="2" />
            <path d="M82 45 L88 48 L84 52" fill="none" stroke="#E879F9" strokeWidth="2" />
          </svg>
        )}

        {type === 'constant' && (
          /* Constant Noise: 20 HP, magenta boombox glitch monster with buzzing speakers */
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Sound blast waves */}
            <circle cx="50" cy="50" r="44" fill="rgba(236, 72, 153, 0.2)" />

            {/* Radio / Boombox Monster Body */}
            <rect
              x="20"
              y="26"
              width="60"
              height="54"
              rx="12"
              fill={isHit ? '#F43F5E' : '#BE185D'}
              stroke="#831843"
              strokeWidth="2.5"
            />
            {/* Top handle */}
            <path d="M34 26 L34 16 L66 16 L66 26" fill="none" stroke="#F472B6" strokeWidth="3.5" strokeLinecap="round" />

            {/* Speaker Eyes */}
            <circle cx="37" cy="46" r="13" fill="#1F2937" stroke="#F472B6" strokeWidth="2" />
            <circle cx="37" cy="46" r="8" fill="#EC4899" />
            <circle cx="37" cy="46" r="3" fill="#FDF2F8" />

            <circle cx="63" cy="46" r="13" fill="#1F2937" stroke="#F472B6" strokeWidth="2" />
            <circle cx="63" cy="46" r="8" fill="#EC4899" />
            <circle cx="63" cy="46" r="3" fill="#FDF2F8" />

            {/* Grumpy / chomp speaker mouth */}
            {isEating ? (
              <rect x="34" y="64" width="32" height="10" rx="3" fill="#1F2937" stroke="#F472B6" strokeWidth="1.5" />
            ) : (
              <g>
                <line x1="36" y1="67" x2="64" y2="67" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" />
                <line x1="36" y1="71" x2="64" y2="71" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" />
              </g>
            )}

            {/* Feet */}
            <rect x="30" y="79" width="10" height="7" rx="3" fill="#831843" />
            <rect x="60" y="79" width="10" height="7" rx="3" fill="#831843" />

            {/* Glitch spikes */}
            <polygon points="16,36 21,42 16,48" fill="#F472B6" />
            <polygon points="84,36 79,42 84,48" fill="#F472B6" />
          </svg>
        )}

        {type === 'incessant' && (
          /* Incessant Noise: 30 HP, heavy megaphone sound beast with armored plates and warning lights */
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Loud noise distortion halo */}
            <circle cx="50" cy="50" r="46" fill="rgba(225, 29, 72, 0.25)" />

            {/* Heavy armored body */}
            <path
              d="M20 32 L80 32 L86 80 L14 80 Z"
              fill={isHit ? '#FB7185' : '#475569'}
              stroke="#1E293B"
              strokeWidth="2.5"
            />
            {/* Corner rivets */}
            <circle cx="24" cy="38" r="2" fill="#CBD5E1" />
            <circle cx="76" cy="38" r="2" fill="#CBD5E1" />
            <circle cx="20" cy="74" r="2" fill="#CBD5E1" />
            <circle cx="80" cy="74" r="2" fill="#CBD5E1" />

            {/* Giant Horn / Megaphone Mouth Center */}
            <circle cx="50" cy="56" r="20" fill="#E11D48" stroke="#FFE4E6" strokeWidth="2" />
            <circle cx="50" cy="56" r="14" fill="#881337" />
            <circle cx="50" cy="56" r="7" fill="#1F2937" />

            {/* Red Warning Beacon on Head */}
            <path d="M42 22 L58 22 L54 12 L46 12 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" className="animate-pulse" />
            <circle cx="50" cy="10" r="3" fill="#FEE2E2" />

            {/* Piercing cyber eyes */}
            <polygon points="32,36 44,40 34,44" fill="#FACC15" />
            <polygon points="68,36 56,40 66,44" fill="#FACC15" />

            {/* Sound shockwave rings */}
            <path d="M74 50 A 24 24 0 0 1 74 62" fill="none" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" />
            <path d="M80 46 A 30 30 0 0 1 80 66" fill="none" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </div>

      {/* Noise Type & HP readout */}
      <span className="text-[9px] font-bold text-slate-400 capitalize tracking-tight">
        {type} · {hp} HP
      </span>
    </div>
  );
};
