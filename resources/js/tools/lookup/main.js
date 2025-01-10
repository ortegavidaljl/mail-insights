export const data = [{
  link: '/lookup',
  name: 'Lookup',
  description: 'Comprueba la información de dominios e IP mediante RDAP',
  order: 4,
  enable: false
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
