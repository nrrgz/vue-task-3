# Task Panel — Reusable Component Library + Pinia

A small task-management panel built to practice **reusable, fully generic Vue 3 components**
and **Pinia** state management. The panel itself is just the demo — the real goal is a
component library (`components/base/`) that drops into any project unchanged.

## Tech stack
Vue 3 (`<script setup>`) · TypeScript · Vite · Pinia · vue-router — no UI library, all
components hand-built.

## Features
- Base component library: `BaseButton`, `BaseInput`, `BaseSelect`, `BaseField`, `BaseModal`, `BaseTable`, `BaseToast`
- Custom table cells via **scoped slots**; two-way binding via **`defineModel()`**
- Pinia stores for tasks (CRUD + filtering getter) and toast notifications
- Create / edit / delete tasks with a stacked confirmation modal
- Hand-rolled form validation (`useValidation` composable) — required fields + email format
- Status / priority filtering driven by a store getter

## Notes on the base layer
Nothing in `components/base/` imports a store, a type from `types/`, or the word "task" —
each component takes generic props and slots only. `UsersView` is the proof: it renders a
completely different dataset through the same components, unmodified.

Three things worth calling out for a reviewer:

- **`BaseToast`** is a base component beyond the required five. It is a pure renderer: it
  takes a `toasts` array and emits `dismiss`, and imports no store of its own — `App.vue`
  wires it to the notifications store. That keeps the toast *stack* reusable in a project
  with a different notification store, or none at all.
- **`BaseField`** is a small extra base component (not in the original brief). It owns the
  label / error / `aria-describedby` wiring that `BaseInput` already had built in, so
  `BaseSelect` and other bare controls can reuse it instead of each view re-implementing
  that markup. It replaced five hand-rolled copies across `TaskForm`, `TasksView` and
  `UsersView`.
- **`BaseButton`'s `loading` prop** is implemented (spinner + clicks blocked + `aria-busy`)
  but unused in the app, because the data layer is a synchronous local mock — there is
  nothing to await. Adding an artificial delay just to show it off would be worse code than
  leaving it dormant, so it stays part of the component's contract for the first real async
  call site.

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
