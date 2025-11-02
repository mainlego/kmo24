<template>
  <div class="image-upload">
    <div
      class="upload-area"
      :class="{
        'drag-over': isDragging,
        'has-error': error,
        'disabled': disabled,
      }"
      @drop.prevent="handleDrop"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        @change="handleFileSelect"
        style="display: none"
      />

      <div v-if="!previewImages.length" class="upload-placeholder">
        <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p class="upload-text">{{ dragText }}</p>
        <p class="upload-hint">{{ hintText }}</p>
      </div>

      <div v-else class="preview-grid" :class="`grid-cols-${gridCols}`">
        <div
          v-for="(image, index) in previewImages"
          :key="image.id"
          class="preview-item"
          :draggable="sortable"
          @dragstart="handleDragStart(index)"
          @dragend="handleDragEnd"
          @dragover.prevent="handlePreviewDragOver(index)"
        >
          <img :src="image.url" :alt="image.name" />

          <div class="preview-overlay">
            <button
              class="preview-btn"
              @click.stop="viewImage(image)"
              title="Просмотр"
            >
              <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              class="preview-btn"
              @click.stop="removeImage(index)"
              title="Удалить"
            >
              <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <div v-if="index === 0 && showMainBadge" class="main-badge">
            Главное
          </div>

          <div v-if="sortable" class="drag-handle">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
            </svg>
          </div>

          <div v-if="image.loading" class="loading-overlay">
            <div class="spinner"></div>
          </div>
        </div>

        <div
          v-if="multiple && (!maxFiles || previewImages.length < maxFiles)"
          class="add-more"
          @click="triggerFileInput"
        >
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Добавить ещё</span>
        </div>
      </div>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="hint" class="hint-message">
      {{ hint }}
    </div>

    <!-- Image Viewer Modal -->
    <div v-if="viewerImage" class="image-viewer" @click="closeViewer">
      <div class="viewer-content" @click.stop>
        <button class="viewer-close" @click="closeViewer">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img :src="viewerImage.url" :alt="viewerImage.name" />
        <div class="viewer-info">
          <span>{{ viewerImage.name }}</span>
          <span v-if="viewerImage.size">{{ formatFileSize(viewerImage.size) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface ImageFile {
  id: string;
  file?: File;
  url: string;
  name: string;
  size?: number;
  loading?: boolean;
}

interface Props {
  modelValue?: ImageFile[];
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number; // в байтах
  disabled?: boolean;
  sortable?: boolean;
  showMainBadge?: boolean;
  gridCols?: number;
  dragText?: string;
  hintText?: string;
  hint?: string;
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*',
  multiple: true,
  maxFiles: 10,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  disabled: false,
  sortable: true,
  showMainBadge: true,
  gridCols: 4,
  dragText: 'Перетащите изображения сюда или нажмите для выбора',
  hintText: 'Поддерживаются форматы: JPG, PNG, GIF, WEBP',
});

const emit = defineEmits<{
  'update:modelValue': [value: ImageFile[]];
  'upload': [files: File[]];
  'remove': [index: number];
  'reorder': [oldIndex: number, newIndex: number];
}>();

// State
const fileInput = ref<HTMLInputElement | null>(null);
const previewImages = ref<ImageFile[]>([]);
const isDragging = ref(false);
const error = ref('');
const viewerImage = ref<ImageFile | null>(null);
const draggedIndex = ref<number | null>(null);

// Watchers
watch(() => props.modelValue, (value) => {
  if (value) {
    previewImages.value = value;
  }
}, { immediate: true });

// Methods
const triggerFileInput = () => {
  if (props.disabled) return;
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files) {
    processFiles(Array.from(files));
  }
  // Reset input
  target.value = '';
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (props.disabled) return;

  const files = event.dataTransfer?.files;
  if (files) {
    processFiles(Array.from(files));
  }
};

const handleDragOver = () => {
  if (!props.disabled) {
    isDragging.value = true;
  }
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const processFiles = (files: File[]) => {
  error.value = '';

  // Validate file count
  if (props.maxFiles && (previewImages.value.length + files.length) > props.maxFiles) {
    error.value = `Можно загрузить максимум ${props.maxFiles} файлов`;
    return;
  }

  // Filter and validate files
  const validFiles = files.filter(file => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      error.value = `Файл ${file.name} не является изображением`;
      return false;
    }

    // Check file size
    if (props.maxFileSize && file.size > props.maxFileSize) {
      error.value = `Файл ${file.name} слишком большой. Максимум: ${formatFileSize(props.maxFileSize)}`;
      return false;
    }

    return true;
  });

  if (validFiles.length === 0) return;

  // Create preview images
  validFiles.forEach(file => {
    const id = `${Date.now()}-${Math.random()}`;
    const url = URL.createObjectURL(file);

    previewImages.value.push({
      id,
      file,
      url,
      name: file.name,
      size: file.size,
      loading: false,
    });
  });

  updateModelValue();
  emit('upload', validFiles);
};

const removeImage = (index: number) => {
  const image = previewImages.value[index];

  // Revoke object URL to free memory
  if (image.url.startsWith('blob:')) {
    URL.revokeObjectURL(image.url);
  }

  previewImages.value.splice(index, 1);
  updateModelValue();
  emit('remove', index);
};

const viewImage = (image: ImageFile) => {
  viewerImage.value = image;
};

const closeViewer = () => {
  viewerImage.value = null;
};

const updateModelValue = () => {
  emit('update:modelValue', previewImages.value);
};

// Drag & Drop for reordering
const handleDragStart = (index: number) => {
  if (!props.sortable) return;
  draggedIndex.value = index;
};

const handleDragEnd = () => {
  draggedIndex.value = null;
};

const handlePreviewDragOver = (index: number) => {
  if (!props.sortable || draggedIndex.value === null || draggedIndex.value === index) return;

  const draggedItem = previewImages.value[draggedIndex.value];
  previewImages.value.splice(draggedIndex.value, 1);
  previewImages.value.splice(index, 0, draggedItem);

  emit('reorder', draggedIndex.value, index);
  draggedIndex.value = index;
  updateModelValue();
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Cleanup on unmount
onUnmounted(() => {
  previewImages.value.forEach(image => {
    if (image.url.startsWith('blob:')) {
      URL.revokeObjectURL(image.url);
    }
  });
});
</script>

<style scoped lang="scss">
.image-upload {
  width: 100%;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 0.75rem;
  padding: 2rem;
  transition: all 0.3s ease;
  cursor: pointer;
  background: #fafafa;

  &:hover:not(.disabled) {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  &.drag-over {
    border-color: #3b82f6;
    background: #eff6ff;
    transform: scale(1.02);
  }

  &.has-error {
    border-color: #ef4444;
    background: #fef2f2;
  }

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #f3f4f6;
  }
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;

  .icon {
    width: 4rem;
    height: 4rem;
    color: #9ca3af;
    margin-bottom: 1rem;
  }

  .upload-text {
    font-size: 1rem;
    font-weight: 500;
    color: #374151;
    margin: 0 0 0.5rem 0;
  }

  .upload-hint {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }
}

.preview-grid {
  display: grid;
  gap: 1rem;

  &.grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  &.grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  &.grid-cols-4 {
    grid-template-columns: repeat(4, 1fr);
  }

  &.grid-cols-5 {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #f3f4f6;
  cursor: move;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover .preview-overlay {
    opacity: 1;
  }
}

.preview-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.6);
  opacity: 0;
  transition: opacity 0.2s;
}

.preview-btn {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  color: #374151;
  transition: all 0.2s;

  &:hover {
    background: white;
    transform: scale(1.1);
  }

  .icon {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.main-badge {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: #3b82f6;
  color: white;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.drag-handle {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 0.25rem;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  .icon {
    width: 1rem;
    height: 1rem;
    color: #6b7280;
  }
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.add-more {
  aspect-ratio: 1;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    background: #eff6ff;
  }

  .icon {
    width: 2rem;
    height: 2rem;
  }

  span {
    font-size: 0.875rem;
    font-weight: 500;
  }
}

.error-message {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  color: #991b1b;
  font-size: 0.875rem;
}

.hint-message {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}

// Image Viewer
.image-viewer {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.9);
  padding: 2rem;
}

.viewer-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  img {
    max-width: 100%;
    max-height: calc(90vh - 4rem);
    object-fit: contain;
    border-radius: 0.5rem;
  }
}

.viewer-close {
  position: absolute;
  top: -3rem;
  right: 0;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  color: white;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }
}

.viewer-info {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: white;
}
</style>
