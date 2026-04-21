import { createRouter, createWebHistory } from 'vue-router'
// 导入你的三个页面组件
import Film from '../views/Film.vue'
import Art from '../views/Art.vue'
import Profile from '../views/Profile.vue'
import ExhibitDetail from '../views/ExhibitDetail.vue'

const routes = [
  {
    path: '/',
    redirect: '/film' // 默认打开电影馆页面
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
  routes
})

export default router