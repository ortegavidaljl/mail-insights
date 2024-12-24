import axios from 'axios'

const api = axios.create({ baseURL: `${window.location.origin}/api` })

api.defaults.withCredentials = true;

/*api.interceptors.response.use(function (response) {
	return response;
	}, function (error) {
	return Promise.reject(error);
});*/

export default api
