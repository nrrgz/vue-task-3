<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseModal from '../components/base/BaseModal.vue'
import BaseSelect from '../components/base/BaseSelect.vue'
import BaseTable from '../components/base/BaseTable.vue'
import { seedTasks } from '../mock/tasks'
import { useNotificationStore } from '../stores/notifications'

const { notify } = useNotificationStore()

const taskColumns = [
  { key: 'title', label: 'Title' },
  { key: 'assigneeEmail', label: 'Assignee' },
  { key: 'status', label: 'Status' },
  { key: 'priority', label: 'Priority' },
]

const modalOpen = ref(false)

const status = ref('')
const statusOptions = [
  { label: 'To do', value: 'todo' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Done', value: 'done' },
]

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

    <section class="demo">
      <h2>BaseSelect demo</h2>

      <div class="demo__stack">
        <BaseSelect v-model="status" :options="statusOptions" placeholder="Select a status" />

        <BaseSelect v-model="status" :options="statusOptions" />

        <BaseButton variant="secondary" @click="status = ''">Reset to placeholder</BaseButton>
      </div>

      <p class="demo__counter">
        Bound value: <strong>{{ status || '(empty)' }}</strong>
        <span class="demo__hint">
          First select shows the placeholder while empty; reset puts it back.
        </span>
      </p>
    </section>

    <section class="demo">
      <h2>BaseModal demo</h2>

      <div class="demo__row">
        <BaseButton @click="modalOpen = true">Open modal</BaseButton>
      </div>

      <p class="demo__counter">
        Model value: <strong>{{ modalOpen ? 'open' : 'closed' }}</strong>
        <span class="demo__hint">
          Closes on ESC, backdrop click, the × button, and the footer buttons. Clicking inside
          the panel must not close it.
        </span>
      </p>

      <BaseModal v-model="modalOpen">
        <template #header>Sample modal</template>

        <p>
          Body content goes in the default slot. Clicking this text, or anywhere inside the
          white panel, should leave the modal open.
        </p>
        <p>The page behind must not scroll while this is open.</p>

        <template #footer>
          <BaseButton variant="secondary" @click="modalOpen = false">Cancel</BaseButton>
          <BaseButton @click="modalOpen = false">Confirm</BaseButton>
        </template>
      </BaseModal>
    </section>

    <section class="demo">
      <h2>BaseToast demo</h2>

      <div class="demo__row">
        <BaseButton @click="notify('success', 'Task saved successfully.')">
          Fire success toast
        </BaseButton>
        <BaseButton variant="danger" @click="notify('error', 'Could not save the task.')">
          Fire error toast
        </BaseButton>
      </div>

      <p class="demo__counter">
        Toasts stack top-right and auto-dismiss after 3s.
        <span class="demo__hint">
          The × closes one immediately. BaseToast is mounted once in App.vue — every view
          shares the same store instance.
        </span>
      </p>
    </section>

    <section class="demo demo--wide">
      <h2>BaseTable demo</h2>

      <BaseTable :columns="taskColumns" :rows="seedTasks">
        <template #cell-status="{ value }">
          <span class="status" :class="`status--${value}`">{{ value }}</span>
        </template>
      </BaseTable>

      <p class="demo__counter">
        Rows: <strong>{{ seedTasks.length }}</strong>
        <span class="demo__hint">
          Only Status is customised; Title, Assignee and Priority use the plain-text fallback.
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

.demo--wide {
  max-width: 52rem;
}

.status {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status--todo {
  background-color: #e5e7eb;
  color: #374151;
}

.status--in-progress {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.status--done {
  background-color: #dcfce7;
  color: #15803d;
}
</style>
