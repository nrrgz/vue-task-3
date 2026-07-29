<script setup lang="ts">
import type { TaskStatus } from '../../types/task'

interface Props {
  status: TaskStatus
}

defineProps<Props>()

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done',
}
</script>

<template>
  <span class="status-badge" :class="`status-badge--${status}`">
    {{ STATUS_LABELS[status] }}
  </span>
</template>

<style scoped>
.status-badge {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-badge--todo {
  background-color: #e5e7eb;
  color: #374151;
}

.status-badge--in-progress {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.status-badge--done {
  background-color: #dcfce7;
  color: #15803d;
}
</style>
