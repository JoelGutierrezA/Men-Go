import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MenuBuilderStep } from '@models/menu-draft.model';
import { MenuDraftService } from '@services/menu-draft.service';
import { getMenuBuilderStep } from '../../menu-builder.config';

type ReviewTarget = MenuBuilderStep | 'business';

interface ReviewItem {
  label: string;
  detail: string;
  status: 'ok' | 'warning' | 'error';
  targetStep: ReviewTarget;
}

@Component({
  selector: 'app-review-step',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './review-step.component.html',
  styleUrl: '../menu-builder-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewStepComponent {
  private readonly menuDraftService = inject(MenuDraftService);

  readonly backRequested = output<void>();
  readonly continueRequested = output<void>();
  readonly stepRequested = output<ReviewTarget>();

  protected readonly draft = this.menuDraftService.draft;
  protected readonly productsCount = this.menuDraftService.productsCount;
  protected readonly stepConfig = getMenuBuilderStep(5);
  protected readonly reviewItems = computed<ReviewItem[]>(() => {
    const draft = this.draft();
    const visibleEmptyCategories = draft.categories.filter(
      (category) => category.visible && category.products.length === 0,
    );
    const visibleProducts = draft.categories.flatMap((category) =>
      category.products.filter((product) => category.visible && product.visible),
    );
    const productsWithoutPrice = visibleProducts.filter(
      (product) => product.price === null,
    );

    return [
      {
        label: 'Nombre del negocio completado',
        detail: draft.businessTitle.trim()
          ? draft.businessTitle
          : 'Debes agregar el nombre del negocio.',
        status: draft.businessTitle.trim() ? 'ok' : 'error',
        targetStep: 'business',
      },
      {
        label: 'Logo agregado',
        detail: draft.logoDataUrl
          ? 'El menú tiene logo.'
          : 'Agrega un logo para fortalecer la identidad.',
        status: draft.logoDataUrl ? 'ok' : 'warning',
        targetStep: 'business',
      },
      {
        label: 'Ubicacion principal',
        detail: draft.headquartersAddress.trim()
          ? `${draft.branchCount} sucursal${draft.branchCount === 1 ? '' : 'es'} configurada${draft.branchCount === 1 ? '' : 's'}.`
          : 'Agrega la casa matriz o direccion principal para orientar a tus clientes.',
        status: draft.headquartersAddress.trim() ? 'ok' : 'warning',
        targetStep: 'business',
      },
      {
        label: 'Al menos una categoría creada',
        detail: draft.categories.length
          ? `${draft.categories.length} categorías creadas.`
          : 'Debes crear al menos una categoría.',
        status: draft.categories.length ? 'ok' : 'error',
        targetStep: 2,
      },
      {
        label: 'Al menos un producto creado',
        detail: this.menuDraftService.productsCount()
          ? `${this.menuDraftService.productsCount()} productos creados.`
          : 'Debes crear al menos un producto.',
        status: this.menuDraftService.productsCount() ? 'ok' : 'error',
        targetStep: 3,
      },
      {
        label: 'Productos visibles con precio',
        detail: productsWithoutPrice.length
          ? `${productsWithoutPrice.length} productos visibles no tienen precio.`
          : 'Los productos visibles tienen precio.',
        status: productsWithoutPrice.length ? 'error' : 'ok',
        targetStep: 3,
      },
      {
        label: 'Categorías visibles con productos',
        detail: visibleEmptyCategories.length
          ? `${visibleEmptyCategories.length} categorías visibles están vacías.`
          : 'No hay categorías visibles vacías.',
        status: visibleEmptyCategories.length ? 'warning' : 'ok',
        targetStep: 2,
      },
      {
        label: 'Diseño configurado',
        detail: `Plantilla ${draft.theme.template}.`,
        status: 'ok',
        targetStep: 4,
      },
    ];
  });
  protected readonly hasBlockingErrors = computed(() =>
    this.reviewItems().some((item) => item.status === 'error'),
  );

  protected iconFor(status: ReviewItem['status']): string {
    const icons = {
      ok: 'check_circle',
      warning: 'warning',
      error: 'error',
    };

    return icons[status];
  }
}
