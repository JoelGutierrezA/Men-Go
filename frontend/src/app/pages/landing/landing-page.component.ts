import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  imports: [MatButtonModule, MatCardModule, MatChipsModule, RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {
  protected readonly highlights = [
    'Menús QR',
    'Panel responsive',
    'Temas visuales',
  ];

  protected readonly pillars = [
    {
      title: 'Control centralizado',
      description:
        'Arquitectura pensada para administrar restaurantes, categorías, productos y promociones desde un mismo panel.',
    },
    {
      title: 'Experiencia móvil primero',
      description:
        'Base visual preparada para que el flujo del administrador funcione bien desde celular, tablet y escritorio.',
    },
    {
      title: 'Escalabilidad preparada',
      description:
        'Servicios desacoplados y módulos separados para integrar persistencia y reglas de negocio sin reestructurar el proyecto.',
    },
  ];
}
