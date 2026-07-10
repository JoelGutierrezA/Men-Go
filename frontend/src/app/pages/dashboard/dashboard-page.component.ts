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
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuDraftService } from '@services/menu-draft.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
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
  protected readonly categoriesCount = this.menuDraftService.categoriesCount;
  protected readonly currentStep = signal<1 | 2>(1);
  protected readonly categoryName = signal('');
  protected readonly categoryError = signal('');
  protected readonly logoError = signal('');
  protected readonly stepError = signal('');
  protected readonly editorTitle = computed(() =>
    this.currentStep() === 1
      ? 'Etapa 1 - Identidad y categorias'
      : 'Etapa 2 - Estilo visual',
  );
  protected readonly fontOptions = [
    { label: 'Manrope', value: 'Manrope, sans-serif' },
    { label: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
  ];
  protected readonly previewInitial = computed(() => {
    const businessTitle = this.draft().businessTitle.trim();
    return businessTitle ? businessTitle.charAt(0).toUpperCase() : 'M';
  });
  protected readonly categoriesSummary = computed(() => {
    const total = this.categoriesCount();
    return total === 0
      ? 'Sin categorias creadas aun'
      : `${total} ${total === 1 ? 'categoria creada' : 'categorias creadas'}`;
  });
  protected readonly canContinueToStyle = computed(() => {
    const draft = this.draft();
    return draft.businessTitle.trim().length > 0 && draft.categories.length > 0;
  });
  protected readonly categoryTextColor = computed(() =>
    this.getReadableTextColor(this.draft().theme.categoryColor),
  );

  constructor() {
    effect(() => {
      const routeStep = (this.routeData()['step'] as 1 | 2 | undefined) ?? 1;

      if (routeStep === 2 && !this.canContinueToStyle()) {
        this.currentStep.set(1);
        this.stepError.set(
          'Primero agrega el nombre del negocio y al menos una categoria principal.',
        );
        queueMicrotask(() => {
          void this.router.navigate(['/panel/menu/identidad']);
        });
        return;
      }

      this.currentStep.set(routeStep);
    });
  }

  protected updateTitle(value: string): void {
    this.menuDraftService.updateTitle(value);
    this.stepError.set('');
  }

  protected updateCategoryName(value: string): void {
    this.categoryName.set(value);
    this.categoryError.set('');
  }

  protected addCategory(): void {
    const result = this.menuDraftService.addCategory(this.categoryName());

    if (!result.success) {
      this.categoryError.set(
        result.reason === 'duplicate'
          ? 'Esa categoria ya fue agregada.'
          : 'Ingresa un nombre de categoria.',
      );
      return;
    }

    this.categoryName.set('');
    this.categoryError.set('');
    this.stepError.set('');
  }

  protected removeCategory(categoryId: string): void {
    this.menuDraftService.removeCategory(categoryId);
  }

  protected removeLogo(): void {
    this.menuDraftService.clearLogo();
    this.logoError.set('');
  }

  protected handleLogoSelection(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const selectedFile = input?.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      this.logoError.set('Selecciona una imagen valida para el logo.');
      input.value = '';
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      this.logoError.set('El logo no debe superar 2 MB.');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;

      if (typeof result === 'string') {
        this.menuDraftService.setLogo(result);
        this.logoError.set('');
      }
    };
    reader.readAsDataURL(selectedFile);
    input.value = '';
  }

  protected goToStep(step: 1 | 2): void {
    if (step === 2 && !this.canContinueToStyle()) {
      this.stepError.set(
        'Primero agrega el nombre del negocio y al menos una categoria principal.',
      );
      return;
    }

    this.stepError.set('');
    void this.router.navigate([
      step === 1 ? '/panel/menu/identidad' : '/panel/menu/estilo',
    ]);
  }

  protected updateThemeColor(
    key: 'backgroundColor' | 'categoryColor' | 'titleColor' | 'textColor',
    value: string,
  ): void {
    this.menuDraftService.updateTheme({ [key]: value });
  }

  protected updateThemeNumber(
    key: 'titleFontSize' | 'bodyFontSize',
    value: string,
  ): void {
    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue)) {
      return;
    }

    this.menuDraftService.updateTheme({ [key]: parsedValue });
  }

  protected updateFontFamily(value: string): void {
    this.menuDraftService.updateTheme({ fontFamily: value });
  }

  protected toggleTitleBold(): void {
    this.menuDraftService.updateTheme({
      titleBold: !this.draft().theme.titleBold,
    });
  }

  protected toggleTitleItalic(): void {
    this.menuDraftService.updateTheme({
      titleItalic: !this.draft().theme.titleItalic,
    });
  }

  private getReadableTextColor(backgroundColor: string): string {
    const cleanHex = backgroundColor.replace('#', '');

    if (cleanHex.length !== 6) {
      return '#ffffff';
    }

    const red = Number.parseInt(cleanHex.slice(0, 2), 16);
    const green = Number.parseInt(cleanHex.slice(2, 4), 16);
    const blue = Number.parseInt(cleanHex.slice(4, 6), 16);
    const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

    return brightness > 160 ? '#1f2a24' : '#ffffff';
  }
}
