import { ref, computed, reactive, watch, onMounted, onUnmounted } from 'vue'

// Default settings
const defaultSettings = {
  pomodoroMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  theme: 'auto',
  notifications: {
    desktop: true,
    sound: true,
    soundType: 'bell',
    volume: 70
  }
}

// Global reactive state
const settings = reactive({ ...defaultSettings })
const currentMode = ref('work')
const timeLeft = ref(25 * 60)
const isRunning = ref(false)
const completedSessions = ref(0)
const startTime = ref(null)
const pausedTime = ref(null)

// Load initial state
const loadState = () => {
  try {
    // Load settings
    const savedSettings = localStorage.getItem('pomodoro-settings')
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      Object.assign(settings, { ...defaultSettings, ...parsed })
    }

    // Load timer state
    const savedState = localStorage.getItem('pomodoro-timer-state')
    if (savedState) {
      const state = JSON.parse(savedState)
      currentMode.value = state.currentMode || 'work'
      timeLeft.value = state.timeLeft || getModeTime(currentMode.value)
      isRunning.value = state.isRunning || false
      completedSessions.value = state.completedSessions || 0
      startTime.value = state.startTime ? new Date(state.startTime) : null
      pausedTime.value = state.pausedTime || null

      // If timer was running, calculate elapsed time
      if (isRunning.value && startTime.value) {
        const now = Date.now()
        const elapsed = Math.floor((now - startTime.value.getTime()) / 1000)
        const newTimeLeft = Math.max(0, timeLeft.value - elapsed)
        
        if (newTimeLeft <= 0) {
          // Timer completed while away
          completeSession()
        } else {
          timeLeft.value = newTimeLeft
          startTime.value = new Date(now - (getModeTime(currentMode.value) - timeLeft.value) * 1000)
        }
      }
    } else {
      // Initialize with settings
      timeLeft.value = getModeTime(currentMode.value)
    }
  } catch (error) {
    console.error('Failed to load state:', error)
  }
}

// Save state to localStorage
const saveState = () => {
  try {
    const state = {
      currentMode: currentMode.value,
      timeLeft: timeLeft.value,
      isRunning: isRunning.value,
      completedSessions: completedSessions.value,
      startTime: startTime.value ? startTime.value.toISOString() : null,
      pausedTime: pausedTime.value
    }
    localStorage.setItem('pomodoro-timer-state', JSON.stringify(state))
    localStorage.setItem('pomodoro-settings', JSON.stringify(settings))
  } catch (error) {
    console.error('Failed to save state:', error)
  }
}

// Get mode duration from settings
const getModeTime = (mode) => {
  switch (mode) {
    case 'work':
      return settings.pomodoroMinutes * 60
    case 'short':
      return settings.shortBreakMinutes * 60
    case 'long':
      return settings.longBreakMinutes * 60
    default:
      return 25 * 60
  }
}

// Timer management
let timerId = null

const startTimer = () => {
  if (isRunning.value) return
  
  isRunning.value = true
  startTime.value = new Date(Date.now() - (getModeTime(currentMode.value) - timeLeft.value) * 1000)
  pausedTime.value = null
  
  timerId = setInterval(() => {
    const now = Date.now()
    const elapsed = Math.floor((now - startTime.value.getTime()) / 1000)
    const newTimeLeft = Math.max(0, getModeTime(currentMode.value) - elapsed)
    
    if (newTimeLeft <= 0) {
      completeSession()
    } else {
      timeLeft.value = newTimeLeft
    }
    
    saveState()
  }, 1000)
  
  saveState()
}

const pauseTimer = () => {
  if (!isRunning.value) return
  
  isRunning.value = false
  pausedTime.value = timeLeft.value
  
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
  
  saveState()
}

const resetTimer = () => {
  pauseTimer()
  timeLeft.value = getModeTime(currentMode.value)
  startTime.value = null
  pausedTime.value = null
  saveState()
}

const switchMode = (modeId) => {
  pauseTimer()
  currentMode.value = modeId
  timeLeft.value = getModeTime(modeId)
  startTime.value = null
  pausedTime.value = null
  saveState()
}

const completeSession = () => {
  pauseTimer()
  
  if (currentMode.value === 'work') {
    completedSessions.value++
    // Track completed pomodoro in history
    trackPomodoroCompletion()
  }
  
  // Show notification
  showNotification(`${getCurrentModeLabel()} completed!`)
  
  // Auto-switch logic
  let nextMode = 'work'
  if (currentMode.value === 'work') {
    nextMode = completedSessions.value % settings.longBreakInterval === 0 ? 'long' : 'short'
  }
  
  switchMode(nextMode)
  
  // Auto-start if enabled
  if ((nextMode !== 'work' && settings.autoStartBreaks) || 
      (nextMode === 'work' && settings.autoStartPomodoros)) {
    setTimeout(() => startTimer(), 1000)
  }
}

// Track pomodoro completion in history
const trackPomodoroCompletion = () => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const history = JSON.parse(localStorage.getItem('pomodoro-history') || '{}')
    history[today] = (history[today] || 0) + 1
    localStorage.setItem('pomodoro-history', JSON.stringify(history))
  } catch (error) {
    console.error('Failed to track pomodoro completion:', error)
  }
}

// Computed properties
const getCurrentModeLabel = () => {
  switch (currentMode.value) {
    case 'work': return 'Pomodoro'
    case 'short': return 'Short Break'
    case 'long': return 'Long Break'
    default: return 'Pomodoro'
  }
}

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const currentModeTime = computed(() => getModeTime(currentMode.value))

const progressPercentage = computed(() => {
  const total = getModeTime(currentMode.value)
  return ((total - timeLeft.value) / total) * 100
})

// Notification function
const showNotification = (message) => {
  if (settings.notifications.desktop && 'Notification' in window && Notification.permission === 'granted') {
    new Notification('Pomodoro Timer', {
      body: message,
      icon: '/vite.svg'
    })
  }
  
  if (settings.notifications.sound) {
    // Play notification sound (placeholder)
    console.log(`🔔 ${message}`)
  }
}

// Request notification permission
const requestNotificationPermission = async () => {
  if ('Notification' in window && settings.notifications.desktop) {
    if (Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }
}

// Handle page visibility change
const handleVisibilityChange = () => {
  if (document.hidden) {
    // Page is hidden
    if (isRunning.value) {
      saveState()
    }
  } else {
    // Page is visible again
    if (isRunning.value && startTime.value) {
      // Recalculate time based on actual elapsed time
      const now = Date.now()
      const elapsed = Math.floor((now - startTime.value.getTime()) / 1000)
      const newTimeLeft = Math.max(0, getModeTime(currentMode.value) - elapsed)
      
      if (newTimeLeft <= 0) {
        completeSession()
      } else {
        timeLeft.value = newTimeLeft
      }
    }
  }
}

// Watch for settings changes
watch(settings, () => {
  saveState()
  // If current timer duration changed, update current time
  if (!isRunning.value) {
    timeLeft.value = getModeTime(currentMode.value)
  }
}, { deep: true })

export function useTimer() {
  onMounted(() => {
    loadState()
    requestNotificationPermission()
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })
  
  onUnmounted(() => {
    if (timerId) {
      clearInterval(timerId)
    }
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    saveState()
  })
  
  return {
    // State
    settings,
    currentMode,
    timeLeft,
    isRunning,
    completedSessions,
    
    // Computed
    formattedTime,
    currentModeTime,
    progressPercentage,
    
    // Methods
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    getCurrentModeLabel,
    getModeTime,
    showNotification,
    saveState,
    loadState
  }
}