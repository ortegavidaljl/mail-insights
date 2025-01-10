<template>
    <img
      v-show="isImageLoaded"
      :src=lele
      alt="Logo"
      @error="handleImageError"
      @load="handleImageLoad"
    />
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
  