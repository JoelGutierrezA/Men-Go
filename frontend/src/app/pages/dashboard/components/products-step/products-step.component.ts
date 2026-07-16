import { ChangeDetectionStrategy, Component, effect, inject, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MenuDraftService } from '@services/menu-draft.service';
import { getMenuBuilderStep } from '../../menu-builder.config';

@Component({
  selector: 'app-products-step',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './products-step.component.html',
  styleUrl: '../menu-builder-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsStepComponent {
  private readonly menuDraftService = inject(MenuDraftService);

  readonly backRequested = output<void>();
  readonly continueRequested = output<void>();

  protected readonly draft = this.menuDraftService.draft;
  protected readonly stepConfig = getMenuBuilderStep(3);
  protected readonly selectedCategoryId = signal('');
  protected readonly productName = signal('');
  protected readonly productDescription = signal('');
  protected readonly productPrice = signal('');
  protected readonly productImageDataUrl = signal<string | null>(null);
  protected readonly productError = signal('');
  protected readonly productImageError = signal('');
  protected readonly editingProductId = signal('');
  protected readonly editingOriginalCategoryId = signal('');
  protected readonly editingCategoryId = signal('');
  protected readonly editingProductName = signal('');
  protected readonly editingProductDescription = signal('');
  protected readonly editingProductPrice = signal('');

  constructor() {
    effect(() => {
      const categories = this.draft().categories;

      if (categories.length === 0) {
        this.selectedCategoryId.set('');
        return;
      }

      const selectedExists = categories.some(
        (category) => category.id === this.selectedCategoryId(),
      );

      if (!this.selectedCategoryId() || !selectedExists) {
        this.selectedCategoryId.set(categories[0].id);
      }
    });
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

  protected addProduct(): void {
    const result = this.menuDraftService.addProduct(this.selectedCategoryId(), {
      name: this.productName(),
      description: this.productDescription(),
      price: this.parsePrice(this.productPrice()),
      imageDataUrl: this.productImageDataUrl(),
      visible: true,
      available: true,
    });

    if (!result.success) {
      const errors = {
        category: 'Selecciona una categoría para este producto.',
        name: 'Ingresa el nombre del producto.',
        price: 'Ingresa un precio válido en pesos chilenos.',
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

  protected handleProductImageSelection(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const selectedFile = input?.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      this.productImageError.set('Selecciona una imagen válida para el producto.');
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

  protected startEditing(
    categoryId: string,
    productId: string,
    productName: string,
    productDescription: string,
    productPrice: number | null,
  ): void {
    this.editingOriginalCategoryId.set(categoryId);
    this.editingCategoryId.set(categoryId);
    this.editingProductId.set(productId);
    this.editingProductName.set(productName);
    this.editingProductDescription.set(productDescription);
    this.editingProductPrice.set(productPrice === null ? '' : String(productPrice));
  }

  protected cancelEditing(): void {
    this.editingOriginalCategoryId.set('');
    this.editingCategoryId.set('');
    this.editingProductId.set('');
  }

  protected saveEditing(): void {
    const price = this.parsePrice(this.editingProductPrice());

    if (price === null) {
      this.productError.set('Ingresa un precio válido en pesos chilenos.');
      return;
    }

    this.menuDraftService.updateProduct(this.editingOriginalCategoryId(), this.editingProductId(), {
      categoryId: this.editingCategoryId(),
      name: this.editingProductName(),
      description: this.editingProductDescription(),
      price,
    });
    this.cancelEditing();
  }

  protected duplicateProduct(categoryId: string, productId: string): void {
    this.menuDraftService.duplicateProduct(categoryId, productId);
  }

  protected toggleProductVisibility(categoryId: string, productId: string): void {
    this.menuDraftService.toggleProductVisibility(categoryId, productId);
  }

  protected toggleProductAvailability(categoryId: string, productId: string): void {
    this.menuDraftService.toggleProductAvailability(categoryId, productId);
  }

  protected removeProduct(categoryId: string, productId: string): void {
    this.menuDraftService.removeProduct(categoryId, productId);
  }

  protected formatPrice(price: number | null): string {
    return this.menuDraftService.formatPrice(price);
  }

  protected updateEditingProductName(value: string): void {
    this.editingProductName.set(value);
  }

  protected updateEditingProductDescription(value: string): void {
    this.editingProductDescription.set(value);
  }

  protected updateEditingProductPrice(value: string): void {
    this.editingProductPrice.set(value);
  }

  protected updateEditingCategory(categoryId: string): void {
    this.editingCategoryId.set(categoryId);
  }

  private parsePrice(value: string): number | null {
    const parsedValue = Number(value);

    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
      return null;
    }

    return Math.round(parsedValue);
  }
}
