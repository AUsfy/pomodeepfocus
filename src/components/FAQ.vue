<template>
  <div class="faq-page">
    <div class="faq-container">
      <h1 class="page-title">Frequently Asked Questions</h1>
      
      <div class="faq-list">
        <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
          <h2 class="faq-question">{{ faq.question }}</h2>
          <div class="faq-answer" v-html="faq.answer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useSEO } from '../composables/useSEO'

useSEO({
  title: 'FAQ - Pomo Timer',
  description: 'Frequently asked questions about Pomo Pomodoro timer, the free productivity app for time management and focus.',
  keywords: 'pomodoro timer faq, productivity questions, time management help, focus timer support'
})

// Add structured data for SEO
let structuredDataScript = null

onMounted(() => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the Pomodoro Technique?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Pomodoro Technique is a time management method where you work for 25 minutes, then take a 5-minute break. After 4 cycles, you take a longer 15-30 minute break. It helps improve focus and productivity."
        }
      },
      {
        "@type": "Question", 
        "name": "Is Pomo timer free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Pomo is completely free to use. No registration required, no hidden fees, and no premium features locked behind a paywall."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to create an account?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No account is required to use Pomo. However, you can optionally sign in to sync your data across devices and track long-term progress."
        }
      },
      {
        "@type": "Question",
        "name": "Can I customize timer durations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can customize work session length, short break duration, and long break duration in the settings page to match your preferences."
        }
      }
    ]
  }

  structuredDataScript = document.createElement('script')
  structuredDataScript.type = 'application/ld+json'
  structuredDataScript.textContent = JSON.stringify(structuredData)
  document.head.appendChild(structuredDataScript)
})

onUnmounted(() => {
  if (structuredDataScript) {
    document.head.removeChild(structuredDataScript)
  }
})

const faqs = [
  {
    question: "What is the Pomodoro Technique?",
    answer: "The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It involves working in focused 25-minute intervals (called 'pomodoros') followed by 5-minute breaks. After completing 4 pomodoros, you take a longer break of 15-30 minutes. This technique helps improve focus, reduce mental fatigue, and boost productivity."
  },
  {
    question: "Is Pomo timer free to use?",
    answer: "Yes, Pomo is completely free to use forever. There are no hidden fees, premium subscriptions, or locked features. We believe productivity tools should be accessible to everyone."
  },
  {
    question: "Do I need to create an account to use Pomo?",
    answer: "No account is required to start using Pomo immediately. All your data is stored locally in your browser. However, you can optionally sign in to sync your tasks and progress across multiple devices."
  },
  {
    question: "Can I customize the timer durations?",
    answer: "Absolutely! While we default to the traditional 25/5 minute intervals, you can customize work session length, short break duration, and long break duration in the Settings page to match your personal preferences and work style."
  },
  {
    question: "How does the task management feature work?",
    answer: "You can add, edit, and organize your tasks directly in Pomo. When you start a timer session, you can associate it with a specific task to track how much time you spend on different activities. This helps you understand your productivity patterns and estimate time for future tasks."
  },
  {
    question: "What browsers are supported?",
    answer: "Pomo works in all modern web browsers including Chrome, Firefox, Safari, and Edge. It's also mobile-friendly and works great on smartphones and tablets."
  },
  {
    question: "Does Pomo work offline?",
    answer: "Yes, once you load Pomo in your browser, it works offline. Your timer will continue running and your tasks will be saved locally even without an internet connection."
  },
  {
    question: "Can I use Pomo for studying?",
    answer: "Definitely! The Pomodoro Technique is excellent for studying. Many students use Pomo to break study sessions into manageable chunks, maintain focus during long study periods, and track their study time across different subjects."
  },
  {
    question: "How do I track my productivity over time?",
    answer: "The Insights page shows your productivity statistics including total focus time, completed sessions, and daily/weekly trends. This helps you understand your productivity patterns and stay motivated."
  },
  {
    question: "Can I change the notification sounds?",
    answer: "Yes, you can customize notification sounds or turn them off completely in the Settings page. You can also adjust the volume to suit your environment."
  },
  {
    question: "Is there a mobile app?",
    answer: "Pomo is a Progressive Web App (PWA), which means you can install it on your phone or desktop directly from your browser. It will work like a native app with offline capabilities and notifications."
  },
  {
    question: "How do I report bugs or suggest features?",
    answer: "We welcome feedback! You can contact us through the app or visit our support page. We actively work on improving Pomo based on user suggestions."
  }
]
</script>

<style scoped>
.faq-page {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-2xl);
  color: var(--text-primary);
}

.faq-container {
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

.faq-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.faq-item {
  border-bottom: 1px solid var(--border);
  padding-bottom: var(--spacing-lg);
}

.faq-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.faq-question {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  line-height: 1.4;
}

.faq-answer {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  line-height: 1.6;
}

.faq-answer p {
  margin-bottom: var(--spacing-sm);
}

.faq-answer p:last-child {
  margin-bottom: 0;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .faq-page {
    padding: var(--spacing-lg);
  }
  
  .faq-container {
    padding: var(--spacing-lg);
  }
  
  .page-title {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--spacing-xl);
  }
  
  .faq-question {
    font-size: var(--font-size-lg);
  }
  
  .faq-answer {
    font-size: var(--font-size-sm);
  }
}
</style>
