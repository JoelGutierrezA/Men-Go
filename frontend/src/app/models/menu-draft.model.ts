export interface MenuCategoryDraft {
  id: string;
  name: string;
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
});

export const createEmptyMenuDraft = (): MenuDraft => ({
  businessTitle: '',
  logoDataUrl: null,
  categories: [],
  theme: createDefaultMenuTheme(),
});
