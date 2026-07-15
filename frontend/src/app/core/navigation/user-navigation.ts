import { NavigationItem } from '@models/navigation-item.model';

export const userNavigation: NavigationItem[] = [
  {
    label: 'Creacion de menu',
    icon: 'restaurant_menu',
    children: [
      {
        label: 'Identidad',
        route: '/panel/menu/identidad',
        icon: 'looks_one',
      },
      {
        label: 'Estilo',
        route: '/panel/menu/estilo',
        icon: 'looks_two',
      },
      {
        label: 'Productos',
        route: '/panel/menu/productos',
        icon: 'looks_3',
      },
    ],
  },
];
