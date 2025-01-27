<template>
	<div class="flex flex-col w-full items-center text-white text-center py-16 overflow-y-auto">
		
		<header class="mt-12">
			<h1 class="text-4xl text-center sm:text-5xl">Escribe una IPv4 o hostname</h1>
			<p class="text-right mr-0.5 mb-16 sm:text-lg">... y pulsa Enter para comprobar si su IP está listada:</p>
		</header>

		<div class="sm:text-lg text-base text-start w-11/12 md:w-3/4 lg:w-3/5 xl:w-2/4">
			<div class="flex flex-row gap-2">
				<input v-model="element" :disabled="isLoading" @keyup.enter="checkAllDnsServers" placeholder="Hostname, IP" type="text" class="bg-white shadow-md hover:shadow-xl text-black py-3 px-4 block w-full border-gray-200 shadow-lg rounded-sm focus:z-10 focus:outline-hidden focus:ring-2 ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"/>

				<select v-model="type" :disabled="isLoading" class="w-64 form-select shadow-md hover:shadow-xl text-black py-3 px-4 block bg-white border-gray-200 shadow-lg rounded-sm focus:z-10 focus:outline-hidden focus:ring-2 ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none">
					<option v-for="record in resourceRecords" :value="record" :selected="record == 'A'">{{ record }}</option>
				</select>
				
			</div>

			<div v-if="isLoading" class="flex flex-row gap-2 text-sm items-center ml-1 mt-2">
				<svg aria-hidden="true" class="w-3 h-3 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
					<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
				</svg>
				<span>Consultando listas negras...</span>
			</div>
		</div>

		<div class="sm:text-lg text-base text-start w-11/12 md:w-3/4 lg:w-4/5 xl:w-3/4">

			<div class="mt-4 p-2 min-w-full flex rounded-sm overflow-hidden gap-2">
				<div class="flex flex-col w-2/4 divide-y divide-slate-700">
					
					<div v-for="server in dnsServerList" class="flex text-base flex-row justify-between items-center">
						<div class="flex flex-row gap-2 items-center">
							<img :src="'https://flagcdn.com/' + server.country + '.svg'" :alt="server.country" class="rounded-sm w-8">
							<p>{{ server.location }}<br/>{{ server.name }}</p>
						</div>
						<div>{{ server?.output?.[0][server?.output?.length - 1] ?? "-" }}</div>
					</div>

				</div>

				<div class="w-2/4">
					<div class="flex justify-center gap-2 text-black mb-2 divide-none text-sm font-medium">
						<button class="rounded-sm bg-white px-3 py-1 shadow-md">
							Comprobación mundial
						</button>

						<button class="rounded-sm hover:bg-white/50 hover:text-black text-white px-3 py-1 hover:shadow-md">
							Servidores autoritativos
						</button>
  				</div>

					<div id="map" class="relative">
						<img src="../assets/world_map.svg" alt="World map"/>
						<MDIIcon size="12px" v-for="server in dnsServerList" :class="server.country + ' ' + (server.color ?? 'fill-sky-600') " :icon="server.icon ?? 'CheckboxBlankCircle'"/>
						<!--<div v-for="server in dnsServerList" :class="(server.country + ' shadow-md ') + (server.status ? 'ok' : 'err') "></div>-->
					</div>
				</div>
				
			</div>

		</div>

	</div>
</template>

<style scoped>
	select {
		border-right: 16px solid transparent;
	}

	.ok {
		background-color: green !important;
	}

	.err {
		background-color: red !important;
	}

	#map {
		i {
			position: absolute;
			background-color: black;
      border-radius: 50%;
			/*width: 8px;
			height: 8px;
			background-color: orange;
			border-radius: 5px;
			position: absolute;
			border: 1px solid black;*/
		}

		.ca {
			top: 13%;
    	left: 15%;
		}

		.us {
			top: 28%;
			left: 15%;
		}

		.ar {
			bottom: 15%;
    	left: 25%;
		}

		.es {
			top: 27%;
			left: 43.5%;
		}

		.gb {
			top: 18%;
			left: 44%;
		}

		.it {
			top: 25%;
    	left: 48.5%;
		}

		.de {
			top: 19%;
      left: 47.5%;
		}

		.no {
			top: 11%;
      left: 47%;
		}

		.ru {
			top: 11%;
      left: 67%;
		}

		.tr {
			top: 28%;
    	right: 43%;
		}

		.jp {
			top: 30%;
    	right: 12%;
		}

		.au {
			bottom: 21%;
    	right: 11%;
		}

		.id {
			bottom: 39%;
			right: 17%;
		}

		.cn {
			top: 31%;
    	right: 22%;
		}

		.in {
			top: 41%;
			right: 29%;
		}

		.mx {
			bottom: 56%;
      left: 12.5%;
		}

		.za {
			bottom: 18%;
    	right: 46.5%;
		}

		.eg {
			top: 37%;
			right: 44.5%;
		}
	}

</style>

<script setup>
	import { ref, onMounted } from 'vue'
	import { query } from '@/utils/rdap'
	import MDIIcon from '@/components/MDIIcon.vue'
	import api from '@/utils/api'
	import dnsServers from '../assets/dns_server_list.json'


	const ipv4 = ref('Comprobando...')
	const ipv6 = ref('Comprobando...')
	const element = ref('')
	const type = ref('A')

	const resourceRecords = ["SOA", "NS", "A", "AAAA", "CNAME", "MX", "TXT", "SRV", "DNSKEY", "CAA", "NAPTR", "PTR"]

	const dnsServerList = ref(dnsServers)

	async function checkAllDnsServers() {
		dnsServerList.value.map(async (server) => {
			server.icon = "Clock"
			server.color = "fill-orange-400"

			await api.get(`/query/${type.value}/${element.value}/${server.ip}`)
				.then((response) => {
					server.output = response.data
					server.status = (response.data.length >= 1);
					server.icon = "CheckCircle"
					server.color = "fill-green-600"
				})
				.catch(() => {
					server.status = 'Error';
					server.icon = "CloseCircle"
					server.color = "fill-red-600"
				})
		});
	}
</script>