<template>
  <div class="insights">
    <div class="insights-header">
      <h2>📊 Insights</h2>
      <div class="insights-summary">
        <div class="stat-card">
          <div class="stat-number">{{ todayPomodoros }}</div>
          <div class="stat-label">Today</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ weekPomodoros }}</div>
          <div class="stat-label">This Week</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ totalPomodoros }}</div>
          <div class="stat-label">All Time</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ averageDaily }}</div>
          <div class="stat-label">Daily Average</div>
        </div>
      </div>
    </div>

    <div class="insights-content">
      <!-- Daily Chart Section -->
      <div class="chart-section">
        <h3>Daily Progress</h3>
        <div class="chart-container">
          <div class="chart-bars">
            <div 
              v-for="day in last7Days" 
              :key="day.date"
              class="chart-bar-container"
            >
              <div class="chart-count">{{ day.pomodoros }}</div>
              <div 
                class="chart-bar"
                :style="{ 
                  height: getBarHeight(day.pomodoros) + '%',
                  top: (100 - getBarHeight(day.pomodoros)) + '%'
                }"
                :title="`${day.pomodoros} pomodoros on ${formatDate(day.date)}`"
              ></div>
              <div class="chart-label">{{ getDayLabel(day.date) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="activity-section">
        <h3>Recent Activity</h3>
        <div class="activity-list">
          <div v-if="recentDays.length === 0" class="empty-state">
            <div class="empty-icon">📈</div>
            <p>Start completing pomodoros to see your insights!</p>
          </div>
          <div 
            v-else
            v-for="day in recentDays" 
            :key="day.date"
            class="activity-item"
          >
            <div class="activity-date">
              <div class="activity-day">{{ formatDateFull(day.date) }}</div>
              <div class="activity-weekday">{{ getWeekday(day.date) }}</div>
            </div>
            <div class="activity-stats">
              <div class="activity-pomodoros">
                <span class="pomodoro-count">{{ day.pomodoros }}</span>
                <span class="pomodoro-label">{{ day.pomodoros === 1 ? 'pomodoro' : 'pomodoros' }}</span>
              </div>
              <div class="activity-time">
                {{ formatWorkTime(day.pomodoros) }}
              </div>
            </div>
            <div class="activity-progress">
              <div class="progress-dots">
                <div 
                  v-for="i in Math.max(day.pomodoros, 1)" 
                  :key="i"
                  class="progress-dot"
                  :class="{ filled: i <= day.pomodoros }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Best Streaks -->
      <div class="streaks-section" v-if="bestStreak > 0">
        <h3>Achievements</h3>
        <div class="achievement-cards">
          <div class="achievement-card">
            <div class="achievement-icon">🔥</div>
            <div class="achievement-info">
              <div class="achievement-title">Best Streak</div>
              <div class="achievement-value">{{ bestStreak }} days</div>
            </div>
          </div>
          <div class="achievement-card">
            <div class="achievement-icon">⭐</div>
            <div class="achievement-info">
              <div class="achievement-title">Most Productive Day</div>
              <div class="achievement-value">{{ maxDayPomodoros }} pomodoros</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// State
const pomodoroHistory = ref({})

// Load pomodoro history from localStorage
const loadHistory = () => {
  try {
    const saved = localStorage.getItem('pomodoro-history')
    if (saved) {
      pomodoroHistory.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Failed to load pomodoro history:', error)
  }
}

// Save pomodoro history to localStorage
const saveHistory = () => {
  try {
    localStorage.setItem('pomodoro-history', JSON.stringify(pomodoroHistory.value))
  } catch (error) {
    console.error('Failed to save pomodoro history:', error)
  }
}

// Add a completed pomodoro to today's count
const addPomodoroToday = () => {
  const today = getTodayKey()
  pomodoroHistory.value[today] = (pomodoroHistory.value[today] || 0) + 1
  saveHistory()
}

// Get today's date key (YYYY-MM-DD)
const getTodayKey = () => {
  return new Date().toISOString().split('T')[0]
}

// Get date key for any date
const getDateKey = (date) => {
  return date.toISOString().split('T')[0]
}

// Computed properties
const todayPomodoros = computed(() => {
  return pomodoroHistory.value[getTodayKey()] || 0
})

const weekPomodoros = computed(() => {
  const today = new Date()
  let total = 0
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const key = getDateKey(date)
    total += pomodoroHistory.value[key] || 0
  }
  
  return total
})

const totalPomodoros = computed(() => {
  return Object.values(pomodoroHistory.value).reduce((sum, count) => sum + count, 0)
})

const averageDaily = computed(() => {
  const days = Object.keys(pomodoroHistory.value).length
  if (days === 0) return 0
  return Math.round((totalPomodoros.value / days) * 10) / 10
})

const last7Days = computed(() => {
  const days = []
  const today = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const key = getDateKey(date)
    
    days.push({
      date: key,
      pomodoros: pomodoroHistory.value[key] || 0
    })
  }
  
  return days
})

const recentDays = computed(() => {
  const days = Object.entries(pomodoroHistory.value)
    .map(([date, pomodoros]) => ({ date, pomodoros }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10)
  
  return days
})

const bestStreak = computed(() => {
  const sortedDates = Object.keys(pomodoroHistory.value).sort()
  if (sortedDates.length === 0) return 0
  
  let maxStreak = 0
  let currentStreak = 0
  
  for (let i = 0; i < sortedDates.length; i++) {
    const date = sortedDates[i]
    const pomodoros = pomodoroHistory.value[date]
    
    if (pomodoros > 0) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  }
  
  return maxStreak
})

const maxDayPomodoros = computed(() => {
  return Math.max(...Object.values(pomodoroHistory.value), 0)
})

// Helper functions
const getBarHeight = (pomodoros) => {
  const max = Math.max(...last7Days.value.map(d => d.pomodoros), 1)
  const percentage = (pomodoros / max) * 100
  // Ensure minimum height of 8% for zero values to show baseline
  return Math.max(percentage, 8)
}

const getDayLabel = (dateStr) => {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  
  if (getDateKey(date) === getDateKey(today)) return 'Today'
  if (getDateKey(date) === getDateKey(yesterday)) return 'Yesterday'
  
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString()
}

const formatDateFull = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

const getWeekday = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' })
}

const formatWorkTime = (pomodoros) => {
  const minutes = pomodoros * 25
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`
  }
  return `${remainingMinutes}m`
}

// Expose method to add pomodoros (called from parent)
defineExpose({
  addPomodoroToday
})

// Initialize
onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.insights {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.insights-header {
  margin-bottom: 2rem;
}

.insights-header h2 {
  color: var(--text-primary);
  font-size: 1.8rem;
  margin-bottom: 1rem;
  text-align: center;
}

.insights-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  padding: 1.5rem 1rem;
  text-align: center;
  transition: var(--transition);
}

.stat-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.insights-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.chart-section,
.activity-section,
.streaks-section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  padding: 1.5rem;
}

.chart-section h3,
.activity-section h3,
.streaks-section h3 {
  color: var(--text-primary);
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.chart-container {
  height: 200px;
  padding: 1rem 0;
  position: relative;
}

.chart-bars {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  height: 150px;
  gap: 0.5rem;
}

.chart-bar-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  position: relative;
}

.chart-bar {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  width: 100%;
  max-width: 40px;
  border-radius: 4px;
  min-height: 4px;
  transition: var(--transition);
  cursor: pointer;
  position: absolute;
  box-shadow: var(--shadow-sm);
}

.chart-bar:hover {
  background: linear-gradient(135deg, var(--primary-dark), var(--primary-color));
  transform: scale(1.05);
}

.chart-count {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  position: absolute;
  top: -1.5rem;
  z-index: 1;
}

.chart-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  position: absolute;
  bottom: -1.5rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.activity-item:hover {
  border-color: var(--primary-color);
}

.activity-date {
  min-width: 120px;
}

.activity-day {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.activity-weekday {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.activity-stats {
  flex: 1;
}

.activity-pomodoros {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.pomodoro-count {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary-color);
}

.pomodoro-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.activity-time {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.progress-dots {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  max-width: 100px;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border);
}

.progress-dot.filled {
  background: var(--primary-color);
}

.achievement-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.achievement-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
}

.achievement-icon {
  font-size: 2rem;
}

.achievement-info {
  flex: 1;
}

.achievement-title {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.achievement-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .insights-summary {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-card {
    padding: 1rem 0.5rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .activity-item {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .activity-date {
    min-width: unset;
    text-align: center;
  }
  
  .achievement-cards {
    grid-template-columns: 1fr;
  }
}
</style>