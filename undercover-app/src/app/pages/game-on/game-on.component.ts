import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { LanguageService } from '../../services/language.service';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-game-on',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container fade-in pulse-container">
      <div class="glass-panel text-center game-panel-layout">
        
        <div class="top-section">
          <div class="icon">🔥</div>
          <h1>{{ t()('game_title') }}</h1>

          <div class="starting-player-badge">
            <span class="badge-icon">🗣️</span>
            <span class="badge-label">{{ t()('game_starter_label') }}</span>
            <span class="badge-name">{{ startingPlayerName() }}</span>
          </div>

          <p class="mt-4 info-text">
            {{ t()('game_instruction_1') }}
            <br><br>
            {{ t()('game_instruction_2') }}
          </p>
        </div>

        <!-- Player Reminder Carousel Section (Middle) -->
        <div class="players-reminder-section">
          <p class="reminder-title">{{ t()('reminder_title') }}</p>
          <div class="carousel-container">
            <div 
              *ngFor="let p of players(); let i = index" 
              class="player-card-carousel-item"
              (click)="showReminder(i)"
            >
              <span class="player-avatar">👤</span>
              <span class="player-name-text">{{ p.name }}</span>
            </div>
          </div>
        </div>

        <div class="bottom-actions">
          <button class="btn btn-secondary reroll-btn" (click)="rerollWords()">
            {{ t()('game_reroll') }}
          </button>

          <button class="btn btn-danger giant-btn" (click)="restart()">
            {{ t()('game_restart') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Secret Word Reminder Overlay (Outside scroll container to center properly) -->
    <div class="reminder-overlay fade-in" *ngIf="reminderState() !== 'hidden'">
      <div class="glass-panel reminder-card">
        
        <!-- Confirm phase -->
        <div *ngIf="reminderState() === 'confirm'" class="fade-in">
          <h2 class="confirm-title">{{ t()('reminder_modal_title') }}</h2>
          <p class="confirm-desc" [innerHTML]="t()('reminder_modal_desc', { name: '<strong>' + selectedPlayerName() + '</strong>' })"></p>
          <button class="btn btn-primary lg-btn" (click)="confirmReveal()">
            {{ t()('reminder_show_word') }}
          </button>
          <button class="cancel-btn" (click)="closeReminder()">{{ t()('reminder_cancel') }}</button>
        </div>

        <!-- Revealed phase -->
        <div *ngIf="reminderState() === 'revealed'" class="fade-in">
          <p class="subtitle">{{ t()('reminder_word_label', { name: selectedPlayerName() }) }}</p>
          
          <h1 class="secret-word-display" [class.danger-text]="selectedPlayerWord() === 'M. BLANC'">
            {{ selectedPlayerWord() === 'M. BLANC' ? t()('reveal_mrwhite_role') : selectedPlayerWord() }}
          </h1>

          <div class="partner-info" *ngIf="selectedPlayerPartner()">
            <p class="partner-label">{{ t()('reminder_partner_label') }}</p>
            <p class="partner-name">{{ selectedPlayerPartner() }}</p>
          </div>

          <button class="btn btn-primary lg-btn" (click)="closeReminder()">
            {{ t()('reminder_done') }}
          </button>
        </div>

      </div>
    </div>
  `,
  styleUrl: './game-on.component.scss'
})
export class GameOnComponent {
  private gameService = inject(GameService);
  private languageService = inject(LanguageService);

  t = this.languageService.t;

  startingPlayerName = computed(() => this.gameService.gameState().startingPlayerName || '');
  players = this.gameService.players;

  selectedPlayerIndex = signal<number | null>(null);
  reminderState = signal<'confirm' | 'revealed' | 'hidden'>('hidden');

  selectedPlayerName = computed(() => {
    const idx = this.selectedPlayerIndex();
    return idx !== null ? this.players()[idx]?.name : '';
  });

  selectedPlayerWord = computed(() => {
    const idx = this.selectedPlayerIndex();
    return idx !== null ? this.gameService.revealWordFor(idx) : '';
  });

  selectedPlayerPartner = computed(() => {
    const idx = this.selectedPlayerIndex();
    return idx !== null ? this.gameService.getPartnerNameFor(idx) : null;
  });

  async showReminder(index: number) {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch(e) {}
    this.selectedPlayerIndex.set(index);
    this.reminderState.set('confirm');
  }

  async confirmReveal() {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch(e) {}
    this.reminderState.set('revealed');
  }

  async closeReminder() {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch(e) {}
    this.reminderState.set('hidden');
    this.selectedPlayerIndex.set(null);
  }

  async rerollWords() {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch(e) {}
    this.gameService.rerollWords();
  }

  async restart() {
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch(e) {}
    this.gameService.restartGame();
  }
}
