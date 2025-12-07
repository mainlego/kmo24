import { ref, computed, readonly } from 'vue';

interface EditableElement {
  id: string;
  type: 'text' | 'image' | 'block' | 'link';
  selector: string;
  value: any;
  originalValue: any;
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

export function usePageEditor() {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBaseUrl;

  // Check if user is admin
  const authStore = useAuthStore();
  const isAdmin = computed(() => authStore.user?.role === 'admin');

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
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      const data = await response.json();
      if (data.success && data.data) {
        originalContent.value = {
          pageId,
          elements: data.data.content || {},
          updatedAt: data.data.updatedAt,
        };
      } else {
        originalContent.value = { pageId, elements: {} };
      }
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
    originalContent.value = null;
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

  // Select element for editing
  const selectElement = (elementId: string | null) => {
    selectedElement.value = elementId;
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
          Authorization: `Bearer ${authStore.token}`,
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
    hasChanges,

    // Actions
    enableEditMode,
    disableEditMode,
    cancelEditMode,
    updateElement,
    getElementValue,
    selectElement,
    saveChanges,
    discardChanges,
  };
}
