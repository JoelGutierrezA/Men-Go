import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MenuDraftService } from '@services/menu-draft.service';

@Component({
  selector: 'app-menu-preview',
  imports: [MatIconModule],
  templateUrl: './menu-preview.component.html',
  styleUrl: './menu-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuPreviewComponent {
  private readonly menuDraftService = inject(MenuDraftService);

  protected readonly draft = this.menuDraftService.draft;
  protected readonly previewInitial = computed(() => {
    const businessTitle = this.draft().businessTitle.trim();
    return businessTitle ? businessTitle.charAt(0).toUpperCase() : 'M';
  });
  protected readonly visibleCategories = computed(() =>
    this.draft().categories.filter((category) => category.visible),
  );
  protected readonly categoriesSummary = computed(() => {
    const total = this.visibleCategories().length;
    return total === 0
      ? 'Sin categorías visibles'
      : `${total} ${total === 1 ? 'categoría visible' : 'categorías visibles'}`;
  });
  protected readonly categoryTextColor = computed(() =>
    this.getReadableTextColor(this.draft().theme.categoryColor),
  );

  protected formatPrice(price: number | null): string {
    return this.menuDraftService.formatPrice(price);
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
