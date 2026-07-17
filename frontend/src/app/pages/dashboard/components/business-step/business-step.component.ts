import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MenuBusinessType } from '@models/menu-draft.model';
import { MenuDraftService } from '@services/menu-draft.service';
import { businessAdminConfig } from '../../menu-builder.config';

@Component({
  selector: 'app-business-step',
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './business-step.component.html',
  styleUrl: '../menu-builder-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessStepComponent {
  private readonly menuDraftService = inject(MenuDraftService);

  readonly continueRequested = output<void>();

  protected readonly draft = this.menuDraftService.draft;
  protected readonly stepConfig = businessAdminConfig;
  protected readonly logoError = signal('');
  protected readonly additionalBranchAddresses = computed(() =>
    this.draft().branchAddresses.slice(0, Math.max(0, this.draft().branchCount - 1)),
  );
  protected readonly hasMultipleBranches = computed(() => this.draft().branchCount > 1);
  protected readonly previewInitial = computed(() => {
    const title = this.draft().businessTitle.trim();
    return title ? title.charAt(0).toUpperCase() : 'M';
  });
  protected readonly businessTypes: Array<{ label: string; value: MenuBusinessType }> = [
    { label: 'Restaurante', value: 'restaurante' },
    { label: 'Bar', value: 'bar' },
    { label: 'Pub', value: 'pub' },
    { label: 'Cafetería', value: 'cafeteria' },
    { label: 'Food truck', value: 'food-truck' },
    { label: 'Otro', value: 'otro' },
  ];

  protected updateBusinessTitle(value: string): void {
    this.menuDraftService.updateBusiness({ businessTitle: value });
  }

  protected updateBusinessType(value: MenuBusinessType): void {
    this.menuDraftService.updateBusinessType(value);
  }

  protected updateBusinessDescription(value: string): void {
    this.menuDraftService.updateBusiness({ businessDescription: value });
  }

  protected updateBranchCount(value: string): void {
    this.menuDraftService.updateBranchCount(Number(value));
  }

  protected updateMultipleBranches(hasMultipleBranches: boolean): void {
    this.menuDraftService.updateBranchCount(hasMultipleBranches ? 2 : 1);
  }

  protected updateHeadquartersAddress(value: string): void {
    this.menuDraftService.updateHeadquartersAddress(value);
  }

  protected updateBranchAddress(index: number, value: string): void {
    this.menuDraftService.updateBranchAddress(index, value);
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
      this.logoError.set('Selecciona una imagen válida para el logo.');
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
}
