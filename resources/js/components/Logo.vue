<template>
    <div v-show="isImageLoaded">
      <img 
        class="absolute bottom-4 top-2.5 right-4 w-32"
        :src=lele
        alt="Logo"
        @error="handleImageError"
        @load="handleImageLoad"
      />
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  const isImageLoaded = ref(false);
  const lele = ref("/build/assets/logo.png");
  
  function handleImageError() {
    isImageLoaded.value = false;
  }
  
  function handleImageLoad() {
    isImageLoaded.value = true;
  }
  </script>
  