/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LevelConfig, MusicianDef, MusicianType } from '../types/game';

export const MUSICIAN_DEFS: Record<MusicianType, MusicianDef> = {
  vocalist: {
    type: 'vocalist',
    name: 'Vocalist',
    cost: 100,
    maxHp: 10,
    damage: 10,
    description: 'Main attacker. Sings high-energy musical blasts when you pronounce the target correctly.',
    cooldownSec: 4,
  },
  guitarist: {
    type: 'guitarist',
    name: 'Guitarist',
    cost: 50,
    maxHp: 10,
    damage: 0,
    description: 'Rhythm generator. Drops golden music notes every 12s (+50 Inspiration when clicked).',
    cooldownSec: 4,
  },
  drummer: {
    type: 'drummer',
    name: 'Drummer',
    cost: 50,
    maxHp: 30,
    damage: 0,
    description: 'Sturdy rhythmic barrier with 30 HP that withstands Noise attacks while your band prepares.',
    cooldownSec: 6,
  },
};

export const LEVELS: LevelConfig[] = [
  {
    id: 'level-vowel-ae',
    title: 'Level 1: The Cat Trap',
    targetFeature: 'Vowel /æ/',
    description: 'Master the open front unrounded vowel /æ/ as in "cat", "apple", and "trap". Drop your jaw relaxed and wide!',
    guide: {
      phoneticSymbol: '/æ/',
      mouthTip: 'Open your mouth wide and pull tongue down behind lower teeth. Sounds like the "a" in "cat" or "black".',
      examples: ['cat', 'trap', 'black hat', 'The cat sat on the mat.'],
    },
    wavesCount: {
      faint: 5,
      loud: 7,
      deafening: 9,
    },
    items: [
      // Words
      { id: 'ae-w1', text: 'cat', cleanText: 'cat', type: 'word', ipa: '/kæt/' },
      { id: 'ae-w2', text: 'bat', cleanText: 'bat', type: 'word', ipa: '/bæt/' },
      { id: 'ae-w3', text: 'trap', cleanText: 'trap', type: 'word', ipa: '/træp/' },
      { id: 'ae-w4', text: 'apple', cleanText: 'apple', type: 'word', ipa: '/ˈæpəl/' },
      { id: 'ae-w5', text: 'black', cleanText: 'black', type: 'word', ipa: '/blæk/' },
      { id: 'ae-w6', text: 'hat', cleanText: 'hat', type: 'word', ipa: '/hæt/' },
      { id: 'ae-w7', text: 'plan', cleanText: 'plan', type: 'word', ipa: '/plæn/' },
      { id: 'ae-w8', text: 'snack', cleanText: 'snack', type: 'word', ipa: '/snæk/' },
      // Phrases
      { id: 'ae-p1', text: 'fat cat', cleanText: 'fat cat', type: 'phrase', ipa: '/fæt kæt/' },
      { id: 'ae-p2', text: 'black hat', cleanText: 'black hat', type: 'phrase', ipa: '/blæk hæt/' },
      { id: 'ae-p3', text: 'apple snack', cleanText: 'apple snack', type: 'phrase', ipa: '/ˈæpəl snæk/' },
      { id: 'ae-p4', text: 'bad plan', cleanText: 'bad plan', type: 'phrase', ipa: '/bæd plæn/' },
      { id: 'ae-p5', text: 'clap back', cleanText: 'clap back', type: 'phrase', ipa: '/klæp bæk/' },
      // Sentences
      { id: 'ae-s1', text: 'The cat sat on the mat.', cleanText: 'the cat sat on the mat', type: 'sentence', ipa: '/ðə kæt sæt ɒn ðə mæt/' },
      { id: 'ae-s2', text: 'I have a black bag.', cleanText: 'i have a black bag', type: 'sentence', ipa: '/aɪ hæv ə blæk bæɡ/' },
      { id: 'ae-s3', text: 'Catch that red apple!', cleanText: 'catch that red apple', type: 'sentence', ipa: '/kætʃ ðæt rɛd ˈæpəl/' },
      { id: 'ae-s4', text: 'The man has a fast plan.', cleanText: 'the man has a fast plan', type: 'sentence', ipa: '/ðə mæn hæz ə fæst plæn/' },
    ],
  },
  {
    id: 'level-consonants-th',
    title: 'Level 2: The Thoughtful Breeze',
    targetFeature: 'Consonants /θ/ & /ð/',
    description: 'Distinguish the unvoiced dental fricative /θ/ ("think") from the voiced /ð/ ("mother", "this"). Tongue gently touches front teeth!',
    guide: {
      phoneticSymbol: '/θ/ & /ð/',
      mouthTip: 'Gently slip tip of tongue between upper and lower teeth. For /θ/ blow air (unvoiced); for /ð/ vibrate vocal cords (voiced).',
      examples: ['think', 'mother', 'three things', 'They went there together.'],
    },
    wavesCount: {
      faint: 5,
      loud: 7,
      deafening: 9,
    },
    items: [
      // Words
      { id: 'th-w1', text: 'think', cleanText: 'think', type: 'word', ipa: '/θɪŋk/' },
      { id: 'th-w2', text: 'thank', cleanText: 'thank', type: 'word', ipa: '/θæŋk/' },
      { id: 'th-w3', text: 'mother', cleanText: 'mother', type: 'word', ipa: '/ˈmʌðər/' },
      { id: 'th-w4', text: 'father', cleanText: 'father', type: 'word', ipa: '/ˈfɑːðər/' },
      { id: 'th-w5', text: 'breathe', cleanText: 'breathe', type: 'word', ipa: '/briːð/' },
      { id: 'th-w6', text: 'three', cleanText: 'three', type: 'word', ipa: '/θriː/' },
      { id: 'th-w7', text: 'weather', cleanText: 'weather', type: 'word', ipa: '/ˈwɛðər/' },
      { id: 'th-w8', text: 'smooth', cleanText: 'smooth', type: 'word', ipa: '/smuːð/' },
      // Phrases
      { id: 'th-p1', text: 'think twice', cleanText: 'think twice', type: 'phrase', ipa: '/θɪŋk twaɪs/' },
      { id: 'th-p2', text: 'three thin things', cleanText: 'three thin things', type: 'phrase', ipa: '/θriː θɪn θɪŋz/' },
      { id: 'th-p3', text: 'mother and father', cleanText: 'mother and father', type: 'phrase', ipa: '/ˈmʌðər ænd ˈfɑːðər/' },
      { id: 'th-p4', text: 'smooth leather', cleanText: 'smooth leather', type: 'phrase', ipa: '/smuːð ˈlɛðər/' },
      { id: 'th-p5', text: 'breathe in deeply', cleanText: 'breathe in deeply', type: 'phrase', ipa: '/briːð ɪn ˈdiːpli/' },
      // Sentences
      { id: 'th-s1', text: 'They went there together.', cleanText: 'they went there together', type: 'sentence', ipa: '/ðeɪ wɛnt ðɛər təˈɡɛðər/' },
      { id: 'th-s2', text: 'Thank you for the thought.', cleanText: 'thank you for the thought', type: 'sentence', ipa: '/θæŋk juː fɔːr ðə θɔːt/' },
      { id: 'th-s3', text: 'The weather is smooth and warm.', cleanText: 'the weather is smooth and warm', type: 'sentence', ipa: '/ðə ˈwɛðər ɪz smuːð ænd wɔːrm/' },
      { id: 'th-s4', text: 'Mother made three sweet pies.', cleanText: 'mother made three sweet pies', type: 'sentence', ipa: '/ˈmʌðər meɪd θriː swiːt paɪz/' },
    ],
  },
  {
    id: 'level-word-stress',
    title: 'Level 3: Rhythm & Syllable Stress',
    targetFeature: 'Two-Syllable Stress',
    description: 'Learn where the rhythmic beat falls! Stress changes meaning between nouns (PRE-sent) and verbs (pre-SENT).',
    guide: {
      phoneticSymbol: 'ˈPrimary Stress',
      mouthTip: 'Make the stressed syllable louder, longer, and higher in pitch. Say PRE-sent (gift) vs pre-SENT (to show).',
      examples: ['PRE-sent', 'pre-SENT', 'wooden TA-ble', 'Please present your project now.'],
    },
    wavesCount: {
      faint: 5,
      loud: 7,
      deafening: 9,
    },
    items: [
      // Words alone with stress guide
      { id: 'st-w1', text: 'PRE-sent', cleanText: 'present', type: 'word', stressGuide: 'PRE-sent (noun)', ipa: '/ˈprɛzənt/' },
      { id: 'st-w2', text: 'pre-SENT', cleanText: 'present', type: 'word', stressGuide: 'pre-SENT (verb)', ipa: '/prɪˈzɛnt/' },
      { id: 'st-w3', text: 'RE-cord', cleanText: 'record', type: 'word', stressGuide: 'RE-cord (noun)', ipa: '/ˈrɛkərd/' },
      { id: 'st-w4', text: 're-CORD', cleanText: 'record', type: 'word', stressGuide: 're-CORD (verb)', ipa: '/rɪˈkɔːrd/' },
      { id: 'st-w5', text: 'DOC-tor', cleanText: 'doctor', type: 'word', stressGuide: 'DOC-tor', ipa: '/ˈdɒktər/' },
      { id: 'st-w6', text: 'TA-ble', cleanText: 'table', type: 'word', stressGuide: 'TA-ble', ipa: '/ˈteɪbəl/' },
      { id: 'st-w7', text: 'MU-sic', cleanText: 'music', type: 'word', stressGuide: 'MU-sic', ipa: '/ˈmjuːzɪk/' },
      { id: 'st-w8', text: 'CON-cert', cleanText: 'concert', type: 'word', stressGuide: 'CON-cert', ipa: '/ˈkɒnsərt/' },
      // In phrases
      { id: 'st-p1', text: 'birthday PRE-sent', cleanText: 'birthday present', type: 'phrase', ipa: '/ˈbɜːrθdeɪ ˈprɛzənt/' },
      { id: 'st-p2', text: 'pre-SENT the prize', cleanText: 'present the prize', type: 'phrase', ipa: '/prɪˈzɛnt ðə praɪz/' },
      { id: 'st-p3', text: 'break the RE-cord', cleanText: 'break the record', type: 'phrase', ipa: '/breɪk ðə ˈrɛkərd/' },
      { id: 'st-p4', text: 're-CORD the song', cleanText: 'record the song', type: 'phrase', ipa: '/rɪˈkɔːrd ðə sɒŋ/' },
      { id: 'st-p5', text: 'wooden TA-ble', cleanText: 'wooden table', type: 'phrase', ipa: '/ˈwʊdən ˈteɪbəl/' },
      { id: 'st-p6', text: 'live CON-cert', cleanText: 'live concert', type: 'phrase', ipa: '/laɪv ˈkɒnsərt/' },
      // In sentences
      { id: 'st-s1', text: 'I got a lovely birthday present.', cleanText: 'i got a lovely birthday present', type: 'sentence', ipa: '/aɪ ɡɒt ə ˈlʌvli ˈbɜːrθdeɪ ˈprɛzənt/' },
      { id: 'st-s2', text: 'Please present your project now.', cleanText: 'please present your project now', type: 'sentence', ipa: '/pliːz prɪˈzɛnt jɔːr ˈprɒdʒɛkt naʊ/' },
      { id: 'st-s3', text: 'She broke the world record today.', cleanText: 'she broke the world record today', type: 'sentence', ipa: '/ʃiː broʊk ðə wɜːrld ˈrɛkərd təˈdeɪ/' },
      { id: 'st-s4', text: 'They will record the live concert.', cleanText: 'they will record the live concert', type: 'sentence', ipa: '/ðeɪ wɪl rɪˈkɔːrd ðə laɪv ˈkɒnsərt/' },
    ],
  },
  {
    id: 'level-linking-sounds',
    title: 'Level 4: Connected Speech & Linking',
    targetFeature: 'Linking Sounds',
    description: 'Bridge consonant-to-vowel smooth transitions: "have-a", "this-is-a", and "pick-it-up" for natural English flow.',
    guide: {
      phoneticSymbol: 'C ‿ V Linking',
      mouthTip: 'Do not pause between the ending consonant and starting vowel. Pronounce "have a" as "ha-va" and "this is" as "thi-sis"!',
      examples: ['have-a cake', 'this-is-a book', 'pick-it-up', 'I have-a cake for you.'],
    },
    wavesCount: {
      faint: 5,
      loud: 7,
      deafening: 9,
    },
    items: [
      // Phrases with explicit linking hyphen
      { id: 'lk-p1', text: 'have-a cake', cleanText: 'have a cake', type: 'phrase', ipa: '/hæv‿ə keɪk/' },
      { id: 'lk-p2', text: 'this-is-a book', cleanText: 'this is a book', type: 'phrase', ipa: '/ðɪs‿ɪz‿ə bʊk/' },
      { id: 'lk-p3', text: 'pick-it-up', cleanText: 'pick it up', type: 'phrase', ipa: '/pɪk‿ɪt‿ʌp/' },
      { id: 'lk-p4', text: 'turn-it-off', cleanText: 'turn it off', type: 'phrase', ipa: '/tɜːrn‿ɪt‿ɒf/' },
      { id: 'lk-p5', text: 'stand-up please', cleanText: 'stand up please', type: 'phrase', ipa: '/stænd‿ʌp pliːz/' },
      { id: 'lk-p6', text: 'take-an apple', cleanText: 'take an apple', type: 'phrase', ipa: '/teɪk‿ən ˈæpəl/' },
      { id: 'lk-p7', text: 'look-at that', cleanText: 'look at that', type: 'phrase', ipa: '/lʊk‿æt ðæt/' },
      // Sentences with linking notation
      { id: 'lk-s1', text: 'I have-a cake for you.', cleanText: 'i have a cake for you', type: 'sentence', ipa: '/aɪ hæv‿ə keɪk fɔːr juː/' },
      { id: 'lk-s2', text: 'This-is-a great story book.', cleanText: 'this is a great story book', type: 'sentence', ipa: '/ðɪs‿ɪz‿ə ɡreɪt ˈstɔːri bʊk/' },
      { id: 'lk-s3', text: 'Can you pick-it-up right now?', cleanText: 'can you pick it up right now', type: 'sentence', ipa: '/kæn juː pɪk‿ɪt‿ʌp raɪt naʊ/' },
      { id: 'lk-s4', text: 'Please turn-it-off before leaving.', cleanText: 'please turn it off before leaving', type: 'sentence', ipa: '/pliːz tɜːrn‿ɪt‿ɒf bɪˈfɔːr ˈliːvɪŋ/' },
      { id: 'lk-s5', text: 'Take-a look-at the shiny stage.', cleanText: 'take a look at the shiny stage', type: 'sentence', ipa: '/teɪk‿ə lʊk‿æt ðə ˈʃaɪni steɪdʒ/' },
    ],
  },
];
