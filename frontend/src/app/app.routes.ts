import { Routes } from '@angular/router';
import { adminNavigation } from '@core/navigation/admin-navigation';
import { userNavigation } from '@core/navigation/user-navigation';
import { authGuard } from '@guards/auth.guard';
import { MainLayoutComponent } from '@layouts/main-layout/main-layout.component';
import { AdminUsersPageComponent } from '@pages/admin-users/admin-users-page.component';
import { DataProtectionPageComponent } from '@pages/data-protection/data-protection-page.component';
import { BusinessAdminPageComponent } from '@pages/dashboard/business-admin-page.component';
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
    title: 'Noren | Menus digitales QR',
  },
  {
    path: 'funciones',
    component: FeaturesPageComponent,
    title: 'Noren | Funciones',
  },
  {
    path: 'planes',
    component: ValuesPageComponent,
    title: 'Noren | Planes',
  },
  {
    path: 'valores',
    redirectTo: 'planes',
  },
  {
    path: 'plataforma',
    component: PlatformPageComponent,
    title: 'Noren | Plataforma',
  },
  {
    path: 'politica-de-privacidad',
    component: PrivacyPageComponent,
    title: 'Noren | Politica de privacidad',
  },
  {
    path: 'proteccion-de-datos',
    component: DataProtectionPageComponent,
    title: 'Noren | Proteccion de datos',
  },
  {
    path: 'login',
    component: LoginPageComponent,
    title: 'Noren | Acceso',
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    title: 'Noren | Registro',
  },
  {
    path: 'panel',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    data: {
      roles: ['user'],
      layoutConfig: {
        navigationItems: userNavigation,
        footerLabel: 'Acceso usuario',
        footerText:
          'Borrador con guardado local, previsualización y publicación preparada.',
        brandRoute: '/panel/negocio/datos',
      },
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'negocio/datos',
      },
      {
        path: 'dashboard',
        pathMatch: 'full',
        redirectTo: 'negocio/datos',
      },
      {
        path: 'menu',
        pathMatch: 'full',
        redirectTo: 'menu/categorias',
      },
      {
        path: 'promociones',
        pathMatch: 'full',
        redirectTo: 'promociones/horarios',
      },
      {
        path: 'menu/identidad',
        pathMatch: 'full',
        redirectTo: 'negocio/datos',
      },
      {
        path: 'menu/estilo',
        pathMatch: 'full',
        redirectTo: 'menu/diseno',
      },
      {
        path: 'menu/negocio',
        pathMatch: 'full',
        redirectTo: 'negocio/datos',
      },
      {
        path: 'negocio/datos',
        component: BusinessAdminPageComponent,
        title: 'Noren | Tu negocio',
      },
      {
        path: 'menu/categorias',
        loadComponent: () =>
          import('@pages/dashboard/dashboard-page.component').then(
            (component) => component.DashboardPageComponent,
          ),
        title: 'Noren | Categorías',
        data: {
          step: 2,
        },
      },
      {
        path: 'menu/productos',
        loadComponent: () =>
          import('@pages/dashboard/dashboard-page.component').then(
            (component) => component.DashboardPageComponent,
          ),
        title: 'Noren | Productos',
        data: {
          step: 3,
        },
      },
      {
        path: 'menu/diseno',
        loadComponent: () =>
          import('@pages/dashboard/dashboard-page.component').then(
            (component) => component.DashboardPageComponent,
          ),
        title: 'Noren | Diseño',
        data: {
          step: 4,
        },
      },
      {
        path: 'menu/revision',
        loadComponent: () =>
          import('@pages/dashboard/dashboard-page.component').then(
            (component) => component.DashboardPageComponent,
          ),
        title: 'Noren | Revisión',
        data: {
          step: 5,
        },
      },
      {
        path: 'menu/publicar',
        loadComponent: () =>
          import('@pages/dashboard/dashboard-page.component').then(
            (component) => component.DashboardPageComponent,
          ),
        title: 'Noren | Publicar',
        data: {
          step: 6,
        },
      },
      {
        path: 'promociones/horarios',
        loadComponent: () =>
          import('@pages/dashboard/promotions-page.component').then(
            (component) => component.PromotionsPageComponent,
          ),
        title: 'Noren | Promociones',
      },
    ],
  },
  {
    path: 'admin',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    data: {
      roles: ['admin'],
      layoutConfig: {
        navigationItems: adminNavigation,
        footerLabel: 'Acceso admin',
        footerText: 'Solo se muestra la lista de usuarios definidos para prueba.',
        brandRoute: '/admin/users',
        brandSubtitle: 'Interfaz admin',
      },
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'users',
      },
      {
        path: 'dashboard',
        pathMatch: 'full',
        redirectTo: 'users',
      },
      {
        path: 'users',
        component: AdminUsersPageComponent,
        title: 'Noren | Usuarios inscritos',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
