<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div v-if="isEditMode" class="visual-editor-toolbar">
        <div class="toolbar-content">
          <div class="toolbar-info">
            <div class="toolbar-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div class="toolbar-text">
              <span class="toolbar-title">Режим редактирования</span>
              <span class="toolbar-page">{{ currentPageName }}</span>
            </div>
          </div>

          <div class="toolbar-status">
            <span v-if="hasChanges" class="status-badge status-unsaved">
              <span class="status-dot"></span>
              Есть несохраненные изменения
            </span>
            <span v-else class="status-badge status-saved">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Все сохранено
            </span>
          </div>

          <div class="toolbar-actions">
            <button class="btn btn-secondary" @click="handleDiscard" :disabled="!hasChanges || isSaving">
              Отменить изменения
            </button>
            <button class="btn btn-primary" @click="handleSave" :disabled="!hasChanges || isSaving">
              <span v-if="isSaving" class="spinner"></span>
              <span v-else>Сохранить</span>
            </button>
            <button class="btn btn-close" @click="handleExit" title="Выйти из редактирования">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Edit instruction hint -->
        <div v-if="showHint" class="toolbar-hint">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Нажмите на выделенные элементы для редактирования</span>
          <button class="hint-close" @click="showHint = false">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Element Editor Modal -->
    <Transition name="fade">
      <div v-if="isEditMode && selectedElement" class="element-editor-overlay" @click.self="closeElementEditor">
        <div class="element-editor-modal">
          <div class="modal-header">
            <h3>{{ elementLabel }}</h3>
            <button class="close-btn" @click="closeElementEditor">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <!-- Text/HTML editor -->
            <div v-if="elementType === 'text' || elementType === 'html'" class="form-group">
              <label>Содержимое</label>
              <textarea
                ref="textareaRef"
                v-model="editingValue"
                :rows="elementType === 'html' ? 8 : 4"
                class="form-textarea"
                placeholder="Введите текст..."
              ></textarea>
              <span v-if="elementType === 'html'" class="form-hint">Поддерживается HTML разметка</span>
            </div>

            <!-- Image editor -->
            <div v-else-if="elementType === 'image'" class="form-group">
              <label>URL изображения</label>
              <input
                v-model="editingValue"
                type="text"
                class="form-input"
                placeholder="https://example.com/image.jpg"
              />
              <div v-if="editingValue" class="image-preview">
                <img :src="editingValue" alt="Preview" @error="handleImageError" />
              </div>
            </div>

            <!-- Link editor -->
            <div v-else-if="elementType === 'link'" class="form-group">
              <label>Текст ссылки</label>
              <input
                v-model="editingValue"
                type="text"
                class="form-input"
                placeholder="Текст кнопки или ссылки"
              />
            </div>

            <!-- Background editor -->
            <div v-else-if="elementType === 'background'" class="form-group">
              <label>Цвет или градиент</label>
              <input
                v-model="editingValue"
                type="text"
                class="form-input"
                placeholder="#ffffff или linear-gradient(...)"
              />
              <div class="color-preview" :style="{ background: editingValue }"></div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeElementEditor">Отмена</button>
            <button class="btn btn-primary" @click="applyElementChange">Применить</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const router = useRouter();
const route = useRoute();
const { success, error } = useToast();
const pageEditor = usePageEditor();

const {
  isEditMode,
  currentPageId,
  hasChanges,
  isSaving,
  selectedElement,
  selectedElementInfo,
  cancelEditMode,
  saveChanges,
  discardChanges,
  selectElement,
  updateElement,
  getEditingValue,
} = pageEditor;

const showHint = ref(true);
const editingValue = ref('');
const textareaRef = ref<HTMLTextAreaElement | null>(null);

// Handle image load error
const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.style.display = 'none';
};

// Page names mapping
const pageNames: Record<string, string> = {
  home: 'Главная страница',
  delivery: 'Доставка',
  contacts: 'Контакты',
  warranty: 'Гарантия',
  about: 'О компании',
};

const currentPageName = computed(() => {
  return currentPageId.value ? pageNames[currentPageId.value] || currentPageId.value : '';
});

// Get label for selected element
const elementLabel = computed(() => {
  return selectedElementInfo.value?.label || selectedElement.value || 'Элемент';
});

// Get type for selected element
const elementType = computed(() => {
  return selectedElementInfo.value?.type || 'text';
});

// Watch for selected element changes
watch(selectedElement, (newValue) => {
  if (newValue) {
    editingValue.value = getEditingValue(newValue);
  }
});

const closeElementEditor = () => {
  selectElement(null);
  editingValue.value = '';
};

const applyElementChange = () => {
  if (selectedElement.value) {
    updateElement(selectedElement.value, editingValue.value);
    closeElementEditor();
  }
};

const handleSave = async () => {
  const result = await saveChanges();
  if (result?.success) {
    success('Изменения сохранены');
  } else {
    error(result?.error || 'Ошибка при сохранении');
  }
};

const handleDiscard = () => {
  if (confirm('Вы уверены, что хотите отменить все изменения?')) {
    discardChanges();
    success('Изменения отменены');
  }
};

const handleExit = async () => {
  const confirmed = await cancelEditMode();
  if (confirmed) {
    // Remove ?edit=true from URL
    const query = { ...route.query };
    delete query.edit;
    router.replace({ query });
  }
};

// Add keyboard shortcut for saving
const handleKeydown = (e: KeyboardEvent) => {
  if (!isEditMode.value) return;

  // Ctrl+S or Cmd+S to save
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    if (hasChanges.value && !isSaving.value) {
      handleSave();
    }
  }

  // Escape to close element editor or exit edit mode
  if (e.key === 'Escape') {
    if (selectedElement.value) {
      closeElementEditor();
    }
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped lang="scss">
.visual-editor-toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
  z-index: 10000;
  padding: 0;
}

.toolbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  max-width: 1600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
  }
}

.toolbar-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toolbar-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  svg {
    width: 20px;
    height: 20px;
  }
}

.toolbar-text {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.toolbar-title {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.toolbar-page {
  font-size: 0.9375rem;
  font-weight: 600;
  color: white;
}

.toolbar-status {
  flex: 1;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    order: 3;
    flex: none;
    width: 100%;
    justify-content: flex-start;
  }
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 500;

  &.status-unsaved {
    background: rgba(245, 158, 11, 0.15);
    color: #fbbf24;
    border: 1px solid rgba(245, 158, 11, 0.3);
  }

  &.status-saved {
    background: rgba(16, 185, 129, 0.15);
    color: #34d399;
    border: 1px solid rgba(16, 185, 129, 0.3);
  }
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #fbbf24;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.btn-primary {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    min-width: 100px;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
    }
  }

  &.btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.2);

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.15);
      color: white;
    }
  }

  &.btn-close {
    width: 40px;
    height: 40px;
    padding: 0;
    background: rgba(239, 68, 68, 0.15);
    color: #f87171;
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 10px;

    &:hover {
      background: rgba(239, 68, 68, 0.25);
      color: #fca5a5;
    }
  }
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.toolbar-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  border-top: 1px solid rgba(59, 130, 246, 0.2);
  color: #93c5fd;
  font-size: 0.8125rem;
}

.hint-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.5rem;
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
}

// Transitions
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// Element Editor Modal
.element-editor-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  padding: 1rem;
}

.element-editor-modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;

  h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
  }
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }
}

.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }
}

.form-hint {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.image-preview {
  margin-top: 1rem;
  padding: 0.5rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-align: center;

  img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 4px;
  }
}

.color-preview {
  margin-top: 0.75rem;
  height: 48px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0 0 12px 12px;

  .btn {
    &.btn-secondary {
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;

      &:hover {
        background: #f9fafb;
      }
    }

    &.btn-primary {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;

      &:hover {
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
      }
    }
  }
}
</style>
