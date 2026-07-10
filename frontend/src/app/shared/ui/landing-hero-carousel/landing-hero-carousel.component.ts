import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface LandingHeroSlide {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly ctaLabel: string;
  readonly ctaTarget: string;
  readonly imageAlt: string;
  readonly imageUrl?: string;
  readonly mockType: 'menu' | 'qr' | 'dashboard';
}

@Component({
  selector: 'app-landing-hero-carousel',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './landing-hero-carousel.component.html',
  styleUrl: './landing-hero-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingHeroCarouselComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly autoplayDelayMs = 5000;
  private autoplayHandle: number | null = null;
  private paused = false;

  readonly slides = input.required<readonly LandingHeroSlide[]>();
  readonly sectionRequested = output<string>();

  protected readonly activeIndex = signal(0);

  constructor() {
    afterNextRender(() => {
      this.startAutoplay();
    });

    this.destroyRef.onDestroy(() => {
      this.stopAutoplay();
    });
  }

  protected previousSlide(): void {
    this.advanceBy(-1);
  }

  protected nextSlide(): void {
    this.advanceBy(1);
  }

  protected showSlide(index: number): void {
    const totalSlides = this.slides().length;

    if (!totalSlides) {
      return;
    }

    this.activeIndex.set((index + totalSlides) % totalSlides);
    this.restartAutoplay();
  }

  protected requestSection(sectionId: string): void {
    this.sectionRequested.emit(sectionId);
    this.restartAutoplay();
  }

  protected pauseAutoplay(): void {
    this.paused = true;
    this.stopAutoplay();
  }

  protected resumeAutoplay(): void {
    this.paused = false;
    this.startAutoplay();
  }

  protected handleFocusOut(event: FocusEvent): void {
    const currentTarget = event.currentTarget;
    const relatedTarget = event.relatedTarget;

    if (
      currentTarget instanceof HTMLElement &&
      relatedTarget instanceof Node &&
      currentTarget.contains(relatedTarget)
    ) {
      return;
    }

    this.resumeAutoplay();
  }

  private advanceBy(step: number): void {
    const totalSlides = this.slides().length;

    if (!totalSlides) {
      return;
    }

    this.activeIndex.update((currentIndex) => (currentIndex + step + totalSlides) % totalSlides);
    this.restartAutoplay();
  }

  private startAutoplay(): void {
    if (this.paused || this.autoplayHandle !== null || this.slides().length < 2) {
      return;
    }

    this.autoplayHandle = window.setInterval(() => {
      const totalSlides = this.slides().length;

      if (!totalSlides) {
        return;
      }

      this.activeIndex.update((currentIndex) => (currentIndex + 1) % totalSlides);
    }, this.autoplayDelayMs);
  }

  private stopAutoplay(): void {
    if (this.autoplayHandle === null) {
      return;
    }

    window.clearInterval(this.autoplayHandle);
    this.autoplayHandle = null;
  }

  private restartAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }
}
