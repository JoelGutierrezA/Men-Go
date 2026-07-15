import { Routes } from '@angular/router';
import { adminNavigation } from '@core/navigation/admin-navigation';
import { userNavigation } from '@core/navigation/user-navigation';
import { authGuard } from '@guards/auth.guard';
import { MainLayoutComponent } from '@layouts/main-layout/main-layout.component';
import { AdminUsersPageComponent } from '@pages/admin-users/admin-users-page.component';
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
    path: 'planes',
    component: ValuesPageComponent,
    title: 'MenuGo | Planes',
  },
  {
    path: 'valores',
    redirectTo: 'planes',
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
    path: 'panel',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    data: {
      roles: ['user'],
      layoutConfig: {
        navigationItems: userNavigation,
        sidebarEyebrow: 'Tu plataforma',
        sidebarTitle: 'Creacion de menu',
        sidebarDescription:
          'Espacio temporal para preparar la experiencia de administracion del menu digital del negocio.',
        footerLabel: 'Acceso usuario',
        footerText:
          'Base visual lista para categorias, productos, QR y publicacion.',
        brandRoute: '/panel/menu/identidad',
        brandSubtitle: 'Panel del negocio',
      },
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'menu/identidad',
      },
      {
        path: 'dashboard',
        pathMatch: 'full',
        redirectTo: 'menu/identidad',
      },
      {
        path: 'menu',
        pathMatch: 'full',
        redirectTo: 'menu/identidad',
      },
      {
        path: 'menu/identidad',
        component: DashboardPageComponent,
        title: 'MenuGo | Creacion de menu',
        data: {
          step: 1,
        },
      },
      {
        path: 'menu/estilo',
        component: DashboardPageComponent,
        title: 'MenuGo | Estilo visual',
        data: {
          step: 2,
        },
      },
      {
        path: 'menu/productos',
        component: DashboardPageComponent,
        title: 'MenuGo | Productos',
        data: {
          step: 3,
        },
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
        sidebarEyebrow: 'Administracion',
        sidebarTitle: 'Usuarios inscritos',
        sidebarDescription:
          'Interfaz temporal para revisar quienes ya tienen acceso a MenuGo en esta fase inicial.',
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
        title: 'MenuGo | Usuarios inscritos',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
