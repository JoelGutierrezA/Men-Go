import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MarketingFooterComponent } from '@shared/ui/marketing-footer/marketing-footer.component';
import { MarketingHeaderComponent } from '@shared/ui/marketing-header/marketing-header.component';

@Component({
  selector: 'app-landing-page',
  imports: [
    MarketingFooterComponent,
    MarketingHeaderComponent,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {
  protected readonly highlights = [
    'Menus QR',
    'Panel web responsive',
    'Gestion centralizada',
  ];

  protected readonly features = [
    {
      icon: 'qr_code_2',
      title: 'Menus digitales por QR',
      description:
        'Publica cartas digitales para que tus clientes accedan rapido desde un codigo QR sin instalar ninguna app.',
    },
    {
      icon: 'devices',
      title: 'Panel simple para administrar',
      description:
        'Organiza categorias, productos, promociones y apariencia del menu desde una interfaz pensada para crecer.',
    },
    {
      icon: 'storefront',
      title: 'Pensado para negocios reales',
      description:
        'MenuGo se esta construyendo para restaurantes, bares, pubs y cafeterias que necesitan actualizar su menu con agilidad.',
    },
  ];

  protected readonly audiences = [
    'Restaurantes con carta amplia y dinamica',
    'Bares y pubs con promociones y horarios variables',
    'Cafeterias que renuevan productos frecuentemente',
  ];

  protected readonly platformBlocks = [
    'Administracion de menus, categorias y productos',
    'Promociones destacadas y temas visuales por negocio',
    'Base preparada para autenticacion, imagenes y futura persistencia',
  ];

  protected readonly values = [
    {
      title: 'Simplicidad real',
      description:
        'La experiencia debe ser facil tanto para el negocio que administra como para el cliente que escanea el QR.',
    },
    {
      title: 'Velocidad para operar',
      description:
        'Cambiar productos, precios o promociones debe tomar minutos, no depender de procesos lentos o rediseños completos.',
    },
    {
      title: 'Base lista para crecer',
      description:
        'Cada modulo se esta preparando para evolucionar hacia un SaaS robusto sin rehacer la arquitectura en cada fase.',
    },
  ];
}
