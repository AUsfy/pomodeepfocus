<template>
  <div class="pomodoro-timer">
    <!-- Pomodoro Description Section -->
    <div class="pomodoro-description">
      <div class="description-content">
        <h2 class="description-title">The Pomodoro Technique</h2>
        <p class="description-text">
          Work in focused 25-minute sessions followed by 5-minute breaks. After 4 sessions, take a longer 15-30 minute break. 
          This proven method helps improve focus, reduce mental fatigue, and boost productivity.
        </p>
        <div class="technique-steps">
          <div class="step">
            <span class="step-icon">🍅</span>
            <span class="step-text">25 min work</span>
          </div>
          <div class="step">
            <span class="step-icon">☕</span>
            <span class="step-text">5 min break</span>
          </div>
          <div class="step">
            <span class="step-icon">🔄</span>
            <span class="step-text">Repeat 4x</span>
          </div>
          <div class="step">
            <span class="step-icon">🏖️</span>
            <span class="step-text">Long break</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Timer Section -->
    <div class="timer-modes">
      <button 
        v-for="mode in modes" 
        :key="mode.id"
        @click="switchMode(mode.id)"
        :class="{ active: currentMode === mode.id }"
        class="mode-btn"
      >
        {{ mode.label }}
      </button>
    </div>

    <div class="timer-display" :class="{ running: isRunning }">
      <div class="time-circle">
        <svg class="progress-ring" width="280" height="280" viewBox="0 0 280 280">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" :style="`stop-color:${currentMode === 'work' ? 'var(--primary-color)' : currentMode === 'short' ? 'var(--secondary-color)' : 'var(--break-color)'};stop-opacity:1`" />
              <stop offset="100%" :style="`stop-color:${currentMode === 'work' ? 'var(--primary-light)' : currentMode === 'short' ? '#34d399' : '#60a5fa'};stop-opacity:1`" />
            </linearGradient>
            <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:var(--border);stop-opacity:1" />
              <stop offset="100%" style="stop-color:var(--border-light);stop-opacity:1" />
            </linearGradient>
          </defs>
          <!-- Enhanced background circle with better visibility -->
          <circle
            class="progress-ring-bg"
            cx="140"
            cy="140"
            r="130"
            stroke-width="12"
            fill="transparent"
            stroke="url(#backgroundGradient)"
          />
          <!-- Dotted guide circle for better visibility when inactive -->
          <circle
            v-if="!isRunning && timeLeft === currentModeTime"
            class="progress-ring-guide"
            cx="140"
            cy="140"
            r="130"
            stroke-width="2"
            fill="transparent"
            :stroke="currentMode === 'work' ? 'var(--primary-color)' : currentMode === 'short' ? 'var(--secondary-color)' : 'var(--break-color)'"
            stroke-dasharray="8,4"
            opacity="0.6"
          />
          <!-- Progress circle -->
          <circle
            class="progress-ring-progress"
            cx="140"
            cy="140"
            r="130"
            stroke-width="12"
            fill="transparent"
            stroke="url(#progressGradient)"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashOffset"
          />
        </svg>
        <div class="time-content">
          <div class="time-display-main">
            <span class="time">{{ formattedTime }}</span>
            <div class="session-info">
              <span class="session-label">{{ getCurrentModeLabel() }}</span>
              <span v-if="activeTask" class="active-task">{{ activeTask.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="timer-controls">
      <button 
        @click="toggleTimer" 
        class="btn btn-primary control-btn-main"
      >
        <span v-if="!isRunning">▶</span>
        <span v-else>⏸</span>
        {{ isRunning ? 'Pause' : 'Start' }}
      </button>
      <button 
        @click="resetTimer" 
        class="btn btn-secondary"
        v-if="timeLeft !== currentModeTime || isRunning"
      >
        ↻ Reset
      </button>
    </div>

    <div class="session-counter" v-if="completedSessions > 0">
      <div class="counter-content">
        <span class="counter-number">{{ completedSessions }}</span>
        <span class="counter-label">{{ completedSessions === 1 ? 'session' : 'sessions' }} completed</span>
      </div>
    </div>

    <!-- Tasks Section -->
    <div class="tasks-section">
      <div class="section-header">
        <h2 class="section-title">Tasks</h2>
        <div class="task-summary">
          <span class="summary-text">{{ completedTasks }}/{{ totalTasks }} completed</span>
        </div>
      </div>

      <div class="add-task-form">
        <form @submit.prevent="addTask" class="task-form">
          <div class="form-group">
            <input
              v-model="newTaskTitle"
              type="text"
              placeholder="What are you working on?"
              class="task-input"
              maxlength="100"
              required
            />
            <input
              v-model.number="newTaskEstimate"
              type="number"
              min="1"
              max="20"
              placeholder="Est"
              class="estimate-input"
              title="Estimated pomodoros"
            />
            <button type="submit" class="btn btn-primary add-btn">
              + Add
            </button>
          </div>
        </form>
      </div>

      <div class="tasks-container">
        <div v-if="tasks.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <p class="empty-text">Add your first task to get started</p>
        </div>

        <div v-else class="tasks-list space-y-2">
          <div
            v-for="task in tasks"
            :key="task.id"
            :class="{ 
              'task-item': true,
              'task-completed': task.completed,
              'task-active': task.id === activeTaskId 
            }"
          >
            <div class="task-main">
              <button
                @click="toggleTask(task.id)"
                class="task-checkbox"
                :class="{ checked: task.completed }"
              >
                <svg v-if="task.completed" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
              </button>

              <div class="task-info">
                <h3 class="task-title" :class="{ completed: task.completed }">
                  {{ task.title }}
                </h3>
                <div class="task-progress">
                  <div class="progress-info">
                    <span class="pomodoro-count">{{ task.completedPomodoros }}/{{ task.estimatedPomodoros }}</span>
                    <span class="progress-text">pomodoros</span>
                  </div>
                  <div class="progress-bar">
                    <div 
                      class="progress-fill" 
                      :style="{ width: getProgressPercentage(task) + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="task-actions">
              <button
                @click="setActiveTask(task.id)"
                class="action-btn"
                :class="{ 'action-active': task.id === activeTaskId }"
                :disabled="task.completed"
              >
                {{ task.id === activeTaskId ? 'Active' : 'Select' }}
              </button>
              <button @click="editTask(task)" class="action-btn action-edit">
                ✏️
              </button>
              <button @click="deleteTask(task.id)" class="action-btn action-delete">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Task Modal -->
    <div v-if="editingTask" class="modal-overlay" @click="cancelEdit">
      <div class="modal card-elevated" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Edit Task</h3>
        </div>
        <form @submit.prevent="saveEdit" class="modal-form space-y-4">
          <div class="form-group">
            <input
              v-model="editForm.title"
              type="text"
              placeholder="Task title"
              class="task-input"
              required
            />
          </div>
          <div class="form-group">
            <input
              v-model.number="editForm.estimatedPomodoros"
              type="number"
              min="1"
              max="20"
              placeholder="Estimated Pomodoros"
              class="estimate-input"
            />
          </div>
          <div class="modal-actions">
            <button type="button" @click="cancelEdit" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTimer } from '../composables/useTimer.js'
import { Analytics } from '../utils/analytics.js'

// Use the shared timer composable
const {
  settings,
  currentMode,
  timeLeft,
  isRunning,
  completedSessions,
  formattedTime,
  currentModeTime,
  progressPercentage,
  startTimer,
  pauseTimer,
  resetTimer,
  switchMode,
  getCurrentModeLabel
} = useTimer()

// Task management state
const tasks = ref([])
const newTaskTitle = ref('')
const newTaskEstimate = ref(1)
const activeTaskId = ref(null)
const editingTask = ref(null)
const editForm = ref({
  title: '',
  estimatedPomodoros: 1
})

// Timer modes - now dynamic based on settings
const modes = computed(() => [
  { id: 'work', label: 'Pomodoro' },
  { id: 'short', label: 'Short Break' },
  { id: 'long', label: 'Long Break' }
])

// Task computed properties
const totalTasks = computed(() => tasks.value.length)
const completedTasks = computed(() => tasks.value.filter(task => task.completed).length)
const activeTask = computed(() => tasks.value.find(task => task.id === activeTaskId.value))

// Timer functions
const toggleTimer = () => {
  if (isRunning.value) {
    pauseTimer()
    Analytics.trackEvent('timer_pause', {
      event_label: getCurrentModeLabel(),
      time_remaining: timeLeft.value
    })
  } else {
    startTimer()
    Analytics.trackEvent('timer_start', {
      event_label: getCurrentModeLabel(),
      time_set: currentModeTime.value
    })
  }
}

// Progress ring calculations
const circumference = 2 * Math.PI * 130
const strokeDashOffset = computed(() => {
  const progress = progressPercentage.value / 100
  return circumference - (progress * circumference)
})

// Task management functions
const addTask = () => {
  if (!newTaskTitle.value.trim()) return

  const newTask = {
    id: Date.now(),
    title: newTaskTitle.value.trim(),
    estimatedPomodoros: newTaskEstimate.value || 1,
    completedPomodoros: 0,
    completed: false,
    createdAt: new Date().toISOString()
  }

  tasks.value.push(newTask)
  
  // Track task addition
  Analytics.trackEvent('task_add', {
    event_label: 'Task Added',
    estimated_pomodoros: newTask.estimatedPomodoros
  })
  
  // Set as active task if it's the first one
  if (tasks.value.length === 1) {
    activeTaskId.value = newTask.id
  }

  // Reset form
  newTaskTitle.value = ''
  newTaskEstimate.value = 1
  
  saveTasks()
}

const toggleTask = (taskId) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) {
    const wasCompleted = task.completed
    task.completed = !task.completed
    
    // Track task completion
    Analytics.trackEvent('task_toggle', {
      event_label: task.completed ? 'Task Completed' : 'Task Uncompleted',
      task_id: taskId
    })
    
    // If marking as completed, remove from active
    if (task.completed && activeTaskId.value === taskId) {
      activeTaskId.value = null
    }
    
    saveTasks()
  }
}

const setActiveTask = (taskId) => {
  activeTaskId.value = activeTaskId.value === taskId ? null : taskId
  saveTasks()
}

const editTask = (task) => {
  editingTask.value = task
  editForm.value = {
    title: task.title,
    estimatedPomodoros: task.estimatedPomodoros
  }
}

const saveEdit = () => {
  if (!editForm.value.title.trim()) return

  editingTask.value.title = editForm.value.title.trim()
  editingTask.value.estimatedPomodoros = editForm.value.estimatedPomodoros
  
  cancelEdit()
  saveTasks()
}

const cancelEdit = () => {
  editingTask.value = null
  editForm.value = { title: '', estimatedPomodoros: 1 }
}

const deleteTask = (taskId) => {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks.value = tasks.value.filter(task => task.id !== taskId)
    
    if (activeTaskId.value === taskId) {
      activeTaskId.value = null
    }
    
    saveTasks()
  }
}

const getProgressPercentage = (task) => {
  return Math.min((task.completedPomodoros / task.estimatedPomodoros) * 100, 100)
}

// Local storage functions
const saveTasks = () => {
  localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks.value))
  localStorage.setItem('pomodoro-active-task', activeTaskId.value?.toString() || '')
}

const loadTasks = () => {
  const savedTasks = localStorage.getItem('pomodoro-tasks')
  const savedActiveTask = localStorage.getItem('pomodoro-active-task')
  
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks)
  }
  
  if (savedActiveTask && savedActiveTask !== '') {
    activeTaskId.value = parseInt(savedActiveTask)
  }
}

// Handle pomodoro completion
const completePomodoro = () => {
  if (activeTaskId.value && currentMode.value === 'work') {
    const activeTask = tasks.value.find(task => task.id === activeTaskId.value)
    if (activeTask && !activeTask.completed) {
      activeTask.completedPomodoros++
      
      // Auto-complete task if pomodoros reached
      if (activeTask.completedPomodoros >= activeTask.estimatedPomodoros) {
        activeTask.completed = true
        activeTaskId.value = null
      }
      
      saveTasks()
    }
  }
}

// Watch for completed sessions to update task progress
watch(completedSessions, (newValue, oldValue) => {
  if (newValue > oldValue) {
    completePomodoro()
  }
})

// Initialize on mount
onMounted(() => {
  loadTasks()
})
</script>

<style scoped>
.pomodoro-timer {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

/* Timer modes with pill design */
.timer-modes {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xs);
  background: var(--surface);
  padding: var(--spacing-xs);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.mode-btn {
  padding: var(--spacing-md) var(--spacing-xl);
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

.mode-btn:hover {
  background: var(--border-light);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.mode-btn.active[data-mode="work"] {
  background: var(--primary-color);
  color: white;
  box-shadow: var(--shadow-sm);
}

.mode-btn.active {
  background: var(--primary-color);
  color: white;
  box-shadow: var(--shadow-sm);
}

/* Modern timer display */
.timer-display {
  display: flex;
  justify-content: center;
  margin: var(--spacing-xl) 0;
}

.time-circle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, var(--surface-elevated) 0%, var(--surface) 70%);
  border-radius: 50%;
  padding: var(--spacing-md);
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-base);
}

/* Enhanced styling when timer is not running */
.timer-display:not(.running) .time-circle {
  background: radial-gradient(circle at center, var(--accent-blue-light) 0%, var(--surface) 70%);
  box-shadow: var(--shadow-lg), inset 0 0 20px rgba(59, 130, 246, 0.1);
}

/* Subtle pulse animation when inactive */
.timer-display:not(.running) .time-circle::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--accent-blue), var(--primary-color));
  opacity: 0.3;
  z-index: -1;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.02);
    opacity: 0.5;
  }
}

.progress-ring {
  transform: rotate(-90deg);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.progress-ring-bg {
  stroke: var(--border);
  opacity: 0.8;
  stroke-width: 12;
  transition: all var(--transition-base);
}

/* Enhanced background visibility when timer is inactive */
.timer-display:not(.running) .progress-ring-bg {
  stroke: var(--border);
  opacity: 1;
  stroke-width: 8;
}

.progress-ring-guide {
  stroke-linecap: round;
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: -100;
  }
}

.progress-ring-progress {
  stroke-linecap: round;
  transition: stroke-dashoffset var(--transition-slow);
}

.time-content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.time-display-main {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.time {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--text-primary);
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  line-height: 1;
  letter-spacing: -0.05em;
}

.session-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  text-align: center;
}

.session-label {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  font-weight: 500;
}

.active-task {
  font-size: var(--font-size-sm);
  color: var(--primary-color);
  font-weight: 600;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Modern timer controls */
.timer-controls {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.control-btn-main {
  padding: var(--spacing-lg) var(--spacing-2xl);
  font-size: var(--font-size-lg);
  font-weight: 600;
  min-width: 140px;
  gap: var(--spacing-sm);
}

/* Session counter */
.session-counter {
  display: flex;
  justify-content: center;
}

.counter-content {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.counter-number {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--primary-color);
  margin-right: var(--spacing-sm);
}

.counter-label {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

/* Tasks section */
.tasks-section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--text-primary);
}

.task-summary {
  display: flex;
  align-items: center;
}

.summary-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  background: var(--border-light);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-md);
}

/* Add task form */
.add-task-form {
  margin-bottom: var(--spacing-xl);
}

.form-group {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.task-input {
  flex: 1;
  min-width: 250px;
  padding: var(--spacing-md);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--background);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.task-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.estimate-input {
  width: 70px;
  padding: var(--spacing-md);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--background);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  text-align: center;
  transition: all var(--transition-fast);
}

.estimate-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.add-btn {
  padding: var(--spacing-md) var(--spacing-lg);
  font-weight: 600;
}

/* Tasks list */
.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--text-muted);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
  opacity: 0.6;
}

.empty-text {
  font-size: var(--font-size-base);
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
  gap: var(--spacing-md);
}

.task-item:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.task-active {
  border-color: var(--primary-color);
  background: rgba(239, 68, 68, 0.05);
}

.task-completed {
  opacity: 0.6;
  background: var(--border-light);
}

.task-main {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
  min-width: 0;
}

.task-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  color: white;
  flex-shrink: 0;
}

.task-checkbox:hover {
  border-color: var(--primary-color);
}

.task-checkbox.checked {
  background: var(--secondary-color);
  border-color: var(--secondary-color);
}

.task-info {
  flex: 1;
  min-width: 0;
}

.task-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-title.completed {
  text-decoration: line-through;
  color: var(--text-muted);
}

.task-progress {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.progress-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  white-space: nowrap;
}

.pomodoro-count {
  font-weight: 600;
  color: var(--primary-color);
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--border-light);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
  border-radius: var(--radius-sm);
  transition: width var(--transition-base);
}

/* Task actions */
.task-actions {
  display: flex;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

.action-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--font-size-xs);
  white-space: nowrap;
}

.action-btn:hover {
  background: var(--border-light);
  color: var(--text-primary);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.action-edit:hover {
  background: #f59e0b;
  color: white;
  border-color: #f59e0b;
}

.action-delete:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal {
  width: 90%;
  max-width: 400px;
  padding: var(--spacing-xl);
  margin: var(--spacing-lg);
}

.modal-header {
  margin-bottom: var(--spacing-lg);
}

.modal-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.modal-form .form-group {
  flex-direction: column;
  gap: var(--spacing-sm);
}

.modal-form .task-input,
.modal-form .estimate-input {
  width: 100%;
  min-width: unset;
}

.modal-actions {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .pomodoro-timer {
    gap: var(--spacing-xl);
  }
  
  .timer-modes {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .mode-btn {
    padding: var(--spacing-sm) var(--spacing-md);
  }
  
  .time {
    font-size: var(--font-size-3xl);
  }
  
  .progress-ring {
    width: 240px;
    height: 240px;
  }
  
  .timer-controls {
    flex-direction: column;
    align-items: center;
  }
  
  .control-btn-main {
    width: 100%;
    max-width: 200px;
  }
  
  .form-group {
    flex-direction: column;
  }
  
  .task-input {
    min-width: unset;
  }
  
  .task-item {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
  }
  
  .task-actions {
    justify-content: center;
  }
  
  .modal {
    margin: var(--spacing-md);
  }
}

/* Pomodoro Description Styles */
.pomodoro-description {
  background: linear-gradient(135deg, var(--accent-blue-light), var(--surface));
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-md);
}

.description-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.description-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.description-text {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
}

.technique-steps {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
  min-width: 80px;
}

.step:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.step-icon {
  font-size: var(--font-size-xl);
}

.step-text {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-secondary);
  text-align: center;
}

/* Dark theme adjustments for description */
[data-theme="dark"] .pomodoro-description {
  background: linear-gradient(135deg, var(--accent-blue-light), var(--surface-elevated));
}

[data-theme="dark"] .step {
  background: var(--surface-elevated);
}

/* Mobile responsiveness for description */
@media (max-width: 768px) {
  .pomodoro-description {
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
  }
  
  .description-title {
    font-size: var(--font-size-xl);
  }
  
  .description-text {
    font-size: var(--font-size-sm);
  }
  
  .technique-steps {
    gap: var(--spacing-md);
  }
  
  .step {
    padding: var(--spacing-sm);
    min-width: 70px;
  }
  
  .step-icon {
    font-size: var(--font-size-lg);
  }
  
  .step-text {
    font-size: var(--font-size-xs);
  }
}
</style>