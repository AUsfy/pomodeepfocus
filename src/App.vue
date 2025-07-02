<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import PomodoroTimer from './components/PomodoroTimer.vue'
import Settings from './components/Settings.vue'
import Insights from './components/Insights.vue'

const currentView = ref('timer')
const isDarkMode = ref(false)

// Theme management
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
}

onMounted(() => {
  // Load theme preference from localStorage
  const savedTheme = localStorage.getItem('pomodoro-theme')
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
  }
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
})
</script>

<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <header class="app-header">
      <div class="container">
        <h1 class="app-title">
          <span class="tomato-icon">🍅</span>
          Pomo
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
        </nav>

        <button @click="toggleTheme" class="theme-toggle">
          {{ isDarkMode ? '☀️' : '🌙' }}
        </button>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <PomodoroTimer v-if="currentView === 'timer'" />
        <Insights v-if="currentView === 'insights'" ref="insightsRef" />
        <Settings v-if="currentView === 'settings'" />
      </div>
    </main>
  </div>
</template>

<style>
:root {
  /* Updated color palette for minimalist design */
  --primary-color: #ef4444;
  --primary-light: #f87171;
  --primary-dark: #dc2626;
  --secondary-color: #10b981;
  --break-color: #3b82f6;
  
  /* Modern neutral colors */
  --background: #fafafa;
  --surface: #ffffff;
  --surface-elevated: #ffffff;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-muted: #9ca3af;
  --border: #e5e7eb;
  --border-light: #f3f4f6;
  
  /* Shadows for depth */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  
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
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #64748b;
  --border: #334155;
  --border-light: #475569;
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
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

/* Modern header with glassmorphism effect */
.app-header {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-light);
  padding: var(--spacing-lg) 0;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all var(--transition-base);
}

[data-theme="dark"] .app-header {
  background: rgba(30, 41, 59, 0.8);
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

/* Pill-style navigation */
.main-nav {
  display: flex;
  gap: var(--spacing-xs);
  background: var(--surface);
  padding: var(--spacing-xs);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
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
  background: var(--border-light);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.nav-btn.active {
  background: var(--primary-color);
  color: white;
  box-shadow: var(--shadow-sm);
}

/* Modern theme toggle */
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
}

.theme-toggle:hover {
  background: var(--border-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
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

/* Modern button styles */
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
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--surface);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  background: var(--border-light);
}

/* Modern card styles */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-elevated {
  background: var(--surface-elevated);
  box-shadow: var(--shadow-lg);
}
</style>
