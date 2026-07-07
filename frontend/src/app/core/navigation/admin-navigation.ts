import { NavigationItem } from '@models/navigation-item.model';

export const adminNavigation: NavigationItem[] = [
  {
    label: 'Dashboard',
    route: '/admin/dashboard',
    icon: 'space_dashboard',
  },
  {
    label: 'Restaurantes',
    route: '/admin/restaurants',
    icon: 'storefront',
    disabled: true,
  },
  {
    label: 'Categorías',
    route: '/admin/categories',
    icon: 'category',
    disabled: true,
  },
  {
    label: 'Productos',
    route: '/admin/products',
    icon: 'restaurant_menu',
    disabled: true,
  },
  {
    label: 'Promociones',
    route: '/admin/promotions',
    icon: 'local_offer',
    disabled: true,
  },
  {
    label: 'Temas',
    route: '/admin/themes',
    icon: 'palette',
    disabled: true,
  },
];
