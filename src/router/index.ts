import { createRouter, createRoute, withParams, unionOf, withDefault, createRejection } from "@kitbag/router";
import HomeView from "../views/HomeView.vue";
import { defineAsyncComponent, h } from "vue";
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

const onlyAccessibleThroughContext = createRoute({
  name: 'onlyAccessibleThroughContext',
  path: '/only-accessible-through-context',
  component: {
    render: () => h('div', 'Only accessible through context')
  }
})

const keys = createRoute({
  parent: settings,
  name: 'settings.keys',
  path: '/keys',
  query: withParams('sort=[?sort]', { 
    sort: withDefault(unionOf(['asc', 'desc']), 'asc') 
  }),
  context: [onlyAccessibleThroughContext],
  component: defineAsyncComponent(() => import('../views/SettingsKeysView.vue'))
})

keys.onAfterRouteEnter((to, { push }) => {
  if(to.params.search === 'secret') {
    push('onlyAccessibleThroughContext')
  }
})

const notAuthorizedRejection = createRejection({
  type: 'NotAuthorized',
  component: LoginView
})

const requiresAuth = createRoute({
  name: 'auth',
  path: '/requires-auth',
  context: [notAuthorizedRejection],
})

requiresAuth.onBeforeRouteEnter((_to, { reject }) => {
  throw reject('NotAuthorized')
})

export const routes = [home, settings, profile, keys, requiresAuth] as const
export const router = createRouter(routes, {
  rejections: [notAuthorizedRejection],
})
