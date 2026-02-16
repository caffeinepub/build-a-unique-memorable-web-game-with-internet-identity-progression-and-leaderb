export type GameMode = 'standard' | 'daily';

export type GameState = 'idle' | 'playing' | 'paused' | 'gameOver' | 'won';

export interface GameConfig {
  seed: string;
  difficulty: 'easy' | 'hard';
  speedMultiplier: number;
}

export interface PlayerShip {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  radius: number;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'static' | 'moving';
  velocityX?: number;
  velocityY?: number;
}

export interface Collectible {
  x: number;
  y: number;
  radius: number;
  collected: boolean;
}

export interface GameRunState {
  state: GameState;
  score: number;
  distance: number;
  time: number;
  player: PlayerShip;
  obstacles: Obstacle[];
  collectibles: Collectible[];
  config: GameConfig;
}

export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  boost: boolean;
}

export interface ProgressionState {
  unlockedSpeedMultipliers: number[];
  bestLocalScore: number;
  bestLocalStreak: number;
  tutorialCompleted: boolean;
}
