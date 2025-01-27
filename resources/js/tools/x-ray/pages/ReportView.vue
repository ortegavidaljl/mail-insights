<template>
	<div v-if="isReportLoading" class="flex justify-center align-center items-center text-white text-xl w-full">
		<div class="flex flex-col gap-4 justify-center items-center">
				<svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
					<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
				</svg>
				<span>Obteniendo reporte...</span>
			</div>
	</div>
	<div v-else class="flex flex-col w-full items-center overflow-y-auto py-14">
		<h1 class="font-bold text-3xl text-center sm:text-4xl mb-14 text-white">{{ getReportTitle(report.general.score) }}</h1>
		<p class='text-2xl mb-2 text-white'>Puntuación</p>

		<div class="relative mb-14">
			<div v-if="report.history.length > 1" class="absolute right-[140px] top-[12px]">
				<TestHistory :data="report.history"/>
			</div>
			<div class='text-5xl text-white'>{{ report.general.score }}/{{ report.general.max_score }}</div>
		</div>

		<!--<div class="w-11/12 md:w-3/4 lg:w-3/5 xl:w-2/4 mt-14 mb-10 grid grid-cols-1 md:grid-cols-2 md:gap-2 text-white">
			<div class="text-left content-center">
				
			</div>
			<div class="md:text-right content-center">
				
			</div>
		</div>-->

		<div class="w-11/12 md:w-3/4 lg:w-3/5 xl:w-2/4 flex flex-col gap-y-6">
			<!-- INFO -->
			<ExpansionPanel :data="report.general">
				<template #text>
					<p class="border-b text-justify">Información básica:</p>
				</template>
				
				<template #custom>
					<table class="mt-2 min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
						<tbody class="divide-y divide-gray-200">
							<tr class='odd:bg-gray-50 hover:bg-gray-200'>
								<td class="p-2">Desde</td><td>{{ report.general.sent_from }}</td>
							</tr>
							<tr class='odd:bg-gray-50 hover:bg-gray-200'>
								<td class="p-2">Hacia</td><td>{{ report.general.sent_to }}</td>
							</tr>
							<tr class='odd:bg-gray-50 hover:bg-gray-200'>
								<td class="p-2">Recibido el</td><td>{{ report.general.message_date }}</td>
							</tr>
							<tr class='odd:bg-gray-50 hover:bg-gray-200'>
								<td class="p-2">Procesado en</td><td>{{ report.general.processed_in.toFixed(2) }} segundos ({{report.rbl.processed_in.toFixed(2) }}s destinados a comprobaciones RBL) </td>
							</tr>
						</tbody>
					</table>

					<p class="border-b text-justify pt-4">Contenido completo:</p>
					<CodeBlock>{{ report.general.complete_message }}</CodeBlock>
				</template>
			</ExpansionPanel>

			<!-- SPAMASSASSIN -->
			<ExpansionPanel :data="report.spamassassin">
				<template #text>
					<p class="text-justify">El correo electrónico ha sido analizado al completo por SpamAssassin (<span class="font-semibold">v.{{ report.general.spamassassin_version }}</span>), un filtro antispam muy utilizado actualmente.
					Este ha dado una puntuación total de "<span class="font-semibold">{{ report.spamassassin.score }}</span>" al correo electrónico.
					La puntuación puede ser un número positivo o negativo, y se calcula sumando y restando puntos según distintos criterios.
					Si la puntuación supera un umbral predeterminado (normalmente 5), el correo electrónico se clasifica como spam.</p>
				</template>
				
				<template #custom>
					<table class="mt-2 min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
						<thead>
							<tr>
								<th v-for="item, index in spamAssassinTableCols" v-bind:key="index" :class="(index > 0 ? 'text-left ' : '') + 'whitespace-nowrap p-2 font-medium text-gray-900'">{{ item }}</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200">
							<tr v-for="item, index in report.spamassassin.tests" v-bind:key="index" class='odd:bg-gray-50 hover:bg-gray-200'>
								<td :class="(colorSpamTests(item.score)) + ' text-center p-2'">{{ item.score == '-0.0' ? '0.0' : item.score }}</td><td class="p-2">{{ item.name }}</td><td class="p-2">{{ item.description }}</td>
							</tr>
						</tbody>
					</table>
				</template>
			</ExpansionPanel>

			<!-- AUTHENTICATION -->
			<ExpansionPanel :data="report.authentication">
				<template #text>
					<p class="text-justify">Es importante que el servidor desde el que se envía el mensaje esté autenticado y autorizado a enviar los correos del dominio.</p>
				</template>

				<template #custom>
					<!-- SPF -->
					<ExpansionPanel class="pt-4" :data="report.authentication.spf">
						<template #text><p class="text-justify">La IP ha se comprueba para verificar si es un remitente autorizado para el dominio.
							<span class="italic">Sender Policy Framework (SPF)</span> es un mecanismo de validación de correo electrónico que intenta evitar el spoofing
							(suplantación de identidad) verificando la dirección IP del remitente.</p>
						</template>
					</ExpansionPanel>

					<!-- DKIM -->
					<ExpansionPanel class="pt-4" :data="report.authentication.dkim">
						<template #text><p class="text-justify"><span class="italic">DomainKeys Identified Mail (DKIM)</span> es un método de autenticación de correo electrónico que
							permite adjuntar una firma (vinculada al dominio del remitente) al correo saliente.
							Los destinatarios pueden verificar el mensaje recibido consultando la clave pública del remitente publicada en el DNS.</p></template>
					</ExpansionPanel>

					<!-- ARC -->
					<ExpansionPanel class="pt-4" :data="report.authentication.arc">
						<template #text><p class="text-justify">El <span class="italic">Authenticated Received Chain (ARC)</span> es un sistema de seguridad que ayuda a verificar la autenticidad
							de los mensajes. Funciona como un "pasaporte", que acompaña al correo electrónico y registra cada servidor por el que pasa, así como los resultados de las
							comprobaciones de seguridad que se realizan en cada uno de ellos. Este permite al servidor destinatario validar un correo electrónico cuando los registros
							SPF y DKIM quedan invalidados durante el procesamiento en un servidor intermedio.</p></template>
					</ExpansionPanel>

					<!-- DMARC -->
					<ExpansionPanel class="pt-4" :data="report.authentication.dmarc">
						<template #text>
							<p class="text-justify">Una política DMARC permite especificarle al servidor destinatario del correo qué hacer con los mensajes no autenticados (mediante SPF/DKIM).
							Si el correo electrónico falla la verificación, dependiendo de las instrucciones contenidas en el registro DMARC, podría ser entregado, puesto en cuarentena o rechazado.</p>
						</template>
					</ExpansionPanel>

					<!-- RDNS -->
					<ExpansionPanel class="pt-4" :data="report.authentication.rdns">
						<template #text>
							<p class="text-justify">Es importante que el HELO (o saludo) del servidor remitente coincida con el registro inverso asociado a la IP que utilice (rDNS).
							Los destinatarios podrán rechazar el mensaje si el servidor remitente no proporciona información válida en su saludo, o si este y su rDNS no coinciden.</p>
						</template>

						<CodeBlock>
							IP: {{ report.general.source_ip }}<br>
							HELO: {{ report.authentication.rdns.helo }}<br>
							rDNS: {{ report.authentication.rdns.rdns }}
						</CodeBlock>
					</ExpansionPanel>

					<!-- MX -->
					<ExpansionPanel class="pt-4" :data="report.authentication.domain_mx">
						<template #text>
							<p class="text-justify">El dominio remitente debería tener uno o más registros MX válidos.</p>
						</template>
					</ExpansionPanel>
				</template>
			</ExpansionPanel>

			<!-- RBL -->
			<ExpansionPanel :data="report.rbl">
				<template #text>
					<p class="text-justify mb-2">La mayoría de servidores de correo se apoyan en una o varias listas negras (RBL) para detectar remitentes de spam, virus u otras amenazas.
					Existen muchas listas negras diferentes y cada una puede especializarse en controlar un tipo de amenaza concreto.</p>
					<p class="text-justify">
						Es posible que tu IP pueda verse listada si no llevas un control sobre los destinatarios a los que envías (podrías estar enviando a una cuenta trampa de una RBL), si emites una gran cantidad de correos en cortos espacios de tiempo, o si envías mensajes infectados o con contenido sospechoso, entre otras posibilidades.
						Tu IP se ha comprobado en un algunas de las RBL más utilizadas.
					</p>
				</template>

				<template #custom>
					<div class="flex flex-row flex-wrap justify-center">
						<a v-for="item, index in report.rbl.tests" v-bind:key="index" :href='item.url' target='_blank' :class="'flex flex-col shadow-sm hover:shadow-md m-2 p-2 my-2 rounded-sm ' + colorRBLTests(item.result)">
							{{ item.name }}
							<span class="text-sm">{{ item.result }}</span>
						</a>
					</div>
				</template>
			</ExpansionPanel>

		</div>
	</div>
</template>

<style scoped>

.rbl-green {
	background: linear-gradient(45deg, rgba(40,186,45,1) 0%, rgba(40,186,45,.5) 100%);
}

.rbl-yellow {
	background: linear-gradient(45deg, rgba(186,182,40,1) 0%, rgba(186,182,40,.5) 100%);
}

.rbl-red {
	background: linear-gradient(45deg, rgba(186,40,40,1) 0%, rgba(186,40,40,.5) 100%);
}



</style>

<script setup>
	import ExpansionPanel from '@/tools/x-ray/components/ExpansionPanel.vue'
	import TestHistory from '@/tools/x-ray/components/TestHistory.vue'
	import CodeBlock from '@/tools/x-ray/components/CodeBlock.vue'
	import { ref, onMounted, onUnmounted, watch } from 'vue'
	import api from '@/utils/api'
	import { useRoute } from 'vue-router'
	import { useMainStore } from '@/stores/main'

  const store = useMainStore()

	const route = useRoute()

	watch(
		() => route.fullPath,
		async () => {
			await getReport()
		}
	);

	const spamAssassinTableCols = [
		'Puntuación', 'Comprobación', 'Información'
	]

	const report = ref(null)
	const isReportLoading = ref(true)

	onMounted(async () => {
		await getReport()
	})

	onUnmounted(async () => {
		store.backgroundHexChangeColor('blue')
	})

	function colorRBLTests(result) {
		return result == "Not listed" ? "rbl-green" : result == "Listed" ? "rbl-red" : "rbl-yellow"
	}

	function colorSpamTests(score) {
		return score > 0 ? "text-red-600" : score < 0 ? "text-green-600" : "text-orange-600"
	}

	function getAuthReportStatus() {
		let testsToCheck = [report.value.authentication.spf.status, report.value.authentication.dkim.status, report.value.authentication.dmarc.status,
												report.value.authentication.rdns.status, report.value.authentication.domain_mx.status, report.value.authentication.arc.status]

		return testsToCheck.includes("error") ? "error" : testsToCheck.includes("warning") ? "warning" : "success"
	}

	function getReportTitle(score) {
		if (score <= 0 || score <= 3.99 ){
			store.backgroundHexChangeColor('red')
			return "Tus mensajes no serán entregados"
		} else if (score <= 4 || score <= 5.99 ){
			store.backgroundHexChangeColor('orange')
			return "Tus mensajes podrían ser descartados"
		} else if (score <= 6 || score <= 7.99 ){
			store.backgroundHexChangeColor('yellow')
			return "Podrías experimentas algunos problemas de entrega"
		} else if (score <= 8 || score <= 10.99 ){
			store.backgroundHexChangeColor('green')
			return "Tus mensajes deberían ser entregados"
		} else {
			store.backgroundHexChangeColor('blue')
			return "Oh... Algo inesperado ha ocurrido"
		}
	}

	function getReport() {
		isReportLoading.value = true
		api.get('/x-ray/report/'+ route.params.id)
		.then((response) => {
			report.value = response.data.data
			report.value.authentication.status = getAuthReportStatus()
		})
		.catch(function (error) {
			console.log(error);
		})
		.finally(function () {
			isReportLoading.value = false
		});
	}
</script>