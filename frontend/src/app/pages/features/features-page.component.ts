import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MarketingFooterComponent } from '@shared/ui/marketing-footer/marketing-footer.component';
import { MarketingHeaderComponent } from '@shared/ui/marketing-header/marketing-header.component';

interface FeatureCard {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
  readonly highlight?: boolean;
  readonly badge?: string;
  readonly note?: string;
  readonly benefits?: readonly string[];
}

interface CampaignExample {
  readonly name: string;
  readonly status: string;
  readonly details: readonly string[];
}

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
  protected readonly featureCards: readonly FeatureCard[] = [
    {
      icon: 'qr_code_2',
      title: 'Una carta siempre actualizada',
      description:
        'Publica tu menú con un código QR estable. Cambia productos, precios, imágenes y categorías sin imprimir otro código ni reemplazar enlaces.',
      note: 'Un solo QR para todos tus cambios.',
    },
    {
      icon: 'event_available',
      title: 'Promociones programadas',
      description:
        'Configura promociones por fecha, día y horario. Noren las activa y desactiva automáticamente, sin repetir cambios cada semana.',
      badge: 'PRÓXIMAMENTE',
      highlight: true,
    },
    {
      icon: 'restaurant_menu',
      title: 'Productos y categorías fáciles de administrar',
      description:
        'Crea categorías, agrega productos y actualiza nombres, descripciones, precios e imágenes desde un panel simple y organizado.',
      benefits: [
        'Ordenar categorías',
        'Editar productos',
        'Ocultar productos',
        'Administrar disponibilidad',
      ],
    },
    {
      icon: 'palette',
      title: 'Un diseño adaptado a tu marca',
      description:
        'Personaliza colores, tipografías, imágenes y componentes para que tu carta se sienta parte de la identidad de tu restaurante.',
      note: 'Tu menú no tiene por qué parecer una plantilla genérica.',
    },
    {
      icon: 'visibility',
      title: 'Vista previa en tiempo real',
      description:
        'Observa cómo verá el cliente cada cambio antes de publicarlo y corrige cualquier detalle directamente desde el constructor.',
    },
    {
      icon: 'devices',
      title: 'Una experiencia para cualquier pantalla',
      description:
        'Tus clientes pueden abrir la carta desde su teléfono sin instalar aplicaciones. El menú se adapta automáticamente a distintos tamaños de pantalla.',
    },
  ];

  protected readonly campaignBenefits = [
    'Activación automática',
    'Desactivación automática',
    'Repetición semanal',
    'Campañas por temporada',
    'Precios promocionales',
    'Productos temporales',
    'Menos cambios manuales',
  ];

  protected readonly campaignExamples: readonly CampaignExample[] = [
    {
      name: 'Happy Hour',
      status: 'Programada',
      details: [
        'Lunes a viernes',
        '18:00 a 20:00',
        'Repetición semanal',
        '6 productos incluidos',
      ],
    },
    {
      name: 'Promoción de fin de semana',
      status: 'Activa',
      details: [
        'Viernes, sábado y domingo',
        'Productos seleccionados',
        'Precio especial',
      ],
    },
    {
      name: 'Halloween',
      status: 'Próxima',
      details: [
        '1 al 31 de octubre',
        'Productos especiales',
        'Banner temporal',
      ],
    },
  ];
}
