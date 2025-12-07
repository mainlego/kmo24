<template>
  <div
    :class="[
      'editable-image',
      { 'editable-image--active': isEditMode },
      { 'editable-image--selected': isSelected },
    ]"
    @click="handleClick"
  >
    <img
      :src="displayValue"
      :alt="alt"
      :class="imgClass"
      @error="handleImageError"
    />

    <!-- Edit overlay -->
    <div v-if="isEditMode" class="edit-overlay">
      <button class="edit-btn" @click.stop="openImagePicker">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        <span>Изменить</span>
      </button>
    </div>

    <!-- Image picker modal -->
    <Teleport to="body">
      <div v-if="showPicker" class="image-picker-overlay" @click.self="closePicker">
        <div class="image-picker-modal">
          <div class="picker-header">
            <h3>Выберите изображение</h3>
            <button class="close-btn" @click="closePicker">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="picker-content">
            <!-- URL input -->
            <div class="input-group">
              <label>URL изображения</label>
              <input
                v-model="newImageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                @keydown.enter="applyImage"
              />
            </div>

            <!-- File upload -->
            <div class="upload-group">
              <label>Или загрузите файл</label>
              <div
                class="upload-dropzone"
                :class="{ 'upload-dropzone--dragover': isDragging }"
                @dragover.prevent="isDragging = true"
                @dragleave="isDragging = false"
                @drop.prevent="handleDrop"
                @click="triggerFileInput"
              >
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  hidden
                  @change="handleFileSelect"
                />
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <p>Перетащите изображение сюда или нажмите для выбора</p>
              </div>
            </div>

            <!-- Preview -->
            <div v-if="previewUrl" class="preview-group">
              <label>Предпросмотр</label>
              <img :src="previewUrl" alt="Preview" class="preview-image" />
            </div>
          </div>

          <div class="picker-footer">
            <button class="btn-secondary" @click="closePicker">Отмена</button>
            <button class="btn-primary" :disabled="!previewUrl" @click="applyImage">
              Применить
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = withDefaults(defineProps<{
  elementId: string;
  defaultValue?: string;
  alt?: string;
  imgClass?: string;
}>(), {
  defaultValue: '',
  alt: '',
  imgClass: '',
});

const emit = defineEmits<{
  (e: 'update', value: string): void;
}>();

const { isEditMode, getElementValue, updateElement, selectedElement, selectElement } = usePageEditor();

const showPicker = ref(false);
const newImageUrl = ref('');
const previewUrl = ref('');
const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const isUploading = ref(false);

const displayValue = computed(() => {
  return getElementValue(props.elementId, props.defaultValue);
});

const isSelected = computed(() => selectedElement.value === props.elementId);

const handleClick = (e: MouseEvent) => {
  if (!isEditMode.value) return;
  e.stopPropagation();
  selectElement(props.elementId);
};

const openImagePicker = () => {
  showPicker.value = true;
  newImageUrl.value = displayValue.value;
  previewUrl.value = displayValue.value;
};

const closePicker = () => {
  showPicker.value = false;
  newImageUrl.value = '';
  previewUrl.value = '';
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files?.[0]) {
    await uploadFile(input.files[0]);
  }
};

const handleDrop = async (e: DragEvent) => {
  isDragging.value = false;
  const file = e.dataTransfer?.files[0];
  if (file && file.type.startsWith('image/')) {
    await uploadFile(file);
  }
};

const uploadFile = async (file: File) => {
  isUploading.value = true;

  // Create preview from file
  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);

  // TODO: Upload to server
  // For now, just use the data URL
  try {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'pages');

    const response = await fetch(`${config.public.apiBaseUrl}/uploads/image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (data.success && data.data?.url) {
      previewUrl.value = data.data.url;
      newImageUrl.value = data.data.url;
    }
  } catch (error) {
    console.error('Upload failed:', error);
    // Keep the data URL as fallback
    newImageUrl.value = previewUrl.value;
  } finally {
    isUploading.value = false;
  }
};

const applyImage = () => {
  const url = newImageUrl.value || previewUrl.value;
  if (url) {
    updateElement(props.elementId, url);
    emit('update', url);
  }
  closePicker();
};

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.src = '/images/placeholder.svg';
};

// Watch for URL changes
watch(newImageUrl, (url) => {
  if (url && url.startsWith('http')) {
    previewUrl.value = url;
  }
});
</script>

<style scoped lang="scss">
.editable-image {
  position: relative;
  display: inline-block;

  &--active {
    cursor: pointer;

    img {
      transition: all 0.2s ease;
    }

    &:hover {
      img {
        opacity: 0.8;
      }

      .edit-overlay {
        opacity: 1;
      }
    }
  }

  &--selected {
    outline: 2px solid #3b82f6;
    outline-offset: 4px;
  }
}

.edit-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.2s ease;
  border-radius: inherit;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  color: #1f2937;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  svg {
    width: 20px;
    height: 20px;
  }
}

// Image Picker Modal
.image-picker-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.image-picker-modal {
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .close-btn {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    color: #6b7280;
    border-radius: 0.375rem;
    transition: all 0.2s ease;

    &:hover {
      background: #f3f4f6;
      color: #1f2937;
    }
  }
}

.picker-content {
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group,
.upload-group,
.preview-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  input {
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
}

.upload-dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  border: 2px dashed #d1d5db;
  border-radius: 0.75rem;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover,
  &--dragover {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.05);
  }

  svg {
    color: #9ca3af;
  }

  p {
    color: #6b7280;
    font-size: 0.875rem;
    text-align: center;
    margin: 0;
  }
}

.preview-image {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.picker-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #e5e7eb;

  button {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-secondary {
    background: white;
    border: 2px solid #e5e7eb;
    color: #374151;

    &:hover {
      background: #f3f4f6;
    }
  }

  .btn-primary {
    background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
    border: none;
    color: white;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>
