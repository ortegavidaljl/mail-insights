export const data = [{
  link: '/me',
  name: 'Me',
  description: 'Comprueba tu dirección IPv4/6',
  order: 3,
  enable: true
}];

export const routes = [{
    path: '/me',
    component: () => import('@/views/AppView.vue'),
    children: [
      {
        path: '',
        component: () => import('./pages/IPChecker.vue'),
      }
    ]
  }]
