import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ConnexionView from '../views/ConnexionView.vue'
import PanierView from '../views/PanierView.vue'
import MontreListView from '../views/MontreList.vue'
import IdMontreView from '../views/IdMontreView.vue'
import ModifyView from '../views/ModifyView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/connexion',
      name: 'connexion',
      component: ConnexionView
    },
    {
      path: '/panier',
      name: 'panierid',
      component: PanierView
      
    },
    {
      path: '/montrelist',
      name: 'montrelist',
      component: MontreListView
    },
    {
      path: '/montrelist/:id',
      name: 'idmontre',
      props: true,
      component: IdMontreView
    },
    {
      path: '/modify/:watchID',
      name: 'modify',
      component: ModifyView,
      props: true,
      
    },
  ]
})

export default router