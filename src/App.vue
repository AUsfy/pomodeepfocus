<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import PomodoroTimer from './components/PomodoroTimer.vue'
import Settings from './components/Settings.vue'
import Insights from './components/Insights.vue'
import Login from './components/Login.vue'
import FAQ from './components/FAQ.vue'
import About from './components/About.vue'
import Help from './components/Help.vue'
import { useAuth } from './composables/useAuth.js'
import { useSEO } from './composables/useSEO.js'
import { Analytics } from './utils/analytics.js'

const currentView = ref('timer')
const isDarkMode = ref(false)
const showLoginModal = ref(false)

// Authentication
const { user, isAuthenticated, loadStoredUser, logout } = useAuth()

// SEO Management
const { setTimerPage, setInsightsPage, setSettingsPage, setHomePage, setFAQPage, setAboutPage, setHelpPage } = useSEO()

// Watch for view changes and update SEO
watch(currentView, (newView) => {
  // Track page view in Google Analytics
  const pageTitle = `Pomo - ${newView.charAt(0).toUpperCase() + newView.slice(1)}`
  Analytics.trackPageView(`/${newView}`, pageTitle)
  
  switch (newView) {
    case 'timer':
      setTimerPage()
      break
    case 'insights':
      setInsightsPage()
      break
    case 'settings':
      setSettingsPage()
      break
    case 'faq':
      setFAQPage()
      break
    case 'about':
      setAboutPage()
      break
    case 'help':
      setHelpPage()
      break
    default:
      setHomePage()
  }
}, { immediate: true })

// Theme management
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
  localStorage.setItem('pomodoro-theme', isDarkMode.value ? 'dark' : 'light')
}

// Authentication handlers
const showLogin = () => {
  showLoginModal.value = true
}

const hideLogin = () => {
  showLoginModal.value = false
}

const handleLoginSuccess = () => {
  showLoginModal.value = false
  currentView.value = 'timer'
}

const handleLogout = async () => {
  if (confirm('Are you sure you want to sign out? Your data will be synced before signing out.')) {
    await logout()
    currentView.value = 'timer'
  }
}

onMounted(() => {
  // Load theme preference from localStorage
  const savedTheme = localStorage.getItem('pomodoro-theme')
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
  }
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
  
  // Load stored user silently (no redirect)
  loadStoredUser()
})
</script>

<template>
  <!-- Main app interface (always visible) -->
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <header class="app-header">
      <div class="container">
        <h1 class="app-title">
          <span class="tomato-icon">🍅</span>
          Pomodoro
        </h1>
        
        <nav class="main-nav">
          <button 
            @click="currentView = 'timer'" 
            :class="{ active: currentView === 'timer' }"
            class="nav-btn"
          >
            Timer
          </button>
          <button 
            @click="currentView = 'insights'" 
            :class="{ active: currentView === 'insights' }"
            class="nav-btn"
          >
            Insights
          </button>
          <button 
            @click="currentView = 'settings'" 
            :class="{ active: currentView === 'settings' }"
            class="nav-btn"
          >
            Settings
          </button>
          <button 
            @click="currentView = 'faq'" 
            :class="{ active: currentView === 'faq' }"
            class="nav-btn"
          >
            FAQ
          </button>
          <button 
            @click="currentView = 'about'" 
            :class="{ active: currentView === 'about' }"
            class="nav-btn"
          >
            About
          </button>
          <button 
            @click="currentView = 'help'" 
            :class="{ active: currentView === 'help' }"
            class="nav-btn"
          >
            Help
          </button>
        </nav>

        <div class="header-actions">
          <!-- User info and logout (if authenticated) -->
          <div v-if="isAuthenticated" class="user-menu">
            <div class="user-info">
              <span class="user-avatar">👤</span>
              <span class="user-name">{{ user.name }}</span>
            </div>
            <button @click="handleLogout" class="logout-btn" title="Sign out">
              🚪
            </button>
          </div>
          
          <!-- Sign in button (if not authenticated) - Disabled until authentication is implemented -->
          <button 
            v-if="false && !isAuthenticated"
            @click="showLogin" 
            class="sign-in-btn"
          >
            <span class="sign-in-icon">🔐</span>
            Sign In
          </button>

          <button @click="toggleTheme" class="theme-toggle">
            {{ isDarkMode ? '☀️' : '🌙' }}
          </button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <PomodoroTimer v-if="currentView === 'timer'" />
        <Insights v-if="currentView === 'insights'" ref="insightsRef" />
        <Settings v-if="currentView === 'settings'" />
        <FAQ v-if="currentView === 'faq'" />
        <About v-if="currentView === 'about'" />
        <Help v-if="currentView === 'help'" />
      </div>
    </main>

    <!-- Login Modal (only shown when user clicks Sign In) -->
    <div v-if="showLoginModal" class="modal-overlay" @click="hideLogin">
      <div class="modal-container" @click.stop>
        <button @click="hideLogin" class="modal-close">×</button>
        <Login 
          @loginSuccess="handleLoginSuccess"
          @continueAsGuest="hideLogin"
        />
      </div>
    </div>
  </div>
</template>

<style>
:root {
  /* Updated modern color palette with light blue theme */
  --primary-color: #ef4444;
  --primary-light: #f87171;
  --primary-dark: #dc2626;
  --secondary-color: #10b981;
  --break-color: #3b82f6;
  
  /* Notification colors */
  --success-color: #10b981;
  --error-color: #ef4444;
  --warning-color: #f59e0b;
  --info-color: #3b82f6;
  
  /* Modern blue-tinted neutral colors */
  --background: #f0f4f8;
  --surface: #ffffff;
  --surface-elevated: #f8fafc;
  --surface-hover: #f1f5f9;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  --border: #e2e8f0;
  --border-light: #f1f5f9;
  --accent-blue: #3b82f6;
  --accent-blue-light: #dbeafe;
  
  /* Enhanced shadows with blue tint */
  --shadow-sm: 0 1px 2px 0 rgba(59, 130, 246, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05);
  --shadow-colored: 0 4px 14px 0 rgba(59, 130, 246, 0.15);
  
  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  
  /* Border radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  
  /* Transitions */
  --transition-fast: 0.15s ease-out;
  --transition-base: 0.2s ease-out;
  --transition-slow: 0.3s ease-out;
}

[data-theme="dark"] {
  --background: #0f172a;
  --surface: #1e293b;
  --surface-elevated: #334155;
  --surface-hover: #475569;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #64748b;
  --border: #334155;
  --border-light: #475569;
  --accent-blue: #60a5fa;
  --accent-blue-light: #1e3a8a;
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
  --shadow-colored: 0 4px 14px 0 rgba(59, 130, 246, 0.3);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  background-color: var(--background);
  color: var(--text-primary);
  line-height: 1.6;
  transition: background-color var(--transition-base), color var(--transition-base);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

/* Modern header with enhanced glassmorphism effect */
.app-header {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-light);
  padding: var(--spacing-lg) 0;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

[data-theme="dark"] .app-header {
  background: rgba(30, 41, 59, 0.9);
}

.app-header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
}

.app-title {
  font-size: var(--font-size-2xl);
  font-weight: 800;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  letter-spacing: -0.025em;
}

.tomato-icon {
  font-size: 2rem;
}

/* Enhanced pill-style navigation */
.main-nav {
  display: flex;
  gap: var(--spacing-xs);
  background: var(--surface);
  padding: var(--spacing-xs);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
}

.nav-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-weight: 500;
  font-size: var(--font-size-sm);
  white-space: nowrap;
}

.nav-btn:hover {
  background: var(--accent-blue-light);
  color: var(--accent-blue);
  transform: translateY(-1px);
}

.nav-btn.active {
  background: var(--primary-color);
  color: white;
  box-shadow: var(--shadow-colored);
}

/* Header actions and user menu */
.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.user-menu, .guest-indicator {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--surface);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.user-avatar, .guest-icon {
  font-size: var(--font-size-lg);
}

.user-name, .guest-text {
  font-weight: 500;
  color: var(--text-primary);
  font-size: var(--font-size-sm);
}

.guest-text {
  color: var(--text-secondary);
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.logout-btn:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
  transform: scale(1.1);
}

/* Sign in button */
.sign-in-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--primary-color);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.sign-in-btn:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-colored);
}

.sign-in-icon {
  font-size: var(--font-size-base);
}

/* Modal overlay and container */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.2s ease-out;
}

.modal-container {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  color: var(--text-secondary);
  border-radius: 50%;
  cursor: pointer;
  font-size: var(--font-size-xl);
  font-weight: bold;
  z-index: 10;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.2);
  color: var(--text-primary);
  transform: scale(1.1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Enhanced mobile responsiveness for header */
@media (max-width: 768px) {
  .header-actions {
    order: 1;
    gap: var(--spacing-sm);
  }
  
  .user-menu {
    padding: var(--spacing-xs) var(--spacing-sm);
  }
  
  .user-name {
    display: none;
  }
  
  .sign-in-btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-xs);
  }
  
  .theme-toggle {
    width: 36px;
    height: 36px;
    font-size: var(--font-size-base);
  }
  
  .modal-container {
    max-width: 95vw;
  }
}

/* Enhanced theme toggle */
.theme-toggle {
  padding: var(--spacing-sm);
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-lg);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  box-shadow: var(--shadow-sm);
}

.theme-toggle:hover {
  background: var(--accent-blue-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
  color: var(--accent-blue);
}

.main-content {
  padding: var(--spacing-2xl) 0;
  min-height: calc(100vh - 100px);
}

/* Enhanced mobile responsiveness */
@media (max-width: 768px) {
  .app-header .container {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-md);
  }
  
  .main-nav {
    order: -1;
    width: 100%;
    max-width: 400px;
  }
  
  .container {
    padding: 0 var(--spacing-md);
  }
  
  .main-content {
    padding: var(--spacing-xl) 0;
  }
}

/* Utility classes for consistent spacing */
.space-y-2 > * + * {
  margin-top: var(--spacing-sm);
}

.space-y-4 > * + * {
  margin-top: var(--spacing-md);
}

.space-y-6 > * + * {
  margin-top: var(--spacing-lg);
}

/* Enhanced button styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-decoration: none;
  white-space: nowrap;
  box-shadow: var(--shadow-sm);
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-colored);
}

.btn-secondary {
  background: var(--surface);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  background: var(--surface-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Enhanced card styles */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
  border-color: var(--accent-blue);
}

.card-elevated {
  background: var(--surface-elevated);
  box-shadow: var(--shadow-lg);
}
</style>
