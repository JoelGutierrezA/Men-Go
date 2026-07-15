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

type MenuStep = 1 | 2 | 3;

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
  protected readonly productsCount = this.menuDraftService.productsCount;
  protected readonly currentStep = signal<MenuStep>(1);
  protected readonly categoryName = signal('');
  protected readonly selectedCategoryId = signal('');
  protected readonly productName = signal('');
  protected readonly productDescription = signal('');
  protected readonly productPrice = signal('');
  protected readonly productImageDataUrl = signal<string | null>(null);
  protected readonly categoryError = signal('');
  protected readonly logoError = signal('');
  protected readonly productError = signal('');
  protected readonly productImageError = signal('');
  protected readonly stepError = signal('');
  protected readonly editorTitle = computed(() => {
    switch (this.currentStep()) {
      case 1:
        return '1 Identidad';
      case 2:
        return '2 Estilo';
      case 3:
        return '3 Productos';
    }
  });
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
  protected readonly productsSummary = computed(() => {
    const total = this.productsCount();
    return total === 0
      ? 'Sin productos agregados aun'
      : `${total} ${total === 1 ? 'producto agregado' : 'productos agregados'}`;
  });
  protected readonly selectedCategory = computed(() =>
    this.draft().categories.find(
      (category) => category.id === this.selectedCategoryId(),
    ),
  );
  protected readonly canContinueToStyle = computed(() => {
    const draft = this.draft();
    return draft.businessTitle.trim().length > 0 && draft.categories.length > 0;
  });
  protected readonly categoryTextColor = computed(() =>
    this.getReadableTextColor(this.draft().theme.categoryColor),
  );

  constructor() {
    effect(() => {
      const routeStep = (this.routeData()['step'] as MenuStep | undefined) ?? 1;

      if (routeStep !== 1 && !this.canContinueToStyle()) {
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

    effect(() => {
      const categories = this.draft().categories;

      if (categories.length === 0) {
        this.selectedCategoryId.set('');
        return;
      }

      const selectedId = this.selectedCategoryId();
      const selectedExists = categories.some((category) => category.id === selectedId);

      if (!selectedId || !selectedExists) {
        this.selectedCategoryId.set(categories[0].id);
      }
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

  protected updateSelectedCategory(categoryId: string): void {
    this.selectedCategoryId.set(categoryId);
    this.productError.set('');
  }

  protected updateProductName(value: string): void {
    this.productName.set(value);
    this.productError.set('');
  }

  protected updateProductDescription(value: string): void {
    this.productDescription.set(value);
  }

  protected updateProductPrice(value: string): void {
    this.productPrice.set(value);
    this.productError.set('');
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

  protected handleProductImageSelection(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const selectedFile = input?.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      this.productImageError.set('Selecciona una imagen valida para el producto.');
      input.value = '';
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      this.productImageError.set('La imagen del producto no debe superar 2 MB.');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;

      if (typeof result === 'string') {
        this.productImageDataUrl.set(result);
        this.productImageError.set('');
      }
    };
    reader.readAsDataURL(selectedFile);
    input.value = '';
  }

  protected removePendingProductImage(): void {
    this.productImageDataUrl.set(null);
    this.productImageError.set('');
  }

  protected addProduct(): void {
    const result = this.menuDraftService.addProduct(this.selectedCategoryId(), {
      name: this.productName(),
      description: this.productDescription(),
      price: this.productPrice(),
      imageDataUrl: this.productImageDataUrl(),
    });

    if (!result.success) {
      const errors = {
        category: 'Selecciona una categoria para este producto.',
        name: 'Ingresa el nombre del producto.',
        price: 'Ingresa el valor del producto.',
      };
      this.productError.set(errors[result.reason ?? 'name']);
      return;
    }

    this.productName.set('');
    this.productDescription.set('');
    this.productPrice.set('');
    this.productImageDataUrl.set(null);
    this.productError.set('');
    this.productImageError.set('');
  }

  protected removeProduct(categoryId: string, productId: string): void {
    this.menuDraftService.removeProduct(categoryId, productId);
  }

  protected goToStep(step: MenuStep): void {
    if (step !== 1 && !this.canContinueToStyle()) {
      this.stepError.set(
        'Primero agrega el nombre del negocio y al menos una categoria principal.',
      );
      return;
    }

    this.stepError.set('');
    const stepRoutes: Record<MenuStep, string> = {
      1: '/panel/menu/identidad',
      2: '/panel/menu/estilo',
      3: '/panel/menu/productos',
    };
    void this.router.navigate([stepRoutes[step]]);
  }

  protected updateThemeColor(
    key:
      | 'backgroundColor'
      | 'categoryColor'
      | 'titleColor'
      | 'textColor'
      | 'productNameColor'
      | 'productDescriptionColor'
      | 'productPriceColor',
    value: string,
  ): void {
    this.menuDraftService.updateTheme({ [key]: value });
  }

  protected updateThemeNumber(
    key: 'titleFontSize' | 'bodyFontSize' | 'productFontSize',
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

  protected updateProductFontFamily(value: string): void {
    this.menuDraftService.updateTheme({ productFontFamily: value });
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

  protected toggleProductNameBold(): void {
    this.menuDraftService.updateTheme({
      productNameBold: !this.draft().theme.productNameBold,
    });
  }

  protected toggleProductNameItalic(): void {
    this.menuDraftService.updateTheme({
      productNameItalic: !this.draft().theme.productNameItalic,
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
