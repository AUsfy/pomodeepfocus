<template>
  <div class="about-page">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">About Pomo</h1>
      
      <div class="prose max-w-none">
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Your Free Productivity Companion</h2>
          <p class="text-gray-600 mb-4">
            Pomo is a free, modern Pomodoro timer designed to help you maximize productivity and maintain focus. 
            Based on the proven Pomodoro Technique developed by Francesco Cirillo, our app breaks your work into 
            manageable 25-minute focused sessions followed by refreshing breaks.
          </p>
          <p class="text-gray-600 mb-4">
            Whether you're a student preparing for exams, a professional tackling complex projects, or anyone 
            looking to improve their time management skills, Pomo provides the tools you need to stay organized 
            and productive.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Key Features</h2>
          <ul class="list-disc pl-6 text-gray-600 space-y-2">
            <li><strong>Customizable Timer:</strong> Adjust work and break durations to match your workflow</li>
            <li><strong>Task Management:</strong> Organize and track your work with our built-in task system</li>
            <li><strong>Progress Insights:</strong> View detailed statistics about your productivity patterns</li>
            <li><strong>No Registration Required:</strong> Start using immediately without creating an account</li>
            <li><strong>Responsive Design:</strong> Works seamlessly on desktop, tablet, and mobile devices</li>
            <li><strong>Offline Support:</strong> Continue working even without an internet connection</li>
            <li><strong>Dark & Light Themes:</strong> Choose the interface that works best for you</li>
            <li><strong>Free Forever:</strong> No premium features, subscriptions, or hidden costs</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">The Science Behind Pomodoro</h2>
          <p class="text-gray-600 mb-4">
            The Pomodoro Technique is backed by scientific research on attention spans and cognitive performance. 
            Studies show that regular breaks improve sustained attention and prevent mental fatigue. By working 
            in focused 25-minute intervals, you can:
          </p>
          <ul class="list-disc pl-6 text-gray-600 space-y-2 mb-4">
            <li>Maintain high levels of concentration throughout the day</li>
            <li>Reduce procrastination and increase motivation</li>
            <li>Better estimate how long tasks will take</li>
            <li>Create a sustainable work rhythm that prevents burnout</li>
            <li>Improve work-life balance through structured time management</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Why Choose Pomo?</h2>
          <p class="text-gray-600 mb-4">
            Unlike other productivity apps that come with complex features and steep learning curves, 
            Pomo focuses on simplicity and effectiveness. We believe the best productivity tool is one 
            that gets out of your way and lets you focus on what matters most - your work.
          </p>
          <p class="text-gray-600 mb-4">
            Our clean, distraction-free interface ensures you spend time being productive, not learning 
            how to use the app. With no ads, no tracking, and no premium upsells, Pomo respects your 
            privacy and your time.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Getting Started</h2>
          <p class="text-gray-600 mb-4">
            Ready to boost your productivity? Here's how to get started with Pomo:
          </p>
          <ol class="list-decimal pl-6 text-gray-600 space-y-2">
            <li>Add your first task in the Tasks section</li>
            <li>Click "Start Focus" to begin your first 25-minute work session</li>
            <li>Work on your task until the timer rings</li>
            <li>Take a 5-minute break when prompted</li>
            <li>Repeat for 4 cycles, then take a longer break</li>
            <li>Review your progress in the Insights section</li>
          </ol>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Contact & Support</h2>
          <p class="text-gray-600 mb-4">
            Have questions, suggestions, or need help? We'd love to hear from you! 
            Our team is committed to making Pomo the best productivity tool for everyone.
          </p>
          <p class="text-gray-600">
            Visit our <router-link to="/help" class="text-blue-600 hover:text-blue-700">Help Center</router-link> 
            for guides and troubleshooting, or check out our 
            <router-link to="/faq" class="text-blue-600 hover:text-blue-700">FAQ</router-link> 
            for answers to common questions.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSEO } from '../composables/useSEO'

useSEO({
  title: 'About Pomo - Free Pomodoro Timer for Productivity',
  description: 'Learn about Pomo, the free Pomodoro timer app that helps boost productivity through focused work sessions and strategic breaks. No registration required.',
  keywords: 'about pomo, pomodoro timer, productivity app, time management, focus technique, free timer, work efficiency'
})
</script>

<style scoped>
.prose {
  line-height: 1.6;
}

.prose h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose p {
  margin-bottom: 1rem;
}

.prose ul, .prose ol {
  margin-bottom: 1rem;
}
</style>
