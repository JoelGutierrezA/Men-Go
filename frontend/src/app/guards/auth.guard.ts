import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppRole } from '@models/auth-user.model';
import { AuthService } from '@services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentUser = authService.currentUser();

  if (!currentUser) {
    return router.createUrlTree(['/login'], {
      queryParams: { redirectTo: state.url },
    });
  }

  const allowedRoles = route.data['roles'] as AppRole[] | undefined;

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return router.createUrlTree([
      authService.getDefaultRouteForRole(currentUser.role),
    ]);
  }

  return true;
};
