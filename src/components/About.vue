<template>
  <div class="about-page">
    <div class="about-container">
      <h1 class="page-title">About Pomo</h1>
      
      <div class="about-content">
        <section class="about-section">
          <h2 class="section-title">Your Free Productivity Companion</h2>
          <p class="section-text">
            Pomo is a free, modern Pomodoro timer designed to help you maximize productivity and maintain focus. 
            Based on the proven Pomodoro Technique developed by Francesco Cirillo, our app breaks your work into 
            manageable 25-minute focused sessions followed by refreshing breaks.
          </p>
          <p class="section-text">
            Whether you're a student preparing for exams, a professional tackling complex projects, or anyone 
            looking to improve their time management skills, Pomo provides the tools you need to stay organized 
            and productive.
          </p>
        </section>

        <section class="about-section">
          <h2 class="section-title">Key Features</h2>
          <ul class="feature-list">
            <li class="feature-item"><strong>Customizable Timer:</strong> Adjust work and break durations to match your workflow</li>
            <li class="feature-item"><strong>Task Management:</strong> Organize and track your work with our built-in task system</li>
            <li class="feature-item"><strong>Progress Insights:</strong> View detailed statistics about your productivity patterns</li>
            <li class="feature-item"><strong>No Registration Required:</strong> Start using immediately without creating an account</li>
            <li class="feature-item"><strong>Responsive Design:</strong> Works seamlessly on desktop, tablet, and mobile devices</li>
            <li class="feature-item"><strong>Offline Support:</strong> Continue working even without an internet connection</li>
            <li class="feature-item"><strong>Dark & Light Themes:</strong> Choose the interface that works best for you</li>
            <li class="feature-item"><strong>Free Forever:</strong> No premium features, subscriptions, or hidden costs</li>
          </ul>
        </section>

        <section class="about-section">
          <h2 class="section-title">The Science Behind Pomodoro</h2>
          <p class="section-text">
            The Pomodoro Technique is backed by scientific research on attention spans and cognitive performance. 
            Studies show that regular breaks improve sustained attention and prevent mental fatigue. By working 
            in focused 25-minute intervals, you can:
          </p>
          <ul class="benefit-list">
            <li class="benefit-item">Maintain high levels of concentration throughout the day</li>
            <li class="benefit-item">Reduce procrastination and increase motivation</li>
            <li class="benefit-item">Better estimate how long tasks will take</li>
            <li class="benefit-item">Create a sustainable work rhythm that prevents burnout</li>
            <li class="benefit-item">Improve work-life balance through structured time management</li>
          </ul>
        </section>

        <section class="about-section">
          <h2 class="section-title">Why Choose Pomo?</h2>
          <p class="section-text">
            Unlike other productivity apps that come with complex features and steep learning curves, 
            Pomo focuses on simplicity and effectiveness. We believe the best productivity tool is one 
            that gets out of your way and lets you focus on what matters most - your work.
          </p>
          <p class="section-text">
            Our clean, distraction-free interface ensures you spend time being productive, not learning 
            how to use the app. With no ads, no tracking, and no premium upsells, Pomo respects your 
            privacy and your time.
          </p>
        </section>

        <section class="about-section">
          <h2 class="section-title">Getting Started</h2>
          <p class="section-text">
            Ready to boost your productivity? Here's how to get started with Pomo:
          </p>
          <ol class="steps-list">
            <li class="step-item">Add your first task in the Tasks section</li>
            <li class="step-item">Click "Start Focus" to begin your first 25-minute work session</li>
            <li class="step-item">Work on your task until the timer rings</li>
            <li class="step-item">Take a 5-minute break when prompted</li>
            <li class="step-item">Repeat for 4 cycles, then take a longer break</li>
            <li class="step-item">Review your progress in the Insights section</li>
          </ol>
        </section>

        <section class="about-section">
          <h2 class="section-title">Contact & Support</h2>
          <p class="section-text">
            Have questions, suggestions, or need help? We'd love to hear from you! 
            Our team is committed to making Pomo the best productivity tool for everyone.
          </p>
          <p class="section-text">
            Visit our <router-link to="/help" class="support-link">Help Center</router-link> 
            for guides and troubleshooting, or check out our 
            <router-link to="/faq" class="support-link">FAQ</router-link> 
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
.about-page {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-2xl);
  color: var(--text-primary);
}

.about-container {
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

.about-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.about-section {
  border-bottom: 1px solid var(--border);
  padding-bottom: var(--spacing-lg);
}

.about-section:last-child {
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

.feature-list,
.benefit-list,
.steps-list {
  margin: var(--spacing-md) 0;
  padding-left: 0;
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
  padding-left: var(--spacing-md);
  text-align: left;
}

.feature-item::before {
  content: "✨";
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
  padding-left: var(--spacing-md);
  text-align: left;
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
  padding-left: var(--spacing-lg);
  counter-increment: step-counter;
  text-align: left;
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
  .about-page {
    padding: var(--spacing-lg);
  }
  
  .about-container {
    padding: var(--spacing-lg);
  }
  
  .page-title {
    font-size: var(--font-size-2xl);
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
    padding-left: var(--spacing-sm);
  }
  
  .step-item {
    padding-left: var(--spacing-md);
  }
}
</style>
