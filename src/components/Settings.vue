<template>
  <div class="settings">
    <div class="settings-header">
      <h2>Settings</h2>
      <p class="settings-description">
        Customize your Pomodoro experience
      </p>
    </div>

    <div class="settings-sections">
      <!-- Timer Settings -->
      <div class="settings-section">
        <h3>Timer Settings</h3>
        <div class="setting-group">
          <label class="setting-label">
            <span class="label-text">Pomodoro Duration</span>
            <div class="input-with-unit">
              <input
                v-model.number="settings.pomodoroMinutes"
                type="number"
                min="1"
                max="60"
                class="time-input"
              />
              <span class="unit">minutes</span>
            </div>
          </label>
          
          <label class="setting-label">
            <span class="label-text">Short Break Duration</span>
            <div class="input-with-unit">
              <input
                v-model.number="settings.shortBreakMinutes"
                type="number"
                min="1"
                max="30"
                class="time-input"
              />
              <span class="unit">minutes</span>
            </div>
          </label>
          
          <label class="setting-label">
            <span class="label-text">Long Break Duration</span>
            <div class="input-with-unit">
              <input
                v-model.number="settings.longBreakMinutes"
                type="number"
                min="1"
                max="60"
                class="time-input"
              />
              <span class="unit">minutes</span>
            </div>
          </label>
          
          <label class="setting-label">
            <span class="label-text">Long Break Interval</span>
            <div class="input-with-unit">
              <input
                v-model.number="settings.longBreakInterval"
                type="number"
                min="2"
                max="10"
                class="time-input"
              />
              <span class="unit">pomodoros</span>
            </div>
          </label>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="settings-section">
        <h3>Notifications</h3>
        <div class="setting-group">
          <label class="setting-label checkbox">
            <input
              v-model="settings.notifications.desktop"
              type="checkbox"
              class="checkbox-input"
            />
            <span class="checkbox-custom"></span>
            <span class="label-text">Desktop Notifications</span>
          </label>
          
          <label class="setting-label checkbox">
            <input
              v-model="settings.notifications.sound"
              type="checkbox"
              class="checkbox-input"
            />
            <span class="checkbox-custom"></span>
            <span class="label-text">Sound Notifications</span>
          </label>
          
          <div v-if="settings.notifications.sound" class="sound-settings">
            <label class="setting-label">
              <span class="label-text">Notification Sound</span>
              <select v-model="settings.notifications.soundType" class="select-input">
                <option value="bell">Bell</option>
                <option value="chime">Chime</option>
                <option value="ding">Ding</option>
                <option value="none">None</option>
              </select>
            </label>
            
            <label class="setting-label">
              <span class="label-text">Volume</span>
              <div class="volume-control">
                <input
                  v-model.number="settings.notifications.volume"
                  type="range"
                  min="0"
                  max="100"
                  class="volume-slider"
                />
                <span class="volume-value">{{ settings.notifications.volume }}%</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Appearance Settings -->
      <div class="settings-section">
        <h3>Appearance</h3>
        <div class="setting-group">
          <label class="setting-label">
            <span class="label-text">Theme</span>
            <select v-model="settings.theme" class="select-input">
              <option value="auto">Auto</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          
          <label class="setting-label checkbox">
            <input
              v-model="settings.autoStartBreaks"
              type="checkbox"
              class="checkbox-input"
            />
            <span class="checkbox-custom"></span>
            <span class="label-text">Auto-start Breaks</span>
          </label>
          
          <label class="setting-label checkbox">
            <input
              v-model="settings.autoStartPomodoros"
              type="checkbox"
              class="checkbox-input"
            />
            <span class="checkbox-custom"></span>
            <span class="label-text">Auto-start Pomodoros</span>
          </label>
        </div>
      </div>

      <!-- Data Management -->
      <div class="settings-section">
        <h3>Data Management</h3>
        <div class="setting-group">
          <div class="data-actions">
            <button @click="exportData" class="action-btn export">
              <span class="btn-icon">📤</span>
              Export Data
            </button>
            
            <button @click="triggerImport" class="action-btn import">
              <span class="btn-icon">📥</span>
              Import Data
            </button>
            
            <button @click="clearAllData" class="action-btn danger">
              <span class="btn-icon">🗑️</span>
              Clear All Data
            </button>
          </div>
          
          <input
            ref="importFileInput"
            type="file"
            accept=".json"
            @change="importData"
            class="hidden-input"
          />
        </div>
      </div>
    </div>

    <div class="settings-footer">
      <div class="save-actions">
        <button @click="resetToDefaults" class="reset-btn">
          Reset to Defaults
        </button>
        <button @click="saveSettings" class="save-btn">
          Save Settings
        </button>
      </div>
      
      <div class="settings-info">
        <p class="info-text">
          Settings are automatically saved to your browser's local storage.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'

const importFileInput = ref(null)

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

// Reactive settings
const settings = reactive({ ...defaultSettings })

// Settings management
const saveSettings = () => {
  try {
    localStorage.setItem('pomodoro-settings', JSON.stringify(settings))
    showNotification('Settings saved successfully!', 'success')
  } catch (error) {
    showNotification('Failed to save settings', 'error')
  }
}

const loadSettings = () => {
  try {
    const savedSettings = localStorage.getItem('pomodoro-settings')
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      Object.assign(settings, { ...defaultSettings, ...parsed })
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
}

const resetToDefaults = () => {
  if (confirm('Are you sure you want to reset all settings to default values?')) {
    Object.assign(settings, defaultSettings)
    saveSettings()
  }
}

// Data management
const exportData = () => {
  try {
    const data = {
      settings: settings,
      tasks: JSON.parse(localStorage.getItem('pomodoro-tasks') || '[]'),
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `pomodoro-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    showNotification('Data exported successfully!', 'success')
  } catch (error) {
    showNotification('Failed to export data', 'error')
  }
}

const triggerImport = () => {
  importFileInput.value?.click()
}

const importData = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      
      if (data.settings) {
        Object.assign(settings, { ...defaultSettings, ...data.settings })
        saveSettings()
      }
      
      if (data.tasks) {
        localStorage.setItem('pomodoro-tasks', JSON.stringify(data.tasks))
      }
      
      showNotification('Data imported successfully!', 'success')
      
      // Reset file input
      event.target.value = ''
    } catch (error) {
      showNotification('Failed to import data. Invalid file format.', 'error')
    }
  }
  
  reader.readAsText(file)
}

const clearAllData = () => {
  if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
    localStorage.removeItem('pomodoro-settings')
    localStorage.removeItem('pomodoro-tasks')
    localStorage.removeItem('pomodoro-active-task')
    localStorage.removeItem('pomodoro-theme')
    
    Object.assign(settings, defaultSettings)
    showNotification('All data cleared successfully!', 'success')
  }
}

// Notification helper
const showNotification = (message, type = 'info') => {
  // Simple notification implementation
  console.log(`${type.toUpperCase()}: ${message}`)
  
  // You could integrate with a toast library here
  alert(message)
}

// Request notification permission
const requestNotificationPermission = async () => {
  if ('Notification' in window && settings.notifications.desktop) {
    if (Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }
}

// Watch for changes and auto-save
watch(settings, () => {
  saveSettings()
}, { deep: true })

// Theme handling
watch(() => settings.theme, (newTheme) => {
  let actualTheme = newTheme
  
  if (newTheme === 'auto') {
    actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  
  document.documentElement.setAttribute('data-theme', actualTheme)
  localStorage.setItem('pomodoro-theme', actualTheme)
})

// Initialize
onMounted(() => {
  loadSettings()
  requestNotificationPermission()
})

// Expose settings for parent components
defineExpose({
  settings
})
</script>

<style scoped>
.settings {
  max-width: 800px;
  margin: 0 auto;
}

.settings-header {
  text-align: center;
  margin-bottom: 2rem;
}

.settings-header h2 {
  color: var(--text-primary);
  font-size: 1.8rem;
  margin: 0 0 0.5rem 0;
}

.settings-description {
  color: var(--text-secondary);
  margin: 0;
}

.settings-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  padding: 1.5rem;
}

.settings-section h3 {
  color: var(--text-primary);
  font-size: 1.2rem;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setting-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.setting-label.checkbox {
  justify-content: flex-start;
  cursor: pointer;
}

.label-text {
  color: var(--text-primary);
  font-weight: 500;
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-input {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  background: var(--background);
  color: var(--text-primary);
  text-align: center;
}

.time-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.unit {
  color: var(--text-secondary);
  font-size: 0.9rem;
  min-width: 60px;
}

.select-input {
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  background: var(--background);
  color: var(--text-primary);
  cursor: pointer;
}

.select-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* Checkbox styles */
.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-radius: 4px;
  background: var(--background);
  position: relative;
  transition: var(--transition);
  margin-right: 0.75rem;
}

.checkbox-input:checked + .checkbox-custom {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 12px;
}

/* Sound settings */
.sound-settings {
  margin-left: 2rem;
  padding-left: 1rem;
  border-left: 2px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 150px;
}

.volume-slider {
  flex: 1;
  height: 6px;
  background: var(--border);
  border-radius: 3px;
  appearance: none;
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--primary-color);
  border-radius: 50%;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: var(--primary-color);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.volume-value {
  color: var(--text-secondary);
  font-size: 0.9rem;
  min-width: 40px;
}

/* Data actions */
.data-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  background: var(--background);
  color: var(--text-primary);
  cursor: pointer;
  transition: var(--transition);
  font-weight: 500;
}

.action-btn:hover {
  background: var(--surface);
}

.action-btn.export:hover {
  background: var(--secondary-color);
  color: white;
  border-color: var(--secondary-color);
}

.action-btn.import:hover {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.action-btn.danger:hover {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

.btn-icon {
  font-size: 1rem;
}

.hidden-input {
  display: none;
}

/* Settings footer */
.settings-footer {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
}

.save-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.reset-btn, .save-btn {
  padding: 0.75rem 2rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.reset-btn {
  background: var(--surface);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.reset-btn:hover {
  background: var(--background);
}

.save-btn {
  background: var(--primary-color);
  color: white;
  border: none;
}

.save-btn:hover {
  background: var(--primary-dark);
}

.settings-info {
  text-align: center;
}

.info-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
}

@media (max-width: 768px) {
  .settings-section {
    padding: 1rem;
  }
  
  .setting-label {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .setting-label.checkbox {
    flex-direction: row;
    align-items: center;
  }
  
  .data-actions {
    flex-direction: column;
  }
  
  .save-actions {
    flex-direction: column;
  }
  
  .sound-settings {
    margin-left: 0;
    padding-left: 0;
    border-left: none;
    border-top: 1px solid var(--border);
    padding-top: 1rem;
  }
}
</style>