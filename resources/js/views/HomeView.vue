<template>
  <header class="pt-20">
    <h1 class="text-center text-white font-bold text-4xl">
      Mail Insights
      <Logo />
    </h1>
  </header>

  <main>
    <ToolSelector />
  </main>
</template>

<script setup>
  import ToolSelector from '../components/ToolSelector.vue'
  import { useMainStore } from '@/stores/main'
  import Logo from '@/components/Logo.vue';

  const store = useMainStore()
</script>
