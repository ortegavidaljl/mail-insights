<template>
	<div :class=" (!report ? 'justify-center' : '') + ' flex flex-col w-full items-center text-white text-center py-16 overflow-y-auto'">
		
		<header :class="!report ? '-mt-12' : ''">
			<h1 class="text-4xl text-center sm:text-5xl">Escribe una IPv4 o hostname</h1>
			<p class="text-right mr-0.5 mb-16 sm:text-lg">... y pulsa Enter para comprobar si su IP está listada:</p>
		</header>

		<div class="sm:text-lg text-base text-start w-11/12 md:w-3/4 lg:w-3/5 xl:w-2/4">
			<input v-model="element" :disabled="isLoading" @keyup.enter="checkAllRBLStatuses" placeholder="Hostname, IP" type="text" class="bg-white shadow-md hover:shadow-xl text-black py-3 px-4 block w-full border-gray-200 shadow-lg rounded-sm focus:z-10 focus:outline-hidden focus:ring-2 ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"/>

			<div v-if="isLoading" class="flex flex-row gap-2 text-sm items-center ml-1 mt-2">
				<svg aria-hidden="true" class="w-3 h-3 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
					<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
				</svg>
				<span>Consultando listas negras...</span>
			</div>


			<table class="mt-4 min-w-full divide-y-2 divide-gray-200 bg-black/30 rounded-sm overflow-hidden">
				<thead>
					<tr>
						<th class="py-1 px-3 text-start">Nombre</th>
						<th class="py-1 px-3 text-start">Servidor</th>
						<th class="py-1 px-3 text-start">Estado</th>
					</tr>
				</thead>
				<tbody>
					<tr :class="color(rbl.status)" v-for="(rbl, index) in report" :key="index">
						<td class="py-1 px-3 flex flex-row gap-2 items-center">
							<svg v-if="rbl.isLoading" aria-hidden="true" class="w-4 h-4 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
								<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
							</svg>
							
							<a :href="rbl.url" target="_blank" class="hover:underline">{{ rbl.name }}</a>
						</td>
						<td class="py-1 px-3">{{ rbl.server }}</td>
						<td class="py-1 px-3">{{ rbl.status }}</td>
					</tr>
				</tbody>
			</table>

		</div>

	</div>
</template>

<script setup>
	import { ref } from 'vue'
	import { rblList } from '@/utils/rbl'
	import ipaddr from 'ipaddr.js'
	import api from '@/utils/api'
	
	const element = ref('')
	const report = ref(rblList)
	const isLoading = ref(false)

	function color (lolo) {
		let status= {
			"Listed": "bg-red-400/50",
			"Not Listed": "bg-green-400/50",
			"Error": "bg-orange-400/50"
		}
		return status[lolo]
	}

	async function checkAllRBLStatuses() {
		let ip = null
		
		if(ipaddr.isValid(element.value)) {
			ip = element.value
		} else if (/^(?!-)[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,63}$/.test(element.value)) {
			ip = await api.get(`/query/A/${element.value}`)
				.then((response) => {
					return response.data[0]["ip"]
				})
				.catch(() => {
					console.log("meh...")
				})
		} else {
			return
		}

		let reversedIP = ip.split('.').reverse().join('.')

		report.value.map(async (rbl) => {
			rbl.isLoading = true
			
			await api.get(`/query/A/${reversedIP}.${rbl.server}`)
				.then((response) => {
					rbl.status = response.data.length >= 1 ? 'Listed' : 'Not Listed';
				})
				.catch(() => {
					rbl.status = 'Error';
				}).finally(() => {
					rbl.isLoading = false
				})
		});
	}


</script>