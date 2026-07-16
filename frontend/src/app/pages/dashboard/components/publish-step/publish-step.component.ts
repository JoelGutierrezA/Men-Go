import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MenuDraftService } from '@services/menu-draft.service';
import { getMenuBuilderStep } from '../../menu-builder.config';

@Component({
  selector: 'app-publish-step',
  imports: [MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './publish-step.component.html',
  styleUrl: '../menu-builder-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishStepComponent {
  private readonly menuDraftService = inject(MenuDraftService);

  readonly backRequested = output<void>();
  readonly panelRequested = output<void>();

  protected readonly draft = this.menuDraftService.draft;
  protected readonly stepConfig = getMenuBuilderStep(6);
  protected readonly publishError = signal('');
  protected readonly copyStatus = signal('');
  protected readonly publicUrl = computed(() => this.draft().publication.publicUrl);

  protected updateSlug(value: string): void {
    this.menuDraftService.updatePublicationSlug(value);
    this.publishError.set('');
  }

  protected publishMenu(): void {
    const result = this.menuDraftService.publishMenu();

    if (!result.success) {
      const errors = {
        business: 'Completa el nombre del negocio antes de publicar.',
        product: 'Agrega al menos un producto antes de publicar.',
        slug: 'Define una URL pública válida.',
      };
      this.publishError.set(errors[result.reason ?? 'slug']);
      return;
    }

    this.publishError.set('');
  }

  protected copyLink(): void {
    const url = this.publicUrl();

    if (!url) {
      return;
    }

    void navigator.clipboard?.writeText(url).then(() => {
      this.copyStatus.set('Enlace copiado');
      setTimeout(() => this.copyStatus.set(''), 1800);
    });
  }

  protected openMenu(): void {
    const url = this.publicUrl();

    if (!url) {
      return;
    }

    globalThis.open(url, '_blank', 'noopener');
  }

  protected downloadQr(): void {
    const url = this.publicUrl();

    if (!url) {
      return;
    }

    const svg = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="420" height="520" viewBox="0 0 420 520">
        <rect width="420" height="520" fill="#ffffff"/>
        <rect x="40" y="40" width="340" height="340" rx="24" fill="#f1fbf5"/>
        <g fill="#123c2b">
          <rect x="78" y="78" width="74" height="74" rx="10"/>
          <rect x="268" y="78" width="74" height="74" rx="10"/>
          <rect x="78" y="268" width="74" height="74" rx="10"/>
          <rect x="184" y="92" width="28" height="28"/>
          <rect x="222" y="132" width="28" height="28"/>
          <rect x="184" y="190" width="56" height="28"/>
          <rect x="268" y="206" width="28" height="56"/>
          <rect x="184" y="284" width="28" height="28"/>
          <rect x="230" y="284" width="28" height="56"/>
          <rect x="306" y="306" width="36" height="36"/>
        </g>
        <text x="210" y="430" text-anchor="middle" font-family="Arial" font-size="20" font-weight="700" fill="#123c2b">MenuGo</text>
        <text x="210" y="462" text-anchor="middle" font-family="Arial" font-size="14" fill="#4d5b68">${url}</text>
      </svg>
    `);
    const link = document.createElement('a');
    link.href = `data:image/svg+xml;charset=utf-8,${svg}`;
    link.download = 'menugo-qr.svg';
    link.click();
  }

  protected printQr(): void {
    globalThis.print();
  }
}
