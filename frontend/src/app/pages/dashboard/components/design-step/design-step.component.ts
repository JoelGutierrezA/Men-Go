import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MenuTemplate } from '@models/menu-draft.model';
import { MenuDraftService } from '@services/menu-draft.service';
import { getMenuBuilderStep } from '../../menu-builder.config';

type ColorKey = 'primaryColor' | 'backgroundColor' | 'categoryColor' | 'titleColor' | 'textColor';

@Component({
  selector: 'app-design-step',
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './design-step.component.html',
  styleUrl: '../menu-builder-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignStepComponent {
  private readonly menuDraftService = inject(MenuDraftService);

  readonly backRequested = output<void>();
  readonly continueRequested = output<void>();

  protected readonly draft = this.menuDraftService.draft;
  protected readonly stepConfig = getMenuBuilderStep(4);
  protected readonly templates: Array<{ label: string; value: MenuTemplate }> = [
    { label: 'Moderno', value: 'moderno' },
    { label: 'Minimalista', value: 'minimalista' },
    { label: 'Elegante', value: 'elegante' },
    { label: 'Rústico', value: 'rustico' },
  ];
  protected readonly fontOptions = [
    { label: 'Manrope', value: 'Manrope, sans-serif' },
    { label: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
  ];
  protected readonly textSizes = [
    { label: 'Pequeño', title: 28, body: 14, product: 14 },
    { label: 'Mediano', title: 34, body: 16, product: 16 },
    { label: 'Grande', title: 42, body: 18, product: 18 },
  ];
  protected readonly colorFields: Array<{ key: ColorKey; label: string }> = [
    { key: 'primaryColor', label: 'Color principal' },
    { key: 'categoryColor', label: 'Color de categorías' },
    { key: 'backgroundColor', label: 'Color de fondo' },
    { key: 'textColor', label: 'Color del texto' },
    { key: 'titleColor', label: 'Color de títulos' },
  ];

  protected updateTemplate(value: MenuTemplate): void {
    this.menuDraftService.updateTheme({ template: value });
  }

  protected updateColor(key: ColorKey, value: string): void {
    this.menuDraftService.updateTheme({ [key]: value });
  }

  protected colorValue(key: ColorKey): string {
    return this.draft().theme[key];
  }

  protected resetColor(key: ColorKey): void {
    this.menuDraftService.resetThemeColor(key);
  }

  protected updateFontFamily(value: string): void {
    this.menuDraftService.updateTheme({
      fontFamily: value,
      productFontFamily: value,
    });
  }

  protected applyTextSize(title: number, body: number, product: number): void {
    this.menuDraftService.updateTheme({
      titleFontSize: title,
      bodyFontSize: body,
      productFontSize: product,
    });
  }

  protected updateNumber(
    key: 'titleFontSize' | 'bodyFontSize' | 'productFontSize' | 'productCardRadius' | 'productCardSpacing',
    value: string,
  ): void {
    const parsedValue = Number(value);

    if (!Number.isFinite(parsedValue)) {
      return;
    }

    this.menuDraftService.updateTheme({ [key]: parsedValue });
  }

  protected toggleTitleBold(): void {
    this.menuDraftService.updateTheme({
      titleBold: !this.draft().theme.titleBold,
      productNameBold: !this.draft().theme.productNameBold,
    });
  }

  protected toggleTitleItalic(): void {
    this.menuDraftService.updateTheme({
      titleItalic: !this.draft().theme.titleItalic,
      productNameItalic: !this.draft().theme.productNameItalic,
    });
  }

  protected updateImageStyle(value: 'rounded' | 'square'): void {
    this.menuDraftService.updateTheme({ productImageStyle: value });
  }
}
