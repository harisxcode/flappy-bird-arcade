export type GameState = 'READY' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';

export type BirdSkin = 'sunny' | 'ruby' | 'azure' | 'volt' | 'phoenix';

export type GameTheme = 'day' | 'sunset' | 'night';

export type GameDifficulty = 'casual' | 'classic' | 'hardcore';

export interface Bird {
  x: number;
  y: number;
  radius: number;
  velocity: number;
  rotation: number;
  wingPhase: number; // 0, 1, 2 for flap frames
  flappingTimer: number;
}

export interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  width: number;
  passed: boolean;
  offsetY?: number; // for moving pipes in hardcore mode
  direction?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  type?: 'feather' | 'dust' | 'sparkle' | 'text';
  text?: string;
}

export interface GameStats {
  highScore: number;
  totalGames: number;
  totalFlaps: number;
  totalPipesPassed: number;
  medals: {
    bronze: boolean;
    silver: boolean;
    gold: boolean;
    platinum: boolean;
  };
}

export interface DifficultyConfig {
  name: string;
  gravity: number;
  jumpVelocity: number;
  pipeSpeed: number;
  pipeSpawnInterval: number;
  pipeGap: number;
  description: string;
}
