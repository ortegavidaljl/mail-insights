<template>
	<div class="container mx-auto justify-center flex flex-col w-full items-center text-white py-16">
		
		<header class="-mt-12">
			<h1 class="text-4xl text-center sm:text-5xl">Esta es tu dirección:</h1>
			<p class="text-right mr-0.5 mb-16 sm:text-lg">Pulsa sobre ella para copiarla</p>
		</header>

		<div class="sm:text-lg text-base text-start min-w-[467px] sm:min-w-[550px]">
	
			<table class="min-w-full divide-y-2 divide-gray-200 bg-white/20 rounded">
				<tbody class="divide-y divide-gray-200 ">
					<tr><td class="text-right font-bold w-1/3 p-2">Dirección IPv4</td><td class="p-2 cursor-pointer" @click="copyToClipboard(ipv4)">{{ ipv4 }}</td></tr>
					
					<template v-if="ipv4RDAP">
						<tr><td class="text-right font-bold p-2">Nombre de la red</td><td class="p-2">{{ ipv4RDAP["name"] }} ({{ ipv4RDAP["country"] }})</td></tr>
						<tr><td class="text-right font-bold p-2">Rango</td><td class="p-2">{{ ipv4RDAP["handle"] }}</td></tr>
					</template>
				</tbody>
			</table>

			<table class="mt-2 min-w-full divide-y-2 divide-gray-200 table-auto bg-white/20 rounded">
				<tbody class="divide-y divide-gray-200 ">
					<tr><td class="text-right font-bold w-1/3 p-2">Dirección IPv6</td><td class="p-2 cursor-pointer" @click="copyToClipboard(ipv6)">{{ ipv6 }}</td></tr>
					<template v-if="ipv6RDAP">
						<tr><td class="text-right font-bold p-2">Nombre de la red</td><td class="p-2">{{ ipv6RDAP["name"] }} ({{ ipv6RDAP["country"] }})</td></tr>
						<tr><td class="text-right font-bold p-2">Rango</td><td class="p-2">{{ ipv6RDAP["handle"] }}</td></tr>
					</template>
				</tbody>
			</table>

		</div>

	</div>
</template>

<script setup>
	import { ref, onMounted } from 'vue'
	import { query } from '@/utils/rdap'
	import api from '@/utils/api'

	onMounted(() => {
		getIP()
	});

	const ipv4 = ref('Comprobando...')
	const ipv6 = ref('Comprobando...')
	const ipv4RDAP = ref(null)
	const ipv6RDAP = ref(null)


	function getIP() {
		api.get(import.meta.env.VITE_APP_IPV4_CHECKER,{
    	withCredentials: false
		})
		.then(async (response) => {
			if (response.data) {
				ipv4.value = response.data
				await query(response.data, false).then((data) => {
					ipv4RDAP.value = data
				})
				
			}
		}).catch(() => {
			ipv4.value = "-"
		});

		api.get(import.meta.env.VITE_APP_IPV6_CHECKER,{
    	withCredentials: false
		})
		.then(async (response) => {
			if (response.data) {
				ipv6.value = response.data
				await query(response.data, false).then((data) => {
					ipv6RDAP.value = data
				
				})
			}
		}).catch(() => {
			ipv6.value = "-"
		});
	}

	function copyToClipboard(text){
		navigator.clipboard.writeText(text);
	}
</script>