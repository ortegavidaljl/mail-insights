<template>

  <div class="flex flex-row gap-4 mt-4">
    <p class="p-2 w-1/2 bg-black/30 rounded flex flex-col text-center justify-center">
      <span class="font-bold">El nombre del ASN es</span>{{ report.network_name }}
    </p>
    <p class="p-2 w-1/2 bg-black/30 rounded flex flex-col text-center justify-center">
      <span class="font-bold">Pertenece a</span>{{ ownedBy }}
    </p>
  </div>

  <table class="mt-4 w-full bg-black/30 rounded">
    <tbody>
      <tr>
        <td class="p-2 pb-0 text-center font-bold">Fecha de registro</td>
        <td class="p-2 pb-0 text-center font-bold">Última actualización</td>
      </tr>
      <tr>
        <td class="p-2 pt-0 text-center">{{ events.registration }}</td>
        <td class="p-2 pt-0 text-center">{{ events.last_changed }}</td>
      </tr>
    </tbody>
  </table>

  <div class="flex flex-row gap-4 mt-4">
    <ul class="py-2 px-4 w-2/4 flex flex-col gap-2 bg-black/30 rounded">
      <li class="text-center font-bold">Estado/s del ASN</li>
      <template v-for="status in report.status">
        <li class="tooltip w-max underline decoration-dotted decoration-white	cursor-help">{{ status }}
          <span class="tooltiptext p-2 backdrop-blur bg-white/30 rounded">{{ rdapStatusInfo[status] }}</span>
        </li>
      </template>
    </ul>

    <ul class="py-2 px-4 w-2/4 flex flex-col gap-2 bg-black/30 rounded">
      <li class="text-center font-bold">Servidor Whois</li>
      <li>{{ report.port43 }}</li>
    </ul>
  </div>
  
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
	import { ref, computed } from 'vue'
	import { rdapStatusInfo } from '@/utils/rdap'

  const props = defineProps({
    report: {
      type: Object,
      required: true
    }
  })
  const imageError = ref(false)

  const events = computed(() => {
    return {
      "registration": props.report.events.find(item => item.action === "registration").date,
      "last_changed": props.report.events.find(item => item.action === "last changed")?.date
    }
  });

  const ownedBy = computed(() => {
    console.log(props.report)
		return props.report.entities.find(item => item.contact_info.some(info => info.other?.some(detail => detail.value === 'org')))?.contact_info[0]?.fullName;
	});

  const contacts = computed(() => {
    let contactList = [...(props.report?.entities || [])]

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

</script>