import { NavigationItem } from '@models/navigation-item.model';

export const userNavigation: NavigationItem[] = [
  {
    label: 'Creacion de menu',
    icon: 'restaurant_menu',
    children: [
      {
        label: 'Etapa 1 - Identidad y categorias',
        route: '/panel/menu/identidad',
        icon: 'looks_one',
      },
      {
        label: 'Etapa 2 - Estilo visual',
        route: '/panel/menu/estilo',
        icon: 'palette',
      },
    ],
  },
];
