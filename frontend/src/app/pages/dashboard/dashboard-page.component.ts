import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard-page',
  imports: [MatCardModule],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  protected readonly sections = [
    {
      title: 'Restaurantes',
      description:
        'Preparado para alojar la configuración principal de cada negocio y sus futuras sucursales.',
    },
    {
      title: 'Categorías y productos',
      description:
        'Base lista para estructurar menús digitales, precios, descripciones e imágenes.',
    },
    {
      title: 'Promociones',
      description:
        'Espacio reservado para campañas, destacados y activaciones comerciales.',
    },
    {
      title: 'Temas visuales',
      description:
        'Módulo pensado para personalizar la presentación del menú por marca o local.',
    },
  ];
}
