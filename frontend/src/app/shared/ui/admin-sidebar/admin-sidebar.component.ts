import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
  readonly items = input.required<NavigationItem[]>();
  readonly eyebrow = input('Administracion');
  readonly title = input('Base del panel');
  readonly description = input(
    'Estructura preparada para crecer por modulos sin mezclar UI, acceso y dominio.',
  );
  readonly footerLabel = input('Fase 1');
  readonly footerText = input('Sin persistencia ni logica de negocio aun.');
  readonly navigate = output<void>();
}
