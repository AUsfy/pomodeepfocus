<template>
  <div class="task-templates">
    <div class="templates-header">
      <h2>Task Templates</h2>
      <p class="templates-description">
        Quick start templates for common tasks and workflows
      </p>
    </div>

    <!-- Template Categories -->
    <div class="template-categories">
      <button
        v-for="category in categories"
        :key="category.id"
        @click="selectedCategory = category.id"
        class="category-btn"
        :class="{ active: selectedCategory === category.id }"
      >
        <span class="category-icon">{{ category.icon }}</span>
        <span class="category-name">{{ category.name }}</span>
      </button>
    </div>

    <!-- Templates Grid -->
    <div class="templates-grid">
      <div
        v-for="template in filteredTemplates"
        :key="template.id"
        class="template-card"
        @click="useTemplate(template)"
      >
        <div class="template-header">
          <span class="template-icon">{{ template.icon }}</span>
          <h3 class="template-title">{{ template.title }}</h3>
        </div>
        
        <p class="template-description">{{ template.description }}</p>
        
        <div class="template-stats">
          <div class="stat">
            <span class="stat-icon">🍅</span>
            <span class="stat-value">{{ template.estimatedPomodoros }}</span>
          </div>
          <div class="stat">
            <span class="stat-icon">⏱️</span>
            <span class="stat-value">{{ template.duration }}</span>
          </div>
        </div>
        
        <div class="template-tags">
          <span
            v-for="tag in template.tags"
            :key="tag"
            class="template-tag"
          >
            {{ tag }}
          </span>
        </div>
        
        <button class="use-template-btn">
          Use Template
        </button>
      </div>
    </div>

    <!-- Custom Template Creation -->
    <div class="create-template-section">
      <button
        @click="showCreateForm = !showCreateForm"
        class="create-template-btn"
      >
        <span class="btn-icon">+</span>
        Create Custom Template
      </button>

      <div v-if="showCreateForm" class="create-template-form">
        <h3>Create New Template</h3>
        <form @submit.prevent="createCustomTemplate">
          <div class="form-row">
            <input
              v-model="newTemplate.title"
              type="text"
              placeholder="Template title"
              class="form-input"
              required
            />
            <select v-model="newTemplate.category" class="form-select">
              <option value="">Select category</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <textarea
            v-model="newTemplate.description"
            placeholder="Template description"
            class="form-textarea"
            rows="3"
          ></textarea>
          
          <div class="form-row">
            <input
              v-model="newTemplate.icon"
              type="text"
              placeholder="Icon (emoji)"
              class="form-input icon-input"
              maxlength="2"
            />
            <input
              v-model.number="newTemplate.estimatedPomodoros"
              type="number"
              placeholder="Estimated pomodoros"
              class="form-input"
              min="1"
              max="20"
            />
          </div>
          
          <input
            v-model="newTemplate.tags"
            type="text"
            placeholder="Tags (comma separated)"
            class="form-input"
          />
          
          <div class="form-actions">
            <button type="button" @click="cancelCreate" class="cancel-btn">
              Cancel
            </button>
            <button type="submit" class="save-btn">
              Save Template
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Notification -->
    <div v-if="notification.show" class="notification" :class="notification.type">
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Props
const emit = defineEmits(['addTask'])

// State
const selectedCategory = ref('all')
const showCreateForm = ref(false)
const notification = ref({
  show: false,
  type: 'success',
  message: ''
})

const newTemplate = ref({
  title: '',
  description: '',
  category: '',
  icon: '📝',
  estimatedPomodoros: 4,
  tags: ''
})

// Template categories
const categories = ref([
  { id: 'all', name: 'All Templates', icon: '📋' },
  { id: 'work', name: 'Work', icon: '💼' },
  { id: 'study', name: 'Study', icon: '📚' },
  { id: 'creative', name: 'Creative', icon: '🎨' },
  { id: 'fitness', name: 'Fitness', icon: '🏃' },
  { id: 'personal', name: 'Personal', icon: '🏠' },
  { id: 'coding', name: 'Development', icon: '💻' }
])

// Pre-built templates
const defaultTemplates = ref([
  {
    id: 1,
    title: 'Deep Work Session',
    description: 'Focused work on important projects without interruptions',
    category: 'work',
    icon: '🎯',
    estimatedPomodoros: 6,
    duration: '3 hours',
    tags: ['focus', 'productivity', 'deep-work']
  },
  {
    id: 2,
    title: 'Code Review',
    description: 'Review pull requests and provide feedback',
    category: 'coding',
    icon: '🔍',
    estimatedPomodoros: 3,
    duration: '1.5 hours',
    tags: ['review', 'coding', 'collaboration']
  },
  {
    id: 3,
    title: 'Study Session',
    description: 'Focused learning with note-taking and practice',
    category: 'study',
    icon: '📖',
    estimatedPomodoros: 8,
    duration: '4 hours',
    tags: ['learning', 'notes', 'practice']
  },
  {
    id: 4,
    title: 'Creative Writing',
    description: 'Writing session for blog posts, articles, or stories',
    category: 'creative',
    icon: '✍️',
    estimatedPomodoros: 4,
    duration: '2 hours',
    tags: ['writing', 'creativity', 'content']
  },
  {
    id: 5,
    title: 'Email Processing',
    description: 'Clear inbox and respond to important emails',
    category: 'work',
    icon: '📧',
    estimatedPomodoros: 2,
    duration: '1 hour',
    tags: ['email', 'communication', 'admin']
  },
  {
    id: 6,
    title: 'Bug Fixing Sprint',
    description: 'Identify and fix bugs in the codebase',
    category: 'coding',
    icon: '🐛',
    estimatedPomodoros: 5,
    duration: '2.5 hours',
    tags: ['debugging', 'testing', 'fixes']
  },
  {
    id: 7,
    title: 'Design Mockups',
    description: 'Create wireframes and visual designs',
    category: 'creative',
    icon: '🎨',
    estimatedPomodoros: 6,
    duration: '3 hours',
    tags: ['design', 'mockup', 'ui-ux']
  },
  {
    id: 8,
    title: 'Meeting Preparation',
    description: 'Prepare agenda and materials for upcoming meetings',
    category: 'work',
    icon: '📝',
    estimatedPomodoros: 2,
    duration: '1 hour',
    tags: ['meetings', 'preparation', 'planning']
  },
  {
    id: 9,
    title: 'Workout Session',
    description: 'Structured exercise routine with rest periods',
    category: 'fitness',
    icon: '💪',
    estimatedPomodoros: 3,
    duration: '1.5 hours',
    tags: ['exercise', 'health', 'fitness']
  },
  {
    id: 10,
    title: 'Research Project',
    description: 'In-depth research on a specific topic',
    category: 'study',
    icon: '🔬',
    estimatedPomodoros: 8,
    duration: '4 hours',
    tags: ['research', 'analysis', 'investigation']
  },
  {
    id: 11,
    title: 'Social Media Content',
    description: 'Create and schedule social media posts',
    category: 'creative',
    icon: '📱',
    estimatedPomodoros: 3,
    duration: '1.5 hours',
    tags: ['social-media', 'content', 'marketing']
  },
  {
    id: 12,
    title: 'Home Organization',
    description: 'Declutter and organize living space',
    category: 'personal',
    icon: '🧹',
    estimatedPomodoros: 4,
    duration: '2 hours',
    tags: ['organization', 'cleaning', 'home']
  }
])

// Custom templates from localStorage
const customTemplates = ref([])

// Computed properties
const filteredTemplates = computed(() => {
  const allTemplates = [...defaultTemplates.value, ...customTemplates.value]
  
  if (selectedCategory.value === 'all') {
    return allTemplates
  }
  
  return allTemplates.filter(template => template.category === selectedCategory.value)
})

// Methods
const useTemplate = (template) => {
  emit('addTask', {
    title: template.title,
    estimatedPomodoros: template.estimatedPomodoros,
    description: template.description,
    tags: template.tags
  })
  
  showNotification('success', `Template "${template.title}" added to your tasks!`)
}

const createCustomTemplate = () => {
  if (!newTemplate.value.title || !newTemplate.value.category) {
    showNotification('error', 'Please fill in all required fields')
    return
  }
  
  const template = {
    id: Date.now(),
    title: newTemplate.value.title,
    description: newTemplate.value.description,
    category: newTemplate.value.category,
    icon: newTemplate.value.icon || '📝',
    estimatedPomodoros: newTemplate.value.estimatedPomodoros,
    duration: `${Math.round(newTemplate.value.estimatedPomodoros * 25 / 60 * 10) / 10} hours`,
    tags: newTemplate.value.tags.split(',').map(tag => tag.trim()).filter(Boolean)
  }
  
  customTemplates.value.push(template)
  saveCustomTemplates()
  
  showNotification('success', 'Custom template created successfully!')
  resetForm()
}

const cancelCreate = () => {
  showCreateForm.value = false
  resetForm()
}

const resetForm = () => {
  newTemplate.value = {
    title: '',
    description: '',
    category: '',
    icon: '📝',
    estimatedPomodoros: 4,
    tags: ''
  }
  showCreateForm.value = false
}

const showNotification = (type, message) => {
  notification.value = { show: true, type, message }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

const saveCustomTemplates = () => {
  try {
    localStorage.setItem('pomodoro-custom-templates', JSON.stringify(customTemplates.value))
  } catch (error) {
    console.error('Failed to save custom templates:', error)
  }
}

const loadCustomTemplates = () => {
  try {
    const saved = localStorage.getItem('pomodoro-custom-templates')
    if (saved) {
      customTemplates.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Failed to load custom templates:', error)
  }
}

// Initialize
onMounted(() => {
  loadCustomTemplates()
})
</script>

<style scoped>
.task-templates {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: var(--color-text);
}

.templates-header {
  text-align: center;
  margin-bottom: 2rem;
}

.templates-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--color-primary);
}

.templates-description {
  font-size: 1.1rem;
  color: var(--color-text-muted);
}

/* Categories */
.template-categories {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.category-btn:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.category-btn.active {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: white;
}

.category-icon {
  font-size: 1.2rem;
}

/* Templates Grid */
.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.template-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.template-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary);
}

.template-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.template-icon {
  font-size: 2rem;
}

.template-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.template-description {
  color: var(--color-text-muted);
  line-height: 1.5;
  margin-bottom: 1rem;
}

.template-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.stat-icon {
  font-size: 1rem;
}

.template-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.template-tag {
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.use-template-btn {
  width: 100%;
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.use-template-btn:hover {
  background: var(--color-accent);
}

/* Create Template Section */
.create-template-section {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.create-template-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.create-template-btn:hover {
  background: var(--color-accent);
}

.btn-icon {
  font-size: 1.2rem;
  font-weight: 700;
}

.create-template-form {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.create-template-form h3 {
  margin-bottom: 1rem;
  color: var(--color-text);
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 1rem;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.icon-input {
  max-width: 80px;
  text-align: center;
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.cancel-btn,
.save-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.cancel-btn {
  background: var(--color-bg-tertiary);
  color: var(--color-text-muted);
}

.cancel-btn:hover {
  background: var(--color-border);
}

.save-btn {
  background: var(--color-primary);
  color: white;
}

.save-btn:hover {
  background: var(--color-accent);
}

/* Notification */
.notification {
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.notification.success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.notification.error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .task-templates {
    padding: 1rem;
  }
  
  .templates-header h2 {
    font-size: 2rem;
  }
  
  .template-categories {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .category-btn {
    flex-shrink: 0;
  }
  
  .templates-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    flex-direction: column;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .cancel-btn,
  .save-btn {
    width: 100%;
  }
}
</style>
