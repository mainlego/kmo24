<template>
  <Teleport to="body">
    <Transition name="toolbar">
      <div v-if="isEditMode" class="editor-toolbar">
        <div class="toolbar-content">
          <!-- Left side: Page info -->
          <div class="toolbar-left">
            <div class="toolbar-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <div class="toolbar-info">
              <span class="toolbar-title">Режим редактирования</span>
              <span class="toolbar-page">{{ pageName }}</span>
            </div>
          </div>

          <!-- Center: Tips -->
          <div class="toolbar-center">
            <div class="toolbar-tip" v-if="!hasChanges">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
              <span>Кликните на элемент для редактирования</span>
            </div>
            <div class="toolbar-tip toolbar-tip--changes" v-else>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Есть несохраненные изменения</span>
            </div>
          </div>

          <!-- Right side: Actions -->
          <div class="toolbar-right">
            <button
              v-if="hasChanges"
              class="toolbar-btn toolbar-btn--discard"
              @click="handleDiscard"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
              <span>Отменить</span>
            </button>

            <button
              class="toolbar-btn toolbar-btn--save"
              :disabled="!hasChanges || isSaving"
              @click="handleSave"
            >
              <svg v-if="!isSaving" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              <span v-if="isSaving" class="loading-spinner"></span>
              <span>{{ isSaving ? 'Сохранение...' : 'Сохранить' }}</span>
            </button>

            <button
              class="toolbar-btn toolbar-btn--exit"
              @click="handleExit"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
              <span>Выйти</span>
            </button>
          </div>
        </div>

        <!-- Progress indicator when saving -->
        <div v-if="isSaving" class="toolbar-progress">
          <div class="toolbar-progress-bar"></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  pageName?: string;
}>();

const emit = defineEmits<{
  (e: 'save'): void;
  (e: 'exit'): void;
}>();

const { isEditMode, hasChanges, isSaving, saveChanges, discardChanges, cancelEditMode } = usePageEditor();
const { success, error } = useToast();

const handleSave = async () => {
  const result = await saveChanges();
  if (result?.success) {
    success('Изменения сохранены');
    emit('save');
  } else {
    error(result?.error || 'Ошибка сохранения');
  }
};

const handleDiscard = () => {
  if (confirm('Отменить все несохраненные изменения?')) {
    discardChanges();
  }
};

const handleExit = async () => {
  const cancelled = await cancelEditMode();
  if (cancelled) {
    emit('exit');
  }
};
</script>

<style scoped lang="scss">
.editor-toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
}

.toolbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1.5rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    padding: 0.75rem 1rem;
  }
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toolbar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
  border-radius: 0.5rem;
  color: white;
}

.toolbar-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.toolbar-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
}

.toolbar-page {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.toolbar-center {
  flex: 1;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    order: 3;
    width: 100%;
    justify-content: flex-start;
    margin-top: 0.5rem;
  }
}

.toolbar-tip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.8);

  svg {
    color: rgba(255, 255, 255, 0.6);
  }

  &--changes {
    background: rgba(16, 185, 129, 0.2);
    color: #6ee7b7;

    svg {
      color: #10b981;
    }
  }
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--save {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
  }

  &--discard {
    background: rgba(239, 68, 68, 0.2);
    color: #fca5a5;
    border: 1px solid rgba(239, 68, 68, 0.3);

    &:hover {
      background: rgba(239, 68, 68, 0.3);
    }
  }

  &--exit {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.2);

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }

  @media (max-width: 640px) {
    span:not(.loading-spinner) {
      display: none;
    }

    padding: 0.625rem;
  }
}

.loading-spinner {
  width: 18px;
  height: 18px;
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

.toolbar-progress {
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.toolbar-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #ea580c, #f59e0b);
  background-size: 200% 100%;
  animation: progress 1.5s ease-in-out infinite;
}

@keyframes progress {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

// Transitions
.toolbar-enter-active,
.toolbar-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toolbar-enter-from,
.toolbar-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
