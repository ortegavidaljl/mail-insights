<template>
  <header class="pt-20 flex items-center justify-center gap-x-3">
    <h1 class="text-center text-white font-bold text-4xl">Mail Insights</h1>
    <div class="min-h-[1em] w-px self-stretch bg-linear-to-tr from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"></div>
    <Logo />
  </header>

  <main>
    <ToolSelector />
  </main>
</template>

<script setup>
  import ToolSelector from '../components/ToolSelector.vue'
  import Logo from '@/components/Logo.vue';
</script>
