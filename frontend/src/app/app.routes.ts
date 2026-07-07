import { Routes } from '@angular/router';
import { authGuard } from '@guards/auth.guard';
import { MainLayoutComponent } from '@layouts/main-layout/main-layout.component';
import { DashboardPageComponent } from '@pages/dashboard/dashboard-page.component';
import { LandingPageComponent } from '@pages/landing/landing-page.component';
import { LoginPageComponent } from '@pages/login/login-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    title: 'MenúGo | Menús digitales QR',
  },
  {
    path: 'login',
    component: LoginPageComponent,
    title: 'MenúGo | Acceso',
  },
  {
    path: 'admin',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        component: DashboardPageComponent,
        title: 'MenúGo | Dashboard',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
