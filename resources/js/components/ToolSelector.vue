<template>
  <div class="max-w-3xl mx-auto text-center px-4">
    <h2 class="my-14 text-2xl text-white">Haz clic sobre la herramienta a la que quieras acceder</h2>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:px-0 lg:gap-8">
      <RouterLink v-for="item, index in store.toolList" v-bind:key="index" :to="item.link" class="flex flex-col items-center shadow-md hover:shadow-xl rounded-lg backdrop-blur-xs bg-white/80 p-4">
        <span class="text-2xl font-medium text-gray-900">{{ item.name }}</span>
        <span class="text-sm text-gray-500">{{ item.description }}</span>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
  import { RouterLink } from 'vue-router'
  import { useMainStore } from '@/stores/main'

  const store = useMainStore()
</script>
