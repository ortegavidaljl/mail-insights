<template>
	
	<div v-if="isTestHistoryShown" @click="isTestHistoryShown = !isTestHistoryShown" class="z-10 w-screen fixed top-[0px] left-[0px] bg-gray-800/10 h-screen bg-black"></div>

	<Transition name="slide-fade">
		<div v-if="isTestHistoryShown" class="z-20 transition-all w-80 max-h-[400px] left-[-145px] top-[45px] absolute backdrop-blur-sm text-white bg-gray-800/90 shadow-lg overflow-auto rounded p-4 overflow-x-auto">

			<h1 class="font-bold text-xl text-center">Otras pruebas ejecutadas</h1>

			<p class="mt-2 mb-4 text-justify">
				En el listado se muestran otras pruebas realizadas a la misma cuenta de correo. Pulsa sobre alguna entrada para acceder a su reporte.
			</p>

			<div class="h-[calc(100%-290px)] text-gray-900 bg-white/80 shadow overflow-auto rounded p-4 overflow-x-auto dark:bg-gray-900 dark:border-gray-700 dark:text-white">
				
				<table class="w-full text-center">
					<tr v-for="item, index in data" v-bind:key="index">
						<td><RouterLink :to="item.id" class="hover:underline">{{ getLocalTime(item.created_at) }}</RouterLink></td>
					</tr>
				</table>
			</div>
		</div>
	</Transition>

	<MDIIcon class="z-20 relative block cursor-pointer fill-white" @click="isTestHistoryShown = !isTestHistoryShown" size="28" icon="History"/>
</template>

<style scoped>
	.slide-fade-enter-active {
		transition: all 0.2s ease-in;
	}

	.slide-fade-leave-active {
		transition: all 0.12s ease-out;
	}

	.slide-fade-enter-from,
	.slide-fade-leave-to {
		transform: translateY(20px);
		opacity: 0;
	}
</style>

<script setup>
	import MDIIcon from '@/components/MDIIcon.vue'
	import { RouterLink } from 'vue-router'
	import { ref  } from 'vue'

	const isTestHistoryShown = ref(false)

	const timeDateFormatter = new Intl.DateTimeFormat(Intl.DateTimeFormat().resolvedOptions().locale, { timeStyle: "long", dateStyle: "medium" })

	function getLocalTime(utcString) {
    return timeDateFormatter.format(new Date(utcString))
  }

	defineProps({
		data: {
			type: Array,
			required: true
		}
	})

</script>