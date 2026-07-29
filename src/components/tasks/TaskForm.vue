<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseButton from '../base/BaseButton.vue'
import BaseField from '../base/BaseField.vue'
import BaseInput from '../base/BaseInput.vue'
import BaseSelect from '../base/BaseSelect.vue'
import { email, required, useValidation } from '../../composables/useValidation'
import type { TaskDraft } from '../../stores/tasks'
import type { Task, TaskPriority, TaskStatus } from '../../types/task'

interface Props {
  initialTask?: Task
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [draft: TaskDraft]
  cancel: []
}>()

const statusOptions: { label: string; value: TaskStatus }[] = [
  { label: 'To do', value: 'todo' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Done', value: 'done' },
]

const priorityOptions: { label: string; value: TaskPriority }[] = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
]

type TaskFormValues = {
  title: string
  assigneeEmail: string
  status: string
  priority: string
}

function emptyValues(): TaskFormValues {
  return { title: '', assigneeEmail: '', status: '', priority: '' }
}

const values = ref<TaskFormValues>(emptyValues())

const { errors, validate, reset } = useValidation(values, {
  title: [required('Title is required')],
  assigneeEmail: [required('Assignee email is required'), email()],
  status: [required('Pick a status')],
  priority: [required('Pick a priority')],
})

watch(
  () => props.initialTask,
  (task) => {
    values.value = task
      ? {
          title: task.title,
          assigneeEmail: task.assigneeEmail,
          status: task.status,
          priority: task.priority,
        }
      : emptyValues()

    reset()
  },
  { immediate: true },
)

const isEditing = computed(() => props.initialTask !== undefined)
const submitLabel = computed(() => (isEditing.value ? 'Save changes' : 'Add task'))

function isTaskStatus(value: string): value is TaskStatus {
  return statusOptions.some((option) => option.value === value)
}

function isTaskPriority(value: string): value is TaskPriority {
  return priorityOptions.some((option) => option.value === value)
}

function handleSubmit(): void {
  if (!validate()) return

  const { title, assigneeEmail, status, priority } = values.value
  if (!isTaskStatus(status) || !isTaskPriority(priority)) return

  emit('submit', {
    title: title.trim(),
    assigneeEmail: assigneeEmail.trim(),
    status,
    priority,
  })
}
</script>

<template>
  <form class="task-form" novalidate @submit.prevent="handleSubmit">
    <BaseInput
      v-model="values.title"
      label="Title"
      :error="errors.title"
      placeholder="What needs doing?"
    />

    <BaseInput
      v-model="values.assigneeEmail"
      label="Assignee email"
      :error="errors.assigneeEmail"
      placeholder="name@company.com"
    />

    <BaseField label="Status" :error="errors.status" v-slot="{ id, describedBy }">
      <BaseSelect
        :id="id"
        v-model="values.status"
        :aria-describedby="describedBy"
        :options="statusOptions"
        placeholder="Select a status"
      />
    </BaseField>

    <BaseField label="Priority" :error="errors.priority" v-slot="{ id, describedBy }">
      <BaseSelect
        :id="id"
        v-model="values.priority"
        :aria-describedby="describedBy"
        :options="priorityOptions"
        placeholder="Select a priority"
      />
    </BaseField>

    <div class="task-form__actions">
      <BaseButton variant="secondary" @click="emit('cancel')">Cancel</BaseButton>
      <BaseButton type="submit">{{ submitLabel }}</BaseButton>
    </div>
  </form>
</template>

<style scoped>
.task-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
</style>
