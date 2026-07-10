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
  private readonly expandedGroups = signal<Record<string, boolean>>({});

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
}
