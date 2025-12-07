import { ref, computed, readonly } from 'vue';

interface EditableElementInfo {
  id: string;
  type: 'text' | 'html' | 'image' | 'icon' | 'link' | 'background';
  defaultValue: string;
  label?: string;
}

interface PageContent {
  pageId: string;
  elements: Record<string, any>;
  updatedAt?: string;
}

const isEditMode = ref(false);
const currentPageId = ref<string | null>(null);
const pendingChanges = ref<Record<string, any>>({});
const isSaving = ref(false);
const selectedElement = ref<string | null>(null);
const registeredElements = ref<Record<string, EditableElementInfo>>({});
const selectedElementInfo = ref<EditableElementInfo | null>(null);

// Store content per page
const pagesContent = ref<Record<string, PageContent>>({});

export function usePageEditor() {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBaseUrl;

  // Check if user is admin
  const authStore = useAuthStore();
  const isAdmin = computed(() => authStore.user?.role === 'admin');

  // Load page content without edit mode (for displaying saved content)
  const loadPageContent = async (pageId: string) => {
    console.log(`[PageEditor] loadPageContent('${pageId}') called, cache exists:`, !!pagesContent.value[pageId]);

    // Always load if not in cache
    if (pagesContent.value[pageId]) {
      currentPageId.value = pageId;
      console.log(`[PageEditor] Using cached content for '${pageId}', elements:`, pagesContent.value[pageId].elements);
      return;
    }

    try {
      const url = `${apiBase}/settings/pages/${pageId}`;
      console.log(`[PageEditor] Fetching from: ${url}`);
      const response = await fetch(url);
      const data = await response.json();
      console.log(`[PageEditor] API response for '${pageId}':`, data);

      if (data.success && data.data) {
        // data.data may be { content: {...} } or just the content object
        const content = data.data.content || data.data;
        console.log(`[PageEditor] Parsed content for '${pageId}':`, content);
        pagesContent.value[pageId] = {
          pageId,
          elements: typeof content === 'object' ? content : {},
          updatedAt: data.data.updatedAt,
        };
        console.log(`[PageEditor] Stored elements for '${pageId}':`, pagesContent.value[pageId].elements);
      } else {
        console.log(`[PageEditor] No data in response, using empty elements`);
        pagesContent.value[pageId] = { pageId, elements: {} };
      }
      currentPageId.value = pageId;
    } catch (error) {
      console.error('[PageEditor] Failed to load page content:', error);
      pagesContent.value[pageId] = { pageId, elements: {} };
      currentPageId.value = pageId;
    }
  };

  // Enable edit mode for a specific page
  const enableEditMode = async (pageId: string) => {
    console.log(`[PageEditor] enableEditMode('${pageId}') called, isAdmin:`, isAdmin.value);
    if (!isAdmin.value) {
      console.log('[PageEditor] Not admin, skipping edit mode');
      return;
    }

    currentPageId.value = pageId;
    isEditMode.value = true;
    console.log('[PageEditor] Edit mode ENABLED, isEditMode.value =', isEditMode.value);
    pendingChanges.value = {};

    // Load current page content from server
    try {
      const response = await fetch(`${apiBase}/settings/pages/${pageId}`, {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      });
      const data = await response.json();
      if (data.success && data.data) {
        // data.data may be { content: {...} } or just the content object
        const content = data.data.content || data.data;
        pagesContent.value[pageId] = {
          pageId,
          elements: typeof content === 'object' ? content : {},
          updatedAt: data.data.updatedAt,
        };
      } else {
        pagesContent.value[pageId] = { pageId, elements: {} };
      }
    } catch (error) {
      console.error('Failed to load page content:', error);
      pagesContent.value[pageId] = { pageId, elements: {} };
    }
  };

  // Disable edit mode
  const disableEditMode = () => {
    isEditMode.value = false;
    pendingChanges.value = {};
    selectedElement.value = null;
    // Don't reset pagesContent or currentPageId - they should persist for display
  };

  // Update element value
  const updateElement = (elementId: string, value: any) => {
    pendingChanges.value[elementId] = value;
  };

  // Get element value (pending change or original)
  const getElementValue = (elementId: string, defaultValue: any = '') => {
    // First check pending changes
    if (pendingChanges.value[elementId] !== undefined) {
      return pendingChanges.value[elementId];
    }

    // Then check current page content
    if (currentPageId.value && pagesContent.value[currentPageId.value]?.elements[elementId] !== undefined) {
      const savedValue = pagesContent.value[currentPageId.value].elements[elementId];
      console.log(`[PageEditor] getElementValue('${elementId}'): found saved value`, savedValue);
      return savedValue;
    }

    // Debug log
    if (currentPageId.value) {
      console.log(`[PageEditor] getElementValue('${elementId}'): no saved value, currentPageId=${currentPageId.value}, pagesContent keys=`, Object.keys(pagesContent.value), 'elements=', pagesContent.value[currentPageId.value]?.elements);
    }

    return defaultValue;
  };

  // Check if element has pending changes
  const hasChanges = computed(() => Object.keys(pendingChanges.value).length > 0);

  // Register an editable element with its default value
  const registerElement = (info: EditableElementInfo) => {
    registeredElements.value[info.id] = info;
  };

  // Unregister element
  const unregisterElement = (elementId: string) => {
    delete registeredElements.value[elementId];
  };

  // Select element for editing
  const selectElement = (elementId: string | null) => {
    selectedElement.value = elementId;
    if (elementId && registeredElements.value[elementId]) {
      selectedElementInfo.value = registeredElements.value[elementId];
    } else {
      selectedElementInfo.value = null;
    }
  };

  // Get current value for editing (pending > saved > default)
  const getEditingValue = (elementId: string): string => {
    if (pendingChanges.value[elementId] !== undefined) {
      return pendingChanges.value[elementId];
    }
    if (currentPageId.value && pagesContent.value[currentPageId.value]?.elements[elementId] !== undefined) {
      return pagesContent.value[currentPageId.value].elements[elementId];
    }
    if (registeredElements.value[elementId]) {
      return registeredElements.value[elementId].defaultValue;
    }
    return '';
  };

  // Get original content for current page
  const originalContent = computed(() => {
    if (currentPageId.value && pagesContent.value[currentPageId.value]) {
      return pagesContent.value[currentPageId.value];
    }
    return null;
  });

  // Save all changes
  const saveChanges = async () => {
    if (!currentPageId.value || !hasChanges.value) return;

    isSaving.value = true;
    try {
      const currentContent = pagesContent.value[currentPageId.value]?.elements || {};
      const mergedContent = {
        ...currentContent,
        ...pendingChanges.value,
      };

      const response = await fetch(`${apiBase}/settings/pages/${currentPageId.value}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.accessToken}`,
        },
        body: JSON.stringify({ content: mergedContent }),
      });

      const data = await response.json();
      if (data.success) {
        // Update cached content with saved changes
        pagesContent.value[currentPageId.value] = {
          pageId: currentPageId.value,
          elements: mergedContent,
          updatedAt: new Date().toISOString(),
        };
        pendingChanges.value = {};
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Failed to save changes:', error);
      return { success: false, error: 'Failed to save changes' };
    } finally {
      isSaving.value = false;
    }
  };

  // Discard all changes
  const discardChanges = () => {
    pendingChanges.value = {};
    selectedElement.value = null;
  };

  // Cancel edit mode with confirmation if there are changes
  const cancelEditMode = async () => {
    if (hasChanges.value) {
      const confirmed = window.confirm('У вас есть несохраненные изменения. Вы уверены, что хотите выйти?');
      if (!confirmed) return false;
    }
    disableEditMode();
    return true;
  };

  // Check if content is loaded for current page
  const isContentLoaded = computed(() => {
    return currentPageId.value ? !!pagesContent.value[currentPageId.value] : false;
  });

  return {
    // State - isEditMode returned directly for reactivity in components
    isEditMode,
    isAdmin,
    currentPageId: readonly(currentPageId),
    pendingChanges: readonly(pendingChanges),
    isSaving: readonly(isSaving),
    selectedElement: readonly(selectedElement),
    selectedElementInfo: readonly(selectedElementInfo),
    registeredElements: readonly(registeredElements),
    hasChanges,
    isContentLoaded,
    originalContent,

    // Actions
    loadPageContent,
    enableEditMode,
    disableEditMode,
    cancelEditMode,
    registerElement,
    unregisterElement,
    updateElement,
    getElementValue,
    getEditingValue,
    selectElement,
    saveChanges,
    discardChanges,
  };
}
