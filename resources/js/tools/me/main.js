export const data = [{
  link: '/me',
  name: 'Me',
  description: 'Comprueba tu dirección IPv4/6',
  order: 3,
  enable: import.meta.env.VITE_APP_ENABLED_TOOLS.includes('me')
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
