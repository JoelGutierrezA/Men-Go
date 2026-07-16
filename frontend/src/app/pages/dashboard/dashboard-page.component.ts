import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { BusinessStepComponent } from './components/business-step/business-step.component';
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
    BusinessStepComponent,
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
  protected readonly currentStep = signal<MenuBuilderStep>(1);
  protected readonly previewCollapsed = signal(false);
  protected readonly previewExpanded = signal(false);
  protected readonly validationError = signal('');
  protected readonly steps = menuBuilderSteps;
  protected readonly currentStepConfig = computed(() =>
    getMenuBuilderStep(this.currentStep()),
  );
  protected readonly progressLabel = computed(
    () => `${this.currentStep()} de ${this.steps.length}`,
  );

  constructor() {
    effect(() => {
      const routeStep = (this.routeData()['step'] as MenuBuilderStep | undefined) ?? 1;
      this.currentStep.set(routeStep);
      this.validationError.set('');
    });
  }

  protected goBack(): void {
    const previousStep = Math.max(1, this.currentStep() - 1) as MenuBuilderStep;
    this.goToStep(previousStep);
  }

  protected goNext(): void {
    if (!this.validateCurrentStep()) {
      return;
    }

    const nextStep = Math.min(this.steps.length, this.currentStep() + 1) as MenuBuilderStep;
    this.goToStep(nextStep);
  }

  protected goToStep(step: MenuBuilderStep): void {
    const stepConfig = getMenuBuilderStep(step);
    this.validationError.set('');
    void this.router.navigate([stepConfig.route]);
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

    if (this.currentStep() === 1 && !draft.businessTitle.trim()) {
      this.validationError.set('Ingresa el nombre del negocio para continuar.');
      return false;
    }

    if (this.currentStep() === 2 && draft.categories.length === 0) {
      this.validationError.set('Crea al menos una categoría para continuar.');
      return false;
    }

    this.validationError.set('');
    return true;
  }
}
