/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Pause, Play, BookOpen, ArrowLeft } from 'lucide-react';
import { Difficulty, LevelConfig } from '../../types/game';

interface ConcertHUDProps {
  level: LevelConfig;
  difficulty: Difficulty;
  inspiration: number;
  currentWave: number;
  totalWaves: number;
  waveProgress: number; // 0..100
  isPaused: boolean;
  isMuted: boolean;
  onTogglePause: () => void;
  onToggleMute: () => void;
  onOpenGuide: () => void;
  onExitToMenu: () => void;
}

export const ConcertHUD: React.FC<ConcertHUDProps> = ({
  level,
  difficulty,
  inspiration,
  currentWave,
  totalWaves,
  waveProgress,
  isPaused,
  isMuted,
  onTogglePause,
  onToggleMute,
  onOpenGuide,
  onExitToMenu,
}) => {
  return (
    <div className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-slate-100 z-40 select-none backdrop-blur-md">
      {/* Left: Inspiration Meter & Back Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onExitToMenu}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Return to Main Menu"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Menu</span>
        </button>

        {/* Big Inspiration Meter */}
        <div className="flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 px-3 py-1 rounded-lg shadow-inner">
          <span className="text-xl leading-none text-amber-400 font-black animate-pulse">♪</span>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300/80 leading-tight">
              Inspiration
            </span>
            <span className="text-lg font-black text-amber-300 leading-tight tabular-nums">
              {inspiration}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Level Feature & Wave Progress */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-extrabold text-white tracking-wide">
              {level.title}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {difficulty}
            </span>
          </div>
          <span className="text-[11px] text-cyan-400 font-medium">
            Focus: {level.targetFeature}
          </span>
        </div>

        {/* Wave Flag Progress */}
        <div className="hidden sm:flex flex-col items-center gap-0.5 w-36">
          <div className="flex justify-between w-full text-[10px] font-bold text-slate-400">
            <span>Wave {currentWave}/{totalWaves}</span>
            <span>{Math.round(waveProgress)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full border border-slate-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-amber-400 to-rose-500 transition-all duration-300"
              style={{ width: `${waveProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Right: Sound, Guide & Pause controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onOpenGuide}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 transition-colors"
          title="View Pronunciation Guide & Mouth Positioning"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Pronunciation Guide</span>
        </button>

        <button
          onClick={onToggleMute}
          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        <button
          onClick={onTogglePause}
          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title={isPaused ? 'Resume Game' : 'Pause Game'}
        >
          {isPaused ? <Play className="w-4 h-4 text-amber-400" /> : <Pause className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
