import {
  computed,
  effect,
  Injectable,
  inject,
  signal,
  untracked,
} from '@angular/core';
import {
  createDefaultMenuTheme,
  createEmptyMenuDraft,
  defaultMenuPublication,
  MenuBusinessType,
  MenuCategoryDraft,
  MenuDraft,
  MenuProductDraft,
  MenuPublicationDraft,
  MenuThemeDraft,
} from '@models/menu-draft.model';
import { AuthService } from '@services/auth.service';

type StoredProductDraft = Partial<Omit<MenuProductDraft, 'price'>> & {
  price?: number | string | null;
};

type StoredCategoryDraft = Partial<Omit<MenuCategoryDraft, 'products'>> & {
  products?: StoredProductDraft[];
};

type StoredMenuDraft = Partial<Omit<MenuDraft, 'categories' | 'theme' | 'publication'>> & {
  categories?: StoredCategoryDraft[];
  theme?: Partial<MenuThemeDraft>;
  publication?: Partial<MenuPublicationDraft>;
};

type MenuProductPatch = Partial<Omit<MenuProductDraft, 'id'>> & {
  categoryId?: string;
};

@Injectable({ providedIn: 'root' })
export class MenuDraftService {
  private static readonly storagePrefix = 'menugo-menu-draft';
  private static readonly publicMenuBaseUrl = 'https://menugo.cl/menu';

  private readonly authService = inject(AuthService);
  private readonly draftState = signal<MenuDraft>(createEmptyMenuDraft());
  private readonly storageKey = computed(() => {
    const currentUser = this.authService.currentUser();
    return currentUser
      ? `${MenuDraftService.storagePrefix}:${currentUser.email.toLowerCase()}`
      : null;
  });

  readonly draft = this.draftState.asReadonly();
  readonly categoriesCount = computed(() => this.draftState().categories.length);
  readonly visibleCategoriesCount = computed(
    () => this.draftState().categories.filter((category) => category.visible).length,
  );
  readonly productsCount = computed(() =>
    this.draftState().categories.reduce(
      (total, category) => total + category.products.length,
      0,
    ),
  );

  constructor() {
    effect(() => {
      const key = this.storageKey();

      untracked(() => {
        this.draftState.set(key ? this.restoreDraft(key) : createEmptyMenuDraft());
      });
    });

    effect(() => {
      const key = this.storageKey();
      const draft = this.draftState();

      if (!key) {
        return;
      }

      localStorage.setItem(key, JSON.stringify(draft));
    });
  }

  updateBusiness(
    patch: Partial<
      Pick<MenuDraft, 'businessTitle' | 'businessType' | 'businessDescription'>
    >,
  ): void {
    this.draftState.update((draft) => {
      const nextTitle = patch.businessTitle ?? draft.businessTitle;
      const nextSlug =
        draft.publication.slug || !patch.businessTitle
          ? draft.publication.slug
          : this.createSlug(nextTitle);

      return {
        ...draft,
        ...patch,
        publication: {
          ...draft.publication,
          slug: nextSlug,
          publicUrl: nextSlug ? this.buildPublicUrl(nextSlug) : draft.publication.publicUrl,
        },
      };
    });
  }

  updateTitle(title: string): void {
    this.updateBusiness({ businessTitle: title });
  }

  updateBusinessType(businessType: MenuBusinessType): void {
    this.updateBusiness({ businessType });
  }

  setLogo(logoDataUrl: string): void {
    this.draftState.update((draft) => ({
      ...draft,
      logoDataUrl,
    }));
  }

  clearLogo(): void {
    this.draftState.update((draft) => ({
      ...draft,
      logoDataUrl: null,
    }));
  }

  addCategory(name: string): { success: boolean; reason?: 'empty' | 'duplicate' } {
    const normalizedName = name.trim();

    if (!normalizedName) {
      return { success: false, reason: 'empty' };
    }

    const alreadyExists = this.draftState().categories.some(
      (category) => category.name.toLowerCase() === normalizedName.toLowerCase(),
    );

    if (alreadyExists) {
      return { success: false, reason: 'duplicate' };
    }

    this.draftState.update((draft) => ({
      ...draft,
      categories: [
        ...draft.categories,
        {
          id: this.createCategoryId(),
          name: normalizedName,
          visible: true,
          products: [],
        },
      ],
    }));

    return { success: true };
  }

  updateCategoryName(
    categoryId: string,
    name: string,
  ): { success: boolean; reason?: 'empty' | 'duplicate' } {
    const normalizedName = name.trim();

    if (!normalizedName) {
      return { success: false, reason: 'empty' };
    }

    const alreadyExists = this.draftState().categories.some(
      (category) =>
        category.id !== categoryId &&
        category.name.toLowerCase() === normalizedName.toLowerCase(),
    );

    if (alreadyExists) {
      return { success: false, reason: 'duplicate' };
    }

    this.draftState.update((draft) => ({
      ...draft,
      categories: draft.categories.map((category) =>
        category.id === categoryId ? { ...category, name: normalizedName } : category,
      ),
    }));

    return { success: true };
  }

  toggleCategoryVisibility(categoryId: string): void {
    this.draftState.update((draft) => ({
      ...draft,
      categories: draft.categories.map((category) =>
        category.id === categoryId
          ? { ...category, visible: !category.visible }
          : category,
      ),
    }));
  }

  reorderCategories(previousIndex: number, currentIndex: number): void {
    this.draftState.update((draft) => {
      const categories = [...draft.categories];
      const [movedCategory] = categories.splice(previousIndex, 1);

      if (!movedCategory) {
        return draft;
      }

      categories.splice(currentIndex, 0, movedCategory);

      return {
        ...draft,
        categories,
      };
    });
  }

  moveCategory(categoryId: string, direction: -1 | 1): void {
    const currentIndex = this.draftState().categories.findIndex(
      (category) => category.id === categoryId,
    );

    if (currentIndex < 0) {
      return;
    }

    this.reorderCategories(currentIndex, currentIndex + direction);
  }

  removeCategory(categoryId: string): void {
    this.draftState.update((draft) => ({
      ...draft,
      categories: draft.categories.filter((category) => category.id !== categoryId),
    }));
  }

  addProduct(
    categoryId: string,
    product: Omit<MenuProductDraft, 'id'>,
  ): { success: boolean; reason?: 'category' | 'name' | 'price' } {
    const normalizedName = product.name.trim();

    if (!categoryId || !this.hasCategory(categoryId)) {
      return { success: false, reason: 'category' };
    }

    if (!normalizedName) {
      return { success: false, reason: 'name' };
    }

    if (product.price === null || product.price < 0) {
      return { success: false, reason: 'price' };
    }

    this.draftState.update((draft) => ({
      ...draft,
      categories: draft.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              products: [
                ...category.products,
                {
                  ...product,
                  id: this.createProductId(),
                  name: normalizedName,
                  description: product.description.trim(),
                },
              ],
            }
          : category,
      ),
    }));

    return { success: true };
  }

  updateProduct(
    categoryId: string,
    productId: string,
    patch: MenuProductPatch,
  ): void {
    const targetCategoryId = patchCategoryId(patch);
    const { categoryId: _categoryId, ...productPatch } = patch;

    if (targetCategoryId && targetCategoryId !== categoryId) {
      this.moveProductToCategory(categoryId, productId, targetCategoryId, patch);
      return;
    }

    this.draftState.update((draft) => ({
      ...draft,
      categories: draft.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              products: category.products.map((product) =>
                product.id === productId
                  ? {
                      ...product,
                      ...productPatch,
                      name: productPatch.name?.trim() ?? product.name,
                      description: productPatch.description?.trim() ?? product.description,
                    }
                  : product,
              ),
            }
          : category,
      ),
    }));
  }

  duplicateProduct(categoryId: string, productId: string): void {
    const sourceCategory = this.draftState().categories.find(
      (category) => category.id === categoryId,
    );
    const sourceProduct = sourceCategory?.products.find(
      (product) => product.id === productId,
    );

    if (!sourceProduct) {
      return;
    }

    this.draftState.update((draft) => ({
      ...draft,
      categories: draft.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              products: [
                ...category.products,
                {
                  ...sourceProduct,
                  id: this.createProductId(),
                  name: `${sourceProduct.name} copia`,
                },
              ],
            }
          : category,
      ),
    }));
  }

  toggleProductVisibility(categoryId: string, productId: string): void {
    const product = this.findProduct(categoryId, productId);

    if (!product) {
      return;
    }

    this.updateProduct(categoryId, productId, { visible: !product.visible });
  }

  toggleProductAvailability(categoryId: string, productId: string): void {
    const product = this.findProduct(categoryId, productId);

    if (!product) {
      return;
    }

    this.updateProduct(categoryId, productId, { available: !product.available });
  }

  removeProduct(categoryId: string, productId: string): void {
    this.draftState.update((draft) => ({
      ...draft,
      categories: draft.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              products: category.products.filter((product) => product.id !== productId),
            }
          : category,
      ),
    }));
  }

  updateTheme(patch: Partial<MenuThemeDraft>): void {
    this.draftState.update((draft) => ({
      ...draft,
      theme: {
        ...draft.theme,
        ...patch,
      },
    }));
  }

  resetThemeColor(key: keyof Pick<
    MenuThemeDraft,
    'primaryColor' | 'backgroundColor' | 'categoryColor' | 'titleColor' | 'textColor'
  >): void {
    this.updateTheme({ [key]: createDefaultMenuTheme()[key] });
  }

  updatePublicationSlug(slug: string): void {
    const normalizedSlug = this.createSlug(slug);
    this.draftState.update((draft) => ({
      ...draft,
      publication: {
        ...draft.publication,
        slug: normalizedSlug,
        publicUrl: normalizedSlug ? this.buildPublicUrl(normalizedSlug) : '',
      },
    }));
  }

  publishMenu(): { success: boolean; reason?: 'slug' | 'business' | 'product' } {
    const draft = this.draftState();
    const slug = draft.publication.slug || this.createSlug(draft.businessTitle);

    if (!draft.businessTitle.trim()) {
      return { success: false, reason: 'business' };
    }

    if (this.productsCount() === 0) {
      return { success: false, reason: 'product' };
    }

    if (!slug) {
      return { success: false, reason: 'slug' };
    }

    this.draftState.update((currentDraft) => ({
      ...currentDraft,
      publication: {
        status: 'published',
        slug,
        publicUrl: this.buildPublicUrl(slug),
        publishedAt: new Date().toISOString(),
      },
    }));

    return { success: true };
  }

  formatPrice(price: number | null): string {
    if (price === null) {
      return '$0';
    }

    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(price);
  }

  private restoreDraft(storageKey: string): MenuDraft {
    const storedDraft = localStorage.getItem(storageKey);

    if (!storedDraft) {
      return createEmptyMenuDraft();
    }

    try {
      const parsedDraft = JSON.parse(storedDraft) as StoredMenuDraft;
      const defaultTheme = createDefaultMenuTheme();
      const defaultPublication = defaultMenuPublication();
      const restoredSlug =
        parsedDraft.publication?.slug ??
        this.createSlug(parsedDraft.businessTitle ?? '');

      return {
        businessTitle: parsedDraft.businessTitle ?? '',
        businessType: this.restoreBusinessType(parsedDraft.businessType),
        businessDescription: parsedDraft.businessDescription ?? '',
        logoDataUrl: parsedDraft.logoDataUrl ?? null,
        categories: this.restoreCategories(parsedDraft.categories),
        theme: {
          ...defaultTheme,
          ...(parsedDraft.theme ?? {}),
        },
        publication: {
          ...defaultPublication,
          ...(parsedDraft.publication ?? {}),
          slug: restoredSlug,
          publicUrl: restoredSlug
            ? this.buildPublicUrl(restoredSlug)
            : parsedDraft.publication?.publicUrl ?? '',
        },
      };
    } catch {
      return createEmptyMenuDraft();
    }
  }

  private restoreCategories(categories: StoredCategoryDraft[] | undefined): MenuCategoryDraft[] {
    if (!Array.isArray(categories)) {
      return [];
    }

    return categories
      .filter((category) => Boolean(category?.id) && Boolean(category?.name))
      .map((category) => ({
        id: category.id ?? this.createCategoryId(),
        name: category.name ?? '',
        visible: category.visible ?? true,
        products: this.restoreProducts(category.products),
      }));
  }

  private restoreProducts(products: StoredProductDraft[] | undefined): MenuProductDraft[] {
    if (!Array.isArray(products)) {
      return [];
    }

    return products
      .filter((product) => Boolean(product?.id) && Boolean(product?.name))
      .map((product) => ({
        id: product.id ?? this.createProductId(),
        name: product.name ?? '',
        description: product.description ?? '',
        price: this.parsePrice(product.price),
        imageDataUrl: product.imageDataUrl ?? null,
        visible: product.visible ?? true,
        available: product.available ?? true,
      }));
  }

  private restoreBusinessType(value: unknown): MenuBusinessType {
    const validTypes: MenuBusinessType[] = [
      'restaurante',
      'bar',
      'pub',
      'cafeteria',
      'food-truck',
      'otro',
    ];

    return validTypes.includes(value as MenuBusinessType)
      ? (value as MenuBusinessType)
      : 'restaurante';
  }

  private parsePrice(price: number | string | null | undefined): number | null {
    if (typeof price === 'number') {
      return price >= 0 ? Math.round(price) : null;
    }

    if (typeof price !== 'string') {
      return null;
    }

    const onlyDigits = price.replace(/\D/g, '');
    const parsedPrice = Number(onlyDigits);

    return Number.isFinite(parsedPrice) ? parsedPrice : null;
  }

  private hasCategory(categoryId: string): boolean {
    return this.draftState().categories.some((category) => category.id === categoryId);
  }

  private findProduct(categoryId: string, productId: string): MenuProductDraft | undefined {
    return this.draftState()
      .categories.find((category) => category.id === categoryId)
      ?.products.find((product) => product.id === productId);
  }

  private moveProductToCategory(
    sourceCategoryId: string,
    productId: string,
    targetCategoryId: string,
    patch: MenuProductPatch,
  ): void {
    if (!this.hasCategory(targetCategoryId)) {
      return;
    }

    const sourceProduct = this.findProduct(sourceCategoryId, productId);

    if (!sourceProduct) {
      return;
    }

    const { categoryId: _categoryId, ...productPatch } = patch;
    const nextProduct: MenuProductDraft = {
      ...sourceProduct,
      ...productPatch,
      name: productPatch.name?.trim() ?? sourceProduct.name,
      description: productPatch.description?.trim() ?? sourceProduct.description,
    };

    this.draftState.update((draft) => ({
      ...draft,
      categories: draft.categories.map((category) => {
        if (category.id === sourceCategoryId) {
          return {
            ...category,
            products: category.products.filter((product) => product.id !== productId),
          };
        }

        if (category.id === targetCategoryId) {
          return {
            ...category,
            products: [...category.products, nextProduct],
          };
        }

        return category;
      }),
    }));
  }

  private createSlug(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private buildPublicUrl(slug: string): string {
    return `${MenuDraftService.publicMenuBaseUrl}/${slug}`;
  }

  private createCategoryId(): string {
    return `cat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private createProductId(): string {
    return `prod-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
}

function patchCategoryId(patch: MenuProductPatch): string | null {
  return patch.categoryId ?? null;
}
