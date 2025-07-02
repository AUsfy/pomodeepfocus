<template>
  <div class="task-list">
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
import { ref, computed, onMounted } from 'vue'

// Reactive state
const tasks = ref([])
const newTaskTitle = ref('')
const newTaskEstimate = ref(1)
const activeTaskId = ref(null)
const editingTask = ref(null)
const editForm = ref({
  title: '',
  estimatedPomodoros: 1
})

// Computed properties
const totalTasks = computed(() => tasks.value.length)
const completedTasks = computed(() => tasks.value.filter(task => task.completed).length)

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

// Public method to increment pomodoro count (called from timer)
const completePomodoro = () => {
  if (activeTaskId.value) {
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

// Expose method for parent components
defineExpose({
  completePomodoro
})

// Initialize on mount
onMounted(() => {
  loadTasks()
})
</script>

<style scoped>
.task-list {
  max-width: 600px;
  margin: 0 auto;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.task-header h2 {
  color: var(--text-primary);
  font-size: 1.5rem;
  margin: 0;
}

.task-stats {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.add-task {
  margin-bottom: 2rem;
}

.task-form {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.task-input {
  flex: 1;
  min-width: 200px;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  background: var(--surface);
  color: var(--text-primary);
  font-size: 1rem;
}

.task-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.estimate-input {
  width: 120px;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  background: var(--surface);
  color: var(--text-primary);
  font-size: 1rem;
}

.estimate-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.add-btn {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.add-btn:hover {
  background: var(--primary-dark);
}

.tasks-container {
  min-height: 200px;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.tasks {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.task-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: var(--transition);
}

.task-item:hover {
  border-color: var(--primary-color);
  opacity: 0.8;
}

.task-item.active {
  border-color: var(--primary-color);
  background: rgba(217, 85, 80, 0.05);
}

.task-item.completed {
  opacity: 0.6;
}

.task-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.task-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border);
  border-radius: 4px;
  background: var(--surface);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  color: white;
  font-weight: bold;
}

.task-checkbox.checked {
  background: var(--secondary-color);
  border-color: var(--secondary-color);
}

.task-details {
  flex: 1;
}

.task-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.task-title.completed {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.task-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.pomodoros-count {
  font-size: 0.85rem;
  color: var(--text-secondary);
  min-width: 100px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--border);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-primary);
  border-radius: calc(var(--border-radius) - 2px);
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.85rem;
}

.action-btn:hover:not(:disabled) {
  background: var(--background);
}

.action-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.edit:hover {
  background: #ffc107;
  color: white;
  border-color: #ffc107;
}

.action-btn.delete:hover {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--surface);
  border-radius: var(--border-radius);
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  border: 1px solid var(--border);
}

.modal h3 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.cancel-btn, .save-btn {
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
}

.cancel-btn {
  background: var(--surface);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.save-btn {
  background: var(--primary-color);
  color: white;
  border: none;
}

.cancel-btn:hover {
  background: var(--background);
}

.save-btn:hover {
  background: var(--primary-dark);
}

@media (max-width: 768px) {
  .task-form {
    flex-direction: column;
  }
  
  .task-input, .estimate-input {
    min-width: unset;
    width: 100%;
  }
  
  .task-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .task-actions {
    justify-content: center;
  }
}
</style>