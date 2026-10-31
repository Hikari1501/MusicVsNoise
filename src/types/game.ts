/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Difficulty = 'faint' | 'loud' | 'deafening';

export type PronunciationCategory = 'word' | 'phrase' | 'sentence';

export interface PronunciationItem {
  id: string;
  text: string;
  cleanText: string;
  type: PronunciationCategory;
  ipa?: string;
  stressGuide?: string; // e.g. "PRE-sent"
  tip?: string;
}

export interface LevelConfig {
  id: string;
  title: string;
  targetFeature: string;
  description: string;
  guide: {
    phoneticSymbol: string;
    mouthTip: string;
    examples: string[];
  };
  items: PronunciationItem[];
  wavesCount: {
    faint: number;
    loud: number;
    deafening: number;
  };
}

export type MusicianType = 'vocalist' | 'guitarist' | 'drummer';

export interface MusicianDef {
  type: MusicianType;
  name: string;
  cost: number;
  maxHp: number;
  damage: number;
  description: string;
  cooldownSec: number;
}

export interface MusicianEntity {
  id: string;
  type: MusicianType;
  row: number; // 0..4
  col: number; // 0..8
  hp: number;
  maxHp: number;
  lastActionTime: number;
  placedAt: number;
}

export type NoiseType = 'normal' | 'constant' | 'incessant';

export interface NoiseEntity {
  id: string;
  type: NoiseType;
  name: string;
  row: number; // 0..4
  x: number; // 0% (left) to 100% (right)
  hp: number;
  maxHp: number;
  dps: number;
  speed: number; // percentage per second
  promptItem: PronunciationItem;
  eatingMusicianId: string | null;
  state: 'walking' | 'eating' | 'hit' | 'defeated';
  hitFlashTime?: number;
}

export interface FloatingNote {
  id: string;
  x: number; // percentage 5..95
  y: number; // percentage 5..95
  targetY?: number;
  source: 'sky' | 'guitarist';
  value: number; // 25 Inspiration
  createdAt: number;
  duration: number; // seconds before vanishing
}

export interface ProjectileEntity {
  id: string;
  row: number;
  x: number; // percentage
  targetNoiseId?: string;
  damage: number;
  speed: number;
  symbol: string;
}

export type GameState = 'TITLE_MENU' | 'PLAYING' | 'PAUSED' | 'VICTORY' | 'GAME_OVER';

export interface WaveInfo {
  waveIndex: number;
  totalWaves: number;
  enemiesRemaining: number;
  progressPercent: number;
}
