import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

export interface LandingHeroSlide {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly ctaLabel: string;
  readonly ctaRoute: string;
  readonly imageAlt: string;
  readonly imageUrl?: string;
  readonly mockType: 'promotions' | 'plans' | 'dashboard';
  readonly badge?: string;
}

@Component({
  selector: 'app-landing-hero-carousel',
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './landing-hero-carousel.component.html',
  styleUrl: './landing-hero-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingHeroCarouselComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly autoplayDelayMs = 7500;
  private autoplayHandle: number | null = null;
  private paused = false;

  readonly slides = input.required<readonly LandingHeroSlide[]>();

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

  protected handleArrowKey(event: KeyboardEvent, step: number): void {
    event.preventDefault();
    this.advanceBy(step);
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
    if (
      this.paused ||
      this.autoplayHandle !== null ||
      this.slides().length < 2 ||
      this.prefersReducedMotion()
    ) {
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

  private prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
