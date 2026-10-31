/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Trophy, RotateCcw, ArrowRight, Home, Music, AlertTriangle } from 'lucide-react';
import { GameState, LevelConfig } from '../../types/game';

interface LevelCompleteModalProps {
  gameState: GameState;
  level: LevelConfig;
  score: number;
  onRestart: () => void;
  onNextLevel?: () => void;
  onReturnToMenu: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  gameState,
  level,
  score,
  onRestart,
  onNextLevel,
  onReturnToMenu,
}) => {
  if (gameState !== 'VICTORY' && gameState !== 'GAME_OVER') return null;

  const isVictory = gameState === 'VICTORY';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-fadeIn">
      <div className="bg-slate-900 border-2 border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl text-center text-slate-100 relative">
        {/* Victory / Defeat Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
          {isVictory ? (
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 flex items-center justify-center">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border-2 border-rose-500 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-white mb-1">
          {isVictory ? 'Encore! Concert Saved!' : 'Sound Check Interrupted!'}
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          {isVictory
            ? `Your harmonious pronunciation defeated all Noise waves in ${level.title}!`
            : 'The Noise monsters broke through to the stage! Regroup and try again!'}
        </p>

        {/* Score & Stats Card */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 mb-5 flex justify-around">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Feature</span>
            <span className="text-sm font-extrabold text-cyan-400">{level.targetFeature}</span>
          </div>
          <div className="w-px bg-slate-700" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Performance</span>
            <span className="text-sm font-black text-amber-300 tabular-nums">
              {score} Pts
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {isVictory && onNextLevel && (
            <button
              onClick={onNextLevel}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-lg transition-transform active:scale-95"
            >
              <span>Next Level</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow transition-transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <button
            onClick={onReturnToMenu}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
