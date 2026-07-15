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
  MenuCategoryDraft,
  MenuDraft,
  MenuProductDraft,
  MenuThemeDraft,
} from '@models/menu-draft.model';
import { AuthService } from '@services/auth.service';

@Injectable({ providedIn: 'root' })
export class MenuDraftService {
  private static readonly storagePrefix = 'menugo-menu-draft';

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

  updateTitle(title: string): void {
    this.draftState.update((draft) => ({
      ...draft,
      businessTitle: title,
    }));
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
          products: [],
        },
      ],
    }));

    return { success: true };
  }

  removeCategory(categoryId: string): void {
    this.draftState.update((draft) => ({
      ...draft,
      categories: draft.categories.filter((category) => category.id !== categoryId),
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

  addProduct(
    categoryId: string,
    product: Omit<MenuProductDraft, 'id'>,
  ): { success: boolean; reason?: 'category' | 'name' | 'price' } {
    const normalizedName = product.name.trim();
    const normalizedPrice = product.price.trim();

    if (!categoryId || !this.draftState().categories.some((category) => category.id === categoryId)) {
      return { success: false, reason: 'category' };
    }

    if (!normalizedName) {
      return { success: false, reason: 'name' };
    }

    if (!normalizedPrice) {
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
                  id: this.createProductId(),
                  name: normalizedName,
                  description: product.description.trim(),
                  price: normalizedPrice,
                  imageDataUrl: product.imageDataUrl,
                },
              ],
            }
          : category,
      ),
    }));

    return { success: true };
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

  private restoreDraft(storageKey: string): MenuDraft {
    const storedDraft = localStorage.getItem(storageKey);

    if (!storedDraft) {
      return createEmptyMenuDraft();
    }

    try {
      const parsedDraft = JSON.parse(storedDraft) as Partial<
        Omit<MenuDraft, 'categories'>
      > & {
        categories?: Array<
          Partial<Omit<MenuCategoryDraft, 'products'>> & {
            products?: Array<Partial<MenuProductDraft>>;
          }
        >;
      };
      const defaultTheme = createDefaultMenuTheme();
      return {
        businessTitle: parsedDraft.businessTitle ?? '',
        logoDataUrl: parsedDraft.logoDataUrl ?? null,
        categories: Array.isArray(parsedDraft.categories)
          ? parsedDraft.categories
              .filter(
                (category) => Boolean(category?.id) && Boolean(category?.name),
              )
              .map((category) => ({
                id: category.id ?? this.createCategoryId(),
                name: category.name ?? '',
                products: Array.isArray(category.products)
                  ? category.products
                      .filter(
                        (product) => Boolean(product?.id) && Boolean(product?.name),
                      )
                      .map((product) => ({
                        id: product.id ?? this.createProductId(),
                        name: product.name ?? '',
                        description: product.description ?? '',
                        price: product.price ?? '',
                        imageDataUrl: product.imageDataUrl ?? null,
                      }))
                  : [],
              }))
          : [],
        theme: {
          ...defaultTheme,
          ...(parsedDraft.theme ?? {}),
        },
      };
    } catch {
      return createEmptyMenuDraft();
    }
  }

  private createCategoryId(): string {
    return `cat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private createProductId(): string {
    return `prod-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
}
