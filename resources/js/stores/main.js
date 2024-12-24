import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
//import packageJson from '../../package.json';

export const useMainStore = defineStore('main', () => {
    const appVersion = "0.0"
		const id = ref(null)
    const isLoggedIn = computed(() => (id.value) )

		const routeModules = import.meta.glob('@/tools/**/main.js');
  
		const toolList = ref([]);

		async function loadToolsData() {
			const data = [];
			const promises = Object.keys(routeModules).map(async (path) => {
				const mod = await routeModules[path]();
				if (mod.data.some(tool => tool.enable !== false)) {
					data.push(...mod.data);
				}
			});
			await Promise.all(promises);
			toolList.value = data.sort((a, b) => (a.order || 0) - (b.order || 0));
		}
	
		// Llama a loadToolsData cuando se inicializa el store
		loadToolsData();
		
		/*[
			{
				link: '/x-ray', name: 'X-Ray',
				description: 'Comprueba la puntuación de tus correos'
			},*/
			/*{
				link: '/domain', name: 'Domain',
				description: 'Obtén información sobre tu dominio y su zona DNS'
			}
			{
				link: '/presence', name: 'Presence',
				description: 'Comprueba si una cuenta de correo existe'
			},
			{
				link: '/rbl-checker', name: 'RBL Checker',
				description: 'Comprueba si una IP está en listas negras'
			},
			{
				link: '/query', name: 'DNS Query',
				description: 'Obtén información sobre registros DNS'
			}*/
		//]

		const backgroundHexColors = {
			'blue': ['#00b6ff', '#001193'],
			'red': ['#ff3d00', '#aa0000'],
			'orange': ["#ffae00", "#934900"],
			'yellow': ["#fff900", "#798000"],
			'green': ["#00FF00", "#008000"]
		}

		const backgroundHexStartColor = ref(backgroundHexColors.blue[0])
		const backgroundHexEndColor = ref(backgroundHexColors.blue[1])

		function backgroundHexChangeColor(Color) {
			backgroundHexStartColor.value = backgroundHexColors[Color][0]
			backgroundHexEndColor.value = backgroundHexColors[Color][1]
		}

		async function getCookie() {
			await api.get('/csrf-cookie');
		}

		async function login(email, password, rememberMe) {
			await getCookie();
			await api.post('/login', { email: email, password: password, remember: rememberMe });
			await setUser();
			await this.router.push('/');
		}

		async function logout() {
			await api.post('/logout');
			await reset();
			await this.router.push('/auth');
		}

		function setUser(payload) {
			if (payload.id != null) this.id = payload.id
		}

		function reset() {
			this.id = null;
		}

    return { appVersion, toolList, backgroundHexStartColor, backgroundHexEndColor, backgroundHexChangeColor, isLoggedIn, login, logout }
  })