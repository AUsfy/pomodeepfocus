import { ref, reactive, computed, watch } from 'vue'

// User state
const user = ref(null)
const isAuthenticated = computed(() => !!user.value)
const isLoading = ref(false)
const authError = ref('')

// Mock API base URL (replace with your actual backend)
const API_BASE = 'https://api.yourpomodoroapp.com'

// Authentication functions
export function useAuth() {
  
  // Login function
  const login = async (email, password) => {
    isLoading.value = true
    authError.value = ''
    
    try {
      // Mock API call - replace with your actual authentication endpoint
      const response = await mockLogin(email, password)
      
      if (response.success) {
        user.value = response.user
        localStorage.setItem('pomo-auth-token', response.token)
        localStorage.setItem('pomo-user', JSON.stringify(response.user))
        return { success: true }
      } else {
        authError.value = response.message
        return { success: false, error: response.message }
      }
    } catch (error) {
      authError.value = 'Login failed. Please try again.'
      return { success: false, error: 'Login failed. Please try again.' }
    } finally {
      isLoading.value = false
    }
  }

  // Register function
  const register = async (userData) => {
    isLoading.value = true
    authError.value = ''
    
    try {
      // Mock API call - replace with your actual registration endpoint
      const response = await mockRegister(userData)
      
      if (response.success) {
        user.value = response.user
        localStorage.setItem('pomo-auth-token', response.token)
        localStorage.setItem('pomo-user', JSON.stringify(response.user))
        return { success: true }
      } else {
        authError.value = response.message
        return { success: false, error: response.message }
      }
    } catch (error) {
      authError.value = 'Registration failed. Please try again.'
      return { success: false, error: 'Registration failed. Please try again.' }
    } finally {
      isLoading.value = false
    }
  }

  // Logout function
  const logout = async () => {
    try {
      // Optional: Call logout endpoint to invalidate token on server
      // await fetch(`${API_BASE}/auth/logout`, { ... })
      
      user.value = null
      localStorage.removeItem('pomo-auth-token')
      localStorage.removeItem('pomo-user')
      authError.value = ''
      
      // Clear all user data from localStorage
      localStorage.removeItem('pomodoro-settings')
      localStorage.removeItem('pomodoro-tasks')
      localStorage.removeItem('pomodoro-history')
      localStorage.removeItem('pomodoro-active-task')
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Logout failed' }
    }
  }

  // Load user from localStorage on app start
  const loadStoredUser = () => {
    try {
      const storedUser = localStorage.getItem('pomo-user')
      const token = localStorage.getItem('pomo-auth-token')
      
      if (storedUser && token) {
        user.value = JSON.parse(storedUser)
      }
    } catch (error) {
      console.error('Failed to load stored user:', error)
      // Clear invalid data
      localStorage.removeItem('pomo-user')
      localStorage.removeItem('pomo-auth-token')
    }
  }

  // Sync user data to server
  const syncData = async (data) => {
    if (!isAuthenticated.value) return { success: false, error: 'Not authenticated' }
    
    try {
      const token = localStorage.getItem('pomo-auth-token')
      const response = await fetch(`${API_BASE}/user/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        return { success: true }
      } else {
        return { success: false, error: 'Sync failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error during sync' }
    }
  }

  // Load user data from server
  const loadUserData = async () => {
    if (!isAuthenticated.value) return { success: false, error: 'Not authenticated' }
    
    try {
      const token = localStorage.getItem('pomo-auth-token')
      const response = await fetch(`${API_BASE}/user/data`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Store data locally
        if (data.settings) {
          localStorage.setItem('pomodoro-settings', JSON.stringify(data.settings))
        }
        if (data.tasks) {
          localStorage.setItem('pomodoro-tasks', JSON.stringify(data.tasks))
        }
        if (data.history) {
          localStorage.setItem('pomodoro-history', JSON.stringify(data.history))
        }
        
        return { success: true, data }
      } else {
        return { success: false, error: 'Failed to load user data' }
      }
    } catch (error) {
      return { success: false, error: 'Network error loading data' }
    }
  }

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    authError,
    
    // Actions
    login,
    register,
    logout,
    loadStoredUser,
    syncData,
    loadUserData
  }
}

// Mock authentication functions (replace with real API calls)
async function mockLogin(email, password) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock validation
  if (email === 'demo@pomo.app' && password === 'demo123') {
    return {
      success: true,
      user: {
        id: 1,
        name: 'Demo User',
        email: 'demo@pomo.app',
        avatar: null,
        createdAt: new Date().toISOString()
      },
      token: 'mock-jwt-token-' + Date.now()
    }
  } else {
    return {
      success: false,
      message: 'Invalid email or password'
    }
  }
}

async function mockRegister(userData) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200))
  
  // Mock validation
  if (userData.email && userData.password && userData.name) {
    return {
      success: true,
      user: {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        avatar: null,
        createdAt: new Date().toISOString()
      },
      token: 'mock-jwt-token-' + Date.now()
    }
  } else {
    return {
      success: false,
      message: 'Please fill in all required fields'
    }
  }
}