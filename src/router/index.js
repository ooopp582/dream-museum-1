import { createRouter, createWebHistory } from 'vue-router'
// 导入你的三个页面组件
import Film from '../views/Film.vue'
import Art from '../views/Art.vue'
import Profile from '../views/Profile.vue'
import ExhibitDetail from '../views/ExhibitDetail.vue'

const scrollPositions = new Map()

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
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    const storedPosition = scrollPositions.get(to.fullPath)
    if (storedPosition) {
      return storedPosition
    }

    if (to.path === from.path) {
      return false
    }

    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if (from.fullPath) {
    scrollPositions.set(from.fullPath, {
      left: window.scrollX,
      top: window.scrollY
    })
  }

  next()
})

export default router
