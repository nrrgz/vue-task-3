<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseModal from '../components/base/BaseModal.vue'
import BaseSelect from '../components/base/BaseSelect.vue'
import BaseTable from '../components/base/BaseTable.vue'
import StatusBadge from '../components/tasks/StatusBadge.vue'
import TaskForm from '../components/tasks/TaskForm.vue'
import {
  useTaskStore,
  type PriorityFilter,
  type StatusFilter,
  type TaskDraft,
} from '../stores/tasks'
import type { Task } from '../types/task'

const taskStore = useTaskStore()
const { filteredTasks, filters } = storeToRefs(taskStore)
const { addTask, updateTask, removeTask } = taskStore

const columns = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'assigneeEmail', label: 'Assignee', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'priority', label: 'Priority', sortable: true },
  { key: 'actions', label: '' },
]

const statusFilterOptions: { label: string; value: StatusFilter }[] = [
  { label: 'All statuses', value: 'all' },
  { label: 'To do', value: 'todo' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Done', value: 'done' },
]

const priorityFilterOptions: { label: string; value: PriorityFilter }[] = [
  { label: 'All priorities', value: 'all' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
]

function isStatusFilter(value: string): value is StatusFilter {
  return statusFilterOptions.some((option) => option.value === value)
}

function isPriorityFilter(value: string): value is PriorityFilter {
  return priorityFilterOptions.some((option) => option.value === value)
}

const statusFilter = computed<string>({
  get: () => filters.value.status,
  set: (value) => {
    if (isStatusFilter(value)) filters.value.status = value
  },
})

const priorityFilter = computed<string>({
  get: () => filters.value.priority,
  set: (value) => {
    if (isPriorityFilter(value)) filters.value.priority = value
  },
})

const isFiltered = computed(
  () => filters.value.status !== 'all' || filters.value.priority !== 'all',
)

function clearFilters() {
  filters.value.status = 'all'
  filters.value.priority = 'all'
}

const formModalOpen = ref(false)
const taskBeingEdited = ref<Task | null>(null)

function openCreate() {
  taskBeingEdited.value = null
  formModalOpen.value = true
}

function openEdit(task: Task) {
  taskBeingEdited.value = task
  formModalOpen.value = true
}

function handleSubmit(draft: TaskDraft) {
  const editing = taskBeingEdited.value

  if (editing) updateTask(editing.id, draft)
  else addTask(draft)

  formModalOpen.value = false
  taskBeingEdited.value = null
}

const taskPendingDelete = ref<Task | null>(null)
const deleteModalOpen = computed<boolean>({
  get: () => taskPendingDelete.value !== null,
  set: (open) => {
    if (!open) taskPendingDelete.value = null
  },
})

function confirmDelete() {
  const target = taskPendingDelete.value
  if (!target) return

  removeTask(target.id)
  taskPendingDelete.value = null
}
</script>

<template>
  <section class="view">
    <header class="view__header">
      <h1>Tasks</h1>
      <BaseButton @click="openCreate">New task</BaseButton>
    </header>

    <div class="filters">
      <label class="filters__field">
        <span class="filters__label">Status</span>
        <BaseSelect v-model="statusFilter" :options="statusFilterOptions" />
      </label>

      <label class="filters__field">
        <span class="filters__label">Priority</span>
        <BaseSelect v-model="priorityFilter" :options="priorityFilterOptions" />
      </label>

      <BaseButton v-if="isFiltered" variant="secondary" @click="clearFilters">
        Clear filters
      </BaseButton>

      <p class="filters__count">{{ filteredTasks.length }} shown</p>
    </div>

    <BaseTable :columns="columns" :rows="filteredTasks">
      <template #cell-status="{ row }">
        <StatusBadge :status="row.status" />
      </template>

      <template #cell-actions="{ row }">
        <div class="row-actions">
          <BaseButton variant="secondary" @click="openEdit(row)">Edit</BaseButton>
          <BaseButton variant="danger" @click="taskPendingDelete = row">Delete</BaseButton>
        </div>
      </template>

      <template #empty>No tasks match these filters.</template>
    </BaseTable>

    <BaseModal v-model="formModalOpen">
      <template #header>{{ taskBeingEdited ? 'Edit task' : 'New task' }}</template>
      
      <TaskForm
        :initial-task="taskBeingEdited ?? undefined"
        @submit="handleSubmit"
        @cancel="formModalOpen = false"
      />
    </BaseModal>

    <BaseModal v-model="deleteModalOpen">
      <template #header>Delete task</template>

      <p class="delete-prompt">
        Delete <strong>{{ taskPendingDelete?.title }}</strong
        >? This cannot be undone.
      </p>

      <template #footer>
        <BaseButton variant="secondary" @click="taskPendingDelete = null">Cancel</BaseButton>
        <BaseButton variant="danger" @click="confirmDelete">Delete</BaseButton>
      </template>
    </BaseModal>
  </section>
</template>

<style scoped>
.view {
  padding: 1.5rem;
  max-width: 64rem;
}

.view__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.view__header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.filters__field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 11rem;
}

.filters__label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #6b7280;
}

.filters__count {
  margin: 0 0 0 auto;
  font-size: 0.85rem;
  color: #6b7280;
}

.row-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.delete-prompt {
  margin: 0;
}
</style>
