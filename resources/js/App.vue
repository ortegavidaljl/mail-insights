<template>
	<HexagonBackground/>
	<router-view />
</template>

<script setup>
	import HexagonBackground from './components/HexagonBackground.vue';
</script>

<style>
/* width */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar:horizontal{
	height: 6px;
}

/* Track */
::-webkit-scrollbar-track {
  border-radius: 10px;
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #c1c1c1; 
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:horizontal{
	border-radius: 10px;
 }


/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #9d9d9d; 
}

</style>
