import { createRouter, createRoute, withParams, unionOf, withDefault } from "@kitbag/router";
import HomeView from "../views/HomeView.vue";
import { defineAsyncComponent } from "vue";
import LoginView from "../views/LoginView.vue";

const home = createRoute({ 
  name: 'home', 
  path: '/', 
  component: HomeView 
})

const settings = createRoute({
  name: 'settings',
  path: '/settings',
  query: 'search=[?search]',
  component: defineAsyncComponent(() => import('../views/SettingsView.vue'))
})

const profile = createRoute({
  parent: settings,
  name: 'settings.profile',
  path: '/profile',
  component: defineAsyncComponent(() => import('../views/SettingsProfileView.vue'))
})

const keys = createRoute({
  parent: settings,
  name: 'settings.keys',
  path: '/keys',
  query: withParams('sort=[?sort]', { 
    sort: withDefault(unionOf(['asc', 'desc']), 'asc') 
  }),
  component: defineAsyncComponent(() => import('../views/SettingsKeysView.vue'))
})

const requiresAuth = createRoute({
  name: 'auth',
  path: '/requires-auth',
  onBeforeRouteEnter: (_to, { reject }) => {
    reject('NotAuthorized')
  },
})

export const routes = [home, settings, profile, keys, requiresAuth] as const
export const router = createRouter(routes, {
  rejections: { NotAuthorized: LoginView },
})
