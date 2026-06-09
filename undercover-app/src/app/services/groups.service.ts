import { Injectable, signal } from '@angular/core';
import { PlayerGroup } from '../models/game.models';

@Injectable({ providedIn: 'root' })
export class GroupsService {
  private readonly STORAGE_KEY = 'undercover_groups';
  groups = signal<PlayerGroup[]>(this.loadFromStorage());

  create(name: string, players: string[]): void {
    const group: PlayerGroup = {
      id: Date.now().toString(),
      name: name.trim(),
      players: players.map(p => p.trim()).filter(p => p.length > 0)
    };
    const updated = [...this.groups(), group];
    this.groups.set(updated);
    this.persist(updated);
  }

  update(id: string, name: string, players: string[]): void {
    const updated = this.groups().map(g =>
      g.id === id
        ? { id, name: name.trim(), players: players.map(p => p.trim()).filter(p => p.length > 0) }
        : g
    );
    this.groups.set(updated);
    this.persist(updated);
  }

  delete(id: string): void {
    const updated = this.groups().filter(g => g.id !== id);
    this.groups.set(updated);
    this.persist(updated);
  }

  private loadFromStorage(): PlayerGroup[] {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  private persist(groups: PlayerGroup[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(groups));
  }
}
