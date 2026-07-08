import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MarketingFooterComponent } from '@shared/ui/marketing-footer/marketing-footer.component';
import { MarketingHeaderComponent } from '@shared/ui/marketing-header/marketing-header.component';

@Component({
  selector: 'app-values-page',
  imports: [
    MarketingFooterComponent,
    MarketingHeaderComponent,
    MatButtonModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './values-page.component.html',
  styleUrl: './values-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValuesPageComponent {
  protected readonly pillars = [
    {
      title: 'Simplicidad operativa',
      description:
        'Cada decision del producto busca reducir friccion para que administrar un menu digital sea algo rapido y natural.',
    },
    {
      title: 'Velocidad con sentido',
      description:
        'Cambiar una carta, un precio o una promocion debe ser un proceso corto, entendible y repetible.',
    },
    {
      title: 'Escalabilidad sin rehacer',
      description:
        'La base actual se esta ordenando para crecer por modulos sin tener que reconstruir la plataforma en cada fase.',
    },
  ];

  protected readonly productPrinciples = [
    'Interfaces claras y mobile first para negocio y cliente final.',
    'Navegacion simple, sin pasos innecesarios ni dependencias ocultas.',
    'Prioridad en tareas frecuentes como actualizar productos, categorias y destacados.',
  ];

  protected readonly engineeringPrinciples = [
    'Arquitectura modular con responsabilidades bien separadas.',
    'Servicios desacoplados y listos para integrar persistencia real mas adelante.',
    'Base preparada para autenticacion, imagenes y futuras reglas de negocio.',
  ];
}
