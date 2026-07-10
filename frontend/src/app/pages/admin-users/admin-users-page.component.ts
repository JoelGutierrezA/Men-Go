import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-admin-users-page',
  imports: [MatCardModule, MatChipsModule, MatTableModule],
  templateUrl: './admin-users-page.component.html',
  styleUrl: './admin-users-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersPageComponent {
  private readonly authService = inject(AuthService);

  protected readonly displayedColumns = ['email', 'role', 'access'];
  protected readonly users = this.authService.registeredUsers;

  protected getRoleLabel(role: 'admin' | 'user'): string {
    return role === 'admin' ? 'Administrador' : 'Usuario';
  }

  protected getAccessLabel(role: 'admin' | 'user'): string {
    return role === 'admin'
      ? 'Interfaz admin y lista de inscritos'
      : 'Dashboard de creacion de menu';
  }
}
