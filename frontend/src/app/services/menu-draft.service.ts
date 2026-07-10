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
  MenuDraft,
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

  private restoreDraft(storageKey: string): MenuDraft {
    const storedDraft = localStorage.getItem(storageKey);

    if (!storedDraft) {
      return createEmptyMenuDraft();
    }

    try {
      const parsedDraft = JSON.parse(storedDraft) as Partial<MenuDraft>;
      const defaultTheme = createDefaultMenuTheme();
      return {
        businessTitle: parsedDraft.businessTitle ?? '',
        logoDataUrl: parsedDraft.logoDataUrl ?? null,
        categories: Array.isArray(parsedDraft.categories)
          ? parsedDraft.categories.filter(
              (category): category is { id: string; name: string } =>
                Boolean(category?.id) && Boolean(category?.name),
            )
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
}
