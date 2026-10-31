/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Difficulty, LevelConfig } from './types/game';
import { LEVELS } from './data/levels';
import { MainMenu } from './components/game/MainMenu';
import { GameStage } from './components/game/GameStage';

export default function App() {
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig>(LEVELS[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('faint');
  const [inGame, setInGame] = useState<boolean>(false);

  // Next level navigation
  const handleNextLevel = () => {
    const currentIndex = LEVELS.findIndex((l) => l.id === selectedLevel.id);
    if (currentIndex >= 0 && currentIndex < LEVELS.length - 1) {
      setSelectedLevel(LEVELS[currentIndex + 1]);
    } else {
      setInGame(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center p-0 md:p-3 overflow-hidden select-none">
      {/* 16:9 Fixed Ratio Stage Container */}
      <div className="relative w-full h-full max-w-[1400px] aspect-[16/9] max-h-[96vh] rounded-none md:rounded-2xl overflow-hidden border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.9)] bg-slate-950 flex flex-col">
        {!inGame ? (
          <MainMenu
            selectedLevel={selectedLevel}
            selectedDifficulty={selectedDifficulty}
            onSelectLevel={setSelectedLevel}
            onSelectDifficulty={setSelectedDifficulty}
            onStartGame={() => setInGame(true)}
          />
        ) : (
          <GameStage
            level={selectedLevel}
            difficulty={selectedDifficulty}
            onReturnToMenu={() => setInGame(false)}
            onNextLevel={handleNextLevel}
          />
        )}
      </div>
    </div>
  );
}
