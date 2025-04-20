<template>
  <header>
    <nav class="h-12 flex items-center text-white backdrop-blur-xs pl-8 px-4 text-gray-900 gap-4">
      <RouterLink class="text-2xl  mr-8" to="/">
        <span class="leading-[30px] align-top">Mail Insights</span>
      </RouterLink>
      <RouterLink v-for="item, index in store.toolList" v-bind:key="index" activeClass="text-black bg-white shadow-md hover:bg-white/80" class="cursor-pointer rounded-sm hover:bg-white/50 hover:text-black px-3 py-1 hover:shadow-md" :to="item.link">{{ item.name }}</RouterLink>

      <Logo class="absolute bottom-4 top-2.5 right-4 w-32" />
    </nav>
  </header>
</template>

<script setup>
  import { RouterLink } from 'vue-router'
  import { useMainStore } from '@/stores/main'
  import Logo from '@/components/Logo.vue';

  const store = useMainStore()
</script>
