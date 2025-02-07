import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
//import packageJson from '../../package.json';

export const useMainStore = defineStore('main', () => {
    const appVersion = "0.0"
		const id = ref(null)
    const isLoggedIn = computed(() => (id.value) )

		const routeModules = import.meta.glob('@/tools/**/main.js');
  
		const toolList = ref([]);

		const RDAPregistryData = ref({});

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

		const customDNSServers = ref([])

		if (localStorage.getItem("custom_dns_servers")) {
			customDNSServers.value = JSON.parse(localStorage.getItem("custom_dns_servers"))
		}

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

    return { customDNSServers, appVersion, toolList, RDAPregistryData, backgroundHexStartColor, backgroundHexEndColor, backgroundHexChangeColor, isLoggedIn, login, logout }
  })