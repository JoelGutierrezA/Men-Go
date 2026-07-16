import { NavigationItem } from '@models/navigation-item.model';

export const userNavigation: NavigationItem[] = [
  {
    label: 'Creación del menú',
    icon: 'restaurant_menu',
    children: [
      {
        label: 'Tu negocio',
        route: '/panel/menu/negocio',
        icon: 'storefront',
      },
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
];
