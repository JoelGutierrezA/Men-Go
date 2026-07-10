import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MarketingFooterComponent } from '@shared/ui/marketing-footer/marketing-footer.component';
import { MarketingHeaderComponent } from '@shared/ui/marketing-header/marketing-header.component';

@Component({
  selector: 'app-platform-page',
  imports: [
    MarketingFooterComponent,
    MarketingHeaderComponent,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './platform-page.component.html',
  styleUrl: './platform-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlatformPageComponent {
  protected readonly builderSteps = [
    {
      title: 'Identidad del negocio',
      description:
        'El usuario define nombre, logo y base visual antes de empezar a cargar el menu.',
    },
    {
      title: 'Categorias principales',
      description:
        'Puede ordenar entradas, platos, bebidas y postres para estructurar la experiencia.',
    },
    {
      title: 'Previsualizacion en vivo',
      description:
        'Mientras edita, ve como quedara el menu digital para sus clientes.',
    },
  ];

  protected readonly builderCategories = [
    'Entradas',
    'Platos del dia',
    'Bebidas',
    'Postres',
  ];
}
