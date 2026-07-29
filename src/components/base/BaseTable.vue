<script setup lang="ts" generic="T extends object">
interface Column {
  key: string
  label: string
}

interface Props {
  columns: Column[]
  rows: T[]
}

defineProps<Props>()

defineSlots<{
  [name: `cell-${string}`]: (props: { row: T; value: unknown }) => unknown
  empty?: () => unknown
}>()

function cellValue(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key]
}
</script>

<template>
  <table class="base-table">
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.key" scope="col">
          {{ column.label }}
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
        <td v-for="column in columns" :key="column.key">
          <slot :name="`cell-${column.key}`" :row="row" :value="cellValue(row, column.key)">
            {{ cellValue(row, column.key) }}
          </slot>
        </td>
      </tr>

      <tr v-if="rows.length === 0">
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

.base-table tbody tr:hover {
  background-color: #f9fafb;
}

.base-table__empty {
  padding: 1.5rem 0.75rem;
  text-align: center;
  color: #6b7280;
}
</style>
