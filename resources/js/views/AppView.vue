<template>
  <NavBar/>
  
  <main class="flex h-[calc(100vh-48px)]">
    <router-view />
  </main>
</template>

<script setup>
  import NavBar from '@/components/NavBar.vue'
</script>

<style>
</style>
