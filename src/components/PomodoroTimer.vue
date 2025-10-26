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

    <!-- Help & Guide Section -->
    <div class="help-guide-section">
      <div class="help-container">
        <!-- Method Explanation Section -->
        <div class="method-explanation">
          <h2 class="method-title">What is Pomo?</h2>
          <p class="method-description">
            Pomo is a free, modern Pomodoro timer designed to help you maximize productivity and maintain focus. 
            Based on the proven <a href="https://en.wikipedia.org/wiki/Pomodoro_Technique" target="_blank" rel="noopener noreferrer" class="technique-link">Pomodoro Technique</a> developed by Francesco Cirillo, our app breaks your work into 
            manageable 25-minute focused sessions followed by refreshing breaks.
          </p>
          <p class="method-description-extended">
            Whether you're a student preparing for exams, a professional managing projects, or a creative pursuing your passion, 
            Pomo empowers you to overcome procrastination and achieve deep work states. Our scientifically-backed approach combines 
            time-blocking with strategic breaks to optimize your cognitive performance, reduce stress, and maintain productivity 
            throughout your day. With features like task tracking, basic analytics, and customizable settings, Pomo transforms 
            the way you work and helps you accomplish more with less effort.
          </p>
          <div class="key-features">
            <h4 class="features-title">Key Features:</h4>
            <ul class="features-list">
              <li><strong>Smart Timer:</strong> Customizable work and break intervals (15-60 minutes)</li>
              <li><strong>Task Management:</strong> Organize, track, and estimate time for your projects</li>
              <li><strong>Basic Analytics:</strong> Track your daily progress and completed sessions</li>
              <li><strong>Focus Sessions:</strong> Distraction-free environment with visual progress indicators</li>
              <li><strong>Local Storage:</strong> Your data is saved securely in your browser</li>
              <li><strong>No Registration Required:</strong> Start using immediately without creating an account</li>
            </ul>
          </div>
        </div>

        <h2 class="help-title">How to Get Started</h2>
        <p class="help-description">
          Master the Pomodoro Technique with our complete guide. Learn everything you need to boost your productivity and maintain focus.
        </p>

        <div class="quick-start-grid">
          <div class="quick-start-card">
            <div class="card-icon">🚀</div>
            <h3>Quick Start</h3>
            <ol class="quick-steps">
              <li>Add a task (optional)</li>
              <li>Click "Start Focus"</li>
              <li>Work for 25 minutes</li>
              <li>Take a 5-minute break</li>
              <li>Repeat for maximum productivity</li>
            </ol>
          </div>

          <div class="quick-start-card">
            <div class="card-icon">⚙️</div>
            <h3>Customize Settings</h3>
            <ul class="feature-highlights">
              <li><strong>Timer Duration:</strong> 15-60 minutes</li>
              <li><strong>Break Length:</strong> 3-15 minutes</li>
              <li><strong>Auto-start:</strong> Seamless sessions</li>
              <li><strong>Notifications:</strong> Sound alerts</li>
              <li><strong>Dark Mode:</strong> Easy on the eyes</li>
            </ul>
          </div>

          <div class="quick-start-card">
            <div class="card-icon">📊</div>
            <h3>Track Progress</h3>
            <ul class="feature-highlights">
              <li><strong>Daily Stats:</strong> Sessions completed</li>
              <li><strong>Task Tracking:</strong> Time per project</li>
              <li><strong>Progress History:</strong> View past activity</li>
              <li><strong>Focus Time:</strong> Total work hours</li>
              <li><strong>Session Counter:</strong> Track your streaks</li>
            </ul>
          </div>
        </div>

        <div class="help-content-sections">
          <div class="help-section">
            <h3 class="section-title">Why the Pomodoro Technique Works</h3>
            <div class="benefits-grid">
              <div class="benefit-item">
                <span class="benefit-icon">🧠</span>
                <div class="benefit-content">
                  <h4>Improved Focus</h4>
                  <p>Short bursts of concentrated work help maintain attention and reduce distractions.</p>
                </div>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">⚡</span>
                <div class="benefit-content">
                  <h4>Reduced Burnout</h4>
                  <p>Regular breaks prevent mental fatigue and keep your energy levels sustained.</p>
                </div>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">📈</span>
                <div class="benefit-content">
                  <h4>Better Productivity</h4>
                  <p>Time-boxing creates urgency and helps you accomplish more in less time.</p>
                </div>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">🎯</span>
                <div class="benefit-content">
                  <h4>Clear Goals</h4>
                  <p>Breaking work into focused sessions makes large tasks feel more manageable.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Benefits Section for SEO -->
          <div class="help-section">
            <h3 class="section-title">Unlock Your Potential: Benefits of Using Pomo</h3>
            <div class="comprehensive-benefits">
              <div class="benefit-category">
                <h4 class="category-title">🎯 Focus & Concentration</h4>
                <div class="benefit-details">
                  <div class="benefit-point">
                    <strong>Enhanced Deep Work:</strong> Achieve flow states faster and maintain concentration for extended periods without mental fatigue.
                  </div>
                  <div class="benefit-point">
                    <strong>Distraction Management:</strong> Train your brain to resist interruptions and maintain laser-sharp focus on your priorities.
                  </div>
                  <div class="benefit-point">
                    <strong>Attention Span Improvement:</strong> Gradually increase your ability to concentrate through consistent practice and structured work sessions.
                  </div>
                </div>
              </div>

              <div class="benefit-category">
                <h4 class="category-title">⚡ Productivity & Efficiency</h4>
                <div class="benefit-details">
                  <div class="benefit-point">
                    <strong>40% Productivity Boost:</strong> Research shows users complete tasks faster and with higher quality when using the Pomodoro Technique.
                  </div>
                  <div class="benefit-point">
                    <strong>Time Awareness:</strong> Develop better estimation skills and understand how long tasks actually take to complete.
                  </div>
                  <div class="benefit-point">
                    <strong>Deadline Management:</strong> Break large projects into manageable chunks and meet deadlines with confidence.
                  </div>
                </div>
              </div>

              <div class="benefit-category">
                <h4 class="category-title">🧘 Mental Health & Wellbeing</h4>
                <div class="benefit-details">
                  <div class="benefit-point">
                    <strong>Stress Reduction:</strong> Regular breaks prevent overwhelm and maintain healthy stress levels throughout your workday.
                  </div>
                  <div class="benefit-point">
                    <strong>Burnout Prevention:</strong> Sustainable work rhythms protect against mental exhaustion and maintain long-term productivity.
                  </div>
                  <div class="benefit-point">
                    <strong>Work-Life Balance:</strong> Clear boundaries between work and rest help you disconnect and recharge effectively.
                  </div>
                </div>
              </div>

              <div class="benefit-category">
                <h4 class="category-title">📈 Learning & Development</h4>
                <div class="benefit-details">
                  <div class="benefit-point">
                    <strong>Improved Retention:</strong> Spaced learning sessions enhance memory consolidation and long-term information retention.
                  </div>
                  <div class="benefit-point">
                    <strong>Skill Building:</strong> Consistent practice sessions accelerate skill development and expertise acquisition.
                  </div>
                  <div class="benefit-point">
                    <strong>Creative Problem Solving:</strong> Break periods allow subconscious processing, leading to breakthrough insights and solutions.
                  </div>
                </div>
              </div>

              <div class="benefit-category">
                <h4 class="category-title">🏢 Professional Benefits</h4>
                <div class="benefit-details">
                  <div class="benefit-point">
                    <strong>Remote Work Excellence:</strong> Structure your home office environment for maximum productivity and professional success.
                  </div>
                  <div class="benefit-point">
                    <strong>Meeting Efficiency:</strong> Use focused time blocks for preparation and follow-up to make meetings more productive.
                  </div>
                  <div class="benefit-point">
                    <strong>Client Deliverables:</strong> Track time accurately for billing purposes and deliver high-quality work consistently.
                  </div>
                </div>
              </div>

              <div class="benefit-category">
                <h4 class="category-title">🎓 Academic Success</h4>
                <div class="benefit-details">
                  <div class="benefit-point">
                    <strong>Study Optimization:</strong> Transform long, overwhelming study sessions into manageable, effective learning periods.
                  </div>
                  <div class="benefit-point">
                    <strong>Exam Preparation:</strong> Build confidence through structured review sessions and consistent progress tracking.
                  </div>
                  <div class="benefit-point">
                    <strong>Research Efficiency:</strong> Maintain focus during literature reviews, data analysis, and academic writing projects.
                  </div>
                </div>
              </div>
            </div>

            <div class="success-stats">
              <h4 class="stats-title">Why Users Love Pomo:</h4>
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="stat-number">25min</span>
                  <span class="stat-label">Optimal Focus Time</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">5min</span>
                  <span class="stat-label">Perfect Break Length</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">Free</span>
                  <span class="stat-label">No Cost Ever</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">1986</span>
                  <span class="stat-label">Technique Developed</span>
                </div>
              </div>
            </div>
          </div>

          <div class="help-section">
            <h3 class="section-title">Advanced Tips for Success</h3>
            <div class="tips-container">
              <div class="tip-card">
                <h4>🎯 Plan Your Day</h4>
                <p>Start each day by listing your tasks and estimating how many pomodoros each will take. This helps you set realistic goals and track progress.</p>
              </div>
              <div class="tip-card">
                <h4>🔕 Eliminate Distractions</h4>
                <p>During focus sessions, put your phone in airplane mode, close unnecessary browser tabs, and let others know you're in a focused work period.</p>
              </div>
              <div class="tip-card">
                <h4>🏃‍♂️ Use Breaks Wisely</h4>
                <p>Stand up, stretch, hydrate, or do light exercises. Avoid activities that might extend your break time or reduce your next session's focus.</p>
              </div>
              <div class="tip-card">
                <h4>📊 Review Your Data</h4>
                <p>Check your insights regularly to track your daily progress, review your completed sessions, and stay motivated with your productivity journey.</p>
              </div>
            </div>
          </div>

          <div class="help-section">
            <h3 class="section-title">Frequently Asked Questions</h3>
            <div class="faq-container">
              <details class="faq-item">
                <summary class="faq-question">What if I get interrupted during a pomodoro?</summary>
                <div class="faq-answer">
                  <p>If the interruption is urgent, you can pause the timer and resume later. For non-urgent interruptions, note them down and address them during your break. The key is to minimize interruptions and protect your focus time.</p>
                </div>
              </details>
              <details class="faq-item">
                <summary class="faq-question">Can I adjust the 25-minute sessions?</summary>
                <div class="faq-answer">
                  <p>Absolutely! While 25 minutes is the traditional length, you can customize timer durations in Settings. Some people prefer 45-minute sessions, while others work better with 15-minute intervals. Find what works for you.</p>
                </div>
              </details>
              <details class="faq-item">
                <summary class="faq-question">How many pomodoros should I aim for per day?</summary>
                <div class="faq-answer">
                  <p>Start with 4-6 pomodoros per day and adjust based on your workload and energy levels. Most people find 8-12 sessions achievable on a full work day, but quality matters more than quantity.</p>
                </div>
              </details>
              <details class="faq-item">
                <summary class="faq-question">What should I do during breaks?</summary>
                <div class="faq-answer">
                  <p>Use breaks to rest your mind and body. Stand up, stretch, hydrate, take deep breaths, or look away from your screen. Avoid activities that require intense focus or might make you lose track of time.</p>
                </div>
              </details>
              <details class="faq-item">
                <summary class="faq-question">What is the Pomodoro Technique?</summary>
                <div class="faq-answer">
                  <p>The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It involves working in focused 25-minute intervals (called 'pomodoros') followed by 5-minute breaks. After completing 4 pomodoros, you take a longer break of 15-30 minutes. This technique helps improve focus, reduce mental fatigue, and boost productivity.</p>
                </div>
              </details>
              <details class="faq-item">
                <summary class="faq-question">Is Pomo timer free to use?</summary>
                <div class="faq-answer">
                  <p>Yes, Pomo is completely free to use forever. There are no hidden fees, premium subscriptions, or locked features. We believe productivity tools should be accessible to everyone.</p>
                </div>
              </details>
              <details class="faq-item">
                <summary class="faq-question">Do I need to create an account to use Pomo?</summary>
                <div class="faq-answer">
                  <p>No account is required to start using Pomo! All your data is stored locally in your browser, so you can begin being productive immediately. Your tasks, settings, and progress are automatically saved as you work.</p>
                </div>
              </details>
              <details class="faq-item">
                <summary class="faq-question">How does the task management feature work?</summary>
                <div class="faq-answer">
                  <p>You can add, edit, and organize your tasks directly in Pomo. When you start a timer session, you can associate it with a specific task to track how much time you spend on different activities. This helps you stay organized and estimate time for future tasks.</p>
                </div>
              </details>
              <details class="faq-item">
                <summary class="faq-question">What browsers are supported?</summary>
                <div class="faq-answer">
                  <p>Pomo works in all modern web browsers including Chrome, Firefox, Safari, and Edge. It's also mobile-friendly and works great on smartphones and tablets.</p>
                </div>
              </details>
              <details class="faq-item">
                <summary class="faq-question">Does Pomo work offline?</summary>
                <div class="faq-answer">
                  <p>Yes, once you load Pomo in your browser, it works offline. Your timer will continue running and your tasks will be saved locally even without an internet connection.</p>
                </div>
              </details>
              <details class="faq-item">
                <summary class="faq-question">Can I use Pomo for studying?</summary>
                <div class="faq-answer">
                  <p>Definitely! The Pomodoro Technique is excellent for studying. Many students use Pomo to break study sessions into manageable chunks, maintain focus during long study periods, and track their study time across different subjects.</p>
                </div>
              </details>
              <details class="faq-item">
                <summary class="faq-question">How do I track my productivity over time?</summary>
                <div class="faq-answer">
                  <p>The Insights page shows your productivity statistics including total focus time, completed sessions, and daily progress. This helps you track your activity and stay motivated on your productivity journey.</p>
                </div>
              </details>
              <details class="faq-item">
                <summary class="faq-question">Can I change the notification sounds?</summary>
                <div class="faq-answer">
                  <p>Yes, you can customize notification sounds or turn them off completely in the Settings page. You can also adjust the volume to suit your environment.</p>
                </div>
              </details>
              <details class="faq-item">
                <summary class="faq-question">Is there a mobile app?</summary>
                <div class="faq-answer">
                  <p>Pomo is a Progressive Web App (PWA), which means you can install it on your phone or desktop directly from your browser. It will work like a native app with offline capabilities and notifications.</p>
                </div>
              </details>
              <details class="faq-item">
                <summary class="faq-question">How do I report bugs or suggest features?</summary>
                <div class="faq-answer">
                  <p>We welcome feedback! You can contact us through our GitHub repository or support channels. We actively work on improving Pomo based on user suggestions.</p>
                </div>
              </details>
            </div>
          </div>
        </div>

        <div class="get-started-cta">
          <h3>Ready to Boost Your Productivity?</h3>
          <p>Start your first pomodoro session now and experience the power of focused work!</p>
          <div class="cta-buttons">
            <button @click="scrollToTimer" class="btn btn-primary">
              <span class="btn-icon">🍅</span>
              Start Your First Session
            </button>
            <button @click="emit('switchView', 'settings')" class="btn btn-secondary">
              <span class="btn-icon">⚙️</span>
              Customize Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTimer } from '../composables/useTimer.js'
import { Analytics } from '../utils/analytics.js'
import { useSEO } from '../composables/useSEO.js'

// SEO Optimization for Timer Page
useSEO({
  title: 'Pomodoro Timer - Focus & Productivity Tool | Pomo',
  description: 'Free online Pomodoro timer to boost productivity and focus. Work in 25-minute sessions with 5-minute breaks. Track tasks, customize settings, and improve your time management with our proven technique.',
  keywords: 'pomodoro timer, productivity timer, focus timer, time management, work sessions, break timer, task tracker, productivity tool, concentration aid, study timer, work from home, time blocking',
  ogTitle: 'Pomo - The Ultimate Pomodoro Timer for Productivity',
  ogDescription: 'Boost your focus and productivity with our free Pomodoro timer. Perfect for students, professionals, and anyone looking to improve their time management skills.',
  twitterTitle: 'Pomo Pomodoro Timer - Stay Focused & Productive',
  twitterDescription: 'Free online Pomodoro timer with task tracking, custom settings, and productivity insights. Start your focused work sessions now!'
})

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

// Help section navigation functions
const emit = defineEmits(['switchView'])

const scrollToTimer = () => {
  const timerElement = document.querySelector('.timer-display')
  if (timerElement) {
    timerElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const currentView = (view) => {
  emit('switchView', view)
}

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

/* Help & Guide Section Styles */
.help-guide-section {
  margin-top: var(--spacing-2xl);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.help-container {
  padding: var(--spacing-2xl);
}

/* Method Explanation Section */
.method-explanation {
  background: linear-gradient(135deg, var(--surface), var(--background));
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
  margin-bottom: var(--spacing-2xl);
  text-align: center;
}

.method-title {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.method-description {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-xl);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.technique-link {
  color: #0066cc;
  text-decoration: underline;
  border-bottom: none;
  transition: all var(--transition-fast);
}

.technique-link:hover {
  color: #004499;
  text-decoration: underline;
}

.help-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.help-description {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  line-height: 1.6;
}

.quick-start-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.quick-start-card {
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  transition: all var(--transition-fast);
}

.quick-start-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.quick-start-card h3 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.quick-steps {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.quick-steps li {
  padding: var(--spacing-sm) 0;
  color: var(--text-secondary);
  position: relative;
  padding-left: var(--spacing-lg);
  counter-increment: step-counter;
}

.quick-steps {
  counter-reset: step-counter;
}

.quick-steps li::before {
  content: counter(step-counter);
  position: absolute;
  left: 0;
  top: var(--spacing-sm);
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.feature-highlights {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.feature-highlights li {
  padding: var(--spacing-xs) 0;
  color: var(--text-secondary);
  position: relative;
  padding-left: var(--spacing-lg);
}

.feature-highlights li::before {
  content: "✓";
  position: absolute;
  left: 0;
  top: var(--spacing-xs);
  color: var(--secondary-color);
  font-weight: 600;
}

.help-content-sections {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.help-section {
  background: var(--background);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
}

.section-title {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

.benefit-icon {
  font-size: var(--font-size-2xl);
  flex-shrink: 0;
}

.benefit-content h4 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.benefit-content p {
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

.tips-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.tip-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  transition: all var(--transition-fast);
}

.tip-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--accent-blue);
}

.tip-card h4 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.tip-card p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.faq-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.faq-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.faq-question {
  padding: var(--spacing-lg);
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  user-select: none;
  transition: all var(--transition-fast);
  background: var(--surface-elevated);
  list-style: none;
}

.faq-question:hover {
  background: var(--surface-hover);
  color: var(--primary-color);
}

.faq-question::marker {
  display: none;
}

.faq-question::after {
  content: '+';
  float: right;
  font-size: var(--font-size-xl);
  font-weight: 600;
  transition: transform var(--transition-fast);
}

.faq-item[open] .faq-question::after {
  transform: rotate(45deg);
}

.faq-answer {
  padding: 0 var(--spacing-lg) var(--spacing-lg);
}

.faq-answer p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.get-started-cta {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
  text-align: center;
  margin-top: var(--spacing-2xl);
}

.get-started-cta h3 {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
}

.get-started-cta p {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xl);
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.cta-buttons .btn {
  min-width: 180px;
}

.cta-buttons .btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.cta-buttons .btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* Mobile responsiveness for help section */
@media (max-width: 768px) {
  .help-container {
    padding: var(--spacing-lg);
  }
  
  .method-explanation {
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
  }
  
  .method-title {
    font-size: var(--font-size-xl);
  }
  
  .method-description {
    font-size: var(--font-size-base);
  }
  
  .help-title {
    font-size: var(--font-size-2xl);
  }
  
  .help-description {
    font-size: var(--font-size-base);
  }
  
  .quick-start-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .quick-start-card {
    padding: var(--spacing-lg);
  }
  
  .benefits-grid,
  .tips-container {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .section-title {
    font-size: var(--font-size-xl);
  }
  
  .get-started-cta {
    padding: var(--spacing-xl);
  }
  
  .get-started-cta h3 {
    font-size: var(--font-size-xl);
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-buttons .btn {
    width: 100%;
    max-width: 280px;
  }
}

/* Enhanced Method Explanation Styles */
.method-description-extended {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: var(--spacing-xl);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.key-features {
  background: var(--surface-elevated);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  margin-top: var(--spacing-xl);
  border: 1px solid var(--border);
}

.features-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.features-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.features-list li {
  padding: var(--spacing-sm) 0;
  color: var(--text-secondary);
  position: relative;
  padding-left: var(--spacing-lg);
  line-height: 1.6;
}

.features-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--success-color);
  font-weight: bold;
  font-size: var(--font-size-lg);
}

.features-list strong {
  color: var(--text-primary);
  font-weight: 600;
}

/* Comprehensive Benefits Section Styles */
.comprehensive-benefits {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
}

.benefit-category {
  background: var(--surface);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.benefit-category:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-color);
}

.category-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.benefit-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.benefit-point {
  color: var(--text-secondary);
  line-height: 1.6;
  padding: var(--spacing-sm) 0;
}

.benefit-point strong {
  color: var(--text-primary);
  font-weight: 600;
  display: block;
  margin-bottom: var(--spacing-xs);
}

/* Success Stats Styles */
.success-stats {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-lg);
  color: white;
  text-align: center;
  margin-top: var(--spacing-xl);
}

.stats-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-xl);
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-lg);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.stat-number {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: white;
  display: block;
}

.stat-label {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Mobile Responsiveness for New Content */
@media (max-width: 768px) {
  .features-list {
    grid-template-columns: 1fr;
  }
  
  .comprehensive-benefits {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }
  
  .key-features,
  .benefit-category {
    padding: var(--spacing-lg);
  }
  
  .success-stats {
    padding: var(--spacing-xl);
  }
  
  .category-title {
    font-size: var(--font-size-lg);
  }
  
  .stats-title {
    font-size: var(--font-size-lg);
  }
  
  .stat-number {
    font-size: var(--font-size-xl);
  }
}
</style>