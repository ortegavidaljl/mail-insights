export const data = [{
  link: '/presence',
  name: 'Presence',
  description: 'Comprueba si una cuenta de correo existe',
  order: 2,
  enable: true
}];

export const routes = [{
    path: '/presence',
    component: () => import('@/views/AppView.vue'),
    children: [
      {
        path: '',
        component: () => import('./pages/CheckAccount.vue'),
      }
    ]
  }]
