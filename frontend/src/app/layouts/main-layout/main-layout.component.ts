import { BreakpointObserver } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { adminNavigation } from '@core/navigation/admin-navigation';
import { NavigationItem } from '@models/navigation-item.model';
import { AuthService } from '@services/auth.service';
import { AdminSidebarComponent } from '@shared/ui/admin-sidebar/admin-sidebar.component';
import { NavbarComponent } from '@shared/ui/navbar/navbar.component';

interface LayoutConfig {
  navigationItems: NavigationItem[];
  sidebarEyebrow: string;
  sidebarTitle: string;
  sidebarDescription: string;
  footerLabel: string;
  footerText: string;
  brandRoute: string;
  brandSubtitle: string;
}

@Component({
  selector: 'app-main-layout',
  imports: [
    AdminSidebarComponent,
    MatSidenavModule,
    NavbarComponent,
    RouterOutlet,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly mobileSidebarOpened = signal(false);
  private readonly layoutConfig = this.activatedRoute.snapshot.data[
    'layoutConfig'
  ] as LayoutConfig | undefined;

  protected readonly navigationItems =
    this.layoutConfig?.navigationItems ?? adminNavigation;
  protected readonly sidebarEyebrow =
    this.layoutConfig?.sidebarEyebrow ?? 'Administracion';
  protected readonly sidebarTitle =
    this.layoutConfig?.sidebarTitle ?? 'Base del panel';
  protected readonly sidebarDescription =
    this.layoutConfig?.sidebarDescription ??
    'Estructura preparada para crecer por modulos sin mezclar UI, acceso y dominio.';
  protected readonly footerLabel = this.layoutConfig?.footerLabel ?? 'Fase 1';
  protected readonly footerText =
    this.layoutConfig?.footerText ?? 'Sin persistencia ni logica de negocio aun.';
  protected readonly brandRoute =
    this.layoutConfig?.brandRoute ?? '/admin/users';
  protected readonly brandSubtitle =
    this.layoutConfig?.brandSubtitle ?? 'Panel interno';
  protected readonly currentUser = this.authService.currentUser;
  protected readonly isMobile = toSignal(
    this.breakpointObserver
      .observe('(max-width: 959px)')
      .pipe(map(({ matches }) => matches)),
    { initialValue: false },
  );
  protected readonly sidenavMode = computed<MatDrawerMode>(() =>
    this.isMobile() ? 'over' : 'side',
  );
  protected readonly sidenavOpened = computed(() =>
    this.isMobile() ? this.mobileSidebarOpened() : true,
  );
  protected readonly landingRoute = '/';

  protected toggleSidebar(): void {
    if (this.isMobile()) {
      this.mobileSidebarOpened.update((opened) => !opened);
    }
  }

  protected closeSidebar(): void {
    if (this.isMobile()) {
      this.mobileSidebarOpened.set(false);
    }
  }
}
