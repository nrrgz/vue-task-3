<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'

const open = defineModel<boolean>({ default: false })

function close() {
  open.value = false
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) close()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

let isLocked = false

function lock() {
  if (isLocked) return
  isLocked = true
  lockBodyScroll()
  window.addEventListener('keydown', handleKeydown)
}

function unlock() {
  if (!isLocked) return
  isLocked = false
  unlockBodyScroll()
  window.removeEventListener('keydown', handleKeydown)
}

watch(open, (isOpen) => (isOpen ? lock() : unlock()), { immediate: true })

onBeforeUnmount(unlock)
</script>

<script lang="ts">
let lockCount = 0
let previousOverflow = ''

function lockBodyScroll() {
  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  lockCount += 1
}

function unlockBodyScroll() {
  if (lockCount === 0) return
  lockCount -= 1
  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="base-modal" role="dialog" aria-modal="true" @click="handleBackdropClick">
      <div class="base-modal__panel">
        <header class="base-modal__header">
          <div class="base-modal__title">
            <slot name="header" />
          </div>

          <button type="button" class="base-modal__close" aria-label="Close" @click="close">
            &times;
          </button>
        </header>

        <div class="base-modal__body">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="base-modal__footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.base-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgb(17 24 39 / 0.5);
}

.base-modal__panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 32rem;
  max-height: calc(100vh - 2rem);
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 20px 45px rgb(0 0 0 / 0.25);
  overflow: hidden;
}

.base-modal__header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}

.base-modal__title {
  flex: 1;
  font-size: 1.05rem;
  font-weight: 600;
  color: #111827;
}

.base-modal__close {
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #6b7280;
  font-size: 1.35rem;
  line-height: 1;
  cursor: pointer;
}

.base-modal__close:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.base-modal__close:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.base-modal__body {
  padding: 1.25rem;
  overflow-y: auto;
}

.base-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
}
</style>
