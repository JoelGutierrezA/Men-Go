import { computed, Injectable, signal } from '@angular/core';
import {
  AppRole,
  AuthSession,
  RegisteredUser,
  SeedUser,
} from '@models/auth-user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private static readonly sessionStorageKey = 'menugo-auth-session';

  private readonly seedUsers: SeedUser[] = [
    {
      email: 'jgutiale@gmail.com',
      password: 'admin123',
      role: 'user',
    },
    {
      email: 'admin@menugo.com',
      password: 'admin123',
      role: 'admin',
    },
  ];

  private readonly session = signal<AuthSession | null>(this.restoreSession());

  readonly currentUser = computed(() => this.session());
  readonly isAuthenticated = computed(() => this.session() !== null);
  readonly registeredUsers: RegisteredUser[] = this.seedUsers.map(
    ({ email, role }) => ({
      email,
      role,
    }),
  );

  login(email: string, password: string): {
    success: boolean;
    redirectTo?: string;
  } {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    const matchedUser = this.seedUsers.find(
      (user) =>
        user.email.toLowerCase() === normalizedEmail &&
        user.password === normalizedPassword,
    );

    if (!matchedUser) {
      return { success: false };
    }

    const session: AuthSession = {
      email: matchedUser.email,
      role: matchedUser.role,
    };

    this.session.set(session);
    this.persistSession(session);

    return {
      success: true,
      redirectTo: this.getDefaultRouteForRole(matchedUser.role),
    };
  }

  logout(): void {
    this.session.set(null);
    localStorage.removeItem(AuthService.sessionStorageKey);
  }

  getDefaultRouteForRole(role: AppRole): string {
    return role === 'admin' ? '/admin/users' : '/panel/menu';
  }

  getCurrentHomeRoute(): string {
    const currentUser = this.currentUser();
    return currentUser ? this.getDefaultRouteForRole(currentUser.role) : '/login';
  }

  getUserAlias(email: string): string {
    return email.split('@')[0] ?? email;
  }

  private restoreSession(): AuthSession | null {
    const storedSession = localStorage.getItem(AuthService.sessionStorageKey);

    if (!storedSession) {
      return null;
    }

    try {
      const parsedSession = JSON.parse(storedSession) as AuthSession;
      const userExists = this.seedUsers.some(
        (user) =>
          user.email === parsedSession.email && user.role === parsedSession.role,
      );

      return userExists ? parsedSession : null;
    } catch {
      return null;
    }
  }

  private persistSession(session: AuthSession): void {
    localStorage.setItem(
      AuthService.sessionStorageKey,
      JSON.stringify(session),
    );
  }
}
