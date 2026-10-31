/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MusicianType } from '../../types/game';

interface ChibiMusicianProps {
  type: MusicianType;
  hp: number;
  maxHp: number;
  isAttacking?: boolean;
  className?: string;
}

export const ChibiMusician: React.FC<ChibiMusicianProps> = ({
  type,
  hp,
  maxHp,
  isAttacking = false,
  className = '',
}) => {
  const hpPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100));

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* HP Bar */}
      <div className="w-12 h-1.5 bg-slate-900/80 rounded-full border border-slate-700 overflow-hidden mb-1 shadow-sm">
        <div
          className={`h-full transition-all duration-200 ${
            hpPercent > 50 ? 'bg-emerald-400' : hpPercent > 25 ? 'bg-amber-400' : 'bg-rose-500'
          }`}
          style={{ width: `${hpPercent}%` }}
        />
      </div>

      {/* Chibi Character SVG */}
      <div className={`w-14 h-14 relative ${isAttacking ? 'scale-110 transition-transform' : 'animate-bounce-subtle'}`}>
        {type === 'vocalist' && (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Stage aura / light */}
            <circle cx="50" cy="55" r="38" fill="rgba(6, 182, 212, 0.15)" />
            {/* Hair back */}
            <path d="M22 45 C15 20, 85 20, 78 45 C80 65, 75 75, 72 82 C65 72, 60 70, 50 72 C40 70, 35 72, 28 82 C25 75, 20 65, 22 45 Z" fill="#38BDF8" />
            
            {/* Body / outfit */}
            <path d="M35 60 L65 60 L68 88 L32 88 Z" fill="#0284C7" />
            <path d="M42 60 L58 60 L56 75 L44 75 Z" fill="#F0F9FF" />
            {/* Collar tie / bow */}
            <polygon points="50,63 46,70 54,70" fill="#F43F5E" />

            {/* Chibi Head */}
            <circle cx="50" cy="42" r="24" fill="#FED7AA" />
            {/* Blushing cheeks */}
            <ellipse cx="36" cy="46" rx="4" ry="2" fill="#FB7185" opacity="0.6" />
            <ellipse cx="64" cy="46" rx="4" ry="2" fill="#FB7185" opacity="0.6" />

            {/* Eyes */}
            <ellipse cx="40" cy="40" rx="3.5" ry="5" fill="#0C4A6E" />
            <circle cx="41" cy="38" r="1.5" fill="#FFFFFF" />
            <ellipse cx="60" cy="40" rx="3.5" ry="5" fill="#0C4A6E" />
            <circle cx="61" cy="38" r="1.5" fill="#FFFFFF" />

            {/* Singing mouth */}
            <path d="M45 47 Q50 56 55 47 Z" fill="#E11D48" />

            {/* Hair front bangs */}
            <path d="M26 36 C32 25, 45 28, 50 34 C55 28, 68 25, 74 36 C70 30, 60 26, 50 28 C40 26, 30 30, 26 36 Z" fill="#0EA5E9" />

            {/* Headphones */}
            <path d="M25 40 A 25 25 0 0 1 75 40" fill="none" stroke="#F43F5E" strokeWidth="4" strokeLinecap="round" />
            <rect x="20" y="34" width="7" height="14" rx="3" fill="#E11D48" />
            <rect x="73" y="34" width="7" height="14" rx="3" fill="#E11D48" />

            {/* Microphone in hand */}
            <rect x="62" y="52" width="5" height="16" rx="2" fill="#64748B" transform="rotate(-25 62 52)" />
            <circle cx="61" cy="50" r="5" fill="#CBD5E1" />
            <circle cx="61" cy="50" r="4" fill="#94A3B8" />

            {/* Floating musical note if singing */}
            {isAttacking && (
              <text x="75" y="28" fill="#FACC15" fontSize="22" fontWeight="bold" className="animate-ping">
                ♪
              </text>
            )}
          </svg>
        )}

        {type === 'guitarist' && (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Stage aura */}
            <circle cx="50" cy="55" r="38" fill="rgba(245, 158, 11, 0.15)" />
            
            {/* Rocker Hair back */}
            <path d="M22 42 C16 14, 84 14, 78 42 C85 60, 75 80, 70 85 C60 78, 40 78, 30 85 C25 80, 15 60, 22 42 Z" fill="#D97706" />

            {/* Body */}
            <path d="M36 60 L64 60 L66 88 L34 88 Z" fill="#78350F" />
            <path d="M44 60 L56 60 L54 74 L46 74 Z" fill="#FEF3C7" />

            {/* Head */}
            <circle cx="50" cy="42" r="23" fill="#FDE68A" />
            {/* Cheeks */}
            <ellipse cx="38" cy="47" rx="3.5" ry="2" fill="#F59E0B" opacity="0.6" />
            <ellipse cx="62" cy="47" rx="3.5" ry="2" fill="#F59E0B" opacity="0.6" />

            {/* Cool sunglasses */}
            <rect x="33" y="37" width="14" height="9" rx="2" fill="#1E293B" />
            <rect x="53" y="37" width="14" height="9" rx="2" fill="#1E293B" />
            <line x1="47" y1="41" x2="53" y2="41" stroke="#1E293B" strokeWidth="2.5" />
            {/* Lens gleam */}
            <line x1="36" y1="39" x2="42" y2="44" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="56" y1="39" x2="62" y2="44" stroke="#94A3B8" strokeWidth="1.5" />

            {/* Smiling mouth */}
            <path d="M46 50 Q50 54 54 50" fill="none" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />

            {/* Wild rocker spikes */}
            <polygon points="50,16 43,26 57,26" fill="#B45309" />
            <polygon points="35,20 30,30 42,28" fill="#B45309" />
            <polygon points="65,20 58,28 70,30" fill="#B45309" />

            {/* Electric Guitar across body */}
            <g transform="rotate(-30 48 68)">
              {/* Guitar neck */}
              <rect x="47" y="32" width="4" height="36" fill="#FDE68A" />
              <rect x="46" y="28" width="6" height="8" rx="1" fill="#DC2626" />
              {/* Guitar body */}
              <path d="M40 64 C35 58, 35 76, 40 82 C45 88, 55 88, 60 82 C65 76, 65 58, 60 64 Z" fill="#EF4444" />
              {/* Pickguard & Strings */}
              <circle cx="50" cy="72" r="5" fill="#FFFFFF" />
              <line x1="49" y1="34" x2="49" y2="76" stroke="#E2E8F0" strokeWidth="1" />
              <line x1="51" y1="34" x2="51" y2="76" stroke="#E2E8F0" strokeWidth="1" />
            </g>
          </svg>
        )}

        {type === 'drummer' && (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Stage aura */}
            <circle cx="50" cy="55" r="38" fill="rgba(16, 185, 129, 0.15)" />

            {/* Head & Cap */}
            <circle cx="50" cy="38" r="20" fill="#FED7AA" />
            {/* Backwards cap */}
            <path d="M30 36 C30 22, 70 22, 70 36 Z" fill="#10B981" />
            <rect x="68" y="33" width="10" height="4" rx="2" fill="#059669" />

            {/* Eyes - determined/sturdy */}
            <ellipse cx="43" cy="38" rx="3" ry="4" fill="#064E3B" />
            <circle cx="44" cy="36" r="1.2" fill="#FFFFFF" />
            <ellipse cx="57" cy="38" rx="3" ry="4" fill="#064E3B" />
            <circle cx="58" cy="36" r="1.2" fill="#FFFFFF" />

            {/* Determined smirk */}
            <path d="M46 45 Q50 48 55 45" fill="none" stroke="#064E3B" strokeWidth="2" strokeLinecap="round" />

            {/* Cheeks */}
            <ellipse cx="38" cy="42" rx="3" ry="1.5" fill="#34D399" opacity="0.6" />
            <ellipse cx="62" cy="42" rx="3" ry="1.5" fill="#34D399" opacity="0.6" />

            {/* Body */}
            <path d="M38 52 L62 52 L65 72 L35 72 Z" fill="#047857" />

            {/* Sturdy Drum Kit barrier in front */}
            {/* Bass Drum Center */}
            <circle cx="50" cy="74" r="17" fill="#059669" stroke="#E2E8F0" strokeWidth="2.5" />
            <circle cx="50" cy="74" r="13" fill="#ECFDF5" />
            <text x="50" y="77" fill="#047857" fontSize="10" fontWeight="bold" textAnchor="middle">
              BEAT
            </text>

            {/* Snare drums left & right */}
            <ellipse cx="28" cy="66" rx="9" ry="5" fill="#10B981" stroke="#CBD5E1" strokeWidth="1.5" />
            <ellipse cx="72" cy="66" rx="9" ry="5" fill="#10B981" stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Cymbal Top Right */}
            <ellipse cx="76" cy="48" rx="10" ry="3" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
            <line x1="76" y1="51" x2="76" y2="70" stroke="#94A3B8" strokeWidth="2" />

            {/* Drumsticks in hands */}
            <line x1="38" y1="50" x2="30" y2="64" stroke="#FEF08A" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="62" y1="50" x2="70" y2="64" stroke="#FEF08A" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        )}
      </div>

      {/* Name and cost label */}
      <span className="text-[10px] font-bold text-slate-300 capitalize tracking-tight mt-0.5">
        {type}
      </span>
    </div>
  );
};
