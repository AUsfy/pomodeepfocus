<template>
  <div class="pomodoro-timer">
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

    <div class="timer-display">
      <div class="time-circle">
        <svg class="progress-ring" width="300" height="300">
          <circle
            class="progress-ring-bg"
            cx="150"
            cy="150"
            r="140"
            stroke-width="8"
            fill="transparent"
          />
          <circle
            class="progress-ring-progress"
            cx="150"
            cy="150"
            r="140"
            stroke-width="8"
            fill="transparent"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashOffset"
          />
        </svg>
        <div class="time-text">
          <span class="time">{{ formattedTime }}</span>
          <span class="session-label">{{ getCurrentModeLabel() }}</span>
          <span v-if="activeTask" class="active-task-name">{{ activeTask.title }}</span>
        </div>
      </div>
    </div>

    <div class="timer-controls">
      <button 
        @click="toggleTimer" 
        class="control-btn primary"
      >
        {{ isRunning ? 'PAUSE' : 'START' }}
      </button>
      <button 
        @click="resetTimer" 
        class="control-btn secondary"
        v-if="timeLeft !== currentModeTime || isRunning"
      >
        RESET
      </button>
    </div>

    <div class="session-info" v-if="completedSessions > 0">
      <p>Sessions completed: {{ completedSessions }}</p>
    </div>

    <!-- Tasks Section -->
    <div class="tasks-section">
      <div class="task-header">
        <h2>Tasks</h2>
        <div class="task-stats">
          <span>{{ completedTasks }}/{{ totalTasks }} completed</span>
        </div>
      </div>

      <div class="add-task">
        <form @submit.prevent="addTask" class="task-form">
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
            placeholder="Est Pomodoros"
            class="estimate-input"
          />
          <button type="submit" class="add-btn">Add Task</button>
        </form>
      </div>

      <div class="tasks-container">
        <div v-if="tasks.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <p>No tasks yet. Add one above to get started!</p>
        </div>

        <div v-else class="tasks">
          <div
            v-for="task in tasks"
            :key="task.id"
            :class="{ 
              'task-item': true, 
              'completed': task.completed,
              'active': task.id === activeTaskId 
            }"
          >
            <div class="task-content">
              <button
                @click="toggleTask(task.id)"
                class="task-checkbox"
                :class="{ checked: task.completed }"
              >
                <span v-if="task.completed">✓</span>
              </button>

              <div class="task-details">
                <h3 class="task-title" :class="{ completed: task.completed }">
                  {{ task.title }}
                </h3>
                <div class="task-progress">
                  <span class="pomodoros-count">
                    {{ task.completedPomodoros }}/{{ task.estimatedPomodoros }} pomodoros
                  </span>
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
                :class="{ active: task.id === activeTaskId }"
                :disabled="task.completed"
              >
                {{ task.id === activeTaskId ? 'Active' : 'Select' }}
              </button>
              <button @click="editTask(task)" class="action-btn edit">
                ✏️
              </button>
              <button @click="deleteTask(task.id)" class="action-btn delete">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Task Modal -->
    <div v-if="editingTask" class="modal-overlay" @click="cancelEdit">
      <div class="modal" @click.stop>
        <h3>Edit Task</h3>
        <form @submit.prevent="saveEdit" class="edit-form">
          <input
            v-model="editForm.title"
            type="text"
            placeholder="Task title"
            class="task-input"
            required
          />
          <input
            v-model.number="editForm.estimatedPomodoros"
            type="number"
            min="1"
            max="20"
            placeholder="Estimated Pomodoros"
            class="estimate-input"
          />
          <div class="modal-actions">
            <button type="button" @click="cancelEdit" class="cancel-btn">
              Cancel
            </button>
            <button type="submit" class="save-btn">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTimer } from '../composables/useTimer.js'

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
  } else {
    startTimer()
  }
}

// Progress ring calculations
const circumference = 2 * Math.PI * 140
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
    task.completed = !task.completed
    
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
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
}

.timer-modes {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: var(--surface);
  padding: 0.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border);
}

.mode-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: calc(var(--border-radius) - 2px);
  cursor: pointer;
  transition: var(--transition);
  font-weight: 500;
  font-size: 0.9rem;
}

.mode-btn:hover {
  background: var(--background);
  color: var(--text-primary);
}

.mode-btn.active {
  background: var(--primary-color);
  color: white;
}

.timer-display {
  margin-bottom: 2rem;
  position: relative;
}

.time-circle {
  position: relative;
  display: inline-block;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-bg {
  stroke: var(--border);
  opacity: 0.3;
}

.progress-ring-progress {
  stroke: var(--primary-color);
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
}

.time-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time {
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-primary);
  font-family: 'Courier New', monospace;
}

.session-label {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

.active-task-name {
  font-size: 1rem;
  color: var(--text-primary);
  margin-top: 0.5rem;
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.control-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
  min-width: 120px;
}

.control-btn.primary {
  background: var(--primary-color);
  color: white;
}

.control-btn.primary:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

.control-btn.secondary {
  background: var(--surface);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.control-btn.secondary:hover {
  background: var(--background);
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.session-info {
  background: var(--surface);
  padding: 1rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border);
  color: var(--text-secondary);
}

.tasks-section {
  margin-top: 2rem;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.task-stats {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.add-task {
  margin-bottom: 1rem;
}

.task-form {
  display: flex;
  gap: 0.5rem;
}

.task-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
}

.estimate-input {
  width: 100px;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
}

.add-btn {
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
}

.add-btn:hover {
  background: var(--primary-dark);
}

.tasks-container {
  background: var(--surface);
  padding: 1rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border);
}

.empty-state {
  text-align: center;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.tasks {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  background: var(--background);
}

.task-item.completed {
  background: var(--surface);
  color: var(--text-secondary);
}

.task-item.active {
  border-color: var(--primary-color);
}

.task-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.task-checkbox {
  width: 20px;
  height: 20px;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: var(--background);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.task-checkbox.checked {
  background: var(--primary-color);
  color: white;
}

.task-details {
  flex: 1;
}

.task-title {
  font-size: 1rem;
  font-weight: 600;
}

.task-title.completed {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.task-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.pomodoros-count {
  color: var(--text-secondary);
}

.progress-bar {
  flex: 1;
  height: 5px;
  background: var(--border);
  border-radius: var(--border-radius);
}

.progress-fill {
  height: 100%;
  background: var(--primary-color);
  border-radius: var(--border-radius);
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  border-radius: var(--border-radius);
  background: var(--surface);
  color: var(--text-primary);
  cursor: pointer;
}

.action-btn.active {
  background: var(--primary-color);
  color: white;
}

.action-btn.edit {
  background: var(--background);
}

.action-btn.delete {
  background: var(--background);
}

.action-btn:hover {
  background: var(--primary-light);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: var(--surface);
  padding: 1rem;
  border-radius: var(--border-radius);
  width: 300px;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.cancel-btn {
  background: var(--background);
  color: var(--text-primary);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
}

.save-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
}

@media (max-width: 768px) {
  .timer-modes {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .mode-btn {
    padding: 0.5rem 1rem;
  }
  
  .time {
    font-size: 2.5rem;
  }
  
  .progress-ring {
    width: 250px;
    height: 250px;
  }
  
  .timer-controls {
    flex-direction: column;
    align-items: center;
  }
}
</style>