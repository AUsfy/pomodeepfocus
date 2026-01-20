# API Documentation

This document describes the key composables and their APIs used throughout the application.

## Composables

### useTimer()

The timer composable manages all timer-related state and operations.

#### State

```javascript
const {
  // Reactive state
  currentMode,        // ref<'work' | 'short' | 'long'> - Current timer mode
  timeLeft,           // ref<number> - Time remaining in seconds
  isRunning,          // ref<boolean> - Timer running state
  completedSessions,  // ref<number> - Total completed pomodoro sessions
  settings,           // reactive<Settings> - Timer settings
  
  // Computed
  currentModeTime,    // computed<number> - Total time for current mode
  progress,           // computed<number> - Progress percentage (0-100)
  
  // Methods
  startTimer,         // () => void - Start the timer
  pauseTimer,         // () => void - Pause the timer
  resetTimer,         // () => void - Reset timer to mode default
  switchMode,         // (mode: string) => void - Switch timer mode
  updateSettings,     // (newSettings: Partial<Settings>) => void - Update timer settings
  skipSession,        // () => void - Skip current session
} = useTimer()
```

#### Settings Object

```javascript
{
  pomodoroMinutes: 25,        // Default work session duration
  shortBreakMinutes: 5,        // Short break duration
  longBreakMinutes: 15,        // Long break duration
  longBreakInterval: 4,        // Sessions before long break
  autoStartBreaks: false,      // Auto-start breaks after work
  autoStartPomodoros: false,   // Auto-start work after breaks
  theme: 'auto',               // Theme preference
  notifications: {
    desktop: true,             // Desktop notifications
    sound: true,               // Sound alerts
    soundType: 'bell',         // Sound type
    volume: 70                 // Volume level (0-100)
  }
}
```

#### Usage Example

```vue
<script setup>
import { useTimer } from '@/composables/useTimer'

const { 
  currentMode, 
  timeLeft, 
  isRunning,
  startTimer,
  pauseTimer,
  resetTimer,
  switchMode
} = useTimer()

// Format time for display
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<template>
  <div>
    <h2>{{ currentMode }}</h2>
    <p>{{ formatTime(timeLeft) }}</p>
    <button @click="isRunning ? pauseTimer() : startTimer()">
      {{ isRunning ? 'Pause' : 'Start' }}
    </button>
    <button @click="resetTimer">Reset</button>
  </div>
</template>
```

---

### useAuth()

The authentication composable manages user authentication and session state.

#### State

```javascript
const {
  // Reactive state
  user,              // ref<User | null> - Current user object
  isAuthenticated,   // computed<boolean> - Authentication status
  isLoading,         // ref<boolean> - Loading state for auth operations
  authError,         // ref<string> - Last authentication error
  
  // Methods
  login,             // (email: string, password: string) => Promise<Result>
  register,          // (userData: UserData) => Promise<Result>
  logout,            // () => Promise<void>
  loadStoredUser,    // () => void - Load user from storage
  updateUser,        // (data: Partial<User>) => Promise<Result>
} = useAuth()
```

#### User Object

```javascript
{
  id: string,
  email: string,
  name: string,
  createdAt: Date,
  settings?: object,    // Synced user settings
  stats?: object        // Synced user statistics
}
```

#### Usage Example

```vue
<script setup>
import { useAuth } from '@/composables/useAuth'

const { 
  user, 
  isAuthenticated, 
  login, 
  logout,
  authError 
} = useAuth()

const handleLogin = async (email, password) => {
  const result = await login(email, password)
  if (result.success) {
    console.log('Logged in successfully')
  } else {
    console.error('Login failed:', result.error)
  }
}
</script>

<template>
  <div v-if="isAuthenticated">
    <p>Welcome, {{ user.name }}</p>
    <button @click="logout">Logout</button>
  </div>
  <div v-else>
    <button @click="handleLogin(email, password)">Login</button>
    <p v-if="authError">{{ authError }}</p>
  </div>
</template>
```

---

### useSEO()

The SEO composable manages page metadata for better search engine optimization.

#### Methods

```javascript
const {
  updateMetaTags,    // (tags: MetaTags) => void - Update page meta tags
  setTitle,          // (title: string) => void - Set page title
  setDescription,    // (description: string) => void - Set meta description
} = useSEO()
```

#### MetaTags Object

```javascript
{
  title?: string,              // Page title
  description?: string,        // Meta description
  keywords?: string[],         // Meta keywords
  ogTitle?: string,           // Open Graph title
  ogDescription?: string,     // Open Graph description
  ogImage?: string,           // Open Graph image URL
  twitterCard?: string        // Twitter card type
}
```

#### Usage Example

```vue
<script setup>
import { onMounted } from 'vue'
import { useSEO } from '@/composables/useSEO'

const { updateMetaTags } = useSEO()

onMounted(() => {
  updateMetaTags({
    title: 'Settings - Pomodoro Timer',
    description: 'Customize your Pomodoro timer settings',
    keywords: ['pomodoro', 'settings', 'timer', 'customization']
  })
})
</script>
```

---

## Component Events

### PomodoroTimer

**Emits:**
- `session-complete` - Fired when a timer session completes
  ```javascript
  { mode: 'work' | 'short' | 'long', duration: number }
  ```

### TaskList

**Props:**
- None

**Emits:**
- `task-added` - Fired when a task is created
  ```javascript
  { id: string, title: string, pomodoros: number }
  ```
- `task-completed` - Fired when a task is marked complete
  ```javascript
  { id: string, completedAt: Date }
  ```
- `task-deleted` - Fired when a task is removed
  ```javascript
  { id: string }
  ```

### Settings

**Props:**
- None

**Emits:**
- `settings-updated` - Fired when settings are saved
  ```javascript
  { settings: Settings }
  ```

---

## Local Storage Keys

The application uses these Local Storage keys:

- `pomodoro-settings` - Timer settings
- `pomodoro-timer-state` - Current timer state
- `pomodoro-tasks` - Task list data
- `pomodoro-theme` - Theme preference ('light' | 'dark')
- `pomo-auth-token` - Authentication token (when logged in)
- `pomo-user` - User data (when logged in)

---

## Utility Functions

### Time Formatting

```javascript
import { formatTime, formatDate } from '@/utils/time'

formatTime(125)  // Returns "2:05"
formatDate(new Date())  // Returns formatted date string
```

### Sound Management

```javascript
import { playSound } from '@/utils/sound'

playSound('bell', 70)  // Plays bell sound at 70% volume
// Available sounds: 'bell', 'digital', 'wood', 'chime'
```

### Notifications

```javascript
import { showNotification } from '@/utils/notifications'

showNotification('Pomodoro Complete!', {
  body: 'Time for a break',
  icon: '/icon.png'
})
```

---

## Best Practices

1. **Always use composables for shared state** - Don't create duplicate state
2. **Handle loading and error states** - Provide user feedback
3. **Clean up on unmount** - Remove event listeners, timers, etc.
4. **Use TypeScript types** - Add proper type definitions (future enhancement)
5. **Follow Vue 3 Composition API patterns** - Use `<script setup>` syntax
