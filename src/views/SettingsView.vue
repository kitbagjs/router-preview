<script lang="ts" setup>
import { useRoute } from '@kitbag/router';
import NavigationBar from '../components/NavigationBar.vue';

const route = useRoute('settings')
</script>

<template>
  <div class="settings-view">

  <NavigationBar>
    <router-link :to="(resolve) => resolve('settings.profile')">Profile</router-link>
    <router-link :to="(resolve) => resolve('settings.keys')">Keys</router-link>
  </NavigationBar>

    <h1>Settings</h1>
    <p>Settings has parent routes (profile and keys) and implements useRoute with v-model on query param.</p>

    <input type="text" placeholder="search" v-model="route.params.search" />

    <router-view>
      <template #default="{ component }">
        <transition name="fade" mode="out-in">
          <component :is="component" />
        </transition>
      </template>
    </router-view>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>