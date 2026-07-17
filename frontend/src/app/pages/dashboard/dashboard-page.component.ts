import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuBuilderStep } from '@models/menu-draft.model';
import { MenuDraftService } from '@services/menu-draft.service';
import { CategoriesStepComponent } from './components/categories-step/categories-step.component';
import { DesignStepComponent } from './components/design-step/design-step.component';
import { MenuPreviewComponent } from './components/menu-preview/menu-preview.component';
import { ProductsStepComponent } from './components/products-step/products-step.component';
import { PublishStepComponent } from './components/publish-step/publish-step.component';
import { ReviewStepComponent } from './components/review-step/review-step.component';
import { getMenuBuilderStep, menuBuilderSteps } from './menu-builder.config';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    CategoriesStepComponent,
    DesignStepComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MenuPreviewComponent,
    ProductsStepComponent,
    PublishStepComponent,
    ReviewStepComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly menuDraftService = inject(MenuDraftService);
  private readonly router = inject(Router);
  private readonly routeData = toSignal(this.activatedRoute.data, {
    initialValue: this.activatedRoute.snapshot.data,
  });

  protected readonly draft = this.menuDraftService.draft;
  protected readonly currentStep = signal<MenuBuilderStep>(2);
  protected readonly previewCollapsed = signal(false);
  protected readonly previewExpanded = signal(false);
  protected readonly validationError = signal('');
  protected readonly steps = menuBuilderSteps;
  constructor() {
    effect(() => {
      const routeStep =
        (this.routeData()['step'] as MenuBuilderStep | undefined) ??
        this.steps[0].step;
      this.currentStep.set(routeStep);
      this.validationError.set('');
    });
  }

  protected goBack(): void {
    const currentIndex = this.currentStepIndex();

    if (currentIndex <= 0) {
      void this.router.navigate(['/panel/negocio/datos']);
      return;
    }

    this.goToStep(this.steps[currentIndex - 1].step);
  }

  protected goNext(): void {
    if (!this.validateCurrentStep()) {
      return;
    }

    const currentIndex = this.currentStepIndex();
    const nextStep =
      this.steps[Math.min(this.steps.length - 1, currentIndex + 1)].step;

    this.goToStep(nextStep);
  }

  protected goToStep(step: MenuBuilderStep): void {
    const stepConfig = getMenuBuilderStep(step);
    this.validationError.set('');
    void this.router.navigate([stepConfig.route]);
  }

  protected goToReviewTarget(target: MenuBuilderStep | 'business'): void {
    if (target === 'business') {
      void this.router.navigate(['/panel/negocio/datos']);
      return;
    }

    this.goToStep(target);
  }

  protected togglePreview(): void {
    this.previewCollapsed.update((isCollapsed) => !isCollapsed);
  }

  protected openLargePreview(): void {
    this.previewExpanded.set(true);
  }

  protected closeLargePreview(): void {
    this.previewExpanded.set(false);
  }

  private validateCurrentStep(): boolean {
    const draft = this.draft();

    if (this.currentStep() === 2 && draft.categories.length === 0) {
      this.validationError.set('Crea al menos una categoria para continuar.');
      return false;
    }

    this.validationError.set('');
    return true;
  }

  private currentStepIndex(): number {
    return Math.max(
      0,
      this.steps.findIndex((stepConfig) => stepConfig.step === this.currentStep()),
    );
  }
}
