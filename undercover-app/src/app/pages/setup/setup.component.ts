import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { GroupsService } from '../../services/groups.service';
import { LanguageService } from '../../services/language.service';
import { GameMode, PlayerGroup } from '../../models/game.models';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container fade-in">
      <div class="header">
        <button class="btn btn-outline small-btn" (click)="goBack()">{{ t()('setup_back') }}</button>
        <h2>{{ t()('setup_title') }}</h2>
      </div>

      <div class="glass-panel content-panel">
        <p class="mode-label">{{ t()('setup_mode') }} <strong>{{ getModeLabel() }}</strong></p>

        <!-- Sélecteur de groupe -->
        <div class="group-selector" *ngIf="groups().length > 0">
          <p class="group-selector-label">{{ t()('setup_load_group') }}</p>
          <div class="group-chips">
            <button
              class="chip"
              *ngFor="let group of groups()"
              [class.selected]="selectedGroupId === group.id"
              (click)="applyGroup(group)"
            >
              {{ group.name }}
              <span class="chip-count">{{ group.players.length }}</span>
            </button>
          </div>
          <div class="group-divider" *ngIf="selectedGroupId">
            <span>{{ t()('setup_loaded_hint') }}</span>
          </div>
        </div>

        <div class="player-list">
          <div class="player-input" *ngFor="let player of players; let i = index; trackBy: trackByIndex">
            <span class="player-number">{{ i + 1 }}</span>
            <input
              type="text"
              [(ngModel)]="players[i]"
              class="input-field"
              [placeholder]="t()('group_player_placeholder')"
              maxlength="20"
              (ngModelChange)="selectedGroupId = null"
            />
            <button class="remove-btn" (click)="removePlayer(i)" *ngIf="players.length > 3">✕</button>
          </div>
        </div>

        <button class="btn add-btn" (click)="addPlayer()" *ngIf="players.length < 20">
          {{ t()('group_add_player') }}
        </button>
      </div>

      <div class="actions">
        <button class="btn btn-primary start-btn" (click)="startGame()" [disabled]="!canStart()">
          {{ t()('setup_start') }}
        </button>
        <p class="error-msg" *ngIf="!canStart()">{{ t()('setup_error_min', { min: minPlayers() }) }}</p>
      </div>
    </div>
  `,
  styleUrl: './setup.component.scss'
})
export class SetupComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private gameService = inject(GameService);
  private groupsService = inject(GroupsService);
  private languageService = inject(LanguageService);

  t = this.languageService.t;

  mode: GameMode = 'undercover';
  players: string[] = ['', '', ''];
  selectedGroupId: string | null = null;

  groups = this.groupsService.groups;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['mode']) {
        this.mode = params['mode'] as GameMode;
      }
    });
  }

  applyGroup(group: PlayerGroup) {
    this.selectedGroupId = group.id;
    this.players = [...group.players];
  }

  addPlayer() {
    if (this.players.length < 20) {
      this.players.push('');
      this.selectedGroupId = null;
    }
  }

  removePlayer(index: number) {
    if (this.players.length > 3) {
      this.players.splice(index, 1);
      this.selectedGroupId = null;
    }
  }

  minPlayers(): number {
    return this.mode === 'undercover-2-known' || this.mode === 'undercover-2-unknown'
        || this.mode === 'mrwhite-2-known'    || this.mode === 'mrwhite-2-unknown'
      ? 4 : 3;
  }

  getModeLabel(): string {
    const labels: Record<string, string> = {
      'undercover':           this.t()('mode_spy'),
      'undercover-hardcore':  this.t()('mode_hardcore'),
      'mrwhite':              this.t()('mode_mrwhite'),
      'undercover-2-known':   this.t()('mode_2spies_allied'),
      'undercover-2-unknown': this.t()('mode_2spies_solo'),
      'mrwhite-2-known':      this.t()('mode_2mrwhite_allied'),
      'mrwhite-2-unknown':    this.t()('mode_2mrwhite_solo'),
    };
    return labels[this.mode] ?? this.mode;
  }

  canStart(): boolean {
    return this.players.length >= this.minPlayers() && this.players.every(p => p.trim().length > 0);
  }

  startGame() {
    if (this.canStart()) {
      this.gameService.goToCategory(this.mode, this.players.map(p => p.trim()));
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
