import { ref, watch } from 'vue'

export function useSEO() {
  const title = ref('Pomo - Pomodoro Timer')
  const description = ref('Focus & productivity app using the Pomodoro Technique with 25-minute work sessions and 5-minute breaks')
  const keywords = ref('pomodoro, timer, productivity, focus, time management, work sessions, breaks')

  // Update document title and meta tags
  const updateMeta = () => {
    if (typeof document !== 'undefined') {
      // Update title
      document.title = title.value

      // Update description
      const descMeta = document.querySelector('meta[name="description"]')
      if (descMeta) {
        descMeta.setAttribute('content', description.value)
      }

      // Update keywords
      const keywordsMeta = document.querySelector('meta[name="keywords"]')
      if (keywordsMeta) {
        keywordsMeta.setAttribute('content', keywords.value)
      }

      // Update Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) {
        ogTitle.setAttribute('content', title.value)
      }

      const ogDesc = document.querySelector('meta[property="og:description"]')
      if (ogDesc) {
        ogDesc.setAttribute('content', description.value)
      }

      // Update Twitter Card
      const twitterTitle = document.querySelector('meta[name="twitter:title"]')
      if (twitterTitle) {
        twitterTitle.setAttribute('content', title.value)
      }

      const twitterDesc = document.querySelector('meta[name="twitter:description"]')
      if (twitterDesc) {
        twitterDesc.setAttribute('content', description.value)
      }
    }
  }

  // Watch for changes and update meta tags
  watch([title, description, keywords], updateMeta, { immediate: true })

  // Predefined page configurations
  const setTimerPage = () => {
    title.value = 'Pomodoro Timer - Focus Sessions | Pomo'
    description.value = 'Start your focused work session with Pomo\'s timer. Break down your tasks into 25-minute focused intervals followed by strategic breaks for maximum productivity.'
    keywords.value = 'pomodoro timer, focus session, work timer, productivity timer, 25 minute timer, time blocking'
  }

  const setInsightsPage = () => {
    title.value = 'Productivity Insights & Statistics | Pomo'
    description.value = 'Track your productivity progress with detailed insights. View your focus sessions, completed tasks, and productivity patterns to optimize your work habits.'
    keywords.value = 'productivity insights, focus statistics, work analytics, productivity tracking, time management stats'
  }

  const setSettingsPage = () => {
    title.value = 'Timer Settings & Customization | Pomo'
    description.value = 'Customize your Pomo experience. Adjust timer durations, notification preferences, and themes to create your perfect productivity environment.'
    keywords.value = 'pomodoro settings, timer customization, productivity preferences, focus settings'
  }

  const setHomePage = () => {
    title.value = 'Pomo - Free Pomodoro Timer | Time-Blocking for Productivity'
    description.value = 'Pomo is a time-blocking app that helps you to be more productive and achieve your goals. It works by breaking down your work into manageable chunks of focused time with strategic breaks.'
    keywords.value = 'pomodoro timer, time blocking app, productivity timer, focus timer, work timer, task management'
  }

  const setFAQPage = () => {
    title.value = 'FAQ - Pomo Timer'
    description.value = 'Frequently asked questions about Pomo Pomodoro timer, the free productivity app for time management and focus.'
    keywords.value = 'pomodoro timer faq, productivity questions, time management help, focus timer support'
  }

  const setAboutPage = () => {
    title.value = 'About Pomo - Free Pomodoro Timer for Productivity'
    description.value = 'Learn about Pomo, the free Pomodoro timer app that helps boost productivity through focused work sessions and strategic breaks. No registration required.'
    keywords.value = 'about pomo, pomodoro timer, productivity app, time management, focus technique, free timer, work efficiency'
  }

  const setHelpPage = () => {
    title.value = 'Help Center - Pomo Timer Guide'
    description.value = 'Complete guide to using Pomo Pomodoro timer. Learn how to start your first session, manage tasks, read insights, and customize settings for maximum productivity.'
    keywords.value = 'pomo help, pomodoro timer guide, productivity tips, time management tutorial, focus technique, timer settings'
  }

  return {
    title,
    description,
    keywords,
    updateMeta,
    setTimerPage,
    setInsightsPage,
    setSettingsPage,
    setHomePage,
    setFAQPage,
    setAboutPage,
    setHelpPage
  }
}
