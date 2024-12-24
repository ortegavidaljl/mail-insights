<template>
	<details :class="'text-black rounded ' + color">
		<summary class="open:rounded-b-none flex shadow-lg text-xl justify-between items-center cursor-pointer border-gray-200 bg-white rounded hover:bg-gray-200 border px-4 py-2">
			<span><span v-if="data.subtract">(-{{ data.subtract }}) </span> {{ panelTitles[data.message] }}</span>
			<MDIIcon :icon="icon"/>
		</summary>

		<div class="p-4 bg-white mt-1 shadow-lg rounded">
			<slot name="text"></slot>
			<slot name="custom"></slot>

			<div v-if="!$slots.custom" v-for="item, index in data.tests" v-bind:key="index" class="pt-4">
				<p class='border-b mb-4'>Resultado de la prueba "{{ item.name }}":</p>
				<CodeBlock v-if="item.name == 'dns'">
					<template v-if="Array.isArray(item.result)" v-for="element in item.result">
						<template v-if="Array.isArray(element)">
							{{ element.join(' ') }} <br/>
						</template>
						<template v-else>{{element }}</template>
					</template>
					<template v-else v-for="result in item.result">
						{{ result }}
					</template>
				</CodeBlock>
				<template v-else-if="item.name == 'header'">
					<table class='mt-2 min-w-full divide-y-2 divide-gray-200 bg-white text-sm rounded'>
						<tbody class='divide-y divide-gray-200'>
							<tr v-for="(value, key, index) in item.result" v-bind:key="index" class='odd:bg-gray-50 hover:bg-gray-200'>
								<td class='p-2'>{{ key }}</td>
								<td class='break-all'>{{ value }}</td>
							</tr>
						</tbody>
					</table>
				</template>
				<CodeBlock v-else>{{ item.result }}</CodeBlock>
			</div>
		</div>
	</details>
</template>

<script setup>
	import { computed } from 'vue'
	import MDIIcon from '@/components/MDIIcon.vue'
	import CodeBlock from '@/tools/x-ray/components/CodeBlock.vue'

	const panelTitles = {
		"message:info": "Tu mensaje",
		"auth:info": "Autenticación",

		"sa:ok": "SpamAssassin no detecta tu correo como spam",
		"sa:shouldReview": "Deberías revisar tu mensaje",
		"sa:nok": "Tu mensaje se ha detectado como spam",

		"spf:ok": 'La IP de tu servidor puede enviar',
		"spf:notAuthorized": 'La IP de tu servidor no está autorizada',
		"spf:notAuthorizedOk": 'La IP de tu servidor no está autorizada, pero podría pasar la comprobación',
		"spf:notSpecified": 'El SPF no bloquea ni autoriza la IP explícitamente',
		"spf:syntaxError": 'El SPF contiene un error',
		"spf:dnsError": 'No se pudo resolver el SPF',
		"spf:noSPF": 'El dominio no tiene SPF',
		"spf:moreThanOne": 'El dominio tiene más de un SPF',

		"dkim:ok": 'La firma DKIM es válida',
		"dkim:notSigned": 'El correo no está firmado',
		"dkim:nok": 'La firma DKIM no es válida',

		"dmarc:ok": 'Registro DMARC detectado',
		"dmarc:nok": 'Registro DMARC no detectado',

		"arc:ok": 'La cadena ARC es válida',
		"arc:notSigned": 'La cadena ARC no está presente',
		"arc:nok": 'La cadena ARC no es válida',

		"rdns:ok": 'El saludo SMTP y el rDNS coinciden',
		"rdns:nok": 'El saludo SMTP y el rDNS no coinciden',

		"domain_mx:ok": 'Tu dominio dispone de al menos un MX',
		"domain_mx:nok": 'Tu dominio no tiene registros MX',

		"rbl:ok": 'La IP de tu servidor no está listada',
		"rbl:nok": 'La IP de tu servidor está listada',
	}

	const props = defineProps({
		data:{
			required: false
		}
	})

	const color = computed(() => {
		switch (props.data.status) {
			case 'success':
				return 'fill-green-600';
			case 'error':
				return 'fill-red-600';
			case 'warning':
				return 'fill-yellow-600';
			default:
				return 'fill-blue-600';
		}
	});

	const icon = computed(() => {
		switch (props.data.status) {
			case 'success':
				return 'CheckCircleOutline';
			case 'error':
				return 'CloseCircleOutline';
			case 'warning':
				return 'AlertCircleOutline';
			case 'info':
				return 'InformationOutline';
			default:
				return 'EmailSearch';
		}
	});

</script>
