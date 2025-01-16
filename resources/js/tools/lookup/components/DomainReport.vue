<template>
  
  <div class="flex flex-row gap-4 mt-4">
    <p class="p-2 w-1/2 bg-black/30 rounded flex flex-col text-center justify-center">
      <span class="font-bold">Reporte para</span>{{ report.registry.name }}
    </p>
    <p class="p-2 w-1/2 bg-black/30 rounded flex flex-col text-center justify-center">
      <span class="font-bold">Registrado en</span>{{ registeredOn }}
    </p>
  </div>

  <table class="mt-4 w-full bg-black/30 rounded">
    <tbody>
      <tr>
        <td class="p-2 pb-0 text-center font-bold">Fecha de registro</td>
        <td :class="'p-2 pb-0 text-center font-bold ' + checkDate">Fecha de expiración</td>
        <td class="p-2 pb-0 text-center font-bold">Última actualización</td>
      </tr>
      <tr>
        <td class="p-2 pt-0 text-center">{{ events.registration }}</td>
        <td :class="'p-2 pt-0 text-center ' + checkDate">{{ events.expiration }}</td>
        <td class="p-2 pt-0 text-center">{{ events.last_changed }}</td>
      </tr>
    </tbody>
  </table>

  <div class="flex flex-row gap-4 mt-4">
    <ul class="py-2 px-4 w-2/4 flex flex-col gap-2 bg-black/30 rounded">
      <li class="text-center font-bold">Estado/s del dominio</li>
      <template v-for="status in source.status">
        <li class="tooltip w-max underline decoration-dotted decoration-white	cursor-help">{{ status }}
          <span class="tooltiptext p-2 backdrop-blur bg-white/30 rounded">{{ rdapStatusInfo[status] }}</span>
        </li>
      </template>
    </ul>

    <ul class="py-2 px-4 w-2/4 flex flex-col gap-2 bg-black/30 rounded">
      <li class="text-center font-bold">Servidores DNS</li>
      <template v-for="server in source.nameservers">
        <li>{{ server.name.toLowerCase() }}</li>
      </template>
    </ul>
  </div>

  <p class="mt-4 py-2 px-4 col-span-3 bg-black/30 rounded">
    <span class="font-bold">DNSSEC está</span> {{ source.dnssec.delegation_signed ? "activado" : "desactivado" }}
  </p>
  
  <p class="mt-4 p-2 w-full bg-black/30 rounded text-center">
    <span class="font-bold">Contactos</span>
  </p>
  
  <div class="mt-4 columns-1 md:columns-2 gap-4 space-y-4">
    <ul class="py-2 px-4 gap-2 bg-black/30 flex flex-col break-words rounded break-inside-avoid-column" v-for="(contact, index) in contacts" :key="index">
      <li class="text-center font-bold">{{ contact.title }}</li>
      <li v-if="contact.roles"><span class="font-bold">Rol/es:</span> {{ contact.roles }}</li>
      <li v-if="contact.remarks"><span class="font-bold">{{ contact.remarks.title }}:</span> {{ contact.remarks.description }}</li>
      <li v-if="contact.organization"><span class="font-bold">Organización:</span> {{ contact.organization }}</li>
      <li v-if="contact.telephone"><span class="font-bold">Teléfono:</span> {{ contact.telephone }}</li>
      <li v-if="contact.email"><span class="font-bold">Email:</span> {{ contact.email }}</li>
      <li v-if="contact.address"><span class="font-bold whitespace-pre-line">Dirección:</span><br/> {{ contact.address }}</li>
    </ul>
  </div>

</template>

<script setup>
	import { computed  } from 'vue'
	import { rdapStatusInfo } from '@/utils/rdap'

  const props = defineProps({
    report: {
      type: Object,
      required: true
    }
  })

  const source = computed(() => {
    return props.report.registry ?? props.report.registrar
  });

  const registeredOn = computed(() => {
    return source.value.entities[0]?.contact_info?.[0]?.fullName
  });

  const events = computed(() => {
    return {
      "registration": source.value.events.find(item => item.action === "registration").date,
      "expiration": source.value.events.find(item => item.action === "expiration")?.date || '-',
      "last_changed": source.value.events.find(item => item.action === "last changed")?.date
    }
  });

  const contacts = computed(() => {
    let contactList = [...(props.report.registry?.entities || []), ...(props.report.registrar?.entities || [])]

    return contactList.map(contact => {
        return {
          title: contact.contact_info[0]?.fullName ?? contact.handle ?? contact.contact_info[0]?.organization ?? contact.roles.join(', '),
          roles: contact.roles.join(', '),
          remarks: contact.remarks?.[0] ? { title: contact.remarks[0].title, description: contact.remarks[0].description } : null,
          organization: contact.contact_info[0]?.organization || null,
          telephone: contact.contact_info[0]?.telephone || null,
          email: contact.contact_info[0]?.email || null,
          address: contact.contact_info[0]?.address || null
        };
      });
  });

	const checkDate = computed(() => {
		if(!source.value.events.find(item => item.action === "expiration")) return

    const today = new Date();
		const targetDate = new Date(source.value.events.find(item => item.action === "expiration").date);

		const diffTime = targetDate - today;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays <= 0 || diffDays <= 7) {
			return "text-red-500";
		} else if (diffDays <= 30) {
			return "text-orange-500";
		} else {
			return "text-green-500";
		}
	});

</script>