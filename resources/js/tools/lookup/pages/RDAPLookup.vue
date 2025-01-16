<template>
	<div :class=" (!report ? 'justify-center' : '') + ' flex flex-col w-full items-center text-white text-center py-16 overflow-y-auto'">
		
		<header :class="!report ? '-mt-12' : ''">
			<h1 class="text-4xl text-center sm:text-5xl">Escribe en el buscador</h1>
			<p class="text-right mr-0.5 mb-16 sm:text-lg">... y pulsa Enter para comprobar mediante RDAP:</p>
		</header>

		<div class="sm:text-lg text-base text-start w-2/4 min-w-[467px] sm:min-w-[550px]">
			<input v-model="element" :disabled="isLoading" @keyup.enter="getRDAPData" placeholder="Dominio, IP, ASN, TLD" type="text" class="shadow-md hover:shadow-xl text-black py-3 px-4 block w-full border-gray-200 shadow-lg rounded focus:z-10 focus:outline-none focus:ring disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"/>

			<div v-if="isLoading" class="flex flex-row gap-2 text-sm items-center ml-1 mt-2">
				<svg aria-hidden="true" class="w-3 h-3 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
					<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
				</svg>
				<span>Consultando servidores RDAP...</span>
			</div>

			<table v-if="report && reportSources.length == 0" class="mt-4 min-w-full divide-y-2 divide-gray-200 bg-black/30 rounded">
				<thead>
					<tr><th class="p-2" colspan="2"><span class="flex justify-center items-center">
						<MDIIcon class="pr-2 fill-red-600" icon="AlertCircleOutline"/>
						No se ha encontrado información sobre el elemento 
					</span></th></tr>
				</thead>
			</table>

			<DomainReport v-if="report !== null && reportType == 'domain'" :report="report"/>
			<IPReport v-if="report !== null && reportType == 'ip network'" :report="report.registry"/>
			<AutnumReport v-if="report !== null && reportType == 'autnum'" :report="report.registry"/>

			<p v-if="report !== null && reportSources.length >= 1 && !isLoading" class="text-center mt-2 text-xs">Datos obtenidos desde {{ reportSources.join(" y ") }}</p>
		</div>

	</div>
</template>

<style>
/* Tooltip container */
.tooltip {
  position: relative;
	display: inline-block;
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  width: 400px;
  text-align: center;
 
	position: absolute;
  z-index: 1;
  top: 50%;
	transform: translate(10px, -50%);
  left: 105%;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}

.tooltip .tooltiptext::after {
  content: " ";
  position: absolute;
  top: 50%;
  right: 100%; /* To the left of the tooltip */
  margin-top: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent rgba(255, 255, 255, 0.3) transparent transparent;
}
</style>

<script setup>
	import { ref, computed, onUnmounted } from 'vue'
	import MDIIcon from '@/components/MDIIcon.vue'
	import { query } from '@/utils/rdap'
	import DomainReport from '@/tools/lookup/components/DomainReport.vue'
	import IPReport from '@/tools/lookup/components/IPReport.vue'
	import AutnumReport from '@/tools/lookup/components/AutnumReport.vue'

	const element = ref('')
	const isLoading = ref(false)
	const report = ref(null)

	const reportType = computed(() => {
		return report.value?.registry?.report_type ?? report.value?.registrar?.report_type
	});

	const reportSources = computed(() => {
		let sources = [];

		if (typeof report.value?.registry?.report_type !== 'undefined' && report.value?.registry?.report_type !== "none") sources.push("Registry")
		if (typeof report.value?.registrar?.report_type !== 'undefined' && report.value?.registrar?.report_type !== "none") sources.push("Registrar")

		return sources;
	});

	async function getRDAPData() {
		if (!element.value) {
			return
		}
		report.value = null
		isLoading.value = true

		await query(element.value, true)
		.then((data) => {
			
			report.value = data
		}).catch((error) => {
			report.value = null
		}).finally(function () {
			isLoading.value = false
		});
	}
</script>