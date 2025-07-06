<template>
  <div class="auth-container">
    <div class="auth-card card-elevated">
      <div class="auth-header">
        <div class="auth-logo">
          <span class="tomato-icon">🍅</span>
          <h1>Pomo</h1>
        </div>
        <p class="auth-subtitle">
          {{ isLogin ? 'Welcome back!' : 'Create your account' }}
        </p>
      </div>

      <!-- Toast Notification -->
      <div v-if="notification.show" class="toast-notification" :class="notification.type">
        <div class="toast-content">
          <span class="toast-icon">{{ getNotificationIcon(notification.type) }}</span>
          <span class="toast-message">{{ notification.message }}</span>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form space-y-4">
        <!-- Name field (only for registration) -->
        <div v-if="!isLogin" class="form-group">
          <label for="name" class="form-label">Full Name</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            class="form-input"
            placeholder="Enter your full name"
            required
          />
        </div>

        <!-- Email field -->
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            class="form-input"
            placeholder="Enter your email"
            required
          />
        </div>

        <!-- Password field -->
        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <div class="password-input-container">
            <input
              id="password"
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="password-toggle"
            >
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
        </div>

        <!-- Confirm Password field (only for registration) -->
        <div v-if="!isLogin" class="form-group">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            class="form-input"
            placeholder="Confirm your password"
            required
          />
        </div>

        <!-- Error message -->
        <div v-if="authError" class="error-message">
          {{ authError }}
        </div>

        <!-- Submit button -->
        <button
          type="submit"
          class="btn btn-primary auth-submit"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="loading-spinner">⏳</span>
          {{ isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account') }}
        </button>
      </form>

      <!-- Switch between login/register -->
      <div class="auth-switch">
        <p class="switch-text">
          {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
          <button @click="toggleMode" class="switch-btn">
            {{ isLogin ? 'Sign up' : 'Sign in' }}
          </button>
        </p>
      </div>

      <!-- Demo account info -->
      <div class="demo-info">
        <div class="demo-card">
          <h4>Demo Account</h4>
          <p>Email: <code>demo@pomo.app</code></p>
          <p>Password: <code>demo123</code></p>
          <button @click="fillDemoCredentials" class="btn btn-secondary demo-btn">
            Use Demo Account
          </button>
        </div>
      </div>

      <!-- Guest mode -->
      <div class="guest-mode">
        <button @click="$emit('continueAsGuest')" class="guest-btn">
          Continue as Guest
        </button>
        <p class="guest-note">
          Your data will be stored locally and won't sync across devices
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAuth } from '../composables/useAuth.js'

// Define emits
const emit = defineEmits(['loginSuccess', 'continueAsGuest'])

// Auth composable
const { login, register, isLoading, authError } = useAuth()

// Component state
const isLogin = ref(true)
const showPassword = ref(false)

// Form data
const formData = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Notification state
const notification = reactive({
  show: false,
  message: '',
  type: 'success'
})

// Helper functions
const showNotification = (message, type = 'success') => {
  notification.message = message
  notification.type = type
  notification.show = true
  
  setTimeout(() => {
    notification.show = false
  }, 3000)
}

const getNotificationIcon = (type) => {
  switch (type) {
    case 'success': return '✅'
    case 'error': return '❌'
    case 'warning': return '⚠️'
    default: return 'ℹ️'
  }
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  // Clear form data when switching modes
  formData.name = ''
  formData.email = ''
  formData.password = ''
  formData.confirmPassword = ''
}

const fillDemoCredentials = () => {
  formData.email = 'demo@pomo.app'
  formData.password = 'demo123'
}

const validateForm = () => {
  if (!isLogin.value) {
    if (!formData.name.trim()) {
      showNotification('Please enter your full name', 'error')
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      showNotification('Passwords do not match', 'error')
      return false
    }
    
    if (formData.password.length < 6) {
      showNotification('Password must be at least 6 characters', 'error')
      return false
    }
  }
  
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    let result
    
    if (isLogin.value) {
      result = await login(formData.email, formData.password)
    } else {
      result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
    }
    
    if (result.success) {
      showNotification(
        isLogin.value ? 'Welcome back!' : 'Account created successfully!',
        'success'
      )
      
      // Emit success event to parent
      setTimeout(() => {
        emit('loginSuccess')
      }, 1000)
    } else {
      showNotification(result.error || 'Authentication failed', 'error')
    }
  } catch (error) {
    showNotification('An unexpected error occurred', 'error')
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, var(--background) 0%, var(--accent-blue-light) 100%);
}

.auth-card {
  width: 100%;
  max-width: 420px;
  padding: var(--spacing-2xl);
  position: relative;
}

.auth-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.auth-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.auth-logo .tomato-icon {
  font-size: 2.5rem;
}

.auth-logo h1 {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--primary-color);
  margin: 0;
}

.auth-subtitle {
  color: var(--text-secondary);
  font-size: var(--font-size-lg);
  margin: 0;
}

.auth-form {
  margin-bottom: var(--spacing-xl);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-label {
  font-weight: 500;
  color: var(--text-primary);
  font-size: var(--font-size-sm);
}

.form-input {
  padding: var(--spacing-md);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--background);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.password-input-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  padding: var(--spacing-xs);
}

.password-toggle:hover {
  color: var(--text-primary);
}

.error-message {
  background: var(--error-color);
  color: white;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  text-align: center;
}

.auth-submit {
  width: 100%;
  padding: var(--spacing-lg);
  font-size: var(--font-size-base);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.auth-switch {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.switch-text {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin: 0;
}

.switch-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  font-weight: 600;
  cursor: pointer;
  font-size: var(--font-size-sm);
  text-decoration: underline;
  margin-left: var(--spacing-xs);
}

.switch-btn:hover {
  color: var(--primary-dark);
}

.demo-info {
  margin-bottom: var(--spacing-xl);
}

.demo-card {
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  text-align: center;
}

.demo-card h4 {
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-base);
}

.demo-card p {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin: var(--spacing-xs) 0;
}

.demo-card code {
  background: var(--background);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  color: var(--primary-color);
}

.demo-btn {
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-lg);
}

.guest-mode {
  text-align: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border);
}

.guest-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-md);
}

.guest-btn:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
}

.guest-note {
  color: var(--text-muted);
  font-size: var(--font-size-xs);
  margin: 0;
}

/* Toast Notification */
.toast-notification {
  position: absolute;
  top: var(--spacing-lg);
  left: var(--spacing-lg);
  right: var(--spacing-lg);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  animation: slideDown 0.3s ease-out;
  z-index: 10;
}

.toast-notification.success {
  background: var(--success-color);
  color: white;
}

.toast-notification.error {
  background: var(--error-color);
  color: white;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.toast-icon {
  font-size: var(--font-size-base);
}

.toast-message {
  font-size: var(--font-size-sm);
  font-weight: 500;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .auth-container {
    padding: var(--spacing-md);
  }
  
  .auth-card {
    padding: var(--spacing-xl);
  }
  
  .auth-logo h1 {
    font-size: var(--font-size-2xl);
  }
  
  .demo-card {
    padding: var(--spacing-md);
  }
}
</style>