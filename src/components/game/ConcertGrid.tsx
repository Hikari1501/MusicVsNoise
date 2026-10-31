/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MusicianEntity, NoiseEntity, ProjectileEntity, FloatingNote, MusicianType } from '../../types/game';
import { ChibiMusician } from '../chibi/ChibiMusician';
import { ChibiNoise } from '../chibi/ChibiNoise';
import { ChibiProjectile } from '../chibi/ChibiProjectile';
import { ChibiNote } from '../chibi/ChibiNote';

interface ConcertGridProps {
  musicians: MusicianEntity[];
  noises: NoiseEntity[];
  projectiles: ProjectileEntity[];
  floatingNotes: FloatingNote[];
  selectedCardType: MusicianType | null;
  onTileClick: (row: number, col: number) => void;
  onTileDrop: (row: number, col: number) => void;
  onCollectNote: (id: string) => void;
  onPreviewTargetAudio: (text: string) => void;
}

export const ConcertGrid: React.FC<ConcertGridProps> = ({
  musicians,
  noises,
  projectiles,
  floatingNotes,
  selectedCardType,
  onTileClick,
  onTileDrop,
  onCollectNote,
  onPreviewTargetAudio,
}) => {
  const ROWS = 5;
  const COLS = 9;

  // Find musician at a specific tile
  const getMusicianAt = (r: number, c: number) =>
    musicians.find((m) => m.row === r && m.col === c);

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 p-2 rounded-xl border border-slate-800 shadow-inner select-none">
      {/* Concert Spotlight Beam Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-32 h-full bg-gradient-to-b from-cyan-400 via-transparent to-transparent -rotate-12 blur-xl" />
        <div className="absolute top-0 right-1/4 w-32 h-full bg-gradient-to-b from-amber-400 via-transparent to-transparent rotate-12 blur-xl" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-full bg-gradient-to-b from-rose-400 via-transparent to-transparent blur-2xl" />
      </div>

      {/* Floating Collectible Notes (from Sky or Guitarists) */}
      {floatingNotes.map((note) => (
        <ChibiNote
          key={note.id}
          id={note.id}
          x={note.x}
          y={note.y}
          value={note.value}
          onCollect={onCollectNote}
        />
      ))}

      {/* 5 Concert Rows */}
      <div className="relative w-full h-full flex flex-col justify-between gap-1 z-10">
        {Array.from({ length: ROWS }).map((_, rowIndex) => {
          const rowProjectiles = projectiles.filter((p) => p.row === rowIndex);
          const rowNoises = noises.filter((n) => n.row === rowIndex);

          return (
            <div
              key={rowIndex}
              className="relative flex-1 w-full grid grid-cols-9 gap-1 items-center px-1 rounded-lg bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/60 transition-colors"
            >
              {/* Row Spotlights & Planks */}
              <div className="absolute inset-0 rounded-lg pointer-events-none opacity-10 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)]" />

              {/* Lane Row Marker at far left */}
              <div className="absolute left-1 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] font-black text-slate-700 select-none">
                {rowIndex + 1}
              </div>

              {/* 9 Column Tiles */}
              {Array.from({ length: COLS }).map((_, colIndex) => {
                const musician = getMusicianAt(rowIndex, colIndex);
                const isHoverable = selectedCardType !== null;

                return (
                  <div
                    key={colIndex}
                    onClick={() => onTileClick(rowIndex, colIndex)}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      onTileDrop(rowIndex, colIndex);
                    }}
                    className={`relative w-full h-full min-h-[58px] flex items-center justify-center rounded-md border transition-all ${
                      colIndex % 2 === 0 ? 'bg-slate-800/25' : 'bg-slate-800/15'
                    } ${
                      isHoverable && !musician
                        ? 'hover:bg-amber-400/20 hover:border-amber-400/60 cursor-pointer'
                        : isHoverable && musician
                        ? 'hover:bg-rose-500/20 hover:border-rose-500/50 cursor-not-allowed'
                        : 'border-slate-800/50'
                    }`}
                  >
                    {/* Render Musician if placed */}
                    {musician && (
                      <ChibiMusician
                        type={musician.type}
                        hp={musician.hp}
                        maxHp={musician.maxHp}
                      />
                    )}
                  </div>
                );
              })}

              {/* Row Projectiles */}
              {rowProjectiles.map((proj) => (
                <ChibiProjectile
                  key={proj.id}
                  x={proj.x}
                  row={proj.row}
                  symbol={proj.symbol}
                />
              ))}

              {/* Row Noises */}
              {rowNoises.map((noise) => (
                <div
                  key={noise.id}
                  className="absolute z-20 pointer-events-auto transition-transform"
                  style={{
                    left: `${noise.x}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <ChibiNoise
                    type={noise.type}
                    hp={noise.hp}
                    maxHp={noise.maxHp}
                    promptItem={noise.promptItem}
                    state={noise.state}
                    onListenPreview={onPreviewTargetAudio}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Concert Stage Floor Edge */}
      <div className="w-full h-2 bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 rounded-b-md shadow-md mt-1" />
    </div>
  );
};
