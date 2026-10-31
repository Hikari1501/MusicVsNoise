/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ChibiProjectileProps {
  x: number; // percentage
  row: number;
  symbol: string;
}

export const ChibiProjectile: React.FC<ChibiProjectileProps> = ({ x, symbol }) => {
  return (
    <div
      className="absolute z-20 pointer-events-none select-none -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: '50%' }}
    >
      <div className="relative flex items-center justify-center">
        {/* Glowing sonic trail */}
        <div className="absolute -left-4 w-8 h-4 rounded-full bg-cyan-400/30 blur-sm" />
        <div className="absolute w-8 h-8 rounded-full bg-cyan-400/40 blur-md animate-ping" />

        {/* Note projectile glyph */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 border border-white flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.9)]">
          <span className="text-white font-black text-sm drop-shadow">{symbol}</span>
        </div>
      </div>
    </div>
  );
};
