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
import { MenuDraftService } from '@services/menu-draft.service';
import { AdminSidebarComponent } from '@shared/ui/admin-sidebar/admin-sidebar.component';
import { NavbarComponent } from '@shared/ui/navbar/navbar.component';

interface LayoutConfig {
  navigationItems: NavigationItem[];
  footerLabel: string;
  footerText: string;
  brandRoute: string;
  brandSubtitle?: string;
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
  private readonly menuDraftService = inject(MenuDraftService);
  private readonly mobileSidebarOpened = signal(false);
  private readonly layoutConfig = this.activatedRoute.snapshot.data[
    'layoutConfig'
  ] as LayoutConfig | undefined;
  private readonly usesBusinessHeader =
    this.layoutConfig?.brandRoute?.startsWith('/panel') ?? false;

  protected readonly navigationItems =
    this.layoutConfig?.navigationItems ?? adminNavigation;
  protected readonly footerLabel = this.layoutConfig?.footerLabel ?? 'Fase 1';
  protected readonly footerText =
    this.layoutConfig?.footerText ?? 'Sin persistencia ni logica de negocio aun.';
  protected readonly brandRoute =
    this.layoutConfig?.brandRoute ?? '/admin/users';
  protected readonly brandSubtitle = computed(() => {
    if (!this.usesBusinessHeader) {
      return this.layoutConfig?.brandSubtitle ?? 'Panel interno';
    }

    return this.menuDraftService.draft().businessTitle.trim() || 'Nombre del negocio';
  });
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
