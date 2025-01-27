export const data = [{
  link: '/query',
  name: 'Query',
  description: 'Comprueba registros en multitud de servidores DNS',
  order: 6,
  enable: true
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
