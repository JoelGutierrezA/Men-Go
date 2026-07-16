import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationItem } from '@models/navigation-item.model';
import { MenuDraftService } from '@services/menu-draft.service';

type SidebarStepStatus = 'pending' | 'current' | 'complete' | 'error';

@Component({
  selector: 'app-admin-sidebar',
  imports: [
    MatDividerModule,
    MatIconModule,
    MatListModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSidebarComponent {
  private readonly router = inject(Router);
  private readonly menuDraftService = inject(MenuDraftService);
  private readonly expandedGroups = signal<Record<string, boolean>>({});
  private readonly builderRouteSteps: Record<string, number> = {
    '/panel/menu/negocio': 1,
    '/panel/menu/categorias': 2,
    '/panel/menu/productos': 3,
    '/panel/menu/diseno': 4,
    '/panel/menu/revision': 5,
    '/panel/menu/publicar': 6,
  };

  readonly items = input.required<NavigationItem[]>();
  readonly eyebrow = input('Administracion');
  readonly title = input('Base del panel');
  readonly description = input(
    'Estructura preparada para crecer por modulos sin mezclar UI, acceso y dominio.',
  );
  readonly footerLabel = input('Fase 1');
  readonly footerText = input('Sin persistencia ni logica de negocio aun.');
  readonly navigate = output<void>();

  protected toggleGroup(itemLabel: string): void {
    this.expandedGroups.update((state) => ({
      ...state,
      [itemLabel]: !state[itemLabel],
    }));
  }

  protected isExpanded(item: NavigationItem): boolean {
    if (!item.children?.length) {
      return false;
    }

    return this.expandedGroups()[item.label] ?? this.hasActiveChild(item);
  }

  protected hasActiveChild(item: NavigationItem): boolean {
    return (
      item.children?.some(
        (child) =>
          !!child.route &&
          (this.router.url === child.route ||
            this.router.url.startsWith(`${child.route}?`)),
      ) ?? false
    );
  }

  protected childStatus(child: NavigationItem): SidebarStepStatus {
    if (!child.route || !(child.route in this.builderRouteSteps)) {
      return this.router.url === child.route ? 'current' : 'pending';
    }

    if (this.router.url === child.route || this.router.url.startsWith(`${child.route}?`)) {
      return 'current';
    }

    const step = this.builderRouteSteps[child.route];
    const draft = this.menuDraftService.draft();

    if (step === 1) {
      return draft.businessTitle.trim() ? 'complete' : 'error';
    }

    if (step === 2) {
      return draft.categories.length > 0 ? 'complete' : 'pending';
    }

    if (step === 3) {
      return this.menuDraftService.productsCount() > 0 ? 'complete' : 'pending';
    }

    if (step === 4) {
      return 'complete';
    }

    if (step === 5) {
      return this.menuDraftService.productsCount() > 0 && draft.businessTitle.trim()
        ? 'complete'
        : 'pending';
    }

    return draft.publication.status === 'published' ? 'complete' : 'pending';
  }

  protected childStatusIcon(child: NavigationItem): string {
    const status = this.childStatus(child);

    if (status === 'complete') {
      return 'check';
    }

    if (status === 'error') {
      return 'priority_high';
    }

    return child.icon;
  }
}
