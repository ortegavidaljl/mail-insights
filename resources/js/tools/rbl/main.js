export const data = [{
  link: '/rbl',
  name: 'RBL',
  description: 'Comprueba si una IP o hostname está en listas negras',
  order: 5,
  enable: true
}];

export const routes = [{
    path: '/rbl',
    component: () => import('@/views/AppView.vue'),
    children: [
      {
        path: '',
        component: () => import('./pages/IPChecker.vue'),
      }
    ]
  }]
