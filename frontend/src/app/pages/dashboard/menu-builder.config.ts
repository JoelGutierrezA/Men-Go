import { MenuBuilderStep } from '@models/menu-draft.model';

export interface MenuBuilderStepConfig {
  step: MenuBuilderStep;
  label: string;
  title: string;
  description: string;
  route: string;
  icon: string;
}

export const businessAdminConfig = {
  label: 'Tu negocio',
  title: 'Administra tu negocio',
  description:
    'Gestiona el nombre, tipo, logo y direcciones que identifican a tu negocio.',
  route: '/panel/negocio/datos',
  icon: 'storefront',
};

export const menuBuilderSteps: MenuBuilderStepConfig[] = [
  {
    step: 2,
    label: 'Categorías',
    title: 'Organiza tu carta',
    description:
      'Crea y ordena las secciones que ayudarán a tus clientes a explorar el menú.',
    route: '/panel/menu/categorias',
    icon: 'account_tree',
  },
  {
    step: 3,
    label: 'Productos',
    title: 'Agrega tus productos',
    description:
      'Completa la información de cada producto y asígnalo a una categoría.',
    route: '/panel/menu/productos',
    icon: 'restaurant',
  },
  {
    step: 4,
    label: 'Diseño',
    title: 'Dale personalidad a tu menú',
    description:
      'Personaliza colores, tipografías y componentes para adaptar el menú a tu marca.',
    route: '/panel/menu/diseno',
    icon: 'palette',
  },
  {
    step: 5,
    label: 'Revisión',
    title: 'Comprueba que todo esté listo',
    description:
      'Explora tu menú como lo verá un cliente y corrige cualquier detalle antes de publicarlo.',
    route: '/panel/menu/revision',
    icon: 'fact_check',
  },
  {
    step: 6,
    label: 'Publicar',
    title: 'Publica y comparte tu menú',
    description:
      'Publica tu menú y obtén un enlace para compartirlo con tus clientes.',
    route: '/panel/menu/publicar',
    icon: 'rocket_launch',
  },
];

export const getMenuBuilderStep = (
  step: MenuBuilderStep,
): MenuBuilderStepConfig =>
  menuBuilderSteps.find((stepConfig) => stepConfig.step === step) ??
  menuBuilderSteps[0];
