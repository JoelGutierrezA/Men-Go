import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface SocialLink {
  label: string;
  href: string;
  iconViewBox: string;
  iconPath: string;
}

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
    { label: 'Planes', route: '/planes' },
    { label: 'Plataforma', route: '/plataforma' },
    { label: 'Registro', route: '/register' },
  ];

  protected readonly legalLinks = [
    { label: 'Politica de privacidad', route: '/politica-de-privacidad' },
    { label: 'Proteccion de datos', route: '/proteccion-de-datos' },
    { label: 'Ingresar', route: '/login' },
  ];

  protected readonly socialLinks: SocialLink[] = [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/',
      iconViewBox: '0 0 24 24',
      iconPath:
        'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/',
      iconViewBox: '0 0 24 24',
      iconPath:
        'M6.94 8.5H3.56V20h3.38V8.5Zm.22-3.56A1.94 1.94 0 0 0 5.25 3 1.94 1.94 0 0 0 3.34 4.94c0 1.06.84 1.94 1.91 1.94h.03c1.09 0 1.88-.88 1.88-1.94ZM20.66 12.55c0-3.51-1.87-5.14-4.38-5.14-2.02 0-2.92 1.11-3.42 1.89V8.5H9.48c.04.53 0 11.5 0 11.5h3.38v-6.42c0-.34.02-.68.13-.93.27-.68.88-1.39 1.92-1.39 1.36 0 1.9 1.04 1.9 2.56V20H20v-6.99Z',
    },
    {
      label: 'WhatsApp',
      href: 'https://www.whatsapp.com/',
      iconViewBox: '0 0 24 24',
      iconPath:
        'M19.05 4.94A9.86 9.86 0 0 0 12 2a9.93 9.93 0 0 0-8.63 14.84L2 22l5.34-1.4A9.92 9.92 0 0 0 12 22a10 10 0 0 0 7.05-17.06ZM12 20.1a8.03 8.03 0 0 1-4.1-1.13l-.3-.18-3.16.83.85-3.07-.2-.32A8.05 8.05 0 1 1 12 20.1Zm4.42-6.03c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.21-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.79-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.24 1.01.39 1.36.49.57.18 1.1.16 1.52.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z',
    },
  ];
}
