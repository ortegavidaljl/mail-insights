import { createRouter, createWebHistory } from 'vue-router'

const routeModules = import.meta.glob('@/tools/**/main.js');

async function loadDinamicRoutes() {
  const routes = [];
  const promises = Object.keys(routeModules).map(async (path) => {
    const mod = await routeModules[path]();
    if (mod.data.some(tool => tool.enable !== false)) {
      routes.push(...mod.routes);
    }
  });
  await Promise.all(promises);
  return routes;
}

async function initRouter() {
  const dynamicRoutes = await loadDinamicRoutes();
  const newStartRoute = import.meta.env.VITE_APP_START_ROUTE || null;

  return createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        name: 'start',
        ...(newStartRoute ? { redirect: newStartRoute } : { component: () => import('@/views/HomeView.vue') })
      },
      ...dynamicRoutes,
      {
        path: '/:catchAll(.*)*',
        component: () => import('@/views/ErrorNotFound.vue')
      }
    ]
  });
}

export default initRouter();