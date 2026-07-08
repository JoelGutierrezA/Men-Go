import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MarketingFooterComponent } from '@shared/ui/marketing-footer/marketing-footer.component';
import { MarketingHeaderComponent } from '@shared/ui/marketing-header/marketing-header.component';

@Component({
  selector: 'app-platform-page',
  imports: [
    MarketingFooterComponent,
    MarketingHeaderComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './platform-page.component.html',
  styleUrl: './platform-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlatformPageComponent {
  protected readonly modules = [
    {
      icon: 'web',
      title: 'Frontend Angular',
      description:
        'Base con standalone components, Angular Material, routing y una experiencia responsive orientada a mobile first.',
    },
    {
      icon: 'hub',
      title: 'Backend NestJS',
      description:
        'Estructura modular preparada para auth, usuarios, restaurantes, categorias, productos, promociones y temas.',
    },
    {
      icon: 'account_tree',
      title: 'Servicios desacoplados',
      description:
        'La logica esta pensada para crecer con interfaces y servicios que luego podran conectarse a persistencia real.',
    },
    {
      icon: 'cloud_sync',
      title: 'Integraciones futuras',
      description:
        'La plataforma queda lista para sumar JWT, Cloudinary y repositorios reales sin mezclar etapas prematuramente.',
    },
  ];

  protected readonly currentPhase = [
    'Sin persistencia implementada en esta etapa inicial.',
    'Base abierta para integrar MySQL con TypeORM o Prisma despues.',
    'Separacion clara entre presentacion, servicios y futura capa de datos.',
  ];

  protected readonly nextLayers = [
    'Autenticacion y acceso por negocio.',
    'Gestion de categorias, productos y promociones.',
    'Carga de imagenes, temas visuales y administracion completa del menu.',
  ];
}
