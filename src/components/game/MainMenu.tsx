/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Play, Sparkles, Volume2, Shield, Info, Music, Zap } from 'lucide-react';
import { Difficulty, LevelConfig } from '../../types/game';
import { LEVELS } from '../../data/levels';
import { ChibiMusician } from '../chibi/ChibiMusician';
import { ChibiNoise } from '../chibi/ChibiNoise';

interface MainMenuProps {
  selectedLevel: LevelConfig;
  selectedDifficulty: Difficulty;
  onSelectLevel: (level: LevelConfig) => void;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onStartGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  selectedLevel,
  selectedDifficulty,
  onSelectLevel,
  onSelectDifficulty,
  onStartGame,
}) => {
  const [showStoryModal, setShowStoryModal] = useState(false);

  const difficulties: Array<{ id: Difficulty; label: string; desc: string; color: string }> = [
    {
      id: 'faint',
      label: 'Faint',
      desc: 'Gentle Noise waves for warm-up practice',
      color: 'border-emerald-500/60 bg-emerald-950/30 text-emerald-300',
    },
    {
      id: 'loud',
      label: 'Loud',
      desc: 'Denser waves with mixed Noise types',
      color: 'border-amber-500/60 bg-amber-950/30 text-amber-300',
    },
    {
      id: 'deafening',
      label: 'Deafening',
      desc: 'High-density multi-lane rushes for masters',
      color: 'border-rose-500/60 bg-rose-950/30 text-rose-300',
    },
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 md:p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-slate-100 select-none overflow-y-auto">
      {/* Concert Spotlight Background Visuals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-10 left-1/4 w-72 h-96 bg-cyan-500/20 rounded-full blur-3xl -rotate-12" />
        <div className="absolute -top-10 right-1/4 w-72 h-96 bg-rose-500/20 rounded-full blur-3xl rotate-12" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-amber-500/15 rounded-full blur-3xl" />
      </div>

      {/* Header Bar */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
            <Music className="w-4 h-4" />
          </div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
            English Pronunciation Defense
          </span>
        </div>

        <button
          onClick={() => setShowStoryModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors"
        >
          <Info className="w-4 h-4 text-cyan-400" />
          <span>Game Story & Rules</span>
        </button>
      </div>

      {/* Hero Title & Chibi Stage Lockup */}
      <div className="relative z-10 text-center my-auto py-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-2">
          <Zap className="w-3.5 h-3.5" />
          <span>Beta Release · 4 Core Pronunciation Modules</span>
        </div>

        {/* Title Lockup */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
          <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
            Music
          </span>{' '}
          <span className="text-rose-500 font-serif italic text-3xl sm:text-4xl md:text-5xl">vs.</span>{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
            Noise
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-1.5">
          Defeat hearing-disrupting Noise monsters by singing English words with pitch, stress, and linking clarity!
        </p>

        {/* Chibi Showdown Showcase Banner */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 p-2 rounded-xl backdrop-blur-sm">
            <ChibiMusician type="vocalist" hp={10} maxHp={10} />
            <ChibiMusician type="guitarist" hp={10} maxHp={10} />
            <ChibiMusician type="drummer" hp={30} maxHp={30} />
          </div>
          <span className="text-rose-400 font-black text-xl">VS</span>
          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 p-2 rounded-xl backdrop-blur-sm">
            <ChibiNoise
              type="normal"
              hp={10}
              maxHp={10}
              promptItem={{ id: 'c1', text: 'cat', cleanText: 'cat', type: 'word' }}
              state="walking"
            />
            <ChibiNoise
              type="constant"
              hp={20}
              maxHp={20}
              promptItem={{ id: 'c2', text: 'think', cleanText: 'think', type: 'word' }}
              state="walking"
            />
            <ChibiNoise
              type="incessant"
              hp={30}
              maxHp={30}
              promptItem={{ id: 'c3', text: 'PRE-sent', cleanText: 'present', type: 'word' }}
              state="walking"
            />
          </div>
        </div>
      </div>

      {/* Level & Difficulty Selectors */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto w-full mb-3">
        {/* Level Selection (Left 2 columns) */}
        <div className="md:col-span-2 bg-slate-900/85 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Select Pronunciation Level
            </span>
            <span className="text-[11px] font-semibold text-cyan-400">
              {selectedLevel.targetFeature}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {LEVELS.map((lvl) => {
              const isSelected = selectedLevel.id === lvl.id;
              return (
                <button
                  key={lvl.id}
                  onClick={() => onSelectLevel(lvl)}
                  className={`flex flex-col text-left p-2.5 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-black text-white">{lvl.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-900/70 text-cyan-300 font-bold">
                      {lvl.targetFeature}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {lvl.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Selection (Right column) */}
        <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-sm shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">
              Wave Difficulty
            </span>
            <div className="flex flex-col gap-1.5">
              {difficulties.map((diff) => {
                const isSelected = selectedDifficulty === diff.id;
                return (
                  <button
                    key={diff.id}
                    onClick={() => onSelectDifficulty(diff.id)}
                    className={`flex flex-col text-left p-2 rounded-xl border transition-all ${
                      isSelected
                        ? `${diff.color} border-2 shadow-sm font-bold scale-[1.02]`
                        : 'border-slate-800 bg-slate-800/30 text-slate-400 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase">{diff.label}</span>
                      {isSelected && <Sparkles className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5">{diff.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start Concert CTA Button */}
          <button
            onClick={onStartGame}
            className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-sm shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Start Concert</span>
          </button>
        </div>
      </div>

      {/* Story & Lore Modal */}
      {showStoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative text-slate-100">
            <h2 className="text-xl font-black text-amber-300 mb-2">
              The Legend of Music vs. Noise
            </h2>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-sm leading-relaxed text-slate-300 mb-4">
              <p className="mb-2.5">
                Somewhere in the near future, noise pollution in the world becomes so severe that monsters called <strong className="text-rose-400">Noise</strong> are born.
              </p>
              <p className="mb-2.5">
                These monsters cause harm to people's lives; disrupting their hearing and tearing through neighborhoods. People can only defeat them with <strong className="text-cyan-400">Music</strong>.
              </p>
              <p>
                As the band's conductor, place your <strong>Vocalist</strong>, <strong>Guitarist</strong>, and <strong>Drummer</strong> along the 5 concert lanes. Speak the words carrying through the Noise to command your Vocalists to blast them with musical harmony!
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowStoryModal(false)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
              >
                Got It, Let's Rock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
