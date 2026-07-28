<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseInput from '../components/base/BaseInput.vue'

const clicks = ref(0)
const saving = ref(false)

const title = ref('')
const titleError = computed(() =>
  title.value.length > 0 && title.value.length < 3 ? 'Must be at least 3 characters' : '',
)

function handleDemoClick() {
  clicks.value++
}

function simulateSave() {
  saving.value = true
  setTimeout(() => {
    saving.value = false
  }, 2000)
}
</script>

<template>
  <section class="view">
    <h1>Tasks</h1>
    <p>Task board goes here.</p>

    <section class="demo">
      <h2>BaseButton demo</h2>

      <div class="demo__row">
        <BaseButton @click="handleDemoClick">Primary</BaseButton>
        <BaseButton variant="secondary" @click="handleDemoClick">Secondary</BaseButton>
        <BaseButton variant="danger" @click="handleDemoClick">Danger</BaseButton>
      </div>

      <div class="demo__row">
        <BaseButton loading @click="handleDemoClick">Primary</BaseButton>
        <BaseButton variant="secondary" loading @click="handleDemoClick">Secondary</BaseButton>
        <BaseButton variant="danger" loading @click="handleDemoClick">Danger</BaseButton>
      </div>

      <div class="demo__row">
        <BaseButton disabled @click="handleDemoClick">Disabled</BaseButton>
        <BaseButton :loading="saving" @click="simulateSave">
          {{ saving ? 'Saving…' : 'Click to load 2s' }}
        </BaseButton>
      </div>

      <p class="demo__counter">
        Clicks received: <strong>{{ clicks }}</strong>
        <span class="demo__hint">(loading and disabled buttons must not increment this)</span>
      </p>
    </section>

    <section class="demo">
      <h2>BaseInput demo</h2>

      <div class="demo__stack">
        <BaseInput v-model="title" label="Title" placeholder="Type at least 3 characters" />

        <BaseInput
          v-model="title"
          label="Same ref, second input"
          :error="titleError"
          placeholder="Both stay in sync"
        />

        <BaseInput label="Disabled" model-value="Read only" disabled />
      </div>

      <p class="demo__counter">
        Bound value: <strong>{{ title || '(empty)' }}</strong>
        <span class="demo__hint">
          Both inputs share one ref — typing in either updates the other and this line.
        </span>
      </p>
    </section>
  </section>
</template>

<style scoped>
.view {
  padding: 1.5rem;
}

.demo {
  margin-top: 2rem;
  padding: 1.25rem;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  max-width: 40rem;
}

.demo h2 {
  margin: 0 0 1rem;
  font-size: 1rem;
}

.demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.demo__stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
  max-width: 22rem;
}

.demo__counter {
  margin: 0;
  font-size: 0.9rem;
}

.demo__hint {
  display: block;
  color: #6b7280;
  font-size: 0.8rem;
}
</style>
