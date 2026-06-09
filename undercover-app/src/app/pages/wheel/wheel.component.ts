import { Component, inject, signal, computed, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { LanguageService } from '../../services/language.service';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

type WheelState = 'idle' | 'spinning' | 'stopped';

@Component({
  selector: 'app-wheel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container fade-in">
      <div class="glass-panel text-center wheel-card">
        
        <p class="subtitle mb-2">{{ t()('wheel_title') }}</p>
        
        <!-- Winner Announcement -->
        <div class="winner-announcement" [class.show]="currentState() === 'stopped'">
          <h1 class="winner-title">{{ t()('wheel_winner_header') }}</h1>
          <h2 class="winner-name glow-text">{{ startingPlayerName() }}</h2>
          <p class="winner-desc">{{ t()('wheel_winner_suffix') }}</p>
        </div>

        <!-- Spin Wheel Canvas Container -->
        <div class="wheel-outer-wrapper">
          <!-- Neon Pointer indicator -->
          <div class="wheel-pointer" [class.wiggle]="currentState() === 'spinning'"></div>
          
          <div class="wheel-canvas-container" #wheelContainer>
            <canvas #wheelCanvas class="wheel-canvas"></canvas>
          </div>
        </div>

        <!-- Actions -->
        <div class="action-container">
          <button 
            *ngIf="currentState() === 'idle'" 
            class="btn btn-primary lg-btn spin-btn glow-button" 
            (click)="spin()"
          >
            {{ t()('wheel_spin_btn') }}
          </button>
          
          <button 
            *ngIf="currentState() === 'spinning'" 
            class="btn btn-outline lg-btn disabled-btn" 
            disabled
          >
            {{ t()('wheel_spinning') }}
          </button>
          
          <button 
            *ngIf="currentState() === 'stopped'" 
            class="btn btn-primary lg-btn start-game-btn" 
            (click)="startGame()"
          >
            {{ t()('wheel_start_game') }}
          </button>
        </div>

      </div>
    </div>
  `,
  styleUrl: './wheel.component.scss'
})
export class WheelComponent implements AfterViewInit, OnDestroy {
  private gameService = inject(GameService);
  private languageService = inject(LanguageService);
  private router = inject(Router);

  t = this.languageService.t;

  @ViewChild('wheelCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('wheelContainer') containerRef!: ElementRef<HTMLDivElement>;

  currentState = signal<WheelState>('idle');

  // Load from GameService
  players = this.gameService.players;
  startingPlayerName = computed(() => this.gameService.gameState().startingPlayerName || '');

  private animationFrameId: number | null = null;
  private lastTickedSliceIndex: number = -1;

  // Vibrant neon color palette
  private colors = [
    '#7C3AED', // Violet
    '#06B6D4', // Cyan
    '#EC4899', // Pink
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#14B8A6'  // Teal
  ];

  ngAfterViewInit() {
    this.drawWheel();
    // Watch resize to keep canvas sharp
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize);
    this.stopTickingLoop();
  }

  private onResize = () => {
    this.drawWheel();
  };

  private drawWheel() {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get wrapper dimensions (responsive size)
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set internal canvas dimensions scaled for high DPI screens
    const size = Math.min(rect.width, rect.height, 320); // cap max size nicely
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    
    // Scale context back to normal coordinates
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 8;
    const totalPlayers = this.players().length;
    const angleSlice = (2 * Math.PI) / totalPlayers;

    ctx.clearRect(0, 0, size, size);

    for (let i = 0; i < totalPlayers; i++) {
      const startAngle = i * angleSlice;
      const endAngle = (i + 1) * angleSlice;

      // 1. Draw Slice sector
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = this.colors[i % this.colors.length];
      ctx.fill();

      // 2. Slice separation border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 3. Draw Player Name
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + angleSlice / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
      
      // Select font size based on slice count to fit
      const fontSize = totalPlayers > 10 ? 11 : (totalPlayers > 6 ? 13 : 15);
      ctx.font = `bold ${fontSize}px "Inter", system-ui, -apple-system, sans-serif`;
      
      // Shadow for text contrast
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Truncate player name if it's too long for the slice
      let name = this.players()[i].name;
      const maxTextWidth = radius - 35;
      if (ctx.measureText(name).width > maxTextWidth) {
        while (ctx.measureText(name + '...').width > maxTextWidth && name.length > 0) {
          name = name.slice(0, -1);
        }
        name += '...';
      }

      ctx.fillText(name, radius - 20, 0);
      ctx.restore();
    }

    // 4. Draw Center Cap (Neon hub)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 24, 0, 2 * Math.PI);
    ctx.fillStyle = '#0A0E1A';
    ctx.strokeStyle = '#06B6D4'; // cyan border
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    // Small inner glow ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#7C3AED'; // violet center dot
    ctx.fill();
  }

  async spin() {
    if (this.currentState() !== 'idle') return;

    this.currentState.set('spinning');

    const totalPlayers = this.players().length;
    const targetName = this.startingPlayerName();
    const targetIndex = this.players().findIndex(p => p.name === targetName);
    
    // Fallback if targetName is missing/wrong
    const finalTargetIndex = targetIndex >= 0 ? targetIndex : 0;

    // Physics calculations
    const spins = 6; // number of full spins
    const sliceDeg = 360 / totalPlayers;
    
    // land in the middle of the target player's slice
    const targetAngle = spins * 360 + 270 - (finalTargetIndex + 0.5) * sliceDeg;

    const container = this.containerRef.nativeElement;
    
    // Set transition parameters
    container.style.transition = 'transform 4.5s cubic-bezier(0.15, 0.85, 0.2, 1)';
    container.style.transform = `rotate(${targetAngle}deg)`;

    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch(e) {}

    // Start real-time tracking for sound/haptic ticks
    this.lastTickedSliceIndex = -1;
    this.startTickingLoop(container, totalPlayers);

    // Stop and celebrate on completion
    setTimeout(async () => {
      this.stopTickingLoop();
      this.currentState.set('stopped');
      try {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      } catch(e) {}
    }, 4500);
  }

  private startTickingLoop(element: HTMLDivElement, totalPlayers: number) {
    const sliceDeg = 360 / totalPlayers;

    const tick = () => {
      const computedStyle = window.getComputedStyle(element);
      const transform = computedStyle.transform;

      if (transform && transform !== 'none') {
        const values = transform.split('(')[1].split(')')[0].split(',');
        const a = parseFloat(values[0]);
        const b = parseFloat(values[1]);
        
        let currentAngle = Math.atan2(b, a) * (180 / Math.PI);
        if (currentAngle < 0) currentAngle += 360;

        // Calculate which slice index is currently passing the 12 o'clock marker (which is at 270 degrees)
        // Since the wheel is rotated by 'currentAngle', the static point on the wheel pointing to 12 o'clock
        // is (270 - currentAngle) modulo 360.
        let pointingAngle = (270 - currentAngle) % 360;
        if (pointingAngle < 0) pointingAngle += 360;

        const currentSliceIndex = Math.floor(pointingAngle / sliceDeg);

        if (currentSliceIndex !== this.lastTickedSliceIndex) {
          this.lastTickedSliceIndex = currentSliceIndex;
          this.triggerTickHaptic();
        }
      }

      this.animationFrameId = requestAnimationFrame(tick);
    };

    this.animationFrameId = requestAnimationFrame(tick);
  }

  private stopTickingLoop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private async triggerTickHaptic() {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch(e) {}
  }

  startGame() {
    this.router.navigate(['/game-on']);
  }
}
