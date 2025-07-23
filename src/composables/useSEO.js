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
    title.value = 'Timer - Pomo Pomodoro'
    description.value = 'Start your Pomodoro session with our focused timer. Track your 25-minute work sessions and 5-minute breaks for maximum productivity.'
    keywords.value = 'pomodoro timer, focus timer, work timer, productivity timer, 25 minute timer'
  }

  const setInsightsPage = () => {
    title.value = 'Insights - Pomo Pomodoro'
    description.value = 'Track your productivity with detailed insights and statistics. View your daily progress and Pomodoro session history.'
    keywords.value = 'productivity insights, pomodoro statistics, work tracking, productivity analytics'
  }

  const setSettingsPage = () => {
    title.value = 'Settings - Pomo Pomodoro'
    description.value = 'Customize your Pomodoro timer settings. Adjust work and break durations, notifications, and themes.'
    keywords.value = 'pomodoro settings, timer customization, productivity preferences'
  }

  const setHomePage = () => {
    title.value = 'Pomo - Pomodoro Timer | Focus & Productivity App'
    description.value = 'Boost your productivity with the Pomodoro Technique. Free online timer with 25-minute work sessions and 5-minute breaks. Track tasks and improve focus.'
    keywords.value = 'pomodoro, timer, productivity, focus, time management, work sessions, breaks'
  }

  return {
    title,
    description,
    keywords,
    updateMeta,
    setTimerPage,
    setInsightsPage,
    setSettingsPage,
    setHomePage
  }
}
