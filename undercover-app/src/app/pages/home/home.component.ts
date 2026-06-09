import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { GroupsService } from '../../services/groups.service';
import { WordsService } from '../../services/words.service';
import { LanguageService, Language } from '../../services/language.service';
import { GameMode, PlayerGroup } from '../../models/game.models';
import { WordPair } from '../../data/words.data';

type Tab = 'jouer' | 'groupes' | 'mots';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container fade-in">

      <div class="hero-section">
        <div class="lang-selector">
          <button 
            class="lang-btn" 
            [class.active]="lang() === 'fr'" 
            (click)="setLang('fr')"
          >🇫🇷 FR</button>
          <button 
            class="lang-btn" 
            [class.active]="lang() === 'en'" 
            (click)="setLang('en')"
          >🇬🇧 EN</button>
        </div>
        <h1>{{ t()('home_title') }}</h1>
        <p class="subtitle">{{ t()('home_subtitle') }}</p>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button class="tab-btn" [class.active]="tab() === 'jouer'" (click)="switchTab('jouer')">
          {{ t()('tab_play') }}
        </button>
        <button class="tab-btn" [class.active]="tab() === 'groupes'" (click)="switchTab('groupes')">
          {{ t()('tab_groups') }}
        </button>
        <button class="tab-btn" [class.active]="tab() === 'mots'" (click)="switchTab('mots')">
          {{ t()('tab_words') }}
        </button>
      </div>

      <!-- ===== JOUER ===== -->
      <div class="tab-content jouer-content" *ngIf="tab() === 'jouer'">
        <div class="mode-selection">

          <!-- Modes classiques -->
          <p class="mode-section-label">{{ t()('mode_classic') }}</p>

          <div class="glass-panel mode-card" (click)="selectMode('undercover')">
            <div class="icon">🕵️</div>
            <h2>{{ t()('mode_spy') }}</h2>
            <p>{{ t()('mode_spy_desc') }}</p>
          </div>

          <div class="glass-panel mode-card mode-card--hardcore" (click)="selectMode('undercover-hardcore')">
            <div class="icon">🔥</div>
            <h2>{{ t()('mode_hardcore') }}</h2>
            <p>{{ t()('mode_hardcore_desc') }}</p>
          </div>

          <div class="glass-panel mode-card" (click)="selectMode('mrwhite')">
            <div class="icon">🃏</div>
            <h2>{{ t()('mode_mrwhite') }}</h2>
            <p>{{ t()('mode_mrwhite_desc') }}</p>
          </div>

          <!-- Modes Duo -->
          <p class="mode-section-label">{{ t()('mode_duo') }}</p>

          <div class="duo-modes-grid">
            <div class="glass-panel mode-card-sm" (click)="selectMode('undercover-2-known')">
              <div class="icon">🕵️🤝</div>
              <h3>{{ t()('mode_2spies_allied') }}</h3>
              <p>{{ t()('mode_2spies_allied_desc') }}</p>
            </div>

            <div class="glass-panel mode-card-sm" (click)="selectMode('undercover-2-unknown')">
              <div class="icon">🕵️🕵️</div>
              <h3>{{ t()('mode_2spies_solo') }}</h3>
              <p>{{ t()('mode_2spies_solo_desc') }}</p>
            </div>

            <div class="glass-panel mode-card-sm" (click)="selectMode('mrwhite-2-known')">
              <div class="icon">🃏🤝</div>
              <h3>{{ t()('mode_2mrwhite_allied') }}</h3>
              <p>{{ t()('mode_2mrwhite_allied_desc') }}</p>
            </div>

            <div class="glass-panel mode-card-sm" (click)="selectMode('mrwhite-2-unknown')">
              <div class="icon">🃏🃏</div>
              <h3>{{ t()('mode_2mrwhite_solo') }}</h3>
              <p>{{ t()('mode_2mrwhite_solo_desc') }}</p>
            </div>
          </div>

        </div>
      </div>

      <!-- ===== GROUPES ===== -->
      <div class="tab-content" *ngIf="tab() === 'groupes'">

        <!-- Formulaire créer / modifier -->
        <div *ngIf="showForm()" class="glass-panel group-form fade-in">
          <h3>{{ editingId() ? t()('group_edit') : t()('group_new') }}</h3>

          <input
            class="input-field group-name-input"
            [(ngModel)]="formName"
            [placeholder]="t()('group_name_placeholder')"
            maxlength="30"
          />

          <div class="form-players">
            <div class="player-input" *ngFor="let p of formPlayers; let i = index; trackBy: trackByIndex">
              <span class="player-number">{{ i + 1 }}</span>
              <input class="input-field" [(ngModel)]="formPlayers[i]" [placeholder]="t()('group_player_placeholder')" maxlength="20" />
              <button class="remove-btn" (click)="removeFormPlayer(i)" *ngIf="formPlayers.length > 2">✕</button>
            </div>
          </div>

          <button class="btn add-btn" (click)="addFormPlayer()" *ngIf="formPlayers.length < 20">
            {{ t()('group_add_player') }}
          </button>

          <div class="form-actions">
            <button class="btn btn-outline" (click)="cancelForm()">{{ t()('group_cancel') }}</button>
            <button class="btn btn-primary" (click)="saveForm()" [disabled]="!canSaveForm()">
              {{ t()('group_save') }}
            </button>
          </div>
        </div>

        <!-- Liste des groupes -->
        <div *ngIf="!showForm()">
          <div *ngIf="groups().length === 0" class="empty-state">
            <div class="empty-icon">👥</div>
            <p>{{ t()('group_empty') }}</p>
            <p class="empty-sub">{{ t()('group_empty_sub') }}</p>
          </div>

          <div class="groups-list">
            <div class="glass-panel group-card fade-in" *ngFor="let group of groups()">
              <div class="group-info">
                <h3 class="group-name">{{ group.name }}</h3>
                <p class="group-players-preview">{{ group.players.join(' · ') }}</p>
                <p class="group-count">
                  {{ group.players.length }} 
                  {{ group.players.length > 1 ? t()('group_players_count_plural') : t()('group_players_count') }}
                </p>
              </div>
              <div class="group-card-actions">
                <button class="icon-btn" (click)="startEdit(group)" title="Modifier">✏️</button>
                <button class="icon-btn danger" (click)="deleteGroup(group.id)" title="Supprimer">🗑️</button>
              </div>
            </div>
          </div>

          <button class="btn btn-primary create-btn" (click)="startCreate()">
            {{ t()('group_new') }}
          </button>
        </div>
      </div>

      <!-- ===== MOTS ===== -->
      <div class="tab-content mots-content" *ngIf="tab() === 'mots'">

        <!-- Add new category bar -->
        <div class="mots-top-bar">
          <div class="new-cat-row" *ngIf="!addingCategory()">
            <button class="btn btn-outline new-cat-btn" (click)="startAddCategory()">
              {{ t()('word_new_cat') }}
            </button>
          </div>
          <div class="new-cat-form fade-in" *ngIf="addingCategory()">
            <input
              class="input-field cat-name-field"
              [(ngModel)]="newCategoryName"
              [placeholder]="t()('word_cat_name_placeholder')"
              maxlength="30"
              (keydown.enter)="confirmAddCategory()"
            />
            <div class="cat-form-actions">
              <button class="btn btn-outline sm-btn" (click)="cancelAddCategory()">{{ t()('group_cancel') }}</button>
              <button class="btn btn-primary sm-btn" (click)="confirmAddCategory()" [disabled]="!newCategoryName.trim()">{{ t()('word_create') }}</button>
            </div>
          </div>
        </div>

        <!-- Category accordion list -->
        <div class="categories-list">
          <div
            class="cat-section glass-panel"
            *ngFor="let cat of allCategories()"
          >
            <!-- Category header -->
            <div class="cat-section-header" (click)="toggleCat(cat)">
              <div class="cat-header-left">
                <span class="cat-section-icon">{{ catIcon(cat) }}</span>
                <span class="cat-section-name">{{ translateCategory(cat) }}</span>
                <span class="cat-count">{{ pairsForCat(cat).length }}</span>
              </div>
              <div class="cat-header-right">
                <button
                  class="icon-btn danger sm"
                  (click)="deleteCat(cat, $event)"
                  title="Supprimer la catégorie"
                >🗑️</button>
                <span class="cat-chevron" [class.open]="openCat() === cat">›</span>
              </div>
            </div>

            <!-- Expanded word list -->
            <div class="cat-words" *ngIf="openCat() === cat">
              <div class="words-table-header">
                <span>{{ t()('word_table_civilian') }}</span>
                <span>↔</span>
                <span>{{ t()('word_table_spy') }}</span>
                <span></span>
              </div>

              <div class="word-row" *ngFor="let pair of pairsForCat(cat)">
                <span class="word-cell">{{ pair.civilian }}</span>
                <span class="word-sep">↔</span>
                <span class="word-cell">{{ pair.undercover }}</span>
                <button
                  class="icon-btn danger sm"
                  title="Supprimer"
                  (click)="deletePair(pair.civilian, cat)"
                >🗑️</button>
              </div>

              <!-- Add word form -->
              <div class="add-word-row" *ngIf="!addingWordCat()">
                <button class="btn add-word-btn" (click)="startAddWord(cat)">{{ t()('word_add_word') }}</button>
              </div>
              <div class="add-word-form fade-in" *ngIf="addingWordCat() === cat">
                <div class="add-word-inputs">
                  <input class="input-field sm-input" [(ngModel)]="newWordCivilian" [placeholder]="t()('word_civilian_placeholder')" maxlength="30" />
                  <span class="word-sep">↔</span>
                  <input class="input-field sm-input" [(ngModel)]="newWordUndercover" [placeholder]="t()('word_spy_placeholder')" maxlength="30" />
                </div>
                <div class="add-word-actions">
                  <button class="btn btn-outline sm-btn" (click)="cancelAddWord()">{{ t()('group_cancel') }}</button>
                  <button class="btn btn-primary sm-btn" (click)="confirmAddWord(cat)" [disabled]="!newWordCivilian.trim() || !newWordUndercover.trim()">{{ t()('word_add') }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>

    </div>
  `,
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private router = inject(Router);
  private gameService = inject(GameService);
  private groupsService = inject(GroupsService);
  private wordsService = inject(WordsService);
  private languageService = inject(LanguageService);

  tab = signal<Tab>('jouer');
  lang = this.languageService.language;
  t = this.languageService.t;

  setLang(l: Language) {
    this.languageService.setLanguage(l);
  }

  translateCategory(cat: string): string {
    const key = `cat_${cat.replace(/\s+/g, '_')}` as any;
    return this.t()(key) || cat;
  }
  groups = this.groupsService.groups;

  // Groups form state
  showForm = signal(false);
  editingId = signal<string | null>(null);
  formName = '';
  formPlayers: string[] = ['', '', ''];

  // Mots tab state
  openCat = signal<string | null>(null);
  addingCategory = signal(false);
  newCategoryName = '';
  addingWordCat = signal<string | null>(null);
  newWordCivilian = '';
  newWordUndercover = '';

  // Computed from WordsService
  allCategories = this.wordsService.allCategories;

  pairsForCat(cat: string) {
    return this.wordsService.pairsForCategory(cat);
  }

  isBuiltIn(cat: string) {
    return this.wordsService.isBuiltInCategory(cat);
  }

  isBuiltInPair(civilian: string, cat: string) {
    return this.wordsService.isBuiltInPair(civilian, cat);
  }

  catIcon(cat: string): string {
    const icons: Record<string, string> = {
      'Nourriture': '🍕', 'Nature': '🌿', 'Animaux': '🐾', 'Maison': '🏠',
      'Corps': '💪', 'Mode': '👗', 'Transport': '🚗', 'Technologie': '💻',
      'Sports': '⚽', 'Musique': '🎸', 'Professions': '👷', 'Lieux': '🗺️',
      'Émotions': '❤️', 'Cinéma': '🎬', 'Jeux': '🎲', 'Histoire': '⚔️',
      'Science': '🔬', 'Géographie': '🌍', 'Art': '🎨', 'Espace': '🚀',
      'Cuisine du Monde': '🌮', 'Météo': '🌩️', 'Adulte': '🔞',
    };
    return icons[cat] ?? '🃏';
  }

  toggleCat(cat: string) {
    this.openCat.set(this.openCat() === cat ? null : cat);
    this.addingWordCat.set(null);
  }

  // ── Category management ─────────────────────────────────────────────

  startAddCategory() {
    this.newCategoryName = '';
    this.addingCategory.set(true);
  }

  cancelAddCategory() {
    this.addingCategory.set(false);
  }

  confirmAddCategory() {
    const name = this.newCategoryName.trim();
    if (!name) return;
    this.wordsService.addCategory(name);
    this.addingCategory.set(false);
    this.openCat.set(name);
  }

  deleteCat(cat: string, event: Event) {
    event.stopPropagation();
    if (confirm(this.t()('word_confirm_delete_cat', { cat: this.translateCategory(cat) }))) {
      this.wordsService.removeCategory(cat);
      if (this.openCat() === cat) this.openCat.set(null);
    }
  }

  // ── Word pair management ─────────────────────────────────────────────

  startAddWord(cat: string) {
    this.newWordCivilian = '';
    this.newWordUndercover = '';
    this.addingWordCat.set(cat);
  }

  cancelAddWord() {
    this.addingWordCat.set(null);
  }

  confirmAddWord(cat: string) {
    const civ = this.newWordCivilian.trim();
    const und = this.newWordUndercover.trim();
    if (!civ || !und) return;
    this.wordsService.addPair({ civilian: civ, undercover: und, category: cat });
    this.addingWordCat.set(null);
  }

  deletePair(civilian: string, cat: string) {
    this.wordsService.removePair(civilian, cat);
  }

  // ── Tab ─────────────────────────────────────────────────────────────

  switchTab(t: Tab) {
    this.showForm.set(false);
    this.addingCategory.set(false);
    this.addingWordCat.set(null);
    this.tab.set(t);
  }

  selectMode(mode: GameMode) {
    this.gameService.gameState().mode = mode;
    this.router.navigate(['/setup'], { queryParams: { mode } });
  }

  // ── Groups ─────────────────────────────────────────────────────────

  startCreate() {
    this.editingId.set(null);
    this.formName = '';
    this.formPlayers = ['', '', ''];
    this.showForm.set(true);
  }

  startEdit(group: PlayerGroup) {
    this.editingId.set(group.id);
    this.formName = group.name;
    this.formPlayers = [...group.players];
    this.showForm.set(true);
  }

  cancelForm() {
    this.showForm.set(false);
  }

  canSaveForm(): boolean {
    return (
      this.formName.trim().length > 0 &&
      this.formPlayers.filter(p => p.trim().length > 0).length >= 2
    );
  }

  saveForm() {
    if (!this.canSaveForm()) return;
    const id = this.editingId();
    if (id) {
      this.groupsService.update(id, this.formName, this.formPlayers);
    } else {
      this.groupsService.create(this.formName, this.formPlayers);
    }
    this.showForm.set(false);
  }

  deleteGroup(id: string) {
    if (confirm(this.t()('group_confirm_delete'))) {
      this.groupsService.delete(id);
    }
  }

  addFormPlayer() {
    if (this.formPlayers.length < 20) this.formPlayers.push('');
  }

  removeFormPlayer(i: number) {
    if (this.formPlayers.length > 2) this.formPlayers.splice(i, 1);
  }

  trackByIndex(i: number) { return i; }
}
