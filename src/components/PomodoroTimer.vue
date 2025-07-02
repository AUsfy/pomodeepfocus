<template>
  <div class="pomodoro-timer">
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
  </div>
</template>

<script setup>
import { computed } from 'vue'
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

// Timer modes - now dynamic based on settings
const modes = computed(() => [
  { id: 'work', label: 'Pomodoro' },
  { id: 'short', label: 'Short Break' },
  { id: 'long', label: 'Long Break' }
])

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