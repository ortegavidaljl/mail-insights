<template>
  <div class="container mx-auto px-20 flex flex-col justify-center align-center text-white text-xl h-screen w-screen">
    <h1 class="text-3xl sm:text-5xl mb-8">
      Esta página no existe :(
    </h1>

    <p class="mb-4">Estás aquí porque has intentado acceder a un apartado que no existe. ¿Qué puedes hacer?</p>
    <ul class="list-disc ml-6 mb-8">
      <li>Revisar la URL (dirección) que muestra tu navegador, por si te hubieras equivocado.</li>
      <li>Pulsar sobre el botón "Atrás" de tu navegador.</li>
      <li>En el caso de que este sitio realmente debiera existir, comunícalo al proveedor.</li>
      <li>Pulsar en el siguiente botón.</li>
    </ul>

    <RouterLink to="/" class="w-36 block rounded border text-center border-blue-600 bg-blue-600 px-6 pt-1 pb-2 font-medium text-white hover:bg-blue-700 hover:text-white focus:outline-none active:text-opacity-75">
      Ir al inicio
    </RouterLink>
  </div>
</template>

<script setup>
  import { onMounted, onUnmounted } from 'vue'
  import { RouterLink } from 'vue-router'
  import { useMainStore } from '@/stores/main'

  const store = useMainStore()

  onMounted(async () => {
		store.backgroundHexChangeColor('red')
	})

	onUnmounted(async () => {
		store.backgroundHexChangeColor('blue')
	})
</script>