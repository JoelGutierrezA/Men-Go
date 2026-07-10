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
      ctaLabel: 'Valores',
      ctaTarget: 'valores',
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
