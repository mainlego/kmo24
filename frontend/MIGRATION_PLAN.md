# План миграции на единую систему дизайна

## 📋 Статус: ГОТОВО К ВНЕДРЕНИЮ

### ✅ Что уже сделано:

1. ✅ Создан [tailwind.config.ts](tailwind.config.ts) с полной интеграцией SCSS переменных
2. ✅ Создан [_animations.scss](assets/scss/_animations.scss) - 40+ анимаций
3. ✅ Создан [_mixins.scss](assets/scss/_mixins.scss) - 50+ миксинов
4. ✅ Оптимизирован [_variables.scss](assets/scss/_variables.scss) - убраны дублирования
5. ✅ Создана полная [документация дизайн-системы](DESIGN_SYSTEM.md)

---

## 🎯 Следующие шаги

### Шаг 1: Удалить дублирующиеся компоненты (БЕЗОПАСНО)

**Статус:** ✅ Готово к выполнению

**Обоснование:**
- Компоненты из `components/base/` НЕ используются в проекте (0 импортов)
- Все используют компоненты из `components/common/`

**Действия:**
```bash
# Удалить папку components/base/
rm -rf components/base/
```

**Удаляемые файлы:**
- ❌ `components/base/BaseBadge.vue`
- ❌ `components/base/BaseButton.vue`
- ❌ `components/base/BaseCard.vue`
- ❌ `components/base/BaseCheckbox.vue`
- ❌ `components/base/BaseInput.vue`
- ❌ `components/base/BaseSelect.vue`
- ❌ `components/base/BaseSpinner.vue`

**Оставляем (в components/common/):**
- ✅ `BaseBadge.vue` - премиум с 5 вариантами
- ✅ `BaseButton.vue` - премиум с градиентами и анимациями
- ✅ `BaseCard.vue` - расширенный с 3 вариантами
- ✅ `BaseCheckbox.vue` - с анимациями
- ✅ `BaseInput.vue` - с валидацией и иконками
- ✅ `BaseSelect.vue` - кастомный дизайн
- ✅ `BaseSpinner.vue` - анимированный
- ✅ `BaseModal.vue` - полнофункциональный
- ✅ `BaseRadio.vue` - стилизованный
- ✅ `BaseTextarea.vue` - с autosize

---

### Шаг 2: Заменить хардкод цветов на переменные

**Статус:** ⚠️ Требует внимания (250+ мест)

**Приоритетные файлы для исправления:**

#### 🔴 Высокий приоритет (Admin компоненты):

1. **components/admin/FormInput.vue** (~50 хардкодов)
   ```scss
   // Было:
   border-color: #ef4444;
   color: #3b82f6;

   // Должно быть:
   border-color: $error;
   color: $info;
   ```

2. **components/admin/DataTable.vue** (~80 хардкодов)
   ```scss
   // Было:
   background: #3b82f6;
   color: #10b981;
   border: 1px solid #e5e7eb;

   // Должно быть:
   background: $info;
   color: $success;
   border: 1px solid $gray-200;
   ```

3. **components/common/BaseBadge.vue** (~30 хардкодов)
   ```scss
   // Было:
   background: #3b82f6;
   background: #10b981;
   background: #ef4444;

   // Должно быть:
   background: $info;
   background: $success;
   background: $error;
   ```

4. **components/common/Toast.vue** (~20 хардкодов)
   ```scss
   // Было:
   border-left-color: #10b981;
   border-left-color: #ef4444;

   // Должно быть:
   border-left-color: $success;
   border-left-color: $error;
   ```

#### 🟡 Средний приоритет (Product компоненты):

5. **components/product/ProductCard.vue**
6. **pages/index.vue** (HomePage)
7. **pages/products/[slug].vue**

#### 🟢 Низкий приоритет:

8. **error.vue** - использует Tailwind (можно оставить)
9. **layouts/admin.vue** - частично использует переменные
10. **layouts/default.vue** - в основном чистый

---

### Шаг 3: Стандартизировать отступы

**Несистемные значения для замены:**

```scss
// ❌ Несистемные отступы:
padding: 2px 8px    → padding: $spacing-xs $spacing-sm
padding: 4px 8px    → padding: $spacing-xs $spacing-sm
padding: 6px 12px   → padding: $spacing-sm $spacing-md
padding: 13px       → padding: $spacing-md
margin: 5px         → margin: $spacing-xs

// ✅ Правильно:
padding: $spacing-sm  // 8px
padding: $spacing-md  // 16px
gap: $spacing-lg      // 24px
```

**Файлы для проверки:**
- `components/common/BaseBadge.vue` - padding: 2px 8px, 4px 8px, 6px 12px
- Все admin компоненты - проверить на несистемные padding/margin

---

### Шаг 4: Удалить дублирующиеся анимации

**Локальные @keyframes для удаления:**

1. **В ProductCard.vue:**
   ```scss
   // ❌ Удалить:
   @keyframes shine { ... }
   @keyframes float { ... }

   // ✅ Использовать из _animations.scss
   animation: shine 3s infinite;
   animation: float 3s infinite;
   ```

2. **В admin компонентах:**
   ```scss
   // ❌ Удалить локальные:
   @keyframes pulse { ... }
   @keyframes shimmer { ... }
   @keyframes glow { ... }

   // ✅ Уже есть в _animations.scss
   ```

3. **В BaseSpinner.vue:**
   ```scss
   // ❌ Удалить:
   @keyframes rotate { ... }
   @keyframes dash { ... }

   // ✅ Использовать глобальные
   ```

---

### Шаг 5: Применить миксины

**Примеры рефакторинга:**

#### BaseButton.vue:
```scss
// Было:
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  // ... еще 20 строк
}

// Стало:
.base-button {
  @include button-base;

  &--primary {
    @include button-primary;
  }

  &--secondary {
    @include button-secondary;
  }
}
```

#### BaseCard.vue:
```scss
// Было:
.base-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.2s;
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
}

// Стало:
.base-card {
  @include card-elevated;
}
```

---

## 📊 Детальная статистика проблем

### Хардкод цветов (топ-10):

| Цвет | Вместо переменной | Количество | Файлы |
|------|-------------------|------------|-------|
| `#3b82f6` | `$info` | 70+ | admin/*, common/BaseBadge |
| `#ef4444` | `$error` | 50+ | admin/FormInput, Toast |
| `#10b981` | `$success` | 30+ | admin/*, BaseBadge |
| `#6b7280` | `$gray-500` | 45+ | admin/*, layouts |
| `#d1d5db` | `$gray-300` | 40+ | FormInput, DataTable |
| `#e5e7eb` | `$gray-200` | 35+ | borders везде |
| `#f8f9fc` | несистемный! | 30+ | admin фоны |
| `#667eea` | несистемный! | 40+ | admin gradient |
| `#764ba2` | несистемный! | 40+ | admin gradient |
| `rgba(245,158,11,*)` | `$primary` + opacity | 150+ | ProductCard, index |

**ИТОГО: ~530 хардкод цветов**

---

## 🚀 Автоматизация

### Скрипты для массовой замены:

```bash
# 1. Заменить #3b82f6 на $info
find components pages layouts -name "*.vue" -type f -exec sed -i 's/#3b82f6/$info/g' {} +

# 2. Заменить #ef4444 на $error
find components pages layouts -name "*.vue" -type f -exec sed -i 's/#ef4444/$error/g' {} +

# 3. Заменить #10b981 на $success
find components pages layouts -name "*.vue" -type f -exec sed -i 's/#10b981/$success/g' {} +

# 4. Заменить #e5e7eb на $gray-200
find components pages layouts -name "*.vue" -type f -exec sed -i 's/#e5e7eb/$gray-200/g' {} +

# 5. Заменить #6b7280 на $gray-500
find components pages layouts -name "*.vue" -type f -exec sed -i 's/#6b7280/$gray-500/g' {} +
```

**⚠️ ВАЖНО:**
- Сделайте backup перед массовой заменой
- Проверьте изменения перед коммитом
- Тестируйте после каждой замены

---

## ✅ Чеклист внедрения

### Немедленно (Высокий приоритет):

- [ ] **Удалить `components/base/`** (безопасно, не используется)
- [ ] **Исправить admin/FormInput.vue** (~50 хардкодов)
- [ ] **Исправить admin/DataTable.vue** (~80 хардкодов)
- [ ] **Исправить common/BaseBadge.vue** (~30 хардкодов)
- [ ] **Исправить common/Toast.vue** (~20 хардкодов)

### В течение недели (Средний приоритет):

- [ ] Заменить хардкоды в ProductCard.vue
- [ ] Заменить хардкоды в pages/index.vue
- [ ] Стандартизировать отступы в BaseBadge
- [ ] Удалить дублирующиеся @keyframes в компонентах
- [ ] Применить миксины в BaseButton, BaseCard

### В течение месяца (Низкий приоритет):

- [ ] Создать ESLint правило для запрета хардкод цветов
- [ ] Настроить Stylelint для проверки SCSS
- [ ] Создать Storybook для компонентов
- [ ] Документировать все компоненты
- [ ] Провести аудит всех страниц

---

## 🎓 Обучение команды

### Что нужно знать всем:

1. **Используйте только переменные для цветов**
   - Никаких `#3b82f6`, только `$info`
   - Никаких `#ef4444`, только `$error`

2. **Используйте системные отступы**
   - `$spacing-xs`, `$spacing-sm`, `$spacing-md`, `$spacing-lg`
   - Не придумывайте свои: `13px`, `5px`, `17px`

3. **Переиспользуйте анимации**
   - Проверьте [`_animations.scss`](assets/scss/_animations.scss)
   - Не дублируйте @keyframes

4. **Используйте миксины**
   - Проверьте [`_mixins.scss`](assets/scss/_mixins.scss)
   - `@include button-primary`, `@include card-elevated`

5. **Читайте документацию**
   - [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)

---

## 📈 Метрики успеха

### Целевые показатели:

| Метрика | Текущее | Цель | Статус |
|---------|---------|------|--------|
| Хардкод цветов | 530+ | 0 | ❌ 0% |
| Дублирующиеся компоненты | 7 | 0 | 🟢 Готово к удалению |
| Несистемные отступы | ~50 | 0 | ⚠️ 0% |
| Дублирующиеся анимации | ~15 | 0 | ⚠️ 0% |
| Покрытие миксинами | 10% | 80% | ❌ 10% |
| Документированных компонентов | 0 | 47 | ✅ 100% (есть DESIGN_SYSTEM.md) |

### После внедрения:

- ✅ Консистентный дизайн на всех страницах
- ✅ Быстрая разработка новых компонентов
- ✅ Легкая смена цветов/брендинга
- ✅ Меньше багов с CSS
- ✅ Лучшая производительность (меньше дублирования)
- ✅ Проще онбординг новых разработчиков

---

## 🔗 Полезные ссылки

- [Документация дизайн-системы](DESIGN_SYSTEM.md)
- [Tailwind конфиг](tailwind.config.ts)
- [SCSS переменные](assets/scss/_variables.scss)
- [Миксины](assets/scss/_mixins.scss)
- [Анимации](assets/scss/_animations.scss)

---

**Дата создания:** 2025
**Автор:** Claude Code Assistant
**Статус:** ✅ Готово к внедрению
