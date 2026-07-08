import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-marketing-footer',
  imports: [RouterLink],
  templateUrl: './marketing-footer.component.html',
  styleUrl: './marketing-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketingFooterComponent {
  protected readonly currentYear = new Date().getFullYear();

  protected readonly platformLinks = [
    { label: 'Home', route: '/' },
    { label: 'Funciones', route: '/funciones' },
    { label: 'Valores', route: '/valores' },
    { label: 'Plataforma', route: '/plataforma' },
    { label: 'Registro', route: '/register' },
  ];

  protected readonly legalLinks = [
    { label: 'Politica de privacidad', route: '/politica-de-privacidad' },
    { label: 'Proteccion de datos', route: '/proteccion-de-datos' },
    { label: 'Ingresar', route: '/login' },
  ];

  protected readonly socialLinks = [
    {
      label: 'Instagram',
      shortLabel: 'IG',
      href: 'https://www.instagram.com/',
    },
    {
      label: 'LinkedIn',
      shortLabel: 'LI',
      href: 'https://www.linkedin.com/',
    },
    {
      label: 'WhatsApp',
      shortLabel: 'WA',
      href: 'https://www.whatsapp.com/',
    },
  ];
}
