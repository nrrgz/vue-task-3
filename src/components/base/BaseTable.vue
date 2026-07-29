<script setup lang="ts" generic="T extends object">
import { computed, ref } from 'vue'

interface Column {
  key: string
  label: string
  sortable?: boolean
}

interface Props {
  columns: Column[]
  rows: T[]
  rowKey?: string
}

const props = defineProps<Props>()

defineSlots<{
  [name: `cell-${string}`]: (props: { row: T; value: unknown }) => unknown
  empty?: () => unknown
}>()

function cellValue(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key]
}

function keyFor(row: T, index: number): string | number {
  if (props.rowKey === undefined) return index

  const value = cellValue(row, props.rowKey)
  return typeof value === 'string' || typeof value === 'number' ? value : index
}

type SortDirection = 'asc' | 'desc'

const sortKey = ref<string | null>(null)
const sortDirection = ref<SortDirection>('asc')

function toggleSort(column: Column): void {
  if (!column.sortable) return

  if (sortKey.value !== column.key) {
    sortKey.value = column.key
    sortDirection.value = 'asc'
  } else if (sortDirection.value === 'asc') {
    sortDirection.value = 'desc'
  } else {
    sortKey.value = null
  }
}

function isBlank(value: unknown): boolean {
  return value === null || value === undefined || value === ''
}

function compareValues(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b))
}

const sortedRows = computed<T[]>(() => {
  const key = sortKey.value
  if (key === null) return props.rows

  const direction = sortDirection.value

  return [...props.rows].sort((rowA, rowB) => {
    const a = cellValue(rowA, key)
    const b = cellValue(rowB, key)

    if (isBlank(a) && isBlank(b)) return 0
    if (isBlank(a)) return 1
    if (isBlank(b)) return -1

    const result = compareValues(a, b)
    return direction === 'asc' ? result : -result
  })
})

function indicatorFor(key: string): string {
  if (sortKey.value !== key) return ''
  return sortDirection.value === 'asc' ? '▲' : '▼'
}

function ariaSortFor(column: Column): 'ascending' | 'descending' | 'none' | undefined {
  if (!column.sortable) return undefined
  if (sortKey.value !== column.key) return 'none'
  return sortDirection.value === 'asc' ? 'ascending' : 'descending'
}
</script>

<template>
  <table class="base-table">
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.key" scope="col" :aria-sort="ariaSortFor(column)">
          <button
            v-if="column.sortable"
            type="button"
            class="base-table__sort"
            @click="toggleSort(column)"
          >
            {{ column.label }}
            <span class="base-table__indicator" aria-hidden="true">{{
              indicatorFor(column.key)
            }}</span>
          </button>

          <template v-else>{{ column.label }}</template>
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(row, rowIndex) in sortedRows" :key="keyFor(row, rowIndex)">
        <td v-for="column in columns" :key="column.key">
          <slot :name="`cell-${column.key}`" :row="row" :value="cellValue(row, column.key)">
            {{ cellValue(row, column.key) }}
          </slot>
        </td>
      </tr>

      <tr v-if="sortedRows.length === 0">
        <td class="base-table__empty" :colspan="columns.length">
          <slot name="empty">No data</slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.base-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.base-table th,
.base-table td {
  padding: 0.6rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.base-table th {
  font-weight: 600;
  color: #374151;
  background-color: #f9fafb;
  border-bottom: 1px solid #d1d5db;
  white-space: nowrap;
}

.base-table__sort {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin: -0.2rem -0.35rem;
  padding: 0.2rem 0.35rem;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: inherit;
  cursor: pointer;
}

.base-table__sort:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.base-table__sort:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
}

.base-table__indicator {
  display: inline-block;
  min-width: 0.75em;
  font-size: 0.7em;
  color: #6b7280;
}

.base-table tbody tr:hover {
  background-color: #f9fafb;
}

.base-table__empty {
  padding: 1.5rem 0.75rem;
  text-align: center;
  color: #6b7280;
}
</style>
