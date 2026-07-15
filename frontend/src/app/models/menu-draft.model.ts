export interface MenuProductDraft {
  id: string;
  name: string;
  description: string;
  price: string;
  imageDataUrl: string | null;
}

export interface MenuCategoryDraft {
  id: string;
  name: string;
  products: MenuProductDraft[];
}

export interface MenuThemeDraft {
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
}

export interface MenuDraft {
  businessTitle: string;
  logoDataUrl: string | null;
  categories: MenuCategoryDraft[];
  theme: MenuThemeDraft;
}

export const createDefaultMenuTheme = (): MenuThemeDraft => ({
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
});

export const createEmptyMenuDraft = (): MenuDraft => ({
  businessTitle: '',
  logoDataUrl: null,
  categories: [],
  theme: createDefaultMenuTheme(),
});
