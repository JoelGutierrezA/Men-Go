import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MarketingFooterComponent } from '@shared/ui/marketing-footer/marketing-footer.component';
import {
  LandingHeroCarouselComponent,
  type LandingHeroSlide,
} from '@shared/ui/landing-hero-carousel/landing-hero-carousel.component';
import { MarketingHeaderComponent } from '@shared/ui/marketing-header/marketing-header.component';

interface HomePlan {
  readonly name: string;
  readonly price: string;
  readonly period: string;
  readonly description: string;
  readonly ctaLabel: string;
  readonly tone: 'trial' | 'neutral' | 'featured' | 'premium';
  readonly badge?: string;
  readonly features: readonly string[];
}

@Component({
  selector: 'app-landing-page',
  imports: [
    MarketingFooterComponent,
    MarketingHeaderComponent,
    LandingHeroCarouselComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {
  private readonly document = inject(DOCUMENT);

  protected readonly heroSlides: readonly LandingHeroSlide[] = [
    {
      eyebrow: 'Experiencia visual',
      title: 'Crea tu carta digital',
      description: 'Organiza categorias, productos e imagenes facilmente.',
      ctaLabel: 'Funciones',
      ctaTarget: 'funciones',
      imageAlt: 'Mockup de una carta digital en un telefono',
      mockType: 'menu',
    },
    {
      eyebrow: 'Marca propia',
      title: 'Refleja la identidad de tu negocio',
      description: 'Personaliza colores, logotipo y apariencia del menu.',
      ctaLabel: 'Planes',
      ctaTarget: 'planes',
      imageAlt: 'Escena de un cliente escaneando un codigo QR en un restaurante',
      mockType: 'qr',
    },
    {
      eyebrow: 'Gestion centralizada',
      title: 'Todo desde una plataforma',
      description: 'Administra tu restaurante desde cualquier dispositivo.',
      ctaLabel: 'Plataforma',
      ctaTarget: 'plataforma',
      imageAlt: 'Panel administrativo de MenuGo mostrando productos y estados',
      mockType: 'dashboard',
    },
  ];

  protected readonly features = [
    {
      icon: 'qr_code_2',
      title: 'Menus digitales',
      description:
        'Tus clientes solo necesitan escanear un codigo QR para consultar la carta desde cualquier celular.',
    },
    {
      icon: 'devices',
      title: 'Actualiza al instante',
      description:
        'Modifica precios, productos o promociones en segundos, sin volver a imprimir cartas ni editar archivos PDF.',
    },
    {
      icon: 'palette',
      title: 'Personaliza tu marca',
      description:
        'Haz que tu carta refleje la identidad de tu restaurante utilizando tu logotipo, colores, imagenes y banners.',
    },
    {
      icon: 'query_stats',
      title: 'Preparado para crecer',
      description:
        'La plataforma evoluciona junto a tu negocio con nuevas funciones, promociones, estadisticas y futuras integraciones.',
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

  protected readonly plans: readonly HomePlan[] = [
    {
      name: 'Prueba gratis',
      price: '15 dias',
      period: 'sin costo',
      description:
        'Empieza con una prueba real para explorar MenuGo antes de elegir un plan.',
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
        'Ideal para negocios que quieren pasar de un PDF a una carta digital profesional.',
      ctaLabel: 'Elegir Emprende',
      tone: 'neutral',
      features: [
        '1 restaurante',
        'Hasta 50 productos',
        'QR personalizado',
        'Logo y colores propios',
      ],
    },
    {
      name: 'Crece',
      price: '$16.990',
      period: 'al mes',
      description:
        'Pensado para locales que actualizan su carta seguido y quieren destacar promociones.',
      ctaLabel: 'Elegir Crece',
      tone: 'featured',
      badge: 'Mas popular',
      features: [
        'Productos ilimitados',
        'Promociones y banner principal',
        'Etiquetas para productos',
        'Soporte prioritario',
      ],
    },
    {
      name: 'Premium',
      price: '$19.990',
      period: 'al mes',
      description:
        'Para restaurantes que necesitan mas control, sucursales y herramientas avanzadas.',
      ctaLabel: 'Elegir Premium',
      tone: 'premium',
      badge: 'Mejor valor',
      features: [
        'Hasta 5 sucursales',
        'Multiples administradores',
        'Analiticas avanzadas',
        'Programacion de promociones',
      ],
    },
  ];

  protected scrollToSection(sectionId: string): void {
    const targetElement = this.document.getElementById(sectionId);
    const windowRef = this.document.defaultView;

    if (!targetElement || !windowRef) {
      return;
    }

    const headerOffset = 96;
    const top = targetElement.getBoundingClientRect().top + windowRef.scrollY - headerOffset;

    windowRef.scrollTo({
      top,
      behavior: 'smooth',
    });
  }
}
