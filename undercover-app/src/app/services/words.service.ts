import { Injectable, signal, computed, inject } from '@angular/core';
import { WORD_PAIRS, WORD_PAIRS_EN, CATEGORIES, WordPair } from '../data/words.data';
import { LanguageService } from './language.service';

const STORAGE_KEY = 'undercover_custom_words';
const STORAGE_CAT_KEY = 'undercover_custom_categories';
const STORAGE_DEL_CAT_KEY = 'undercover_deleted_categories';
const STORAGE_DEL_PAIR_KEY = 'undercover_deleted_pairs';

@Injectable({ providedIn: 'root' })
export class WordsService {

  private languageService = inject(LanguageService);

  // Custom pairs & categories from localStorage
  private customPairs = signal<WordPair[]>(this.loadPairs());
  private customCategories = signal<string[]>(this.loadCategories());

  // Deleted built-in categories & pairs (category:civilian)
  private deletedCategories = signal<string[]>(this.loadDeletedCategories());
  private deletedPairs = signal<string[]>(this.loadDeletedPairs());

  // ── Public computed signals ──────────────────────────────────────────

  /** All active categories: built-in + custom minus deleted */
  allCategories = computed<string[]>(() => {
    const combined = [...CATEGORIES, ...this.customCategories()];
    const unique = Array.from(new Set(combined));
    const deleted = this.deletedCategories();
    return unique.filter(c => !deleted.includes(c));
  });

  /** All active word pairs: built-in + custom minus deleted */
  allWordPairs = computed<WordPair[]>(() => {
    const isEn = this.languageService.language() === 'en';
    const basePairs = isEn ? WORD_PAIRS_EN : WORD_PAIRS;
    const combined = [...basePairs, ...this.customPairs()];
    const deletedCats = this.deletedCategories();
    const deletedP = this.deletedPairs();
    return combined.filter(p => 
      !deletedCats.includes(p.category) && 
      !deletedP.includes(`${p.category}:${p.civilian}`)
    );
  });

  /** Whether a category is built-in - not used for locking anymore */
  isBuiltInCategory(cat: string): boolean {
    return false;
  }

  /** Whether a pair is built-in - not used for locking anymore */
  isBuiltInPair(civilian: string, category: string): boolean {
    return false;
  }

  /** Get pairs for a given category */
  pairsForCategory(cat: string): WordPair[] {
    return this.allWordPairs().filter(p => p.category === cat);
  }

  // ── Mutations ────────────────────────────────────────────────────────

  addPair(pair: WordPair): void {
    const key = `${pair.category}:${pair.civilian}`;
    
    // If it was deleted, restore it
    if (this.deletedPairs().includes(key)) {
      const updatedDeleted = this.deletedPairs().filter(k => k !== key);
      this.deletedPairs.set(updatedDeleted);
      this.saveDeletedPairs(updatedDeleted);
      return;
    }

    const current = this.customPairs();
    if (current.some(p => p.civilian === pair.civilian && p.category === pair.category)) return;
    const updated = [...current, pair];
    this.customPairs.set(updated);
    this.savePairs(updated);
  }

  removePair(civilian: string, category: string): void {
    const isBuiltIn = WORD_PAIRS.some(
      p => p.civilian.toLowerCase() === civilian.toLowerCase() && 
           p.category.toLowerCase() === category.toLowerCase()
    );

    if (isBuiltIn) {
      // Find the exact built-in case-matching name
      const exactBuiltIn = WORD_PAIRS.find(
        p => p.civilian.toLowerCase() === civilian.toLowerCase() && 
             p.category.toLowerCase() === category.toLowerCase()
      );
      const exactCiv = exactBuiltIn ? exactBuiltIn.civilian : civilian;
      const exactCat = exactBuiltIn ? exactBuiltIn.category : category;
      const key = `${exactCat}:${exactCiv}`;

      if (!this.deletedPairs().includes(key)) {
        const updatedDeleted = [...this.deletedPairs(), key];
        this.deletedPairs.set(updatedDeleted);
        this.saveDeletedPairs(updatedDeleted);
      }
    } else {
      const updated = this.customPairs().filter(
        p => !(p.civilian.toLowerCase() === civilian.toLowerCase() && 
               p.category.toLowerCase() === category.toLowerCase())
      );
      this.customPairs.set(updated);
      this.savePairs(updated);
    }
  }

  addCategory(name: string): void {
    const trimmed = name.trim();
    if (!trimmed) return;

    // If it was deleted, restore it
    if (this.deletedCategories().includes(trimmed)) {
      const updatedDeleted = this.deletedCategories().filter(c => c !== trimmed);
      this.deletedCategories.set(updatedDeleted);
      this.saveDeletedCategories(updatedDeleted);
      return;
    }

    if (this.allCategories().includes(trimmed)) return;
    const updated = [...this.customCategories(), trimmed];
    this.customCategories.set(updated);
    this.saveCategories(updated);
  }

  removeCategory(name: string): void {
    const isBuiltIn = CATEGORIES.includes(name);

    if (isBuiltIn) {
      if (!this.deletedCategories().includes(name)) {
        const updatedDeleted = [...this.deletedCategories(), name];
        this.deletedCategories.set(updatedDeleted);
        this.saveDeletedCategories(updatedDeleted);
      }
    } else {
      const updatedCats = this.customCategories().filter(c => c !== name);
      this.customCategories.set(updatedCats);
      this.saveCategories(updatedCats);
      
      // Remove all custom pairs in this category
      const updatedPairs = this.customPairs().filter(p => p.category !== name);
      this.customPairs.set(updatedPairs);
      this.savePairs(updatedPairs);
    }
  }

  // ── Storage helpers ─────────────────────────────────────────────────

  private loadPairs(): WordPair[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  private savePairs(pairs: WordPair[]): void {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(pairs)); } catch {}
  }

  private loadCategories(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_CAT_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  private saveCategories(cats: string[]): void {
    try { localStorage.setItem(STORAGE_CAT_KEY, JSON.stringify(cats)); } catch {}
  }

  private loadDeletedCategories(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_DEL_CAT_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  private saveDeletedCategories(cats: string[]): void {
    try { localStorage.setItem(STORAGE_DEL_CAT_KEY, JSON.stringify(cats)); } catch {}
  }

  private loadDeletedPairs(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_DEL_PAIR_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  private saveDeletedPairs(pairs: string[]): void {
    try { localStorage.setItem(STORAGE_DEL_PAIR_KEY, JSON.stringify(pairs)); } catch {}
  }
}
