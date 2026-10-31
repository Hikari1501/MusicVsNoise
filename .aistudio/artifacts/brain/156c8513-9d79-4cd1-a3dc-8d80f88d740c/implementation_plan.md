# Music vs. Noise — English Pronunciation PvZ Defense Game

A chibi, cartoonish 16:9 concert lane-defense game where students combat hearing-disrupting Noise monsters by speaking English words, phrases, and linking patterns to unleash musical attacks from their stage band.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following design specifications and architectural choices have been aligned with your preferences:
> - **Pronunciation Recognition Engine**: Powered by the browser's native Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`) for zero-latency, real-time vocal attacks, paired with an accessible click-to-preview / simulated-pronounce fallback if microphone hardware permissions are unavailable.
> - **Audio Model & Phonetic Guide**: Every Noise monster displays its target word/phrase along with IPA notation (e.g., `/æ/`, `/θ/`, `/ð/`, syllable stress marks `ˈ`, and linking arcs `‿`). Players can click the "Listen" audio preview button at any time to hear accurate native pronunciation via Web Speech Synthesis.
> - **Difficulty Scaling**: "Faint", "Loud", and "Deafening" scale wave spawn density, spawn intervals, and simultaneous enemy counts across the 5 concert lanes.
> - **Aspect Ratio**: Locked 16:9 responsive stage container with full-viewport canvas scaling, low-occlusion HUD, and concert lighting ambiance.

---

## 1. Overview & Core Concept

- **What It Does**: Students place band musicians on a 5×9 concert stage grid to defend against advancing Noise monsters. Students defeat monsters by speaking the target English pronunciation items (vowels, consonants, two-syllable word stress, and linking sounds) shown above the monsters. Correct pronunciation commands Vocalists on that lane to fire rhythmic musical blasts.
- **Target Audience**: ESL/EFL students, language classrooms, and self-directed English learners looking for an engaging, gamified pronunciation training experience.
- **Key Value**: Replaces repetitive drills with dynamic, high-urgency game mechanics (PvZ-style lane defense) where quick, accurate speech directly translates to musical defense power.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Title & Level Select**:
   - Title screen with concert stage lighting, chibi mascots, game story lore, and "Start Concert" CTA.
   - Stage Selection:
     - Level 1: Short Vowel `/æ/` (cat, bat, trap, black cat, catch that apple).
     - Level 2: Consonants `/θ/` & `/ð/` (think, thank, breathe, mother, three thin things).
     - Level 3: Two-Syllable Word Stress (PRE-sent vs pre-SENT, RE-cord vs re-CORD, TA-ble, DOC-tor).
     - Level 4: Connected Speech & Linking Sounds (`have-a cake`, `this-is-a book`, `pick-it-up`, `turn-it-off`).
   - Difficulty Selection: **Faint** (relaxed wave spacing), **Loud** (dense clusters), **Deafening** (rapid high-density rushes).
2. **Concert Grid (5 × 9 Tiles)**:
   - Top HUD: Inspiration balance (`♪ 50` at start), Wave Progression bar, Current Level & Target Phoneme, Audio Mute toggle, Pause button.
   - Musician Card Tray (Left/Top):
     - **Vocalist** (100 Inspiration, 10 HP): Sings sonic soundwaves deal 10 DMG when player pronounces correctly.
     - **Guitarist** (50 Inspiration, 10 HP): Strums rhythm chords generating floating music notes (+25 Inspiration).
     - **Drummer** (50 Inspiration, 30 HP): Sturdy defensive wall holding back advancing Noise.
   - Stage Playfield: 5 rows (lanes) × 9 columns with concert spotlights, wooden stage planks, and neon neon-accented amplifier backdrops.
   - Sky & Lanes: Music notes drift down from stage rafters for bonus Inspiration on click.
3. **Voice Attack System**:
   - Big, intuitive "Sing / Speak" Microphone button with real-time waveform pulse.
   - When active, browser listens for the spoken prompt.
   - Matching any active Noise on the board causes the Vocalist on that lane to launch a glowing musical note projectile.
   - If spoken correctly but no Vocalist is stationed on that lane, a friendly toast appears: *"No Vocalist on this lane! Place one to sing!"*
   - Audio Model button (`🔊`) to hear a clear pronunciation sample before repeating.
4. **Victory / Game Over Summary**:
   - **Encore Victory**: Stars awarded based on pronunciation accuracy and stage health, score breakdown, and next level unlock.
   - **Sound Check Defeat**: Replay option with specific phonetic review of missed words.

### Visual Identity & Theme
- **Art Style**: Chibi, cartoonish, colorful, high-contrast readability.
- **Color Palette (60-30-10 Budget)**:
  - Canvas (60%): Deep stage midnight navy (`#0B0F19`) and concert stage mahogany wood (`#1E2235`).
  - Structural Surfaces (30%): Clean instrument card panels (`#2A2F45`), stage tile borders, and lane guidelines.
  - Accents (10%): Golden treble clef inspiration yellow (`#FBBF24`), neon electric cyan for vocal blasts (`#06B6D4`), and magenta/purple distortion for Noise monsters (`#EC4899`).
- **Typography**: Display font with energetic rhythm (`Plus Jakarta Sans` / `Outfit`), paired with clean tabular numerals (`tabular-nums`) for timers and Inspiration counters.

---

## 3. Key Product Decisions & Trade-Offs

- **Web Speech API (`webkitSpeechRecognition`) with Fuzzy Phonetic Matching**:
  - *Chosen Approach*: Real-time continuous speech recognition with normalized token comparison (lowercasing, punctuation stripping, phonetic aliases).
  - *Why*: Instantaneous $<150$ms feedback required for real-time arcade defense; no network lag or cloud API billing limits for classroom play.
  - *Fallback*: Keyboard trigger and "Tap to Practice" mode for environments with restricted microphone permissions.
- **Pure 2D HTML5 Canvas + SVG Composite Engine**:
  - *Chosen Approach*: Lightweight 60 FPS animation loop for projectile physics, particle bursts, and tile state management.
  - *Why*: Seamless 16:9 ratio preservation with zero layout reflows and smooth 60fps frame rate on all student devices (Chromebooks, laptops, tablets).
- **In-Game Speech Synthesis (`speechSynthesis`)**:
  - *Chosen Approach*: Native client-side speech synthesis to play modeled English pronunciation on demand without loading heavy external MP3 bundles.

---

## 4. Technical Architecture & Data Strategy

### System Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App Root (16:9 Frame)                           │
│                                                                        │
│  ┌───────────────────────┐   ┌──────────────────────────────────────┐  │
│  │      Main Menu        │   │             HUD Bar                  │  │
│  │ • Level Selection     │   │ • Inspiration Meter (♪)              │  │
│  │ • Difficulty (F/L/D)  │   │ • Wave Progress & Lane Status        │  │
│  │ • Phonetic Guide      │   │ • Volume & Pause Controls            │  │
│  └───────────┬───────────┘   └──────────────────┬───────────────────┘  │
│              │                                  │                      │
│              ▼                                  ▼                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                       Game Stage Engine                          │  │
│  │                                                                  │  │
│  │  ┌─────────────────────────┐      ┌───────────────────────────┐  │  │
│  │  │ 5x9 Concert Lane Grid   │      │ Card Selector & Placement │  │  │
│  │  │ • Vocalist (100♪ / 10HP)│◄────►│ • Guitarist (50♪ / 10HP)  │  │  │
│  │  │ • Drummer (50♪ / 30HP)  │      │ • Note Collectables (+25♪)│  │  │
│  │  └────────────┬────────────┘      └───────────────────────────┘  │  │
│  │               │                                                  │  │
│  │               ▼                                                  │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │ Active Noise Enemies (Normal, Constant, Incessant)         │  │  │
│  │  │ • Word / Phrase display with IPA stress markers            │  │  │
│  │  │ • HP bars & lane advance physics                           │  │  │
│  │  └────────────────────────────┬───────────────────────────────┘  │  │
│  └───────────────────────────────┼──────────────────────────────────┘  │
│                                  │                                     │
│                                  ▼                                     │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │               Pronunciation & Attack Controller                  │  │
│  │ • Web Speech Recognition Listener                                │  │
│  │ • Pronunciation Evaluator (Phonetic matching + fuzzy match)       │  │
│  │ • Audio Synthesizer (Model Audio preview via Web Speech)         │  │
│  │ • Soundwave Projectile Dispatcher                                │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Structures & State Model

```typescript
export type Difficulty = 'faint' | 'loud' | 'deafening';

export interface PhoneticItem {
  id: string;
  text: string;
  ipa: string;
  type: 'word' | 'phrase' | 'sentence';
  tip: string;
}

export interface LevelConfig {
  id: string;
  title: string;
  phonemeFeature: string;
  description: string;
  items: PhoneticItem[];
  wavesCount: number;
}

export type MusicianType = 'vocalist' | 'guitarist' | 'drummer';

export interface MusicianEntity {
  id: string;
  type: MusicianType;
  row: number; // 0..4
  col: number; // 0..8
  hp: number;
  maxHp: number;
  lastActionTime: number;
}

export type NoiseType = 'normal' | 'constant' | 'incessant';

export interface NoiseEntity {
  id: string;
  type: NoiseType;
  row: number;
  x: number; // pixel or ratio position on stage
  hp: number;
  maxHp: number;
  dps: number;
  speed: number;
  targetItem: PhoneticItem;
}

export interface ProjectileEntity {
  id: string;
  row: number;
  x: number;
  damage: number;
  noteSymbol: string;
}
```

### Verification & Implementation Order
1. Update `metadata.json` and sync `index.html` headers to "Music vs. Noise".
2. Build Audio & Synthesizer service (Web Speech Recognition, Web Speech Synthesis, Web Audio synth chime effects for attacks, hits, placements).
3. Assemble pronunciation curricula database covering all 4 beta levels (`/æ/`, `/θ/ & /ð/`, two-syllable stress, and linking sounds).
4. Implement Concert Stage 5x9 interactive game loop with responsive 16:9 canvas scaling, chibi SVG illustrations for musicians and Noises.
5. Implement voice capture HUD with active listening pulse, model audio playback, and visual feedback toasts.
6. Verify game with `compile_applet` and test gameplay across all levels and difficulties.
