import { Injectable, signal, WritableSignal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GameState, GameMode, Player } from '../models/game.models';
import { WORD_PAIRS, CIVILIAN_WORDS, WordPair } from '../data/words.data';
import { WordsService } from './words.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  // Reactive state management using Angular 17+ Signals
  private state: WritableSignal<GameState> = signal({
    mode: 'undercover',
    players: [],
    civilianWord: '',
    undercoverWord: null,
    specialPlayerIndex: -1,
    secondSpecialPlayerIndex: -1,
    phase: 'setup',
    currentRevealIndex: 0,
    selectedCategory: null
  });

  // Computed signals
  public gameState = this.state.asReadonly();
  public phase = computed(() => this.state().phase);
  public currentRevealIndex = computed(() => this.state().currentRevealIndex);
  public players = computed(() => this.state().players);
  public isMrWhiteMode = computed(() => {
    const m = this.state().mode;
    return m === 'mrwhite' || m === 'mrwhite-2-known' || m === 'mrwhite-2-unknown';
  });

  // Store player names & mode temporarily while navigating to category screen
  private pendingPlayerNames: string[] = [];
  private pendingMode: GameMode = 'undercover';

  private wordsService = inject(WordsService);

  constructor(private router: Router) {}

  /** Called by Setup — stores players/mode and navigates to category selection. */
  goToCategory(mode: GameMode, playerNames: string[]) {
    this.pendingPlayerNames = [...playerNames];
    this.pendingMode = mode;
    this.router.navigate(['/category']);
  }

  /** Returns the pending mode (used by category screen back-button). */
  getPendingMode(): GameMode {
    return this.pendingMode;
  }

  /** Called by Category screen — kicks off game with chosen category. */
  startGame(category: string | null) {
    const mode = this.pendingMode;
    const playerNames = this.pendingPlayerNames;

    // 1. Keep player order as entered (no shuffle)
    const orderedNames = [...playerNames];

    const isDuo = mode === 'undercover-2-known' || mode === 'undercover-2-unknown'
               || mode === 'mrwhite-2-known'    || mode === 'mrwhite-2-unknown';
    const isUndercoverVariant = mode === 'undercover' || mode === 'undercover-hardcore'
                             || mode === 'undercover-2-known' || mode === 'undercover-2-unknown';

    // 2. Assign Words
    let civWord = '';
    let undWord: string | null = null;

    if (mode === 'undercover-hardcore') {
      const civPair = this.getRandomPair(category);
      civWord = civPair.civilian;
      
      let spyPair;
      let attempts = 0;
      do {
        spyPair = this.getRandomPair(null);
        attempts++;
      } while (
        (spyPair.civilian.toLowerCase() === civWord.toLowerCase() || 
         spyPair.undercover.toLowerCase() === civWord.toLowerCase()) && 
        attempts < 100
      );
      
      undWord = this.cryptoRandomInt(2) === 0 ? spyPair.civilian : spyPair.undercover;
    } else if (isUndercoverVariant) {
      const pair = this.getRandomPair(category);
      civWord = pair.civilian;
      undWord = pair.undercover;
    } else {
      // M. Blanc mode: draw civilian word filtered by category
      civWord = this.getRandomCivilianWord(category);
      undWord = null;
    }


    // 3. Assign Roles (randomly but players stay in list order)
    const specialRole: Player['role'] = isUndercoverVariant ? 'undercover' : 'mrwhite';
    let specialPlayerIndex = -1;
    let secondSpecialPlayerIndex = -1;

    if (isDuo) {
      const shuffledIndices = this.cryptoShuffle([...Array(orderedNames.length).keys()]);
      specialPlayerIndex = shuffledIndices[0];
      secondSpecialPlayerIndex = shuffledIndices[1];
    } else {
      specialPlayerIndex = this.cryptoRandomInt(orderedNames.length);
    }

    const players: Player[] = orderedNames.map((name, i) => ({
      name,
      role: (i === specialPlayerIndex || i === secondSpecialPlayerIndex) ? specialRole : 'civilian',
      hasRevealed: false
    }));

    const startingPlayerIndex = this.cryptoRandomInt(players.length);
    const startingPlayerName = players[startingPlayerIndex].name;

    // Update state
    this.state.set({
      mode,
      players,
      civilianWord: civWord,
      undercoverWord: undWord,
      specialPlayerIndex,
      secondSpecialPlayerIndex,
      phase: 'reveal',
      currentRevealIndex: 0,
      selectedCategory: category,
      startingPlayerName
    });

    this.router.navigate(['/reveal']);
  }

  /** Re-rolls words only (keeps players & roles), restarts reveal phase. */
  rerollWords() {
    const s = this.state();
    const mode = s.mode;
    const category = s.selectedCategory;
    const isUndercoverVariant = mode === 'undercover' || mode === 'undercover-hardcore'
                             || mode === 'undercover-2-known' || mode === 'undercover-2-unknown';

    let civWord = s.civilianWord;
    let undWord = s.undercoverWord;

    if (mode === 'undercover-hardcore') {
      const civPair = this.getRandomPair(category);
      civWord = civPair.civilian;
      
      let spyPair;
      let attempts = 0;
      do {
        spyPair = this.getRandomPair(null);
        attempts++;
      } while (
        (spyPair.civilian.toLowerCase() === civWord.toLowerCase() || 
         spyPair.undercover.toLowerCase() === civWord.toLowerCase()) && 
        attempts < 100
      );
      
      undWord = this.cryptoRandomInt(2) === 0 ? spyPair.civilian : spyPair.undercover;
    } else if (isUndercoverVariant) {
      const pair = this.getRandomPair(category);
      civWord = pair.civilian;
      undWord = pair.undercover;
    } else {
      // M. Blanc mode: respect category on reroll too
      civWord = this.getRandomCivilianWord(category);
      undWord = null;
    }


    // Reset hasRevealed for all players
    const resetPlayers = s.players.map(p => ({ ...p, hasRevealed: false }));
    const startingPlayerIndex = this.cryptoRandomInt(resetPlayers.length);
    const startingPlayerName = resetPlayers[startingPlayerIndex].name;

    this.state.set({
      ...s,
      players: resetPlayers,
      civilianWord: civWord,
      undercoverWord: undWord,
      phase: 'reveal',
      currentRevealIndex: 0,
      startingPlayerName
    });

    this.router.navigate(['/reveal']);
  }

  revealWordFor(playerIndex: number): string {
    const player = this.state().players[playerIndex];
    if (player.role === 'civilian') {
      return this.state().civilianWord;
    } else if (player.role === 'undercover') {
      return this.state().undercoverWord!;
    } else {
      return 'M. BLANC';
    }
  }

  /** Returns the ally's name for known-duo modes, null otherwise. */
  getPartnerNameFor(playerIndex: number): string | null {
    const s = this.state();
    if (s.mode !== 'undercover-2-known' && s.mode !== 'mrwhite-2-known') return null;

    const player = s.players[playerIndex];
    if (player.role === 'civilian') return null;

    const partnerIndex = playerIndex === s.specialPlayerIndex
      ? s.secondSpecialPlayerIndex
      : (playerIndex === s.secondSpecialPlayerIndex ? s.specialPlayerIndex : -1);

    if (partnerIndex === -1) return null;
    return s.players[partnerIndex].name;
  }

  markRevealed(playerIndex: number) {
    const currentState = this.state();
    const updatedPlayers = [...currentState.players];
    updatedPlayers[playerIndex] = { ...updatedPlayers[playerIndex], hasRevealed: true };

    const nextIndex = playerIndex + 1;
    const nextPhase = nextIndex >= updatedPlayers.length ? 'game-on' : 'reveal';

    this.state.set({
      ...currentState,
      players: updatedPlayers,
      currentRevealIndex: nextIndex,
      phase: nextPhase
    });

    if (nextPhase === 'game-on') {
      this.router.navigate(['/wheel']);
    }
  }

  allRevealed(): boolean {
    return this.state().players.every(p => p.hasRevealed);
  }

  restartGame() {
    this.pendingPlayerNames = [];
    this.pendingMode = 'undercover';
    this.state.set({
      mode: 'undercover',
      players: [],
      civilianWord: '',
      undercoverWord: null,
      specialPlayerIndex: -1,
      secondSpecialPlayerIndex: -1,
      phase: 'setup',
      currentRevealIndex: 0,
      selectedCategory: null,
      startingPlayerName: undefined
    });
    this.router.navigate(['/']);
  }

  // ── Crypto-quality randomness ────────────────────────────────────────

  /** Cryptographically secure Fisher-Yates shuffle. */
  private cryptoShuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = this.cryptoRandomInt(i + 1);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /** Returns a cryptographically secure random integer in [0, max). */
  private cryptoRandomInt(max: number): number {
    const buf = new Uint32Array(1);
    // Rejection-sampling to eliminate modulo bias
    const limit = 0x100000000 - (0x100000000 % max);
    let r: number;
    do {
      crypto.getRandomValues(buf);
      r = buf[0];
    } while (r >= limit);
    return r % max;
  }

  private getRandomPair(category: string | null): WordPair {
    // Use merged word pairs (built-in + custom)
    const allPairs = this.wordsService.allWordPairs();
    const pool = category
      ? allPairs.filter(p => p.category === category)
      : allPairs;
    const source = pool.length > 0 ? pool : allPairs;
    return source[this.cryptoRandomInt(source.length)];
  }



  /** For M. Blanc: picks a civilian word from WORD_PAIRS filtered by category. */
  private getRandomCivilianWord(category: string | null = null): string {
    const allPairs = this.wordsService.allWordPairs();
    if (category) {
      const pool = allPairs.filter(p => p.category === category);
      if (pool.length > 0) {
        return pool[this.cryptoRandomInt(pool.length)].civilian;
      }
    }
    if (allPairs.length > 0) {
      return allPairs[this.cryptoRandomInt(allPairs.length)].civilian;
    }
    return 'Civil';
  }
}
