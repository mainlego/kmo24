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
const originalContent = ref<PageContent | null>(null);
const selectedElement = ref<string | null>(null);
const registeredElements = ref<Record<string, EditableElementInfo>>({});
const selectedElementInfo = ref<EditableElementInfo | null>(null);
const isContentLoaded = ref(false);
const loadedPageId = ref<string | null>(null);

export function usePageEditor() {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBaseUrl;

  // Check if user is admin
  const authStore = useAuthStore();
  const isAdmin = computed(() => authStore.user?.role === 'admin');

  // Load page content without edit mode (for displaying saved content)
  const loadPageContent = async (pageId: string) => {
    // Skip if already loaded for this page
    if (loadedPageId.value === pageId && isContentLoaded.value) {
      return;
    }

    try {
      const response = await fetch(`${apiBase}/settings/pages/${pageId}`);
      const data = await response.json();
      console.log('Loaded page content:', pageId, data);
      if (data.success && data.data) {
        // data.data may be { content: {...} } or just the content object
        const content = data.data.content || data.data;
        originalContent.value = {
          pageId,
          elements: typeof content === 'object' ? content : {},
          updatedAt: data.data.updatedAt,
        };
      } else {
        originalContent.value = { pageId, elements: {} };
      }
      loadedPageId.value = pageId;
      isContentLoaded.value = true;
    } catch (error) {
      console.error('Failed to load page content:', error);
      originalContent.value = { pageId, elements: {} };
      loadedPageId.value = pageId;
      isContentLoaded.value = true;
    }
  };

  // Enable edit mode for a specific page
  const enableEditMode = async (pageId: string) => {
    if (!isAdmin.value) return;

    currentPageId.value = pageId;
    isEditMode.value = true;
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
        originalContent.value = {
          pageId,
          elements: typeof content === 'object' ? content : {},
          updatedAt: data.data.updatedAt,
        };
      } else {
        originalContent.value = { pageId, elements: {} };
      }
      loadedPageId.value = pageId;
      isContentLoaded.value = true;
    } catch (error) {
      console.error('Failed to load page content:', error);
      originalContent.value = { pageId, elements: {} };
    }
  };

  // Disable edit mode
  const disableEditMode = () => {
    isEditMode.value = false;
    currentPageId.value = null;
    pendingChanges.value = {};
    selectedElement.value = null;
    // Don't reset originalContent - it should persist for display
  };

  // Update element value
  const updateElement = (elementId: string, value: any) => {
    pendingChanges.value[elementId] = value;
  };

  // Get element value (pending change or original)
  const getElementValue = (elementId: string, defaultValue: any = '') => {
    if (pendingChanges.value[elementId] !== undefined) {
      return pendingChanges.value[elementId];
    }
    if (originalContent.value?.elements[elementId] !== undefined) {
      return originalContent.value.elements[elementId];
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
    if (originalContent.value?.elements[elementId] !== undefined) {
      return originalContent.value.elements[elementId];
    }
    if (registeredElements.value[elementId]) {
      return registeredElements.value[elementId].defaultValue;
    }
    return '';
  };

  // Save all changes
  const saveChanges = async () => {
    if (!currentPageId.value || !hasChanges.value) return;

    isSaving.value = true;
    try {
      const mergedContent = {
        ...(originalContent.value?.elements || {}),
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
        // Update original content with saved changes
        if (originalContent.value) {
          originalContent.value.elements = mergedContent;
        }
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

  return {
    // State
    isEditMode: readonly(isEditMode),
    isAdmin,
    currentPageId: readonly(currentPageId),
    pendingChanges: readonly(pendingChanges),
    isSaving: readonly(isSaving),
    selectedElement: readonly(selectedElement),
    selectedElementInfo: readonly(selectedElementInfo),
    registeredElements: readonly(registeredElements),
    hasChanges,
    isContentLoaded: readonly(isContentLoaded),

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
