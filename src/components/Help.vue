<template>
  <div class="help-page">
    <div class="help-container">
      <h1 class="page-title">Help Center</h1>
      
      <div class="help-sections-grid">
        <div class="help-section-card">
          <h2 class="section-card-title">Getting Started</h2>
          <ul class="section-links">
            <li><a href="#timer-basics" class="section-link">Timer Basics</a></li>
            <li><a href="#first-session" class="section-link">Your First Session</a></li>
            <li><a href="#customizing" class="section-link">Customizing Settings</a></li>
          </ul>
        </div>
        
        <div class="help-section-card">
          <h2 class="section-card-title">Task Management</h2>
          <ul class="section-links">
            <li><a href="#adding-tasks" class="section-link">Adding Tasks</a></li>
            <li><a href="#organizing-tasks" class="section-link">Organizing Tasks</a></li>
            <li><a href="#tracking-time" class="section-link">Tracking Time</a></li>
          </ul>
        </div>
        
        <div class="help-section-card">
          <h2 class="section-card-title">Insights & Reports</h2>
          <ul class="section-links">
            <li><a href="#reading-insights" class="section-link">Reading Insights</a></li>
            <li><a href="#productivity-trends" class="section-link">Productivity Trends</a></li>
            <li><a href="#goal-setting" class="section-link">Setting Goals</a></li>
          </ul>
        </div>
      </div>

      <div class="help-content">
        <section id="timer-basics" class="help-section">
          <h2 class="section-title">Timer Basics</h2>
          <div class="tip-box">
            <h3 class="tip-title">The Pomodoro Technique</h3>
            <p class="tip-text">
              Work for 25 minutes, then take a 5-minute break. After 4 work sessions, 
              take a longer 15-30 minute break. This cycle helps maintain focus and prevents burnout.
            </p>
          </div>
          <p class="section-text">
            To start your first timer session, simply click the "Start Focus" button on the timer page. 
            The timer will count down from 25 minutes. When it reaches zero, you'll hear a notification 
            and see a prompt to take your break.
          </p>
        </section>
        <section id="first-session" class="help-section">
          <h2 class="section-title">Your First Session</h2>
          <ol class="steps-list">
            <li class="step-item">Navigate to the Timer page</li>
            <li class="step-item">Optionally, add a task to track what you're working on</li>
            <li class="step-item">Click "Start Focus" to begin your 25-minute work session</li>
            <li class="step-item">Focus on your work until the timer notification</li>
            <li class="step-item">Click "Start Break" for your 5-minute break</li>
            <li class="step-item">Repeat the cycle - after 4 work sessions, take a longer break</li>
          </ol>
        </section>

        <section id="customizing" class="help-section">
          <h2 class="section-title">Customizing Settings</h2>
          <p class="section-text">
            While the traditional 25/5 minute intervals work well for most people, you can customize 
            the timer durations in the Settings page to match your preferences:
          </p>
          <ul class="feature-list">
            <li class="feature-item"><strong>Focus Duration:</strong> Adjust work session length (15-60 minutes)</li>
            <li class="feature-item"><strong>Short Break:</strong> Customize short break duration (3-15 minutes)</li>
            <li class="feature-item"><strong>Long Break:</strong> Set longer break duration (15-60 minutes)</li>
            <li class="feature-item"><strong>Auto-start:</strong> Automatically start breaks or next work sessions</li>
            <li class="feature-item"><strong>Notifications:</strong> Enable/disable sound notifications</li>
            <li class="feature-item"><strong>Theme:</strong> Switch between light and dark modes</li>
          </ul>
        </section>

        <section id="adding-tasks" class="help-section">
          <h2 class="section-title">Adding Tasks</h2>
          <p class="section-text">
            Tasks help you stay organized and track how much time you spend on different activities:
          </p>
          <ol class="steps-list">
            <li class="step-item">Go to the Tasks page</li>
            <li class="step-item">Click "Add Task" or the "+" button</li>
            <li class="step-item">Enter a descriptive name for your task</li>
            <li class="step-item">Optionally, estimate how many pomodoros the task will take</li>
            <li class="step-item">Click "Save" to add the task to your list</li>
          </ol>
        </section>

        <section id="organizing-tasks" class="help-section">
          <h2 class="section-title">Organizing Tasks</h2>
          <p class="section-text">Keep your tasks organized for maximum productivity:</p>
          <ul class="feature-list">
            <li class="feature-item"><strong>Edit:</strong> Click on any task to edit its name or estimated time</li>
            <li class="feature-item"><strong>Mark Complete:</strong> Check off tasks when finished</li>
            <li class="feature-item"><strong>Delete:</strong> Remove tasks you no longer need</li>
            <li class="feature-item"><strong>Prioritize:</strong> Reorder tasks by dragging them up or down</li>
          </ul>
        </section>

        <section id="tracking-time" class="help-section">
          <h2 class="section-title">Tracking Time</h2>
          <p class="section-text">
            When you start a timer session, you can associate it with a specific task. 
            This helps you understand how much time different activities actually take:
          </p>
          <ul class="benefit-list">
            <li class="benefit-item">Select a task before starting your timer</li>
            <li class="benefit-item">The time will be automatically tracked for that task</li>
            <li class="benefit-item">View time spent on each task in the Tasks page</li>
            <li class="benefit-item">Use this data to improve your time estimates for future planning</li>
          </ul>
        </section>

        <section id="reading-insights" class="help-section">
          <h2 class="section-title">Reading Insights</h2>
          <p class="section-text">
            The Insights page provides valuable data about your productivity patterns:
          </p>
          <ul class="benefit-list">
            <li class="benefit-item"><strong>Daily Stats:</strong> See how many pomodoros you completed today</li>
            <li class="benefit-item"><strong>Weekly Trends:</strong> Track your productivity over the past week</li>
            <li class="benefit-item"><strong>Focus Time:</strong> Total time spent in focused work sessions</li>
            <li class="benefit-item"><strong>Task Breakdown:</strong> See which tasks consumed the most time</li>
          </ul>
        </section>

        <section id="productivity-trends" class="help-section">
          <h2 class="section-title">Productivity Trends</h2>
          <p class="section-text">
            Understanding your productivity patterns can help you optimize your schedule:
          </p>
          <ul class="benefit-list">
            <li class="benefit-item">Identify your most productive hours of the day</li>
            <li class="benefit-item">Spot patterns in your break timing and effectiveness</li>
            <li class="benefit-item">Track improvements in your focus duration over time</li>
            <li class="benefit-item">Use weekly comparisons to maintain consistent progress</li>
          </ul>
        </section>

        <section id="goal-setting" class="help-section">
          <h2 class="section-title">Setting Goals</h2>
          <p class="section-text">
            Use your insights to set realistic productivity goals:
          </p>
          <ul class="benefit-list">
            <li class="benefit-item">Set daily pomodoro targets based on your historical data</li>
            <li class="benefit-item">Aim for consistent daily practice rather than perfectionism</li>
            <li class="benefit-item">Celebrate small wins and gradual improvements</li>
            <li class="benefit-item">Adjust your goals based on what your data tells you is achievable</li>
          </ul>
        </section>

        <section class="support-section">
          <h2 class="section-title">Still Need Help?</h2>
          <p class="section-text">
            Can't find what you're looking for? Check out our 
            <router-link to="/faq" class="support-link">FAQ page</router-link> 
            for answers to common questions, or visit our 
            <router-link to="/about" class="support-link">About page</router-link> 
            to learn more about the Pomodoro Technique.
          </p>
          <p class="section-text">
            For additional support, you can reach out to our team - we're here to help you 
            make the most of your productivity journey with Pomo!
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSEO } from '../composables/useSEO'

useSEO({
  title: 'Help Center - Pomo Timer Guide',
  description: 'Complete guide to using Pomo Pomodoro timer. Learn how to start your first session, manage tasks, read insights, and customize settings for maximum productivity.',
  keywords: 'pomo help, pomodoro timer guide, productivity tips, time management tutorial, focus technique, timer settings'
})
</script>

<style scoped>
.help-page {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-2xl);
  color: var(--text-primary);
}

.help-container {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-sm);
}

.page-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-2xl);
  text-align: center;
}

.help-sections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.help-section-card {
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  transition: all var(--transition-fast);
}

.help-section-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.section-card-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.section-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.section-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);
}

.section-link:hover {
  color: var(--primary-color);
}

.help-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.help-section {
  border-bottom: 1px solid var(--border);
  padding-bottom: var(--spacing-lg);
  scroll-margin-top: 100px;
}

.help-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  line-height: 1.4;
}

.section-text {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
}

.section-text:last-child {
  margin-bottom: 0;
}

.tip-box {
  background: linear-gradient(135deg, var(--accent-blue-light), var(--surface-elevated));
  border: 1px solid var(--accent-blue);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.tip-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.tip-text {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.feature-list,
.benefit-list,
.steps-list {
  margin: var(--spacing-md) 0;
}

.feature-list {
  list-style: none;
  padding-left: 0;
}

.feature-item {
  position: relative;
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-sm);
  padding-left: var(--spacing-lg);
}

.feature-item::before {
  content: "⚙️";
  position: absolute;
  left: 0;
  top: 0;
  color: var(--primary-color);
}

.benefit-list {
  list-style: none;
  padding-left: 0;
}

.benefit-item {
  position: relative;
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-sm);
  padding-left: var(--spacing-lg);
}

.benefit-item::before {
  content: "✓";
  position: absolute;
  left: 0;
  top: 0;
  color: var(--secondary-color);
  font-weight: 600;
}

.steps-list {
  list-style: none;
  padding-left: 0;
  counter-reset: step-counter;
}

.step-item {
  position: relative;
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-sm);
  padding-left: var(--spacing-xl);
  counter-increment: step-counter;
}

.step-item::before {
  content: counter(step-counter);
  position: absolute;
  left: 0;
  top: 0;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.support-section {
  background: var(--accent-blue-light);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
}

.support-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.support-link:hover {
  color: var(--primary-light);
  text-decoration: underline;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .help-page {
    padding: var(--spacing-lg);
  }
  
  .help-container {
    padding: var(--spacing-lg);
  }
  
  .page-title {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--spacing-xl);
  }
  
  .help-sections-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
  }
  
  .section-title {
    font-size: var(--font-size-lg);
  }
  
  .section-text,
  .feature-item,
  .benefit-item,
  .step-item {
    font-size: var(--font-size-sm);
  }
  
  .feature-item,
  .benefit-item {
    padding-left: var(--spacing-md);
  }
  
  .step-item {
    padding-left: var(--spacing-lg);
  }
}
</style>
