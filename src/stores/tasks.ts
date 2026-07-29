import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { seedTasks } from '../mock/tasks'
import type { Task, TaskPriority, TaskStatus } from '../types/task'
import { useNotificationStore } from './notifications'

export type StatusFilter = TaskStatus | 'all'
export type PriorityFilter = TaskPriority | 'all'

export interface TaskFilters {
  status: StatusFilter
  priority: PriorityFilter
}

export type TaskDraft = Omit<Task, 'id' | 'createdAt'>

export type TaskPatch = Partial<Omit<Task, 'id'>>

let idCounter = 0

function createId(): string {
  return `task-${Date.now().toString(36)}-${++idCounter}`
}

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([...seedTasks])

  const filters = ref<TaskFilters>({ status: 'all', priority: 'all' })

  const filteredTasks = computed(() =>
    tasks.value.filter((task) => {
      const statusMatches = filters.value.status === 'all' || task.status === filters.value.status
      const priorityMatches =
        filters.value.priority === 'all' || task.priority === filters.value.priority

      return statusMatches && priorityMatches
    }),
  )

  function addTask(draft: TaskDraft): Task {
    const { notify } = useNotificationStore()

    const task: Task = {
      ...draft,
      id: createId(),
      createdAt: new Date().toISOString(),
    }

    tasks.value.push(task)
    notify('success', `Task "${task.title}" created.`)

    return task
  }

  function updateTask(id: string, patch: TaskPatch): Task | undefined {
    const { notify } = useNotificationStore()

    const index = tasks.value.findIndex((task) => task.id === id)
    if (index === -1) {
      notify('error', 'Could not update that task — it no longer exists.')
      return undefined
    }

    const updated: Task = { ...tasks.value[index], ...patch }
    tasks.value[index] = updated

    notify('success', `Task "${updated.title}" updated.`)

    return updated
  }

  function removeTask(id: string): boolean {
    const { notify } = useNotificationStore()

    const index = tasks.value.findIndex((task) => task.id === id)
    if (index === -1) {
      notify('error', 'Could not delete that task — it no longer exists.')
      return false
    }

    const [removed] = tasks.value.splice(index, 1)
    notify('success', `Task "${removed.title}" deleted.`)

    return true
  }

  return { tasks, filters, filteredTasks, addTask, updateTask, removeTask }
})
