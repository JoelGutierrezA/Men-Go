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
  MenuPromotionDay,
  MenuPromotionDraft,
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

type StoredPromotionDraft = Partial<MenuPromotionDraft>;

type StoredMenuDraft = Partial<Omit<MenuDraft, 'categories' | 'theme' | 'publication'>> & {
  categories?: StoredCategoryDraft[];
  promotions?: StoredPromotionDraft[];
  theme?: Partial<MenuThemeDraft>;
  publication?: Partial<MenuPublicationDraft>;
};

type MenuProductPatch = Partial<Omit<MenuProductDraft, 'id'>> & {
  categoryId?: string;
};

@Injectable({ providedIn: 'root' })
export class MenuDraftService {
  private static readonly storagePrefix = 'noren-menu-draft';
  private static readonly legacyStoragePrefix = 'menugo-menu-draft';
  private static readonly publicMenuBaseUrl = 'https://noren.cl/menu';

  private readonly authService = inject(AuthService);
  private readonly draftState = signal<MenuDraft>(createEmptyMenuDraft());
  private readonly storageKey = computed(() => {
    const currentUser = this.authService.currentUser();
    return currentUser
      ? `${MenuDraftService.storagePrefix}:${currentUser.email.toLowerCase()}`
      : null;
  });
  private readonly legacyStorageKey = computed(() => {
    const currentUser = this.authService.currentUser();

    if (!currentUser) {
      return null;
    }

    const email = currentUser.email.toLowerCase();
    const legacyEmail = email === 'admin@noren.com' ? 'admin@menugo.com' : email;
    return `${MenuDraftService.legacyStoragePrefix}:${legacyEmail}`;
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
  readonly activePromotionsCount = computed(
    () => this.draftState().promotions.filter((promotion) => promotion.active).length,
  );

  constructor() {
    effect(() => {
      const key = this.storageKey();
      const legacyKey = this.legacyStorageKey();

      untracked(() => {
        this.draftState.set(key ? this.restoreDraft(key, legacyKey) : createEmptyMenuDraft());
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

  updateBranchCount(value: number): void {
    const branchCount = this.clampBranchCount(value);

    this.draftState.update((draft) => ({
      ...draft,
      branchCount,
      branchAddresses: this.resizeBranchAddresses(
        draft.branchAddresses,
        branchCount,
      ),
    }));
  }

  updateHeadquartersAddress(headquartersAddress: string): void {
    this.draftState.update((draft) => ({
      ...draft,
      headquartersAddress,
    }));
  }

  updateBranchAddress(index: number, address: string): void {
    if (index < 0) {
      return;
    }

    this.draftState.update((draft) => {
      const branchAddresses = this.resizeBranchAddresses(
        draft.branchAddresses,
        draft.branchCount,
      );

      if (index >= branchAddresses.length) {
        return draft;
      }

      branchAddresses[index] = address;

      return {
        ...draft,
        branchAddresses,
      };
    });
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

  addPromotion(
    promotion: Omit<MenuPromotionDraft, 'id'>,
  ): { success: boolean; reason?: 'name' | 'category' | 'discount' | 'schedule' } {
    const normalizedName = promotion.name.trim();

    if (!normalizedName) {
      return { success: false, reason: 'name' };
    }

    if (promotion.categoryIds.length === 0) {
      return { success: false, reason: 'category' };
    }

    if (promotion.discountPercent < 1 || promotion.discountPercent > 100) {
      return { success: false, reason: 'discount' };
    }

    if (!promotion.startTime || !promotion.endTime || promotion.days.length === 0) {
      return { success: false, reason: 'schedule' };
    }

    this.draftState.update((draft) => ({
      ...draft,
      promotions: [
        ...draft.promotions,
        {
          ...promotion,
          id: this.createPromotionId(),
          name: normalizedName,
        },
      ],
    }));

    return { success: true };
  }

  togglePromotionActive(promotionId: string): void {
    this.draftState.update((draft) => ({
      ...draft,
      promotions: draft.promotions.map((promotion) =>
        promotion.id === promotionId
          ? { ...promotion, active: !promotion.active }
          : promotion,
      ),
    }));
  }

  removePromotion(promotionId: string): void {
    this.draftState.update((draft) => ({
      ...draft,
      promotions: draft.promotions.filter((promotion) => promotion.id !== promotionId),
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

  private restoreDraft(storageKey: string, legacyStorageKey: string | null): MenuDraft {
    const storedDraft =
      localStorage.getItem(storageKey) ??
      (legacyStorageKey ? localStorage.getItem(legacyStorageKey) : null);

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
      const branchCount = this.restoreBranchCount(
        parsedDraft.branchCount,
        parsedDraft.branchAddresses,
      );

      return {
        businessTitle: parsedDraft.businessTitle ?? '',
        businessType: this.restoreBusinessType(parsedDraft.businessType),
        businessDescription: parsedDraft.businessDescription ?? '',
        logoDataUrl: parsedDraft.logoDataUrl ?? null,
        branchCount,
        headquartersAddress: parsedDraft.headquartersAddress ?? '',
        branchAddresses: this.restoreBranchAddresses(
          parsedDraft.branchAddresses,
          branchCount,
        ),
        categories: this.restoreCategories(parsedDraft.categories),
        promotions: this.restorePromotions(parsedDraft.promotions),
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

  private restorePromotions(
    promotions: StoredPromotionDraft[] | undefined,
  ): MenuPromotionDraft[] {
    if (!Array.isArray(promotions)) {
      return [];
    }

    return promotions
      .filter((promotion) => Boolean(promotion?.id) && Boolean(promotion?.name))
      .map((promotion) => ({
        id: promotion.id ?? this.createPromotionId(),
        name: promotion.name ?? '',
        categoryIds: Array.isArray(promotion.categoryIds)
          ? promotion.categoryIds.filter(
              (categoryId): categoryId is string => typeof categoryId === 'string',
            )
          : [],
        discountPercent: this.clampDiscountPercent(promotion.discountPercent),
        days: this.restorePromotionDays(promotion.days),
        startTime: promotion.startTime ?? '17:00',
        endTime: promotion.endTime ?? '19:00',
        active: promotion.active ?? true,
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

  private restoreBranchCount(
    branchCount: unknown,
    branchAddresses: unknown,
  ): number {
    if (typeof branchCount === 'number') {
      return this.clampBranchCount(branchCount);
    }

    if (typeof branchCount === 'string') {
      return this.clampBranchCount(Number(branchCount));
    }

    return Array.isArray(branchAddresses) ? branchAddresses.length + 1 : 1;
  }

  private restoreBranchAddresses(
    branchAddresses: unknown,
    branchCount: number,
  ): string[] {
    const addresses = Array.isArray(branchAddresses)
      ? branchAddresses.filter((address): address is string => typeof address === 'string')
      : [];

    return this.resizeBranchAddresses(addresses, branchCount);
  }

  private resizeBranchAddresses(
    branchAddresses: string[],
    branchCount: number,
  ): string[] {
    const additionalBranches = Math.max(0, this.clampBranchCount(branchCount) - 1);
    const resizedAddresses = branchAddresses.slice(0, additionalBranches);

    while (resizedAddresses.length < additionalBranches) {
      resizedAddresses.push('');
    }

    return resizedAddresses;
  }

  private clampBranchCount(value: number): number {
    if (!Number.isFinite(value)) {
      return 1;
    }

    return Math.min(20, Math.max(1, Math.round(value)));
  }

  private restorePromotionDays(days: unknown): MenuPromotionDay[] {
    const validDays: MenuPromotionDay[] = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];

    if (!Array.isArray(days)) {
      return [];
    }

    return days.filter((day): day is MenuPromotionDay =>
      validDays.includes(day as MenuPromotionDay),
    );
  }

  private clampDiscountPercent(value: unknown): number {
    const numericValue =
      typeof value === 'number'
        ? value
        : typeof value === 'string'
          ? Number(value)
          : 10;

    if (!Number.isFinite(numericValue)) {
      return 10;
    }

    return Math.min(100, Math.max(1, Math.round(numericValue)));
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

  private createPromotionId(): string {
    return `promo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
}

function patchCategoryId(patch: MenuProductPatch): string | null {
  return patch.categoryId ?? null;
}
