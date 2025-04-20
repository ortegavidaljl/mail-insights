export const data = [{
  link: '/lookup',
  name: 'Lookup',
  description: 'Comprueba la información de dominios e IP mediante RDAP',
  order: 4,
  enable: import.meta.env.VITE_APP_ENABLED_TOOLS.includes('lookup')
}];

export const routes = [{
    path: '/lookup',
    component: () => import('@/views/AppView.vue'),
    children: [
      {
        path: '',
        component: () => import('./pages/RDAPLookup.vue'),
      }
    ]
  }]
