<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import PomodoroTimer from './components/PomodoroTimer.vue'
import Settings from './components/Settings.vue'

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
          Pomofocus
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
        <Settings v-if="currentView === 'settings'" />
      </div>
    </main>
  </div>
</template>

<style>
:root {
  --primary-color: #d95550;
  --primary-dark: #c44942;
  --secondary-color: #4c956c;
  --break-color: #457b9d;
  --background: #ffffff;
  --surface: #f8f9fa;
  --text-primary: #2c3e50;
  --text-secondary: #6c757d;
  --border: #e9ecef;
  --shadow: rgba(0, 0, 0, 0.1);
  
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --border-radius: 8px;
  --transition: all 0.3s ease;
}

[data-theme="dark"] {
  --background: #1a1a1a;
  --surface: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --border: #404040;
  --shadow: rgba(0, 0, 0, 0.3);
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
  transition: var(--transition);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.app-header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.app-header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tomato-icon {
  font-size: 1.8rem;
}

.main-nav {
  display: flex;
  gap: 0.5rem;
  background: var(--background);
  padding: 0.25rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border);
}

.nav-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: calc(var(--border-radius) - 2px);
  cursor: pointer;
  transition: var(--transition);
  font-weight: 500;
}

.nav-btn:hover {
  background: var(--surface);
  color: var(--text-primary);
}

.nav-btn.active {
  background: var(--primary-color);
  color: white;
}

.theme-toggle {
  padding: 0.5rem;
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 1.2rem;
  transition: var(--transition);
}

.theme-toggle:hover {
  background: var(--background);
}

.main-content {
  padding: 2rem 0;
  min-height: calc(100vh - 80px);
}

@media (max-width: 768px) {
  .app-header .container {
    flex-direction: column;
    text-align: center;
  }
  
  .main-nav {
    order: -1;
    width: 100%;
    max-width: 400px;
  }
  
  .container {
    padding: 0 0.5rem;
  }
}
</style>
