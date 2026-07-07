import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { adminNavigation } from '@core/navigation/admin-navigation';
import { AdminSidebarComponent } from '@shared/ui/admin-sidebar/admin-sidebar.component';
import { NavbarComponent } from '@shared/ui/navbar/navbar.component';

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
  private readonly mobileSidebarOpened = signal(false);

  protected readonly navigationItems = adminNavigation;
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
