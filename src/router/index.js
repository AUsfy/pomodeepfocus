import { createRouter, createWebHistory } from 'vue-router'
import { Analytics } from '../utils/analytics.js'

// Import components
import PomodoroTimer from '../components/PomodoroTimer.vue'
import Settings from '../components/Settings.vue'
import Insights from '../components/Insights.vue'
import About from '../components/About.vue'
import BlogList from '../components/blog/BlogList.vue'
import BlogPost from '../components/blog/BlogPost.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: PomodoroTimer,
    meta: {
      title: 'Pomodoro Timer - Focus & Productivity Tool | Pomo',
      description: 'Free online Pomodoro timer to boost productivity and focus. Work in 25-minute sessions with 5-minute breaks. Track tasks, customize settings, and improve your time management with our proven technique.'
    }
  },
  {
    path: '/insights',
    name: 'Insights',
    component: Insights,
    meta: {
      title: 'Productivity Insights | Pomo',
      description: 'Track your productivity progress with detailed insights and statistics from your Pomodoro sessions.'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      title: 'Settings | Pomo',
      description: 'Customize your Pomodoro timer settings, adjust durations, sounds, and preferences.'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: 'About Pomo | Pomodoro Timer',
      description: 'Learn more about Pomo and the Pomodoro Technique for better productivity and focus.'
    }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: BlogList,
    meta: {
      title: 'Productivity Blog | Pomo',
      description: 'Discover productivity tips, Pomodoro Technique guides, and time management strategies to boost your focus and efficiency.'
    }
  },
  {
    path: '/blog/:slug',
    name: 'BlogPost',
    component: BlogPost,
    meta: {
      title: 'Blog Post | Pomo',
      description: 'Read our latest productivity and time management insights.'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// SEO and Analytics on route change
router.beforeEach((to, from, next) => {
  // Update document title
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // Update meta description
  if (to.meta.description) {
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', to.meta.description)
    }
  }
  
  next()
})

router.afterEach((to, from) => {
  // Track page view in Google Analytics
  const pageTitle = to.meta.title || 'Pomo'
  Analytics.trackPageView(to.path, pageTitle)
})

export default router