// Google Analytics and tracking utilities
export class Analytics {
  static trackingId = 'G-MY9NYVMQ4X'
  
  static init() {
    // Since gtag is loaded in HTML, we just need to ensure it's available
    if (typeof window === 'undefined' || !window.gtag) {
      console.warn('Google Analytics not available')
      return
    }
    
    console.log('📊 Google Analytics initialized with ID:', this.trackingId)
  }
  
  static trackEvent(eventName, parameters = {}) {
    if (typeof window === 'undefined' || !window.gtag) return
    
    window.gtag('event', eventName, {
      event_category: 'Pomodoro',
      ...parameters
    })
    
    console.log('📊 Event tracked:', eventName, parameters)
  }
  
  static trackPageView(pagePath, pageTitle) {
    if (typeof window === 'undefined' || !window.gtag) return
    
    window.gtag('config', this.trackingId, {
      page_path: pagePath,
      page_title: pageTitle
    })
    
    console.log('📊 Page view tracked:', pagePath, pageTitle)
  }
  
  // Pomodoro-specific tracking
  static trackPomodoroStart() {
    this.trackEvent('pomodoro_start', {
      event_category: 'Timer',
      event_label: 'Work Session'
    })
  }
  
  static trackPomodoroComplete() {
    this.trackEvent('pomodoro_complete', {
      event_category: 'Timer',
      event_label: 'Work Session Completed'
    })
  }
  
  static trackBreakStart() {
    this.trackEvent('break_start', {
      event_category: 'Timer',
      event_label: 'Break Session'
    })
  }
  
  static trackTaskAdd() {
    this.trackEvent('task_add', {
      event_category: 'Tasks',
      event_label: 'Task Added'
    })
  }
  
  static trackTaskComplete() {
    this.trackEvent('task_complete', {
      event_category: 'Tasks',
      event_label: 'Task Completed'
    })
  }
  
  static trackSettingsChange(setting) {
    this.trackEvent('settings_change', {
      event_category: 'Settings',
      event_label: setting
    })
  }
  
  static trackLogin() {
    this.trackEvent('login', {
      event_category: 'Authentication',
      event_label: 'User Login'
    })
  }
  
  static trackSignup() {
    this.trackEvent('sign_up', {
      event_category: 'Authentication',
      event_label: 'User Registration'
    })
  }
}

// Simple event tracking without external dependencies
export class SimpleAnalytics {
  static events = []
  
  static track(event, data = {}) {
    const timestamp = new Date().toISOString()
    const eventData = {
      timestamp,
      event,
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...data
    }
    
    this.events.push(eventData)
    
    // Store in localStorage for later sending
    const stored = localStorage.getItem('pomo-analytics') 
    const storedEvents = stored ? JSON.parse(stored) : []
    storedEvents.push(eventData)
    
    // Keep only last 100 events
    if (storedEvents.length > 100) {
      storedEvents.splice(0, storedEvents.length - 100)
    }
    
    localStorage.setItem('pomo-analytics', JSON.stringify(storedEvents))
    
    console.log('📊 Event tracked:', eventData)
  }
  
  static getEvents() {
    const stored = localStorage.getItem('pomo-analytics')
    return stored ? JSON.parse(stored) : []
  }
  
  static clearEvents() {
    localStorage.removeItem('pomo-analytics')
    this.events = []
  }
}
