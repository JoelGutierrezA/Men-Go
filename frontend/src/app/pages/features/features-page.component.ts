import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MarketingFooterComponent } from '@shared/ui/marketing-footer/marketing-footer.component';
import { MarketingHeaderComponent } from '@shared/ui/marketing-header/marketing-header.component';

@Component({
  selector: 'app-features-page',
  imports: [
    MarketingFooterComponent,
    MarketingHeaderComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './features-page.component.html',
  styleUrl: './features-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturesPageComponent {
  protected readonly featureCards = [
    {
      icon: 'qr_code_2',
      title: 'Menus QR faciles de publicar',
      description:
        'Cada negocio podra compartir su carta desde un codigo QR con una experiencia clara, movil y lista para actualizarse.',
    },
    {
      icon: 'tune',
      title: 'Panel simple para administrar',
      description:
        'La operacion esta pensada para ordenar categorias, productos, promociones y temas visuales desde una sola base.',
    },
    {
      icon: 'campaign',
      title: 'Espacio para crecimiento comercial',
      description:
        'La plataforma se esta preparando para destacar promociones, novedades y secciones dinamicas sin rehacer el producto.',
    },
  ];

  protected readonly businessFlow = [
    'Actualizar cartas y destacados desde un panel web responsive.',
    'Preparar productos, categorias y temas visuales sin depender de cambios manuales.',
    'Escalar hacia multiples negocios y futuras sucursales con una base modular.',
  ];

  protected readonly guestFlow = [
    'Escanear el QR y abrir el menu sin instalar aplicaciones.',
    'Navegar productos y promociones desde una interfaz pensada para movil.',
    'Recibir una experiencia consistente aunque el negocio siga creciendo.',
  ];
}
