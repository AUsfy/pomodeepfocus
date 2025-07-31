<template>
  <div class="help-page">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Help Center</h1>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="help-section bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-3">Getting Started</h2>
          <ul class="space-y-2 text-gray-600">
            <li><a href="#timer-basics" class="hover:text-blue-600">Timer Basics</a></li>
            <li><a href="#first-session" class="hover:text-blue-600">Your First Session</a></li>
            <li><a href="#customizing" class="hover:text-blue-600">Customizing Settings</a></li>
          </ul>
        </div>
        
        <div class="help-section bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-3">Task Management</h2>
          <ul class="space-y-2 text-gray-600">
            <li><a href="#adding-tasks" class="hover:text-blue-600">Adding Tasks</a></li>
            <li><a href="#organizing-tasks" class="hover:text-blue-600">Organizing Tasks</a></li>
            <li><a href="#tracking-time" class="hover:text-blue-600">Tracking Time</a></li>
          </ul>
        </div>
        
        <div class="help-section bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-3">Insights & Reports</h2>
          <ul class="space-y-2 text-gray-600">
            <li><a href="#reading-insights" class="hover:text-blue-600">Reading Insights</a></li>
            <li><a href="#productivity-trends" class="hover:text-blue-600">Productivity Trends</a></li>
            <li><a href="#goal-setting" class="hover:text-blue-600">Setting Goals</a></li>
          </ul>
        </div>
      </div>

      <div class="help-content space-y-8">
        <section id="timer-basics">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Timer Basics</h2>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
            <h3 class="text-lg font-semibold text-blue-800 mb-2">The Pomodoro Technique</h3>
            <p class="text-blue-700">
              Work for 25 minutes, then take a 5-minute break. After 4 work sessions, 
              take a longer 15-30 minute break. This cycle helps maintain focus and prevents burnout.
            </p>
          </div>
          <p class="text-gray-600 mb-4">
            To start your first timer session, simply click the "Start Focus" button on the timer page. 
            The timer will count down from 25 minutes. When it reaches zero, you'll hear a notification 
            and see a prompt to take your break.
          </p>
        </section>

        <section id="first-session">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Your First Session</h2>
          <ol class="list-decimal pl-6 text-gray-600 space-y-2">
            <li>Navigate to the Timer page</li>
            <li>Optionally, add a task to track what you're working on</li>
            <li>Click "Start Focus" to begin your 25-minute work session</li>
            <li>Focus on your work until the timer notification</li>
            <li>Click "Start Break" for your 5-minute break</li>
            <li>Repeat the cycle - after 4 work sessions, take a longer break</li>
          </ol>
        </section>

        <section id="customizing">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Customizing Settings</h2>
          <p class="text-gray-600 mb-4">
            While the traditional 25/5 minute intervals work well for most people, you can customize 
            the timer durations in the Settings page to match your preferences:
          </p>
          <ul class="list-disc pl-6 text-gray-600 space-y-2">
            <li><strong>Focus Duration:</strong> Adjust work session length (15-60 minutes)</li>
            <li><strong>Short Break:</strong> Customize short break duration (3-15 minutes)</li>
            <li><strong>Long Break:</strong> Set longer break duration (15-60 minutes)</li>
            <li><strong>Auto-start:</strong> Automatically start breaks or next work sessions</li>
            <li><strong>Notifications:</strong> Enable/disable sound notifications</li>
            <li><strong>Theme:</strong> Switch between light and dark modes</li>
          </ul>
        </section>

        <section id="adding-tasks">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Adding Tasks</h2>
          <p class="text-gray-600 mb-4">
            Tasks help you stay organized and track how much time you spend on different activities:
          </p>
          <ol class="list-decimal pl-6 text-gray-600 space-y-2">
            <li>Go to the Tasks page</li>
            <li>Click "Add Task" or the "+" button</li>
            <li>Enter a descriptive name for your task</li>
            <li>Optionally, estimate how many pomodoros the task will take</li>
            <li>Click "Save" to add the task to your list</li>
          </ol>
        </section>

        <section id="organizing-tasks">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Organizing Tasks</h2>
          <p class="text-gray-600 mb-4">Keep your tasks organized for maximum productivity:</p>
          <ul class="list-disc pl-6 text-gray-600 space-y-2">
            <li><strong>Edit:</strong> Click on any task to edit its name or estimated time</li>
            <li><strong>Mark Complete:</strong> Check off tasks when finished</li>
            <li><strong>Delete:</strong> Remove tasks you no longer need</li>
            <li><strong>Prioritize:</strong> Reorder tasks by dragging them up or down</li>
          </ul>
        </section>

        <section id="tracking-time">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Tracking Time</h2>
          <p class="text-gray-600 mb-4">
            When you start a timer session, you can associate it with a specific task. 
            This helps you understand how much time different activities actually take:
          </p>
          <ul class="list-disc pl-6 text-gray-600 space-y-2">
            <li>Select a task before starting your timer</li>
            <li>The time will be automatically tracked for that task</li>
            <li>View time spent on each task in the Tasks page</li>
            <li>Use this data to improve your time estimates for future planning</li>
          </ul>
        </section>

        <section id="reading-insights">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Reading Insights</h2>
          <p class="text-gray-600 mb-4">
            The Insights page provides valuable data about your productivity patterns:
          </p>
          <ul class="list-disc pl-6 text-gray-600 space-y-2">
            <li><strong>Daily Stats:</strong> See how many pomodoros you completed today</li>
            <li><strong>Weekly Trends:</strong> Track your productivity over the past week</li>
            <li><strong>Focus Time:</strong> Total time spent in focused work sessions</li>
            <li><strong>Task Breakdown:</strong> See which tasks consumed the most time</li>
          </ul>
        </section>

        <section id="productivity-trends">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Productivity Trends</h2>
          <p class="text-gray-600 mb-4">
            Understanding your productivity patterns can help you optimize your schedule:
          </p>
          <ul class="list-disc pl-6 text-gray-600 space-y-2">
            <li>Identify your most productive hours of the day</li>
            <li>Spot patterns in your break timing and effectiveness</li>
            <li>Track improvements in your focus duration over time</li>
            <li>Use weekly comparisons to maintain consistent progress</li>
          </ul>
        </section>

        <section id="goal-setting">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Setting Goals</h2>
          <p class="text-gray-600 mb-4">
            Use your insights to set realistic productivity goals:
          </p>
          <ul class="list-disc pl-6 text-gray-600 space-y-2">
            <li>Set daily pomodoro targets based on your historical data</li>
            <li>Aim for consistent daily practice rather than perfectionism</li>
            <li>Celebrate small wins and gradual improvements</li>
            <li>Adjust your goals based on what your data tells you is achievable</li>
          </ul>
        </section>

        <section class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Still Need Help?</h2>
          <p class="text-gray-600 mb-4">
            Can't find what you're looking for? Check out our 
            <router-link to="/faq" class="text-blue-600 hover:text-blue-700">FAQ page</router-link> 
            for answers to common questions, or visit our 
            <router-link to="/about" class="text-blue-600 hover:text-blue-700">About page</router-link> 
            to learn more about the Pomodoro Technique.
          </p>
          <p class="text-gray-600">
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
.help-section {
  transition: transform 0.2s ease;
}

.help-section:hover {
  transform: translateY(-2px);
}

.help-content section {
  scroll-margin-top: 100px;
}

.help-content a {
  scroll-behavior: smooth;
}
</style>
