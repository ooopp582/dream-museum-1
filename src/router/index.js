import { createRouter, createWebHistory } from 'vue-router'
import Film from '../views/Film.vue'
import Art from '../views/Art.vue'
import Dreams from '../views/Dreams.vue'
import Profile from '../views/Profile.vue'
import ExhibitDetail from '../views/ExhibitDetail.vue'

const routes = [
  {
    path: '/',
    redirect: '/film'
  },
  {
    path: '/film',
    name: 'Film',
    component: Film
  },
  {
    path: '/art',
    name: 'Art',
    component: Art
  },
  {
    path: '/dreams',
    name: 'Dreams',
    component: Dreams
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/film/:id',
    name: 'FilmDetail',
    component: ExhibitDetail
  },
  {
    path: '/art/:id',
    name: 'ArtDetail',
    component: ExhibitDetail
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.path === from.path) {
      return false
    }

    return { top: 0 }
  }
})

export default router
