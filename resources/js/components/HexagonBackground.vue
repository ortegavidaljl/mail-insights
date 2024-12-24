<template>
	<div class="overflow-hidden absolute w-screen h-screen -z-10">
		<div class="blur-md absolute left-1/2 top-0">
			<svg height="1100" width="1100" xmlns="http://www.w3.org/2000/svg" viewBox="-12.9 -12.9 210.6 210.6" xml:space="preserve" stroke="#000" stroke-width="0" transform="rotate(-45)">
				<defs>
					<linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" :style="'stop-color:' + store.backgroundHexStartColor" />
						<stop offset="100%" :style="'stop-color:' + store.backgroundHexEndColor" />
					</linearGradient>
				</defs>
				<g stroke="url(#greenGradient)" fill="url(#greenGradient)" stroke-width="21.8" >
					<path d="m0 92 46-80h93l46 80-46 80H46L0 92z" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="m0 92 46-80h93l46 80-46 80H46L0 92z"  stroke-linecap="round" stroke-linejoin="round"/>
				</g>
			</svg>
		</div>
	</div>
</template>

<script setup>
	import { useMainStore } from '@/stores/main'

  const store = useMainStore()
</script>
