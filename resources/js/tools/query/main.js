export const data = [{
  link: '/query',
  name: 'Query',
  description: 'Comprueba registros en multitud de servidores DNS',
  order: 6,
  enable: import.meta.env.VITE_APP_ENABLED_TOOLS.includes('query')
}];

export const routes = [{
    path: '/query',
    component: () => import('@/views/AppView.vue'),
    children: [
      {
        path: '',
        component: () => import('./pages/Checker.vue'),
      }
    ]
  }]
