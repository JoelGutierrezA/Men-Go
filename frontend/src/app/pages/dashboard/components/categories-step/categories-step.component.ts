import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MenuDraftService } from '@services/menu-draft.service';
import { getMenuBuilderStep } from '../../menu-builder.config';

@Component({
  selector: 'app-categories-step',
  imports: [
    DragDropModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './categories-step.component.html',
  styleUrl: '../menu-builder-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesStepComponent {
  private readonly menuDraftService = inject(MenuDraftService);

  readonly backRequested = output<void>();
  readonly continueRequested = output<void>();

  protected readonly draft = this.menuDraftService.draft;
  protected readonly stepConfig = getMenuBuilderStep(2);
  protected readonly categoryName = signal('');
  protected readonly categoryError = signal('');
  protected readonly editingCategoryId = signal('');
  protected readonly editingCategoryName = signal('');

  protected updateCategoryName(value: string): void {
    this.categoryName.set(value);
    this.categoryError.set('');
  }

  protected addCategory(): void {
    const result = this.menuDraftService.addCategory(this.categoryName());

    if (!result.success) {
      this.categoryError.set(
        result.reason === 'duplicate'
          ? 'Esa categoría ya fue agregada.'
          : 'Ingresa un nombre de categoría.',
      );
      return;
    }

    this.categoryName.set('');
    this.categoryError.set('');
  }

  protected startEditing(categoryId: string, name: string): void {
    this.editingCategoryId.set(categoryId);
    this.editingCategoryName.set(name);
  }

  protected updateEditingName(value: string): void {
    this.editingCategoryName.set(value);
  }

  protected saveEditing(categoryId: string): void {
    const result = this.menuDraftService.updateCategoryName(
      categoryId,
      this.editingCategoryName(),
    );

    if (!result.success) {
      this.categoryError.set(
        result.reason === 'duplicate'
          ? 'Ya existe una categoría con ese nombre.'
          : 'Ingresa un nombre de categoría.',
      );
      return;
    }

    this.editingCategoryId.set('');
    this.editingCategoryName.set('');
    this.categoryError.set('');
  }

  protected cancelEditing(): void {
    this.editingCategoryId.set('');
    this.editingCategoryName.set('');
    this.categoryError.set('');
  }

  protected toggleVisibility(categoryId: string): void {
    this.menuDraftService.toggleCategoryVisibility(categoryId);
  }

  protected removeCategory(categoryId: string): void {
    this.menuDraftService.removeCategory(categoryId);
  }

  protected dropCategory(event: CdkDragDrop<unknown>): void {
    this.menuDraftService.reorderCategories(event.previousIndex, event.currentIndex);
  }
}
