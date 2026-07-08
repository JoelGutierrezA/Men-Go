import { Routes } from '@angular/router';
import { authGuard } from '@guards/auth.guard';
import { MainLayoutComponent } from '@layouts/main-layout/main-layout.component';
import { DataProtectionPageComponent } from '@pages/data-protection/data-protection-page.component';
import { DashboardPageComponent } from '@pages/dashboard/dashboard-page.component';
import { FeaturesPageComponent } from '@pages/features/features-page.component';
import { LandingPageComponent } from '@pages/landing/landing-page.component';
import { LoginPageComponent } from '@pages/login/login-page.component';
import { PlatformPageComponent } from '@pages/platform/platform-page.component';
import { PrivacyPageComponent } from '@pages/privacy/privacy-page.component';
import { RegisterPageComponent } from '@pages/register/register-page.component';
import { ValuesPageComponent } from '@pages/values/values-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    title: 'MenuGo | Menus digitales QR',
  },
  {
    path: 'funciones',
    component: FeaturesPageComponent,
    title: 'MenuGo | Funciones',
  },
  {
    path: 'valores',
    component: ValuesPageComponent,
    title: 'MenuGo | Valores',
  },
  {
    path: 'plataforma',
    component: PlatformPageComponent,
    title: 'MenuGo | Plataforma',
  },
  {
    path: 'politica-de-privacidad',
    component: PrivacyPageComponent,
    title: 'MenuGo | Politica de privacidad',
  },
  {
    path: 'proteccion-de-datos',
    component: DataProtectionPageComponent,
    title: 'MenuGo | Proteccion de datos',
  },
  {
    path: 'login',
    component: LoginPageComponent,
    title: 'MenuGo | Acceso',
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    title: 'MenuGo | Registro',
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
        title: 'MenuGo | Dashboard',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
