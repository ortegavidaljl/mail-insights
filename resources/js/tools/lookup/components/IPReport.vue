<template>

  <div class="flex flex-row gap-4 mt-4">
    <p v-show="!imageError" class="p-2 w-1/2 bg-black/30 rounded flex flex-col items-center justify-center">
      <span class="font-bold">Registrado en</span>
      <img :src="'https://flagcdn.com/' + report.country?.toLowerCase() + '.svg'" width="32" height="24" :alt="report.country" class="m-1 inline rounded" @error="imageError = true" @load="imageError = false">
    </p>
    <p v-if="imageError" class="p-2 w-1/2 bg-black/30 rounded flex flex-col text-center justify-center"><span class="font-bold">País desconocido</span></p>

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
      <li class="text-center font-bold">Estado/s del dominio</li>
      <template v-for="status in report.status">
        <li class="tooltip w-max underline decoration-dotted decoration-white	cursor-help">{{ status }}
          <span class="tooltiptext p-2 backdrop-blur bg-white/30 rounded">{{ rdapStatusInfo[status] }}</span>
        </li>
      </template>
    </ul>

    <ul class="py-2 px-4 w-2/4 flex flex-col gap-2 bg-black/30 rounded">
      <li class="text-center font-bold">Rango de direcciones</li>
      <li>{{ report.address_range }}</li>
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

  const ownedBy = computed(() => {
		return props.report.entities.find(item => item.contact_info.some(info => info.other?.some(detail => detail.value === 'org')))?.contact_info[0]?.fullName;
	});

  const events = computed(() => {
    return {
      "registration": props.report.events.find(item => item.action === "registration").date,
      "last_changed": props.report.events.find(item => item.action === "last changed")?.date
    }
  });
  
</script>