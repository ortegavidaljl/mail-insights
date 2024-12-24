import { validate as isUUID } from 'uuid';

export const data = [{
  link: '/x-ray',
  name: 'X-Ray',
  description: 'Comprueba la puntuación de tus correos',
  order: 1,
  enable: true
}];

export const routes = [{
    path: '/x-ray',
    component: () => import('@/views/AppView.vue'),
    children: [
      {
        path: '',
        component: () => import('./pages/NewAccount.vue'),
      },
      {
        path: ':id',
        component: () => import('./pages/ReportView.vue'),
        beforeEnter: (to, from, next) => {
          if (isUUID(to.params.id)) {
            next();
          } else {
            next('/x-ray');
          }
        }
      }
    ]
  }]
