<template>
	<div class="flex flex-col w-full items-center text-white text-center py-16 overflow-y-auto">
		
		<header>
			<h1 class="text-4xl text-center sm:text-5xl">Escribe un nombre de dominio</h1>
			<p class="text-right mr-0.5 mb-16 sm:text-lg">... y pulsa Enter para consultarlo en los servidores DNS:</p>
		</header>

		<div class="sm:text-lg text-base text-start w-11/12 md:w-3/4 lg:w-3/5 xl:w-2/4">
			<div class="flex flex-row gap-2">
				<input v-model="element" @keyup.enter="checkAllDnsServers" placeholder="Hostname" type="text" class="bg-white shadow-md hover:shadow-xl text-black py-3 px-4 block w-full border-gray-200 shadow-lg rounded-sm focus:z-10 focus:outline-hidden focus:ring-2 ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"/>

				<select v-model="type" class="w-64 form-select shadow-md hover:shadow-xl text-black py-3 px-4 block bg-white border-gray-200 shadow-lg rounded-sm focus:z-10 focus:outline-hidden focus:ring-2 ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none">
					<option v-for="record in resourceRecords" :value="record" :selected="record == 'A'">{{ record }}</option>
				</select>
			</div>
		</div>

		<div class="sm:text-lg text-base text-start w-11/12 md:w-3/4 lg:w-4/5 xl:w-3/4">
			<div class="mt-4 min-w-full flex flex-wrap rounded-sm overflow-hidden">

				<div v-if="checkType == 'authoritative'" class="flex flex-col w-full p-2 lg:w-2/4 divide-y divide-slate-700">
					<div v-if="isAuthServerListLoading">
						<div class="animate-pulse text-base divide-y divide-slate-700 mb-4">
							<div class="flex flex-row justify-between items-center py-1 min-h-[57px]">
								<div class="w-48 h-8 bg-gray-300 rounded"></div>
								<div class="w-1/2 h-8 bg-gray-300 rounded"></div>
							</div>
							<div class="flex flex-row justify-between items-center py-1 min-h-[57px]">
								<div class="w-32 h-8 bg-gray-300/50 rounded"></div>
								<div class="w-1/2 h-8 bg-gray-300/50 rounded"></div>
							</div>
							<div class="flex flex-row justify-between items-center py-1 min-h-[57px]">
								<div class="w-40 h-8 bg-gray-300/20 rounded"></div>
								<div class="w-1/2 h-8 bg-gray-300/20 rounded"></div>
							</div>
						</div>

						<div class="flex flex-col gap-4 justify-center items-center">
							<svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
								<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
							</svg>
							<span>Obteniendo servidores autoritativos...</span>
						</div>
					</div>
					

					<div v-else-if="dnsServerList.length" v-for="server in dnsServerList" class="flex text-base flex-row justify-between items-center py-1 min-h-[57px]">
						<p class="ml-4">{{ server.address }}</p>
						<div class="flex flex-col gap-1 whitespace-pre-wrap max-w-[50%] text-end">
							<p v-for="record in server.values" :class="(server.values.length > 1) ? 'p-1 bg-gray-800 rounded-sm text-balance word-break' : ''">
								{{ record ?? "-" }}
							</p>
						</div>
					</div>
					<p v-else class="text-center">No se encontraron servidores; El TLD tiene su propia entidad de gestión, no dispone de servidor RDAP público o el dominio no se encuentra registrado.</p>
				</div>

				<div v-else class="flex flex-col w-full p-2 lg:w-2/4 divide-y divide-slate-700">
					<div v-for="server in dnsServerList" class="flex text-base flex-row justify-between items-center py-1 min-h-[57px]">
						<div class="flex flex-row gap-2 items-center">
							<img v-if="checkType != 'custom'" :src="'https://flagcdn.com/' + server.country + '.svg'" :alt="server.country" class="rounded-sm w-8">
							<p class="flex flex-col">
								<span>{{ server.location }}</span>
								<span>{{ server.name }}</span>
								<span v-if="checkType == 'custom'" class="ml-4">{{ server.address }}</span>
							</p>
						</div>
						<div class="flex flex-col gap-1 whitespace-pre-wrap max-w-[50%] text-end">
							<p v-for="record in server.values" :class="(server.values.length > 1) ? 'p-1 bg-gray-800 rounded-sm text-balance word-break' : ''">
								{{ record ?? "-" }}
							</p>
						</div>
					</div>

					<div v-if="checkType == 'custom'" class="text-center">
						<p class="mt-4">Añadir servidores personalizados</p>
						<input v-model="customDNS" @keyup.enter="modDNSServer()" class="mt-4 bg-white shadow-md hover:shadow-xl text-black text-base py-3 px-4 block w-full border-gray-200 shadow-lg rounded-sm focus:z-10 focus:outline-hidden focus:ring-2 ring-blue-500"/>
						<button @click="modDNSServer()" class="cursor-pointer rounded-sm bg-white text-sm font-medium px-3 py-1 mr-2 mt-4 text-black shadow-md">
							Añadir / Borrar
						</button>
					</div>
				</div>

				<div class="flex flex-col w-full p-2 lg:w-2/4">
					<div class="flex justify-center gap-2 text-black mb-2 divide-none text-sm font-medium">
						<button @click="checkType = 'global'" :class="getButtonClasses('global')">
							Comprobación global
						</button>

						<button :disabled="!isElementOk" @click="checkType = 'authoritative'" :class="getButtonClasses('authoritative')">
							Servidores autoritativos
						</button>

						<button @click="checkType = 'custom'" :class="getButtonClasses('custom')">
							Servidores propios
						</button>
  				</div>

					<div id="map" class="relative">
						<img src="../assets/world_map.svg" alt="World map"/>
						<MDIIcon v-if="checkType == 'global'" size="12px" v-for="server in dnsServerList" :style="getGetPosition(server.position)" :class="server.color ?? 'fill-sky-600'" :icon="server.icon ?? 'CheckboxBlankCircle'"/>
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

	#map {
		i {
			position: absolute;
			background-color: black;
	  border-radius: 50%;
		}
	}

	.word-break{
		word-wrap: break-word;
	}

</style>

<script setup>
	import { ref, watch, computed } from 'vue'
	import { query } from '@/utils/rdap'
	import MDIIcon from '@/components/MDIIcon.vue'
	import api from '@/utils/api'
	import dnsServers from '@/tools/query/assets/dns_server_list.json'
	import { useMainStore } from '@/stores/main'

  const store = useMainStore()

	const element = ref('')
	const type = ref('A')
	const checkType = ref('global')
	const isAuthServerListLoading = ref('false')
	const customDNS = ref('')

	watch(element, async (newType) => {
		if (checkType.value == 'authoritative') {
			checkType.value = 'global'
		}
	})

	watch(checkType, async (newType) => {
		switch(newType){
			case 'global':
				dnsServerList.value = dnsServers
				break
			case 'authoritative':
				await getAuhoritativeDNS(element.value)
				break
			case 'custom':
				dnsServerList.value = store.customDNSServers
				break
		}
	})

	const isElementOk = computed(() => {
		return element.value.trim().length !== 0 && /^(?!-)[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,63}$/.test(element.value)
	})

	const resourceRecords = ["SOA", "NS", "A", "AAAA", "CNAME", "MX", "TXT", "SRV", "CAA", "PTR"]

	const dnsServerList = ref(dnsServers)

	function modDNSServer(){
		if(customDNS.value.trim().length == 0) return

		let doesServerExists = dnsServerList.value.find((server) => server.address == customDNS.value)

		if(!doesServerExists) {
			dnsServerList.value.push({
				address: customDNS.value,
			})
		} else {
			dnsServerList.value = dnsServerList.value.filter((server) => server.address != customDNS.value)
		}

		store.customDNSServers = dnsServerList.value
		localStorage.setItem('custom_dns_servers', JSON.stringify(dnsServerList.value))
	}

	function getButtonClasses(type){
		return type == checkType.value ? 'rounded-sm bg-white px-3 py-1 shadow-md' : 'cursor-pointer rounded-sm hover:bg-white/50 hover:text-black text-white px-3 py-1 hover:shadow-md'
	}

	async function getAuhoritativeDNS(domain){
		isAuthServerListLoading.value = true
		await query(domain, true)
			.then((data) => {
				dnsServerList.value = []
				data.registrar.nameservers.map((server) => {
					dnsServerList.value.push({
						address: server.name,
					})
				})
				isAuthServerListLoading.value = false
			})
			.catch(() => {
				dnsServerList.value = []
				isAuthServerListLoading.value = false
			})
	}

	function getGetPosition(position){
		return {
			top: position[0] + '%',
			right: position[1] + '%',
			bottom: position[2] + '%',
			left: position[3] + '%'
		}
	}

	function getRecordsValue(records){
		let values = []

		records.forEach((record) => {
			switch(type.value){
				case 'A':
					values.push(record.ip)
					break
				case 'AAAA':
					values.push(record.ipv6)
					break
				case 'CNAME':
					values.push(record.target)
					break
				case 'NS':
					values.push(record.target)
					break
				case 'MX':
					values.push(`${record.pri}:${record.target}`)
					break
				case 'TXT':
					values.push(record.txt)
					break
				case 'SRV':
					values.push(`${record.pri} ${record.weight} ${record.port} ${record.target}`)
					break
				case 'CAA':
					values.push(`${record.flags} ${record.tag} ${record.value}`)
					break
				case 'SOA':
					values.push(`${record.mname} ${record.rname} ${record.serial} ${record.refresh} ${record.retry} ${record.expire} ${record.minimum_ttl}`)
					break
				case 'PTR':
					values.push(record.target)
					break
				default:
					values.push('Registro no soportado')
					break;
			}
		})
		return values
	}

	async function checkAllDnsServers() {
		dnsServerList.value.map(async (server) => {
			server.icon = "Clock"
			server.color = "fill-orange-400"

			await api.get(`/query/${type.value}/${element.value}/${server.address}`)
				.then((response) => {
					if (response.data.length == 0) {
							throw new Error('not found');
					}

					server.output = response.data
					server.icon = "CheckCircle"
					server.color = "fill-green-600"

					server.values = getRecordsValue(response.data)
				})
				.catch(() => {
					server.icon = "CloseCircle"
					server.color = "fill-red-600"
					server.values = "-"
				})
		});
	}
</script>