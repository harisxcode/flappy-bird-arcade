import { BirdSkin, DifficultyConfig, GameDifficulty } from '../types/game';

export const VIRTUAL_WIDTH = 360;
export const VIRTUAL_HEIGHT = 640;
export const GROUND_HEIGHT = 112;
export const PLAY_AREA_HEIGHT = VIRTUAL_HEIGHT - GROUND_HEIGHT; // 528

export const DIFFICULTY_SETTINGS: Record<GameDifficulty, DifficultyConfig> = {
  casual: {
    name: 'Casual',
    gravity: 0.24,
    jumpVelocity: -6.0,
    pipeSpeed: 1.9,
    pipeSpawnInterval: 120, // frames (~2 sec)
    pipeGap: 145,
    description: 'Generous gaps, gentle gravity, relaxed pacing.',
  },
  classic: {
    name: 'Classic',
    gravity: 0.28,
    jumpVelocity: -6.5,
    pipeSpeed: 2.2,
    pipeSpawnInterval: 100, // frames (~1.6 sec)
    pipeGap: 120,
    description: 'Original arcade feel, sharp precision required.',
  },
  hardcore: {
    name: 'Storm',
    gravity: 0.32,
    jumpVelocity: -7.0,
    pipeSpeed: 2.6,
    pipeSpawnInterval: 90,
    pipeGap: 105,
    description: 'Tight gaps, high speed, dynamic moving pipes & rain.',
  },
};

export interface SkinPalette {
  name: string;
  body: string;
  belly: string;
  wing: string;
  outline: string;
  beak: string;
  beakOutline: string;
  eyeHighlight: string;
  trailColor: string;
}

export const BIRD_PALETTES: Record<BirdSkin, SkinPalette> = {
  sunny: {
    name: 'Sunny',
    body: '#FACC15', // Gold
    belly: '#FEF08A',
    wing: '#EAB308',
    outline: '#582C0E',
    beak: '#F97316',
    beakOutline: '#7C2D12',
    eyeHighlight: '#FFFFFF',
    trailColor: '#FDE047',
  },
  ruby: {
    name: 'Ruby',
    body: '#EF4444', // Red
    belly: '#FCA5A5',
    wing: '#DC2626',
    outline: '#450A0A',
    beak: '#FB923C',
    beakOutline: '#7C2D12',
    eyeHighlight: '#FFFFFF',
    trailColor: '#F87171',
  },
  azure: {
    name: 'Azure',
    body: '#0284C7', // Blue
    belly: '#BAE6FD',
    wing: '#0369A1',
    outline: '#082F49',
    beak: '#F59E0B',
    beakOutline: '#78350F',
    eyeHighlight: '#FFFFFF',
    trailColor: '#38BDF8',
  },
  volt: {
    name: 'Volt',
    body: '#10B981', // Emerald / Neon
    belly: '#A7F3D0',
    wing: '#059669',
    outline: '#064E3B',
    beak: '#EAB308',
    beakOutline: '#713F12',
    eyeHighlight: '#FFFFFF',
    trailColor: '#34D399',
  },
  phoenix: {
    name: 'Phoenix',
    body: '#F43F5E', // Rose Gold
    belly: '#FED7AA',
    wing: '#D97706',
    outline: '#4C0519',
    beak: '#FBBF24',
    beakOutline: '#78350F',
    eyeHighlight: '#FEF08A',
    trailColor: '#FB923C',
  },
};
