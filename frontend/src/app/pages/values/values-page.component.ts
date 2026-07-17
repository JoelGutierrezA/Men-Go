import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MarketingFooterComponent } from '@shared/ui/marketing-footer/marketing-footer.component';
import { MarketingHeaderComponent } from '@shared/ui/marketing-header/marketing-header.component';

interface SubscriptionPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  ctaLabel: string;
  tone: 'trial' | 'neutral' | 'featured' | 'premium';
  badge?: string;
  features: string[];
}

@Component({
  selector: 'app-values-page',
  imports: [
    MarketingFooterComponent,
    MarketingHeaderComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './values-page.component.html',
  styleUrl: './values-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValuesPageComponent {
  protected readonly plans: SubscriptionPlan[] = [
    {
      name: 'Prueba gratis',
      price: '15 dias',
      period: 'sin costo',
      description:
        'Empieza con una prueba real para explorar Noren antes de elegir un plan.',
      ctaLabel: 'Probar gratis',
      tone: 'trial',
      badge: 'Nuevo',
      features: [
        'Constructor completo del menu',
        'Logo y colores personalizados',
        'QR listo para compartir',
        'Sin tarjeta al comenzar',
      ],
    },
    {
      name: 'Emprende',
      price: '$9.990',
      period: 'al mes',
      description:
        'Para pequeños negocios que quieren reemplazar su menu PDF por una carta digital profesional.',
      ctaLabel: 'Comenzar',
      tone: 'neutral',
      features: [
        '1 restaurante',
        'Codigo QR personalizado',
        'Hasta 50 productos',
        'Hasta 10 categorias',
        'Logo y colores personalizados',
        'Imagenes de productos',
        'Menu responsive',
        'Actualizaciones ilimitadas',
        'Activar o desactivar productos',
      ],
    },
    {
      name: 'Crece',
      price: '$16.990',
      period: 'al mes',
      description:
        'Para negocios que actualizan su carta con frecuencia y quieren destacar promociones y productos.',
      ctaLabel: 'Elegir Crece',
      tone: 'featured',
      badge: 'Mas popular',
      features: [
        'Todo lo incluido en Emprende',
        'Productos ilimitados',
        'Categorias ilimitadas',
        'Productos destacados',
        'Banner principal',
        'Promociones',
        'Etiquetas para productos',
        'Temas estacionales',
        'Estadisticas basicas de visitas',
        'Soporte prioritario',
      ],
    },
    {
      name: 'Premium',
      price: '$19.990',
      period: 'al mes',
      description:
        'Para restaurantes que necesitan mas control, administracion y herramientas avanzadas.',
      ctaLabel: 'Elegir Premium',
      tone: 'premium',
      badge: 'Mejor valor',
      features: [
        'Todo lo incluido en Crece',
        'Hasta 5 sucursales',
        'Multiples administradores',
        'Roles y permisos',
        'Programacion de promociones',
        'Programacion de disponibilidad',
        'Analiticas avanzadas',
        'Historial de cambios',
        'Acceso anticipado a nuevas funciones',
        'Soporte premium',
      ],
    },
  ];
}
