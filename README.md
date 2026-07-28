# Task Panel — Reusable Component Library + Pinia

A small task-management panel built to practice **reusable, fully generic Vue 3 components**
and **Pinia** state management. The panel itself is just the demo — the real goal is a
component library (`components/base/`) that drops into any project unchanged.

## Tech stack
Vue 3 (`<script setup>`) · TypeScript · Vite · Pinia · vue-router — no UI library, all
components hand-built.

## Features
- Base component library: `BaseButton`, `BaseInput`, `BaseSelect`, `BaseModal`, `BaseTable`, `BaseToast`
- Custom table cells via **scoped slots**; two-way binding via **`defineModel()`**
- Pinia stores for tasks (CRUD + filtering getter) and toast notifications
- Create / edit / delete tasks with a stacked confirmation modal
- Hand-rolled form validation (`useValidation` composable) — required fields + email format
- Status / priority filtering driven by a store getter

## Getting started
```bash
npm install
npm run dev      # start the dev server
npm run build    # production build
```

## Project structure
```
src/
├─ components/base/   # generic, reusable UI — no business logic
├─ components/tasks/  # feature layer (TaskForm, StatusBadge)
├─ composables/       # useValidation
├─ stores/            # tasks, notifications (Pinia)
├─ mock/              # local seed data
├─ types/             # shared Task types
└─ views/             # TasksView (main), UsersView (reuse demo)
```

Data is a local mock array — no backend required.
