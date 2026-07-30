<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseField from '../components/base/BaseField.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseModal from '../components/base/BaseModal.vue'
import BaseSelect from '../components/base/BaseSelect.vue'
import BaseTable from '../components/base/BaseTable.vue'
import { email, required, useValidation } from '../composables/useValidation'
import { useNotificationStore } from '../stores/notifications'

type UserRole = 'admin' | 'editor' | 'viewer'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

const users = ref<User[]>([
  { id: 'u-1', name: 'Mara Velasquez', email: 'mara.velasquez@northwind.io', role: 'admin' },
  { id: 'u-2', name: 'Dev Patel', email: 'dev.patel@northwind.io', role: 'editor' },
  { id: 'u-3', name: 'Jonas Lindqvist', email: 'jonas.lindqvist@northwind.io', role: 'editor' },
  { id: 'u-4', name: 'Ines Moreau', email: 'ines.moreau@northwind.io', role: 'viewer' },
  { id: 'u-5', name: 'Tobias Hart', email: 'tobias.hart@northwind.io', role: 'viewer' },
])

const { notify } = useNotificationStore()

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'actions', label: 'Actions', hideLabel: true },
]

const roleOptions: { label: string; value: UserRole }[] = [
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer' },
]

const roleFilterOptions = [{ label: 'All roles', value: 'all' }, ...roleOptions]

const roleFilter = ref<string>('all')

const visibleUsers = computed(() =>
  roleFilter.value === 'all' ? users.value : users.value.filter((u) => u.role === roleFilter.value),
)

const inviteOpen = ref(false)
const inviteFormId = useId()

type InviteValues = {
  name: string
  email: string
  role: string
}

function emptyInvite(): InviteValues {
  return { name: '', email: '', role: '' }
}

const invite = ref<InviteValues>(emptyInvite())

const { errors, validate, reset } = useValidation(invite, {
  name: [required('Name is required')],
  email: [required('Email is required'), email()],
  role: [required('Pick a role')],
})

watch(inviteOpen, (open) => {
  if (open) {
    invite.value = emptyInvite()
    reset()
  }
})

function isUserRole(value: string): value is UserRole {
  return roleOptions.some((option) => option.value === value)
}

let nextId = users.value.length

function submitInvite() {
  if (!validate()) return

  const { name, email: address, role } = invite.value
  if (!isUserRole(role)) return

  users.value.push({
    id: `u-${++nextId}`,
    name: name.trim(),
    email: address.trim(),
    role,
  })

  inviteOpen.value = false
  notify('success', `Invited ${name.trim()}.`)
}

const userPendingRemoval = ref<User | null>(null)

const removeOpen = computed<boolean>({
  get: () => userPendingRemoval.value !== null,
  set: (open) => {
    if (!open) userPendingRemoval.value = null
  },
})

function confirmRemove() {
  const target = userPendingRemoval.value
  if (!target) return

  users.value = users.value.filter((user) => user.id !== target.id)
  userPendingRemoval.value = null
  notify('success', `Removed ${target.name}.`)
}
</script>

<template>
  <section class="view">
    <header class="view__header">
      <h1>Users</h1>
      <BaseButton @click="inviteOpen = true">Invite user</BaseButton>
    </header>

    <div class="filters">
      <BaseField class="filters__field" label="Role" v-slot="{ id }">
        <BaseSelect :id="id" v-model="roleFilter" :options="roleFilterOptions" />
      </BaseField>

      <p class="filters__count">{{ visibleUsers.length }} shown</p>
    </div>

    <BaseTable :columns="columns" :rows="visibleUsers" row-key="id">
      <template #cell-role="{ value }">
        <span class="role" :class="`role--${value}`">{{ value }}</span>
      </template>

      <template #cell-actions="{ row }">
        <div class="row-actions">
          <BaseButton variant="danger" @click="userPendingRemoval = row">Remove</BaseButton>
        </div>
      </template>

      <template #empty>No users with that role.</template>
    </BaseTable>

    <BaseModal v-model="inviteOpen">
      <template #header>Invite user</template>

      <form :id="inviteFormId" class="invite-form" novalidate @submit.prevent="submitInvite">
        <BaseInput v-model="invite.name" label="Name" :error="errors.name" placeholder="Full name" />

        <BaseInput
          v-model="invite.email"
          label="Email"
          :error="errors.email"
          placeholder="name@company.com"
        />

        <BaseField label="Role" :error="errors.role" v-slot="{ id, describedBy, invalid }">
          <BaseSelect
            :id="id"
            v-model="invite.role"
            :aria-describedby="describedBy"
            :invalid="invalid"
            :options="roleOptions"
            placeholder="Select a role"
          />
        </BaseField>
      </form>

      <template #footer>
        <BaseButton variant="secondary" @click="inviteOpen = false">Cancel</BaseButton>
        <BaseButton type="submit" :form="inviteFormId">Send invite</BaseButton>
      </template>
    </BaseModal>

    <BaseModal v-model="removeOpen">
      <template #header>Remove user</template>

      <p class="remove-prompt">
        Remove <strong>{{ userPendingRemoval?.name }}</strong
        >? They will lose access immediately.
      </p>

      <template #footer>
        <BaseButton variant="secondary" @click="userPendingRemoval = null">Cancel</BaseButton>
        <BaseButton variant="danger" @click="confirmRemove">Remove</BaseButton>
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
  min-width: 11rem;
}

.filters__count {
  margin: 0 0 0 auto;
  font-size: 0.85rem;
  color: #6b7280;
}

.role {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.role--admin {
  background-color: #ede9fe;
  color: #6d28d9;
}

.role--editor {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.role--viewer {
  background-color: #e5e7eb;
  color: #374151;
}

.row-actions {
  display: flex;
  justify-content: flex-end;
}

.invite-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.remove-prompt {
  margin: 0;
}
</style>
