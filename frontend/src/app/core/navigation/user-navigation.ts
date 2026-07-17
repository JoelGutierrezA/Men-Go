import { NavigationItem } from '@models/navigation-item.model';

export const userNavigation: NavigationItem[] = [
  {
    label: 'Tu Negocio',
    icon: 'storefront',
    children: [
      {
        label: 'Datos del negocio',
        route: '/panel/negocio/datos',
        icon: 'badge',
      },
    ],
  },
  {
    label: 'Crea tu Menú',
    icon: 'restaurant_menu',
    children: [
      {
        label: 'Categorías',
        route: '/panel/menu/categorias',
        icon: 'account_tree',
      },
      {
        label: 'Productos',
        route: '/panel/menu/productos',
        icon: 'restaurant',
      },
      {
        label: 'Diseño',
        route: '/panel/menu/diseno',
        icon: 'palette',
      },
      {
        label: 'Revisión',
        route: '/panel/menu/revision',
        icon: 'fact_check',
      },
      {
        label: 'Publicar',
        route: '/panel/menu/publicar',
        icon: 'rocket_launch',
      },
    ],
  },
  {
    label: 'Promociones',
    icon: 'sell',
    children: [
      {
        label: 'Por horarios',
        route: '/panel/promociones/horarios',
        icon: 'schedule',
      },
    ],
  },
];
