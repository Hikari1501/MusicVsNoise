/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MusicianType } from '../../types/game';
import { MUSICIAN_DEFS } from '../../data/levels';
import { ChibiMusician } from '../chibi/ChibiMusician';

interface CardTrayProps {
  inspiration: number;
  selectedType: MusicianType | null;
  onSelectType: (type: MusicianType | null) => void;
  onDragStartCard: (type: MusicianType) => void;
}

export const CardTray: React.FC<CardTrayProps> = ({
  inspiration,
  selectedType,
  onSelectType,
  onDragStartCard,
}) => {
  const musicians: MusicianType[] = ['vocalist', 'guitarist', 'drummer'];

  return (
    <div className="flex sm:flex-col gap-2 p-2 bg-slate-900/90 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-md select-none shrink-0 z-30">
      <span className="hidden sm:block text-[10px] font-black tracking-wider text-slate-400 uppercase text-center border-b border-slate-800 pb-1">
        Musicians
      </span>

      {musicians.map((type) => {
        const def = MUSICIAN_DEFS[type];
        const canAfford = inspiration >= def.cost;
        const isSelected = selectedType === type;

        return (
          <div
            key={type}
            draggable={canAfford}
            onDragStart={() => canAfford && onDragStartCard(type)}
            onClick={() => {
              if (canAfford) {
                onSelectType(isSelected ? null : type);
              }
            }}
            title={`${def.name} (${def.cost} Inspiration): ${def.description}`}
            className={`relative flex sm:flex-col items-center justify-between p-1.5 rounded-lg border-2 transition-all cursor-pointer ${
              isSelected
                ? 'border-amber-400 bg-amber-500/20 scale-105 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                : canAfford
                ? 'border-slate-700 bg-slate-800/80 hover:border-slate-500 hover:bg-slate-700/80'
                : 'border-slate-800 bg-slate-950/60 opacity-50 cursor-not-allowed grayscale'
            }`}
          >
            {/* Chibi Icon Preview */}
            <div className="w-10 h-10 flex items-center justify-center pointer-events-none">
              <ChibiMusician type={type} hp={def.maxHp} maxHp={def.maxHp} />
            </div>

            {/* Musician Name and Cost */}
            <div className="flex flex-col items-center text-center mt-1">
              <span className="text-[11px] font-bold text-slate-200 capitalize leading-tight">
                {def.name}
              </span>
              <div className="flex items-center gap-0.5 mt-0.5">
                <span className="text-amber-400 font-black text-xs">♪</span>
                <span className="text-xs font-black text-amber-300 tabular-nums">
                  {def.cost}
                </span>
              </div>
            </div>

            {/* Selection indicator highlight ring */}
            {isSelected && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
