<template>
  <i>
    <svg :height="size" :width="size" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path :d="icons[`mdi${icon}`]" />
    </svg>
  </i> 
</template>

<script setup>
  defineProps({
    size: {
      type: String,
      required: false,
      default: "32"
    },
    icon: {
      type: String,
      required: true
    }
  })

  const icons = {"mdiAt": mdiAt,
                 "mdiInformation": mdiInformation,
                 "mdiInformationOutline": mdiInformationOutline,
                 "mdiCheckCircleOutline": mdiCheckCircleOutline,
                 "mdiCloseCircleOutline":mdiCloseCircleOutline,
                 "mdiAlertCircleOutline":mdiAlertCircleOutline,
                 "mdiEmailSearch":mdiEmailSearch,
                 "mdiAccountBox":mdiAccountBox,
                 "mdiHistory":mdiHistory,
                 "mdiPhone":mdiPhone,
                 "mdiDelete": mdiDelete,
                 "mdiEye":mdiEye}

  import {mdiAt,
    mdiInformation,
    mdiInformationOutline,
    mdiCheckCircleOutline,
    mdiCloseCircleOutline,
    mdiAlertCircleOutline,
    mdiEmailSearch,
    mdiAccountBox,
    mdiHistory,
    mdiDelete,
    mdiPhone,
    mdiEye} from '@mdi/js'
  
</script>