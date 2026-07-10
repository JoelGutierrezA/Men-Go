import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [MatButtonModule, MatIconModule, MatToolbarModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly showMenuButton = input(false);
  readonly brandRoute = input('/');
  readonly brandSubtitle = input('Panel MenuGo');
  readonly homeRoute = input('/');
  readonly homeLabel = input('Landing');
  readonly sessionEmail = input<string | null>(null);
  readonly menuRequested = output<void>();

  protected logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
