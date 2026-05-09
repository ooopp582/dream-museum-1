import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Film from '../views/Film.vue'
import Art from '../views/Art.vue'
import Dreams from '../views/Dreams.vue'
import Profile from '../views/Profile.vue'
import ExhibitDetail from '../views/ExhibitDetail.vue'

const galleryScrollPositions = new Map()

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      hideNavbar: true
    }
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
  },
  {
    path: '/dreams/:id',
    name: 'DreamDetail',
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

    const isReturningToFilm = to.name === 'Film' && from.name === 'FilmDetail'
    const isReturningToArt = to.name === 'Art' && from.name === 'ArtDetail'
    const isReturningToDreams = to.name === 'Dreams' && from.name === 'DreamDetail'

    if (isReturningToFilm || isReturningToArt || isReturningToDreams) {
      const storedPosition = galleryScrollPositions.get(to.name)
      if (storedPosition) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(storedPosition), 0)
        })
      }
    }

    if (to.path === from.path) {
      return false
    }

    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const isLeavingFilmForDetail = from.name === 'Film' && to.name === 'FilmDetail'
  const isLeavingArtForDetail = from.name === 'Art' && to.name === 'ArtDetail'
  const isLeavingDreamsForDetail = from.name === 'Dreams' && to.name === 'DreamDetail'

  if (isLeavingFilmForDetail || isLeavingArtForDetail || isLeavingDreamsForDetail) {
    galleryScrollPositions.set(from.name, {
      left: window.scrollX,
      top: window.scrollY
    })
  }

  next()
})

export default router
