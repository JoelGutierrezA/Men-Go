export type MenuBuilderStep = 2 | 3 | 4 | 5 | 6;

export type MenuBusinessType =
  | 'restaurante'
  | 'bar'
  | 'pub'
  | 'cafeteria'
  | 'food-truck'
  | 'otro';

export type MenuPublicationStatus = 'draft' | 'published';

export type MenuTemplate = 'moderno' | 'minimalista' | 'elegante' | 'rustico';

export type MenuPromotionDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface MenuProductDraft {
  id: string;
  name: string;
  description: string;
  price: number | null;
  imageDataUrl: string | null;
  visible: boolean;
  available: boolean;
}

export interface MenuCategoryDraft {
  id: string;
  name: string;
  visible: boolean;
  products: MenuProductDraft[];
}

export interface MenuThemeDraft {
  template: MenuTemplate;
  primaryColor: string;
  backgroundColor: string;
  categoryColor: string;
  titleColor: string;
  textColor: string;
  fontFamily: string;
  titleFontSize: number;
  bodyFontSize: number;
  titleBold: boolean;
  titleItalic: boolean;
  productFontFamily: string;
  productFontSize: number;
  productNameColor: string;
  productDescriptionColor: string;
  productPriceColor: string;
  productNameBold: boolean;
  productNameItalic: boolean;
  productImageStyle: 'rounded' | 'square';
  productCardRadius: number;
  productCardSpacing: number;
}

export interface MenuPublicationDraft {
  status: MenuPublicationStatus;
  slug: string;
  publicUrl: string;
  publishedAt: string | null;
}

export interface MenuPromotionDraft {
  id: string;
  name: string;
  categoryIds: string[];
  discountPercent: number;
  days: MenuPromotionDay[];
  startTime: string;
  endTime: string;
  active: boolean;
}

export interface MenuDraft {
  businessTitle: string;
  businessType: MenuBusinessType;
  businessDescription: string;
  logoDataUrl: string | null;
  branchCount: number;
  headquartersAddress: string;
  branchAddresses: string[];
  categories: MenuCategoryDraft[];
  promotions: MenuPromotionDraft[];
  theme: MenuThemeDraft;
  publication: MenuPublicationDraft;
}

export const defaultMenuPublication = (): MenuPublicationDraft => ({
  status: 'draft',
  slug: '',
  publicUrl: '',
  publishedAt: null,
});

export const createDefaultMenuTheme = (): MenuThemeDraft => ({
  template: 'moderno',
  primaryColor: '#2bb673',
  backgroundColor: '#f6fbf8',
  categoryColor: '#2bb673',
  titleColor: '#1c1c1c',
  textColor: '#4d5b68',
  fontFamily: 'Manrope, sans-serif',
  titleFontSize: 34,
  bodyFontSize: 16,
  titleBold: true,
  titleItalic: false,
  productFontFamily: 'Manrope, sans-serif',
  productFontSize: 16,
  productNameColor: '#1c1c1c',
  productDescriptionColor: '#5f6f7b',
  productPriceColor: '#138a55',
  productNameBold: true,
  productNameItalic: false,
  productImageStyle: 'rounded',
  productCardRadius: 14,
  productCardSpacing: 12,
});

export const createEmptyMenuDraft = (): MenuDraft => ({
  businessTitle: '',
  businessType: 'restaurante',
  businessDescription: '',
  logoDataUrl: null,
  branchCount: 1,
  headquartersAddress: '',
  branchAddresses: [],
  categories: [],
  promotions: [],
  theme: createDefaultMenuTheme(),
  publication: defaultMenuPublication(),
});
