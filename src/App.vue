<script setup lang="ts"></script>

<template>
  <header class="app-header">
    <nav>
      <RouterLink to="/tasks">Tasks</RouterLink>
      <RouterLink to="/users">Users</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
.app-header {
  border-bottom: 1px solid #e2e2e2;
  padding: 0.75rem 1.5rem;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  color: inherit;
  text-decoration: none;
}

nav a.router-link-active {
  font-weight: 600;
  text-decoration: underline;
}
</style>
