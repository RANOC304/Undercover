import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { WordsService } from '../../services/words.service';
import { LanguageService } from '../../services/language.service';
import { CATEGORIES } from '../../data/words.data';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cat-page fade-in">

      <div class="cat-header">
        <button class="btn btn-outline small-btn" (click)="goBack()">{{ t()('cat_back') }}</button>
        <div>
          <h2>{{ t()('cat_title') }}</h2>
          <p class="cat-subtitle">{{ t()('cat_subtitle') }}</p>
        </div>
      </div>

      <div class="cat-scroll-area">
        <div class="category-grid">

          <!-- Random tile -->
          <div class="cat-tile cat-tile--random" (click)="select('__random__')" id="cat-random">
            <div class="cat-icon">🎲</div>
            <div class="cat-name">{{ t()('cat_random') }}</div>
            <div class="cat-desc">{{ t()('cat_random_desc') }}</div>
          </div>

          <!-- All tile -->
          <div class="cat-tile cat-tile--all" (click)="select('__all__')" id="cat-all">
            <div class="cat-icon">📦</div>
            <div class="cat-name">{{ t()('cat_all') }}</div>
            <div class="cat-desc">{{ t()('cat_all_desc') }}</div>
          </div>

          <!-- Per-category tiles -->
          <div
            *ngFor="let cat of categories; let i = index"
            class="cat-tile"
            (click)="select(cat)"
            [id]="'cat-' + i"
          >
            <div class="cat-icon">{{ icon(cat) }}</div>
            <div class="cat-name">{{ translateCategory(cat) }}</div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .cat-page {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding-top: 0.75rem;
      padding-bottom: 0;
    }
    .cat-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 0 1rem 0.75rem;
      flex-shrink: 0;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .cat-header h2 {
      margin: 0 0 2px;
      font-size: 1.15rem;
      color: #fff;
    }
    .cat-subtitle {
      color: #a0aec0;
      font-size: 0.78rem;
      margin: 0;
    }
    .cat-scroll-area {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 0.85rem 1rem 1.5rem;
      -webkit-overflow-scrolling: touch;
    }
    .cat-scroll-area::-webkit-scrollbar { width: 3px; }
    .cat-scroll-area::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 2px;
    }
    .category-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }
    .cat-tile {
      background: rgba(255,255,255,0.06);
      border: 1.5px solid rgba(255,255,255,0.10);
      border-radius: 14px;
      padding: 1rem 0.6rem;
      cursor: pointer;
      transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.3rem;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
    .cat-tile:active {
      transform: scale(0.96);
      box-shadow: 0 4px 16px rgba(0,0,0,.35);
      background: rgba(255,255,255,0.12);
    }
    .cat-tile--random {
      border-color: rgba(250, 204, 21, .55);
      background: rgba(250, 204, 21, .09);
    }
    .cat-tile--random:active {
      background: rgba(250, 204, 21, .2);
      box-shadow: 0 6px 20px rgba(250,204,21,.25);
    }
    .cat-tile--all {
      border-color: rgba(99, 179, 237, .55);
      background: rgba(99, 179, 237, .09);
    }
    .cat-tile--all:active {
      background: rgba(99, 179, 237, .2);
      box-shadow: 0 6px 20px rgba(99,179,237,.25);
    }
    .cat-icon {
      font-size: 1.8rem;
      line-height: 1;
    }
    .cat-name {
      font-size: 0.88rem;
      font-weight: 700;
      color: #fff;
      line-height: 1.2;
    }
    .cat-desc {
      font-size: 0.7rem;
      color: #a0aec0;
    }
  `]
})
export class CategoryComponent {
  private gameService = inject(GameService);
  private wordsService = inject(WordsService);
  private languageService = inject(LanguageService);
  private router = inject(Router);

  t = this.languageService.t;

  translateCategory(cat: string): string {
    const key = `cat_${cat.replace(/\s+/g, '_')}` as any;
    return this.t()(key) || cat;
  }

  // Use live signal so custom categories appear too
  get categories() { return this.wordsService.allCategories(); }

  private categoryIcons: Record<string, string> = {
    'Nourriture': '🍕',
    'Nature': '🌿',
    'Animaux': '🐾',
    'Maison': '🏠',
    'Corps': '💪',
    'Mode': '👗',
    'Transport': '🚗',
    'Technologie': '💻',
    'Sports': '⚽',
    'Musique': '🎸',
    'Professions': '👷',
    'Lieux': '🗺️',
    'Émotions': '❤️',
    'Cinéma': '🎬',
    'Jeux': '🎲',
    'Histoire': '⚔️',
    'Science': '🔬',
    'Géographie': '🌍',
    'Art': '🎨',
    'Espace': '🚀',
    'Cuisine du Monde': '🌮',
    'Météo': '🌩️',
    'Adulte': '🔞',
  };

  icon(cat: string): string {
    return this.categoryIcons[cat] ?? '🃏';
  }

  async select(cat: string) {
    try { await Haptics.impact({ style: ImpactStyle.Medium }); } catch(e) {}

    let category: string | null;

    if (cat === '__all__') {
      // All categories — no filter
      category = null;
    } else if (cat === '__random__') {
      // Secretly pick ONE random category from the list
      const idx = Math.floor(Math.random() * CATEGORIES.length);
      category = CATEGORIES[idx];
    } else {
      // Specific category chosen
      category = cat;
    }

    this.gameService.startGame(category);
  }

  goBack() {
    // pendingMode is stored in the service — use it to restore mode param
    this.router.navigate(['/setup'], {
      queryParams: { mode: this.gameService.getPendingMode() }
    });
  }
}
