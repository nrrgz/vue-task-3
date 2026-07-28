import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import TasksView from '../views/TasksView.vue'
import UsersView from '../views/UsersView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/tasks' },
  { path: '/tasks', name: 'tasks', component: TasksView },
  { path: '/users', name: 'users', component: UsersView },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
