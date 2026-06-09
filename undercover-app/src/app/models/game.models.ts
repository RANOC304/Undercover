export type GameMode =
  | 'undercover'
  | 'undercover-hardcore'
  | 'mrwhite'
  | 'undercover-2-known'
  | 'undercover-2-unknown'
  | 'mrwhite-2-known'
  | 'mrwhite-2-unknown';

export interface PlayerGroup {
  id: string;
  name: string;
  players: string[];
}

export interface Player {
  name: string;
  role: 'civilian' | 'undercover' | 'mrwhite';
  hasRevealed: boolean;
}

export interface GameState {
  mode: GameMode;
  players: Player[];
  civilianWord: string;
  undercoverWord: string | null;
  specialPlayerIndex: number;
  secondSpecialPlayerIndex: number;
  phase: 'setup' | 'reveal' | 'game-on';
  currentRevealIndex: number;
  selectedCategory: string | null; // null = all categories
  startingPlayerName?: string;
}
