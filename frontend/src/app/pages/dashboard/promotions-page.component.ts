import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MenuPromotionDay } from '@models/menu-draft.model';
import { MenuDraftService } from '@services/menu-draft.service';

interface PromotionDayOption {
  value: MenuPromotionDay;
  label: string;
  shortLabel: string;
}

@Component({
  selector: 'app-promotions-page',
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './promotions-page.component.html',
  styleUrls: [
    './dashboard-page.component.scss',
    './components/menu-builder-step.scss',
    './promotions-page.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionsPageComponent {
  private readonly menuDraftService = inject(MenuDraftService);

  protected readonly draft = this.menuDraftService.draft;
  protected readonly promotionName = signal('');
  protected readonly selectedCategoryIds = signal<string[]>([]);
  protected readonly discountPercent = signal('10');
  protected readonly selectedDays = signal<MenuPromotionDay[]>([
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
  ]);
  protected readonly startTime = signal('17:00');
  protected readonly endTime = signal('19:00');
  protected readonly promotionError = signal('');
  protected readonly activePromotionsCount = this.menuDraftService.activePromotionsCount;
  protected readonly dayOptions: PromotionDayOption[] = [
    { value: 'monday', label: 'Lunes', shortLabel: 'Lun' },
    { value: 'tuesday', label: 'Martes', shortLabel: 'Mar' },
    { value: 'wednesday', label: 'Miércoles', shortLabel: 'Mié' },
    { value: 'thursday', label: 'Jueves', shortLabel: 'Jue' },
    { value: 'friday', label: 'Viernes', shortLabel: 'Vie' },
    { value: 'saturday', label: 'Sábado', shortLabel: 'Sáb' },
    { value: 'sunday', label: 'Domingo', shortLabel: 'Dom' },
  ];
  protected readonly hasCategories = computed(() => this.draft().categories.length > 0);

  protected updatePromotionName(value: string): void {
    this.promotionName.set(value);
    this.promotionError.set('');
  }

  protected updateSelectedCategories(categoryIds: string[]): void {
    this.selectedCategoryIds.set(categoryIds);
    this.promotionError.set('');
  }

  protected updateDiscountPercent(value: string): void {
    this.discountPercent.set(value);
    this.promotionError.set('');
  }

  protected updateStartTime(value: string): void {
    this.startTime.set(value);
    this.promotionError.set('');
  }

  protected updateEndTime(value: string): void {
    this.endTime.set(value);
    this.promotionError.set('');
  }

  protected toggleDay(day: MenuPromotionDay, checked: boolean): void {
    this.selectedDays.update((days) =>
      checked ? Array.from(new Set([...days, day])) : days.filter((item) => item !== day),
    );
    this.promotionError.set('');
  }

  protected addPromotion(): void {
    const result = this.menuDraftService.addPromotion({
      name: this.promotionName(),
      categoryIds: this.selectedCategoryIds(),
      discountPercent: Number(this.discountPercent()),
      days: this.selectedDays(),
      startTime: this.startTime(),
      endTime: this.endTime(),
      active: true,
    });

    if (!result.success) {
      const errors = {
        name: 'Agrega un nombre para la promoción.',
        category: 'Selecciona al menos una categoría.',
        discount: 'El descuento debe estar entre 1% y 100%.',
        schedule: 'Selecciona días y un horario válido.',
      };
      this.promotionError.set(errors[result.reason ?? 'name']);
      return;
    }

    this.promotionName.set('');
    this.selectedCategoryIds.set([]);
    this.discountPercent.set('10');
    this.promotionError.set('');
  }

  protected togglePromotionActive(promotionId: string): void {
    this.menuDraftService.togglePromotionActive(promotionId);
  }

  protected removePromotion(promotionId: string): void {
    this.menuDraftService.removePromotion(promotionId);
  }

  protected categoryNames(categoryIds: string[]): string {
    const names = this.draft()
      .categories.filter((category) => categoryIds.includes(category.id))
      .map((category) => category.name);

    return names.length ? names.join(', ') : 'Categorías no disponibles';
  }

  protected daysSummary(days: MenuPromotionDay[]): string {
    return this.dayOptions
      .filter((dayOption) => days.includes(dayOption.value))
      .map((dayOption) => dayOption.shortLabel)
      .join(', ');
  }
}
