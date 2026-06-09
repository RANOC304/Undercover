import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { LanguageService } from '../../services/language.service';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

type RevealState = 'passing-phone' | 'revealing' | 'blackout';

@Component({
  selector: 'app-reveal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container" 
         [ngClass]="{'blackout-bg': currentState() === 'blackout'}">
      
      <!-- Passing Phone State -->
      <div class="state-view prompt-view fade-in" *ngIf="currentState() === 'passing-phone'">
        <div class="glass-panel pass-card">
          <p class="subtitle">{{ t()('reveal_pass_title') }}</p>
          <h1 class="player-name">{{ currentPlayerName() }}</h1>
          <button class="btn btn-primary lg-btn" (click)="revealWord()">{{ t()('reveal_pass_btn') }}</button>
          <button class="btn btn-outline cancel-btn" (click)="cancelGame()">{{ t()('reveal_cancel') }}</button>
        </div>
      </div>

      <!-- Revealing State -->
      <div class="state-view reveal-view" *ngIf="currentState() === 'revealing'">
        <div class="card-3d-scene">
          <div class="card-3d-wrapper" [class.is-flipped]="isFlipped()">

            <div class="card-face">
              <!-- Empty front to animate from -->
            </div>

            <div class="card-face card-face-back">
              <p class="subtitle">{{ t()('reveal_secret_word_label') }}</p>

              <h1 class="secret-word" [class.danger-text]="currentWord() === 'M. BLANC'">
                <span class="icon" *ngIf="currentWord() === 'M. BLANC'">🃏</span>
                <br *ngIf="currentWord() === 'M. BLANC'" />
                {{ currentWord() === 'M. BLANC' ? t()('reveal_mrwhite_role') : currentWord() }}
              </h1>

              <div class="partner-info" *ngIf="partnerName()">
                <p class="partner-label">{{ t()('reveal_partner_label') }}</p>
                <p class="partner-name">{{ partnerName() }}</p>
              </div>

              <button class="btn btn-primary mt-auto" (click)="memorized()">{{ t()('reveal_memorized_btn') }}</button>
            </div>

          </div>
        </div>
      </div>

      <!-- Blackout State (Completely empty dark screen) -->
      <div class="state-view blackout-view" *ngIf="currentState() === 'blackout'">
        <!-- No content -->
      </div>
    </div>
  `,
  styleUrl: './reveal.component.scss'
})
export class RevealComponent {
  private gameService = inject(GameService);
  private languageService = inject(LanguageService);

  t = this.languageService.t;

  currentState = signal<RevealState>('passing-phone');
  isFlipped = signal<boolean>(false);

  currentPlayerIndex = this.gameService.currentRevealIndex;
  
  currentPlayerName = computed(() => {
    const players = this.gameService.players();
    const idx = this.currentPlayerIndex();
    return players[idx]?.name || '';
  });

  currentWord = computed(() => {
    return this.gameService.revealWordFor(this.currentPlayerIndex());
  });

  partnerName = computed(() => {
    return this.gameService.getPartnerNameFor(this.currentPlayerIndex());
  });

  async revealWord() {
    this.currentState.set('revealing');
    
    // Slight delay to allow CSS to render front face before flipping
    setTimeout(async () => {
      this.isFlipped.set(true);
      try {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      } catch(e) { /* Ignore if web / no haptics */ }
    }, 50);
  }

  cancelGame() {
    this.gameService.restartGame();
  }

  async memorized() {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch(e) { /* Ignore */ }

    // Start blackout
    this.currentState.set('blackout');
    this.isFlipped.set(false);

    // Wait 1.5s then advance
    setTimeout(() => {
      this.gameService.markRevealed(this.currentPlayerIndex());
      
      // If phase changed to game-on, service handles routing. Otherwise:
      if (this.gameService.phase() === 'reveal') {
        this.currentState.set('passing-phone');
      }
    }, 1500);
  }
}
