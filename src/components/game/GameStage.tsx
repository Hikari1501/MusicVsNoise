/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Difficulty,
  LevelConfig,
  GameState,
  MusicianEntity,
  NoiseEntity,
  ProjectileEntity,
  FloatingNote,
  MusicianType,
  NoiseType,
  PronunciationItem,
} from '../../types/game';
import { MUSICIAN_DEFS } from '../../data/levels';
import { SoundFX, playPronunciationModelAudio } from '../../services/audio';
import { speechService, checkPronunciationMatch } from '../../services/speechRecognition';
import { ConcertHUD } from './ConcertHUD';
import { CardTray } from './CardTray';
import { ConcertGrid } from './ConcertGrid';
import { SingAttackController } from './SingAttackController';
import { PhoneticGuideModal } from './PhoneticGuideModal';
import { LevelCompleteModal } from './LevelCompleteModal';

interface GameStageProps {
  level: LevelConfig;
  difficulty: Difficulty;
  onReturnToMenu: () => void;
  onNextLevel?: () => void;
}

export const GameStage: React.FC<GameStageProps> = ({
  level,
  difficulty,
  onReturnToMenu,
  onNextLevel,
}) => {
  // Game State
  const [gameState, setGameState] = useState<GameState>('PLAYING');
  const [inspiration, setInspiration] = useState<number>(100); // 100 Inspiration at start
  const [score, setScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [prepTimeRemaining, setPrepTimeRemaining] = useState<number>(7); // Prep pause before Noises appear

  // Card Selection & Drag
  const [selectedCardType, setSelectedCardType] = useState<MusicianType | null>(null);
  const [draggedCardType, setDraggedCardType] = useState<MusicianType | null>(null);

  // Entities displayed in React
  const [musicians, setMusicians] = useState<MusicianEntity[]>([]);
  const [noises, setNoises] = useState<NoiseEntity[]>([]);
  const [projectiles, setProjectiles] = useState<ProjectileEntity[]>([]);
  const [floatingNotes, setFloatingNotes] = useState<FloatingNote[]>([]);

  // Simulation Refs (prevents state race conditions in 60fps requestAnimationFrame loop)
  const musiciansRef = useRef<MusicianEntity[]>([]);
  const noisesRef = useRef<NoiseEntity[]>([]);
  const projectilesRef = useRef<ProjectileEntity[]>([]);
  const floatingNotesRef = useRef<FloatingNote[]>([]);
  const inspirationRef = useRef<number>(100);
  const prepTimeRef = useRef<number>(7);

  // Keep refs synced with state
  useEffect(() => {
    musiciansRef.current = musicians;
  }, [musicians]);

  useEffect(() => {
    noisesRef.current = noises;
  }, [noises]);

  useEffect(() => {
    projectilesRef.current = projectiles;
  }, [projectiles]);

  useEffect(() => {
    floatingNotesRef.current = floatingNotes;
  }, [floatingNotes]);

  useEffect(() => {
    inspirationRef.current = inspiration;
  }, [inspiration]);

  // Wave Management
  const totalWaves = level.wavesCount[difficulty];
  const [currentWave, setCurrentWave] = useState<number>(1);
  const [waveProgress, setWaveProgress] = useState<number>(0);
  const currentWaveRef = useRef<number>(1);
  const pendingWaveEnemiesRef = useRef<NoiseEntity[]>([]);
  const waveSpawningActiveRef = useRef<boolean>(false);
  const waveAppearanceTimeRef = useRef<number>(performance.now());

  // Speech Recognition & Feedback
  const [isListening, setIsListening] = useState<boolean>(false);
  const [lastTranscript, setLastTranscript] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handledUtteranceIdsRef = useRef<Set<string>>(new Set());

  // Loop & Timer Refs
  const animFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const skyNoteTimerRef = useRef<number>(0);

  // Show a temporary banner message
  const triggerFeedback = useCallback((msg: string, duration = 3000) => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    setFeedbackMessage(msg);
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedbackMessage(null);
    }, duration);
  }, []);

  // Build the wave for current wave & difficulty (all enemies appear at the same time)
  const prepareWave = useCallback(
    (waveNum: number) => {
      currentWaveRef.current = waveNum;
      setCurrentWave(waveNum);
      const prepDuration = waveNum === 1 ? 7 : 4;
      prepTimeRef.current = prepDuration;
      setPrepTimeRemaining(prepDuration);
      waveAppearanceTimeRef.current = performance.now() + prepDuration * 1000;

      // Filter available target items by wave to prevent early sentences on easier difficulties
      let availableItems = level.items;
      if (difficulty === 'faint') {
        if (waveNum === 1) {
          // Wave 1: Words only!
          const words = level.items.filter((i) => i.type === 'word');
          availableItems = words.length > 0 ? words : level.items;
        } else if (waveNum === 2) {
          // Wave 2: Words and phrases only (no sentences yet)
          const nonSentences = level.items.filter((i) => i.type !== 'sentence');
          availableItems = nonSentences.length > 0 ? nonSentences : level.items;
        }
      } else if (difficulty === 'loud') {
        if (waveNum === 1) {
          // Wave 1 on Loud: Words and phrases only (no sentences in wave 1)
          const nonSentences = level.items.filter((i) => i.type !== 'sentence');
          availableItems = nonSentences.length > 0 ? nonSentences : level.items;
        }
      }

      // Reduced noise count per wave so simultaneous appearance is engaging and not overwhelming:
      // Faint (5 waves): W1: 1, W2: 2, W3: 2, W4: 3, W5: 3
      // Loud (7 waves): W1: 2, W2: 2, W3: 3, W4: 3, W5: 3, W6: 4, W7: 4
      // Deafening (9 waves): W1: 2, W2: 3, W3: 3, W4: 3, W5: 4, W6: 4, W7: 4, W8: 5, W9: 5
      let count = 1;
      if (difficulty === 'faint') {
        count = waveNum === 1 ? 1 : waveNum <= 3 ? 2 : 3;
      } else if (difficulty === 'loud') {
        count = waveNum <= 2 ? 2 : waveNum <= 5 ? 3 : 4;
      } else {
        count = waveNum === 1 ? 2 : waveNum <= 4 ? 3 : waveNum <= 7 ? 4 : 5;
      }

      // Pick distinct rows for simultaneous spawn across the 5 concert lanes
      const availableRows = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5);
      const newEnemies: NoiseEntity[] = [];

      for (let i = 0; i < count; i++) {
        let type: NoiseType = 'normal';
        const rand = Math.random();
        if (waveNum >= 2 && rand > 0.6) {
          type = 'constant';
        }
        if (waveNum >= 4 && rand > 0.75) {
          type = 'incessant';
        }

        const row = availableRows[i % availableRows.length];
        const item = availableItems[Math.floor(Math.random() * availableItems.length)];
        const maxHp = type === 'normal' ? 10 : type === 'constant' ? 20 : 30;
        const speed = type === 'normal' ? 2.2 : type === 'constant' ? 1.8 : 1.4;

        newEnemies.push({
          id: `noise-${Date.now()}-${i}-${Math.random()}`,
          type,
          name: `${type} Noise`,
          row,
          x: 98, // Appear simultaneously at the right edge
          hp: maxHp,
          maxHp,
          dps: 2,
          speed,
          promptItem: item,
          eatingMusicianId: null,
          state: 'walking',
        });
      }

      pendingWaveEnemiesRef.current = newEnemies;
      waveSpawningActiveRef.current = true;
    },
    [difficulty, level.items]
  );

  // Initialize Wave 1 on mount
  useEffect(() => {
    prepareWave(1);
  }, [prepareWave]);

  // Audio preview handler
  const handlePreviewTargetAudio = useCallback((text: string) => {
    playPronunciationModelAudio(text);
  }, []);

  // Fire Vocalist projectile when correct pronunciation is spoken
  const fireVocalistAttack = useCallback(
    (matchedRow: number, matchedItemText: string) => {
      const vocalistsOnRow = musiciansRef.current.filter(
        (m) => m.row === matchedRow && m.type === 'vocalist'
      );

      if (vocalistsOnRow.length === 0) {
        triggerFeedback(`No Vocalist on Lane ${matchedRow + 1}! Place a Vocalist to attack!`);
        SoundFX.playWarning();
        return;
      }

      SoundFX.playSingAttack();

      // Find the closest noise on this row to ensure the projectile spawns behind the noise
      const noiseOnRow = noisesRef.current
        .filter((n) => n.row === matchedRow && n.hp > 0)
        .sort((a, b) => a.x - b.x)[0];

      // Choose vocalist: pick the one closest to but behind the noise (or leftmost if all are behind)
      const vocalistsBehind = noiseOnRow
        ? vocalistsOnRow.filter((v) => ((v.col + 0.5) / 9) * 100 < noiseOnRow.x)
        : vocalistsOnRow;

      const chosenVocalist = (vocalistsBehind.length > 0 ? vocalistsBehind : vocalistsOnRow)
        .sort((a, b) => a.col - b.col)[0];

      let startX = ((chosenVocalist.col + 0.5) / 9) * 100;
      if (noiseOnRow && startX >= noiseOnRow.x) {
        startX = Math.max(2, noiseOnRow.x - 3);
      }

      const symbols = ['♪', '♫', '♬'];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];

      const newProj: ProjectileEntity = {
        id: `proj-${Date.now()}-${Math.random()}`,
        row: matchedRow,
        x: startX,
        damage: 10, // 10 damage each time per spec
        speed: 65, // percentage per second
        symbol,
      };

      projectilesRef.current = [...projectilesRef.current, newProj];
      setProjectiles(projectilesRef.current);

      triggerFeedback(`Harmonious attack! Vocalist singing "${matchedItemText}"!`);
    },
    [triggerFeedback]
  );

  // Speech evaluation handler with intelligent lane matching
  const handleSpeechEvaluation = useCallback(
    (transcript: string, isFromInterim = false, utteranceId?: string) => {
      setLastTranscript(transcript);

      // Prevent duplicate attack firing from the same spoken utterance (e.g., interim + final double firing)
      if (utteranceId && handledUtteranceIdsRef.current.has(utteranceId)) {
        return;
      }

      // Find all alive noises on board matching the spoken transcript
      const matchingNoises = noisesRef.current.filter((n) =>
        n.hp > 0 && checkPronunciationMatch(transcript, n.promptItem.text, n.promptItem.cleanText)
      );

      if (matchingNoises.length > 0) {
        // Prioritize matching noises on rows that HAVE a Vocalist
        const noisesWithVocalists = matchingNoises.filter((n) =>
          musiciansRef.current.some((m) => m.row === n.row && m.type === 'vocalist')
        );

        if (noisesWithVocalists.length > 0) {
          // Mark utterance as handled immediately so only ONE shot is ever fired per pronunciation!
          if (utteranceId) {
            handledUtteranceIdsRef.current.add(utteranceId);
            if (handledUtteranceIdsRef.current.size > 200) {
              handledUtteranceIdsRef.current.clear();
            }
          }

          // Fire one sound from the Vocalist on each matching row with a Vocalist
          const attackedRows = new Set<number>();
          for (const targetNoise of noisesWithVocalists) {
            if (!attackedRows.has(targetNoise.row)) {
              attackedRows.add(targetNoise.row);
              fireVocalistAttack(targetNoise.row, targetNoise.promptItem.text);
            }
          }
        } else {
          // If no Vocalist on any matching row, alert the player to place one
          const targetRow = matchingNoises[0].row;
          triggerFeedback(`No Vocalist on Lane ${targetRow + 1}! Place a Vocalist to attack!`);
          SoundFX.playWarning();
        }
      } else if (!isFromInterim) {
        triggerFeedback(`Heard: "${transcript}" — Match words shown on active Noise!`);
      }
    },
    [fireVocalistAttack, triggerFeedback]
  );

  // Toggle Microphone recording
  const toggleSing = useCallback(() => {
    if (isListening) {
      speechService.stop();
      setIsListening(false);
      triggerFeedback('Singing mode paused.');
    } else {
      speechService.start({
        onStart: () => {
          setIsListening(true);
          triggerFeedback('Listening... Sing the words on the Noise monsters!');
        },
        onResult: (transcript, isFinal, utteranceId) => {
          setLastTranscript(transcript);
          // Evaluate immediately on both interim and final results for zero-latency response
          handleSpeechEvaluation(transcript, !isFinal, utteranceId);
        },
        onError: (err) => {
          setIsListening(false);
          if (err === 'not-allowed') {
            triggerFeedback('Microphone permission denied. You can click "Pronounce" to practice!');
          } else {
            triggerFeedback('Microphone ready. Click Sing to try again.');
          }
        },
        onEnd: () => {
          setIsListening(false);
        },
      });
    }
  }, [isListening, handleSpeechEvaluation, triggerFeedback]);

  // Fallback direct practice pronunciation
  const handleSimulatePronounce = useCallback(
    (targetText: string) => {
      handleSpeechEvaluation(targetText, false, `manual_${Date.now()}_${Math.random()}`);
    },
    [handleSpeechEvaluation]
  );

  // Tile Placement Handler
  const handlePlaceMusician = useCallback(
    (row: number, col: number, typeToPlace: MusicianType) => {
      const def = MUSICIAN_DEFS[typeToPlace];
      if (inspirationRef.current < def.cost) {
        SoundFX.playWarning();
        triggerFeedback(`Need ${def.cost} Inspiration to place ${def.name}!`);
        return;
      }

      const occupied = musiciansRef.current.some((m) => m.row === row && m.col === col);
      if (occupied) {
        SoundFX.playWarning();
        triggerFeedback('This tile is already occupied by a musician!');
        return;
      }

      setInspiration((prev) => prev - def.cost);
      SoundFX.playPlace();

      const newMusician: MusicianEntity = {
        id: `musician-${Date.now()}-${Math.random()}`,
        type: typeToPlace,
        row,
        col,
        hp: def.maxHp,
        maxHp: def.maxHp,
        lastActionTime: performance.now(),
        placedAt: performance.now(),
      };

      musiciansRef.current = [...musiciansRef.current, newMusician];
      setMusicians(musiciansRef.current);

      setSelectedCardType(null);
      setDraggedCardType(null);
    },
    [triggerFeedback]
  );

  // Note collection (+50 Inspiration per note per spec)
  const handleCollectNote = useCallback((id: string) => {
    SoundFX.playCollectNote();
    setInspiration((prev) => prev + 50);
    setScore((prev) => prev + 50);
    floatingNotesRef.current = floatingNotesRef.current.filter((n) => n.id !== id);
    setFloatingNotes(floatingNotesRef.current);
  }, []);

  // Main 60 FPS Game Loop
  useEffect(() => {
    let isCancelled = false;

    const gameLoop = (timestamp: number) => {
      if (isCancelled) return;

      const rawDt = (timestamp - lastFrameTimeRef.current) / 1000;
      const dt = Math.min(rawDt, 0.05);
      lastFrameTimeRef.current = timestamp;

      if (gameState === 'PLAYING' && !isPaused) {
        // 1. Spawning Sky Notes (every 12 seconds)
        skyNoteTimerRef.current += dt;
        if (skyNoteTimerRef.current > 12) {
          skyNoteTimerRef.current = 0;
          const randomX = 15 + Math.random() * 70;
          const randomY = 15 + Math.random() * 65;
          const newSkyNote: FloatingNote = {
            id: `note-sky-${timestamp}-${Math.random()}`,
            x: randomX,
            y: randomY,
            source: 'sky',
            value: 50, // 50 Inspiration per note
            createdAt: timestamp,
            duration: 9,
          };
          floatingNotesRef.current = [...floatingNotesRef.current, newSkyNote];
          setFloatingNotes(floatingNotesRef.current);
        }

        // 2. Guitarists producing notes every 12 seconds
        let newGuitaristNoteCreated = false;
        const updatedMusicians = musiciansRef.current.map((m) => {
          if (m.type === 'guitarist') {
            if (timestamp - m.lastActionTime > 12000) {
              const noteX = (m.col / 9) * 100 + 4;
              const noteY = (m.row / 5) * 100 + 8;
              const newGtrNote: FloatingNote = {
                id: `note-gtr-${timestamp}-${Math.random()}`,
                x: Math.min(85, Math.max(10, noteX)),
                y: Math.min(85, Math.max(10, noteY)),
                source: 'guitarist',
                value: 50, // 50 Inspiration per note
                createdAt: timestamp,
                duration: 12,
              };
              floatingNotesRef.current = [...floatingNotesRef.current, newGtrNote];
              newGuitaristNoteCreated = true;
              return { ...m, lastActionTime: timestamp };
            }
          }
          return m;
        });

        if (newGuitaristNoteCreated) {
          musiciansRef.current = updatedMusicians;
          setMusicians(updatedMusicians);
          setFloatingNotes(floatingNotesRef.current);
        }

        // 3. Spawning Wave Noises: ALL appear at the same time when prep ends
        if (prepTimeRef.current > 0) {
          prepTimeRef.current = Math.max(0, prepTimeRef.current - dt);
          setPrepTimeRemaining(Math.ceil(prepTimeRef.current));
          waveAppearanceTimeRef.current = timestamp;
        } else if (waveSpawningActiveRef.current && pendingWaveEnemiesRef.current.length > 0) {
          // Spawn all noises in the wave simultaneously across their lanes!
          const spawnedBatch = [...pendingWaveEnemiesRef.current];
          pendingWaveEnemiesRef.current = [];
          noisesRef.current = [...noisesRef.current, ...spawnedBatch];
          setNoises(noisesRef.current);
          waveAppearanceTimeRef.current = timestamp;
          triggerFeedback(`Wave ${currentWaveRef.current} has arrived! Sing to attack!`, 2500);
        }

        // 4. Update Projectiles & Check Collisions with Noises
        let noisesChangedByHits = false;
        const currentProjectiles = [...projectilesRef.current];
        const nextProjectiles: ProjectileEntity[] = [];

        currentProjectiles.forEach((proj) => {
          const nextX = proj.x + proj.speed * dt;
          let hitNoise: NoiseEntity | null = null;

          // Find the front-most alive noise on this row
          const rowNoises = noisesRef.current
            .filter((n) => n.row === proj.row && n.hp > 0)
            .sort((a, b) => a.x - b.x); // Closest noise first

          for (const n of rowNoises) {
            // Hit when the projectile has physically reached the monster's front edge
            if (proj.x <= n.x + 1 && nextX >= n.x - 2.5) {
              hitNoise = n;
              break;
            }
          }

          if (hitNoise) {
            SoundFX.playHit();
            hitNoise.hp -= proj.damage;
            hitNoise.state = hitNoise.hp <= 0 ? 'defeated' : 'hit';
            if (hitNoise.hp <= 0) {
              SoundFX.playDefeat();
              setScore((s) => s + 50);
            }
            noisesChangedByHits = true;
          } else if (nextX < 102) {
            nextProjectiles.push({ ...proj, x: nextX });
          }
        });

        projectilesRef.current = nextProjectiles;
        setProjectiles(nextProjectiles);

        if (noisesChangedByHits) {
          noisesRef.current = noisesRef.current.filter((n) => n.hp > 0);
          setNoises([...noisesRef.current]);
        }

        // 5. Update Noises: movement & eating musicians
        let gameOverTriggered = false;
        let musiciansDamaged = false;

        const updatedNoises = noisesRef.current.map((noise) => {
          const noiseCol = Math.floor((noise.x / 100) * 9);
          const targetMusician = musiciansRef.current.find(
            (m) => m.row === noise.row && m.col === noiseCol
          );

          if (targetMusician) {
            // Eating musician: deal 2 DPS
            targetMusician.hp -= noise.dps * dt;
            musiciansDamaged = true;
            return {
              ...noise,
              state: 'eating' as const,
              eatingMusicianId: targetMusician.id,
            };
          }

          // Normal walking forward (right to left)
          const newX = noise.x - noise.speed * dt;
          if (newX <= 6) {
            gameOverTriggered = true;
          }

          return {
            ...noise,
            x: newX,
            state: 'walking' as const,
            eatingMusicianId: null,
          };
        });

        noisesRef.current = updatedNoises;
        setNoises(updatedNoises);

        if (musiciansDamaged) {
          // Remove musicians whose HP has reached 0
          musiciansRef.current = musiciansRef.current.filter((m) => m.hp > 0);
          setMusicians([...musiciansRef.current]);
        }

        if (gameOverTriggered) {
          SoundFX.playGameOver();
          setGameState('GAME_OVER');
          return;
        }

        // 6. Check Wave Progression & Victory
        // Requirement: "Don't make the next wave appear until the previous wave has been defeated, or after 30 seconds from when the previous wave appeared"
        const secondsSinceWaveAppeared = (timestamp - waveAppearanceTimeRef.current) / 1000;
        const isCurrentWaveDefeated =
          pendingWaveEnemiesRef.current.length === 0 && noisesRef.current.length === 0;
        const has30SecondsPassed = secondsSinceWaveAppeared >= 30;

        if (
          prepTimeRef.current <= 0 &&
          waveSpawningActiveRef.current &&
          (isCurrentWaveDefeated || has30SecondsPassed)
        ) {
          if (currentWaveRef.current < totalWaves) {
            const nextWave = currentWaveRef.current + 1;
            currentWaveRef.current = nextWave;
            setCurrentWave(nextWave);
            setWaveProgress(((nextWave - 1) / totalWaves) * 100);
            prepareWave(nextWave);
            triggerFeedback(
              isCurrentWaveDefeated
                ? `Wave cleared! Prepare for Wave ${nextWave}!`
                : `30s elapsed! Wave ${nextWave} incoming!`,
              3500
            );
          } else if (isCurrentWaveDefeated) {
            // Player cleared the last wave -> VICTORY!
            SoundFX.playVictory();
            setGameState('VICTORY');
            return;
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      isCancelled = true;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, isPaused, totalWaves, level.items, prepareWave, triggerFeedback]);

  // Cleanup speech service on unmount
  useEffect(() => {
    return () => {
      speechService.stop();
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  // Restart current level
  const handleRestart = () => {
    setGameState('PLAYING');
    setInspiration(100);
    inspirationRef.current = 100;
    prepTimeRef.current = 7;
    setPrepTimeRemaining(7);
    setScore(0);
    setMusicians([]);
    musiciansRef.current = [];
    setNoises([]);
    noisesRef.current = [];
    setProjectiles([]);
    projectilesRef.current = [];
    setFloatingNotes([]);
    floatingNotesRef.current = [];
    pendingWaveEnemiesRef.current = [];
    handledUtteranceIdsRef.current.clear();
    setCurrentWave(1);
    currentWaveRef.current = 1;
    setWaveProgress(0);
    prepareWave(1);
    setIsPaused(false);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-slate-950 text-slate-100 select-none">
      {/* Top HUD */}
      <ConcertHUD
        level={level}
        difficulty={difficulty}
        inspiration={inspiration}
        currentWave={currentWave}
        totalWaves={totalWaves}
        waveProgress={waveProgress}
        isPaused={isPaused}
        isMuted={isMuted}
        onTogglePause={() => setIsPaused((prev) => !prev)}
        onToggleMute={() => {
          const muted = SoundFX.toggleMute();
          setIsMuted(muted);
        }}
        onOpenGuide={() => setShowGuide(true)}
        onExitToMenu={onReturnToMenu}
      />

      {/* Main Playfield: Musician Tray + 5x9 Concert Grid */}
      <div className="flex-1 w-full flex flex-col sm:flex-row items-stretch gap-2 p-2 overflow-hidden min-h-0">
        {/* Left Side: Musician Cards Tray */}
        <CardTray
          inspiration={inspiration}
          selectedType={selectedCardType}
          onSelectType={setSelectedCardType}
          onDragStartCard={setDraggedCardType}
        />

        {/* Center: 5x9 Concert Stage Grid */}
        <div className="flex-1 h-full min-h-0 relative">
          {/* Preparation Countdown Banner */}
          {prepTimeRemaining > 0 && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-bounce-subtle">
              <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 font-black text-xs shadow-[0_0_25px_rgba(245,158,11,0.8)] border border-amber-200">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                <span>
                  Prepare Your Band! Noises arrive in{' '}
                  <span className="text-sm font-black underline tracking-wider">{prepTimeRemaining}s</span>
                </span>
              </div>
            </div>
          )}

          <ConcertGrid
            musicians={musicians}
            noises={noises}
            projectiles={projectiles}
            floatingNotes={floatingNotes}
            selectedCardType={selectedCardType}
            onTileClick={(row, col) => {
              if (selectedCardType) {
                handlePlaceMusician(row, col, selectedCardType);
              }
            }}
            onTileDrop={(row, col) => {
              if (draggedCardType) {
                handlePlaceMusician(row, col, draggedCardType);
              }
            }}
            onCollectNote={handleCollectNote}
            onPreviewTargetAudio={handlePreviewTargetAudio}
          />
        </div>
      </div>

      {/* Bottom Sing Attack Controller */}
      <SingAttackController
        isListening={isListening}
        activeNoises={noises}
        lastTranscript={lastTranscript}
        feedbackMessage={feedbackMessage}
        onToggleSing={toggleSing}
        onPreviewTargetAudio={handlePreviewTargetAudio}
        onSimulatePronounce={handleSimulatePronounce}
      />

      {/* Pronunciation Guide Modal */}
      <PhoneticGuideModal
        level={level}
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        onPlayAudio={handlePreviewTargetAudio}
      />

      {/* Level Complete / Game Over Modal */}
      <LevelCompleteModal
        gameState={gameState}
        level={level}
        score={score}
        onRestart={handleRestart}
        onNextLevel={onNextLevel}
        onReturnToMenu={onReturnToMenu}
      />
    </div>
  );
};
