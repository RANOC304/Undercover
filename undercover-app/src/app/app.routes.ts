import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'setup',
    loadComponent: () => import('./pages/setup/setup.component').then(m => m.SetupComponent)
  },
  {
    path: 'category',
    loadComponent: () => import('./pages/category/category.component').then(m => m.CategoryComponent)
  },
  {
    path: 'reveal',
    loadComponent: () => import('./pages/reveal/reveal.component').then(m => m.RevealComponent)
  },
  {
    path: 'wheel',
    loadComponent: () => import('./pages/wheel/wheel.component').then(m => m.WheelComponent)
  },
  {
    path: 'game-on',
    loadComponent: () => import('./pages/game-on/game-on.component').then(m => m.GameOnComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
