<template>
  <div class="blog">
    <div class="blog-header">
      <h1>Productivity Blog</h1>
      <p class="blog-subtitle">
        Expert tips, guides, and insights on the Pomodoro Technique, time management, and boosting your productivity
      </p>
    </div>

    <!-- Featured Article -->
    <div v-if="featuredArticle" class="featured-article">
      <div class="featured-content">
        <span class="featured-badge">Featured Article</span>
        <h2 class="featured-title">{{ featuredArticle.title }}</h2>
        <p class="featured-excerpt">{{ featuredArticle.excerpt }}</p>
        <div class="featured-meta">
          <span class="meta-item">📅 {{ formatDate(featuredArticle.publishDate) }}</span>
          <span class="meta-item">⏱️ {{ featuredArticle.readTime }} min read</span>
          <span class="meta-item">🏷️ {{ featuredArticle.category }}</span>
        </div>
        <button @click="selectArticle(featuredArticle)" class="read-more-btn">
          Read Full Article
        </button>
      </div>
      <div class="featured-image">
        <div class="image-placeholder">
          <span class="placeholder-icon">{{ featuredArticle.icon }}</span>
        </div>
      </div>
    </div>

    <!-- Article Filters -->
    <div class="article-filters">
      <button
        v-for="category in categories"
        :key="category.id"
        @click="selectedCategory = category.id"
        class="filter-btn"
        :class="{ active: selectedCategory === category.id }"
      >
        <span class="filter-icon">{{ category.icon }}</span>
        <span class="filter-name">{{ category.name }}</span>
      </button>
    </div>

    <!-- Articles Grid -->
    <div v-if="!selectedArticle" class="articles-section">
      <h2 class="section-title">Latest Articles</h2>
      <div class="articles-grid">
        <article
          v-for="article in filteredArticles"
          :key="article.id"
          class="article-card"
          @click="selectArticle(article)"
        >
          <div class="article-image">
            <div class="image-placeholder">
              <span class="placeholder-icon">{{ article.icon }}</span>
            </div>
            <span class="article-category">{{ article.category }}</span>
          </div>
          
          <div class="article-content">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-excerpt">{{ article.excerpt }}</p>
            
            <div class="article-meta">
              <span class="meta-item">📅 {{ formatDate(article.publishDate) }}</span>
              <span class="meta-item">⏱️ {{ article.readTime }} min read</span>
            </div>
            
            <div class="article-tags">
              <span
                v-for="tag in article.tags"
                :key="tag"
                class="article-tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- Article Detail View -->
    <div v-if="selectedArticle" class="article-detail">
      <button @click="selectedArticle = null" class="back-btn">
        ← Back to Articles
      </button>
      
      <article class="article-full">
        <header class="article-header">
          <div class="article-category-badge">{{ selectedArticle.category }}</div>
          <h1 class="article-title-full">{{ selectedArticle.title }}</h1>
          <p class="article-subtitle">{{ selectedArticle.subtitle }}</p>
          
          <div class="article-meta-full">
            <span class="meta-item">📅 Published {{ formatDate(selectedArticle.publishDate) }}</span>
            <span class="meta-item">⏱️ {{ selectedArticle.readTime }} minute read</span>
            <span class="meta-item">👤 By Pomo Team</span>
          </div>
          
          <div class="article-tags-full">
            <span
              v-for="tag in selectedArticle.tags"
              :key="tag"
              class="article-tag"
            >
              {{ tag }}
            </span>
          </div>
        </header>
        
        <div class="article-body" v-html="selectedArticle.content"></div>
        
        <footer class="article-footer">
          <div class="cta-section">
            <h3>Ready to boost your productivity?</h3>
            <p>Try our free Pomodoro timer and start implementing these techniques today!</p>
            <button @click="goToTimer" class="cta-btn">
              🍅 Start Pomodoro Timer
            </button>
          </div>
          
          <div class="share-section">
            <h4>Share this article:</h4>
            <div class="share-buttons">
              <button @click="shareArticle('twitter')" class="share-btn twitter">
                🐦 Twitter
              </button>
              <button @click="shareArticle('linkedin')" class="share-btn linkedin">
                💼 LinkedIn
              </button>
              <button @click="shareArticle('copy')" class="share-btn copy">
                📋 Copy Link
              </button>
            </div>
          </div>
        </footer>
      </article>
    </div>

    <!-- Newsletter Signup -->
    <div class="newsletter-section">
      <div class="newsletter-content">
        <h3>Stay Updated</h3>
        <p>Get the latest productivity tips and Pomodoro techniques delivered to your inbox</p>
        <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
          <input
            v-model="newsletterEmail"
            type="email"
            placeholder="Enter your email"
            class="newsletter-input"
            required
          />
          <button type="submit" class="newsletter-btn">Subscribe</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSEO } from '../composables/useSEO.js'

// Props and emits
const emit = defineEmits(['switchView'])

// SEO Management
const { updateSEO } = useSEO()

// State
const selectedCategory = ref('all')
const selectedArticle = ref(null)
const newsletterEmail = ref('')

// Categories
const categories = ref([
  { id: 'all', name: 'All Articles', icon: '📚' },
  { id: 'technique', name: 'Pomodoro Technique', icon: '🍅' },
  { id: 'productivity', name: 'Productivity', icon: '⚡' },
  { id: 'study', name: 'Study Tips', icon: '📖' },
  { id: 'work', name: 'Remote Work', icon: '💻' },
  { id: 'wellness', name: 'Mental Health', icon: '🧠' }
])

// Articles data
const articles = ref([
  {
    id: 1,
    title: '10 Tips to Stop Procrastinating Using the Pomodoro Technique',
    subtitle: 'Break the cycle of procrastination with proven time management strategies',
    excerpt: 'Discover how the Pomodoro Technique can help you overcome procrastination and build momentum for your most important tasks.',
    category: 'Productivity',
    icon: '🚀',
    publishDate: '2024-10-01',
    readTime: 8,
    tags: ['procrastination', 'time-management', 'productivity', 'focus'],
    featured: true,
    content: `
      <p>Procrastination is one of the biggest enemies of productivity, affecting millions of people worldwide. The good news? The Pomodoro Technique offers a proven solution to break the procrastination cycle and build sustainable work habits.</p>
      
      <h2>Why We Procrastinate</h2>
      <p>Before diving into solutions, it's important to understand why we procrastinate. Common reasons include:</p>
      <ul>
        <li><strong>Overwhelm:</strong> Tasks seem too big or complex</li>
        <li><strong>Perfectionism:</strong> Fear of not doing something perfectly</li>
        <li><strong>Lack of motivation:</strong> The task doesn't feel rewarding</li>
        <li><strong>Decision fatigue:</strong> Too many choices can paralyze us</li>
      </ul>
      
      <h2>10 Anti-Procrastination Tips with Pomodoro</h2>
      
      <h3>1. Start with Just One Pomodoro</h3>
      <p>The biggest hurdle is getting started. Commit to just 25 minutes of work. Often, you'll find yourself continuing beyond the timer.</p>
      
      <h3>2. Break Large Tasks into Smaller Chunks</h3>
      <p>If a project seems overwhelming, break it into Pomodoro-sized pieces. Instead of "write report," try "outline report sections" for one Pomodoro.</p>
      
      <h3>3. Use the "Swiss Cheese" Method</h3>
      <p>Pick random, small parts of a large task to work on. This creates momentum and makes the task less intimidating.</p>
      
      <h3>4. Set Up Your Environment</h3>
      <p>Before starting your Pomodoro, eliminate distractions. Put your phone in another room, close unnecessary browser tabs, and prepare your workspace.</p>
      
      <h3>5. Use Positive Self-Talk</h3>
      <p>Replace "I have to" with "I choose to." This simple language shift can increase motivation and reduce resistance.</p>
      
      <h3>6. Reward Yourself</h3>
      <p>Plan small rewards after completing Pomodoros. This could be a cup of coffee, a short walk, or checking social media during your break.</p>
      
      <h3>7. Track Your Progress</h3>
      <p>Keep a visual record of completed Pomodoros. Seeing your progress builds momentum and motivation for future sessions.</p>
      
      <h3>8. Start with Easy Tasks</h3>
      <p>Begin your day with simpler tasks to build confidence and momentum before tackling more challenging work.</p>
      
      <h3>9. Use Implementation Intentions</h3>
      <p>Plan specific times for your Pomodoros: "At 9 AM, I will start a Pomodoro for project research." This reduces decision-making overhead.</p>
      
      <h3>10. Forgive Yourself</h3>
      <p>If you procrastinate, don't beat yourself up. Self-compassion is more effective than self-criticism for changing behavior.</p>
      
      <h2>The Science Behind Pomodoro and Procrastination</h2>
      <p>Research shows that the Pomodoro Technique works because it:</p>
      <ul>
        <li>Reduces the perceived burden of tasks</li>
        <li>Creates artificial deadlines that motivate action</li>
        <li>Provides regular breaks that prevent mental fatigue</li>
        <li>Builds a sense of accomplishment with each completed session</li>
      </ul>
      
      <h2>Getting Started Today</h2>
      <p>Don't wait for the "perfect" moment to start using these techniques. Pick one tip from this list and implement it in your next work session. Remember, small consistent actions lead to big results over time.</p>
    `
  },
  {
    id: 2,
    title: 'Pomodoro Technique for Students: How to Ace Exam Prep',
    subtitle: 'Transform your study sessions and improve retention with strategic time blocking',
    excerpt: 'Learn how students can use the Pomodoro Technique to improve focus, retention, and exam performance while reducing study stress.',
    category: 'Study Tips',
    icon: '🎓',
    publishDate: '2024-09-28',
    readTime: 10,
    tags: ['studying', 'exams', 'students', 'memory', 'focus'],
    content: `
      <p>Studying for exams can be overwhelming, especially when you have multiple subjects and limited time. The Pomodoro Technique offers a structured approach that can transform your study sessions and improve your academic performance.</p>
      
      <h2>Why Pomodoro Works for Students</h2>
      <p>The student brain is particularly well-suited to the Pomodoro Technique because:</p>
      <ul>
        <li><strong>Improved Focus:</strong> 25-minute sessions match natural attention spans</li>
        <li><strong>Better Retention:</strong> Regular breaks help consolidate information</li>
        <li><strong>Reduced Burnout:</strong> Prevents marathon study sessions that lead to exhaustion</li>
        <li><strong>Measurable Progress:</strong> Easy to track study time and accomplishments</li>
      </ul>
      
      <h2>Setting Up Your Study Pomodoros</h2>
      
      <h3>Choose Your Study Environment</h3>
      <p>Find a quiet space where you won't be interrupted. This could be a library, a dedicated study room, or even a coffee shop with good Wi-Fi.</p>
      
      <h3>Gather Your Materials</h3>
      <p>Before starting your first Pomodoro, have everything you need within reach:</p>
      <ul>
        <li>Textbooks and notes</li>
        <li>Highlighters and pens</li>
        <li>A notebook for active recall</li>
        <li>Water and healthy snacks</li>
        <li>A timer (use our Pomodoro timer above!)</li>
      </ul>
      
      <h2>Study Techniques for Each Pomodoro</h2>
      
      <h3>Active Reading (1-2 Pomodoros)</h3>
      <p>Don't just read passively. Use techniques like:</p>
      <ul>
        <li>SQ3R (Survey, Question, Read, Recite, Review)</li>
        <li>Cornell note-taking system</li>
        <li>Highlighting key concepts and definitions</li>
      </ul>
      
      <h3>Active Recall (1 Pomodoro)</h3>
      <p>Test yourself without looking at your notes:</p>
      <ul>
        <li>Write down everything you remember about a topic</li>
        <li>Create flashcards for key concepts</li>
        <li>Explain concepts out loud as if teaching someone else</li>
      </ul>
      
      <h3>Practice Problems (2-3 Pomodoros)</h3>
      <p>For subjects like math or science:</p>
      <ul>
        <li>Work through example problems</li>
        <li>Time yourself on practice tests</li>
        <li>Focus on understanding the process, not just the answer</li>
      </ul>
      
      <h2>Managing Breaks Effectively</h2>
      
      <h3>5-Minute Breaks</h3>
      <ul>
        <li>Stretch or do light exercise</li>
        <li>Hydrate and have a healthy snack</li>
        <li>Step outside for fresh air</li>
        <li>Practice deep breathing</li>
      </ul>
      
      <h3>15-30 Minute Long Breaks</h3>
      <ul>
        <li>Take a walk or do light exercise</li>
        <li>Eat a proper meal</li>
        <li>Call a friend or family member</li>
        <li>Take a power nap (15-20 minutes max)</li>
      </ul>
      
      <h2>Sample Study Schedules</h2>
      
      <h3>Intensive Study Day (8 hours)</h3>
      <ul>
        <li>9:00-9:25: Review yesterday's material</li>
        <li>9:30-9:55: Read new chapter</li>
        <li>10:00-10:25: Take notes and highlight</li>
        <li>10:30-10:55: Active recall session</li>
        <li>11:00-11:30: Long break</li>
        <li>Continue pattern throughout the day...</li>
      </ul>
      
      <h3>Exam Week Schedule</h3>
      <ul>
        <li>Morning: Focus on your hardest subject (4 Pomodoros)</li>
        <li>Afternoon: Review and practice problems (4 Pomodoros)</li>
        <li>Evening: Light review and relaxation (2 Pomodoros)</li>
      </ul>
      
      <h2>Common Mistakes to Avoid</h2>
      <ul>
        <li><strong>Skipping breaks:</strong> Your brain needs rest to consolidate information</li>
        <li><strong>Multitasking:</strong> Focus on one subject per Pomodoro</li>
        <li><strong>Perfectionism:</strong> It's okay if you don't finish everything in one session</li>
        <li><strong>Ignoring your energy levels:</strong> Study your hardest subjects when you're most alert</li>
      </ul>
      
      <h2>Tracking Your Progress</h2>
      <p>Keep a study log to track:</p>
      <ul>
        <li>Number of Pomodoros completed</li>
        <li>Subjects studied</li>
        <li>Energy levels throughout the day</li>
        <li>What worked well and what didn't</li>
      </ul>
      
      <p>This data will help you optimize your study schedule and identify your most productive times.</p>
    `
  },
  {
    id: 3,
    title: 'Deep Work vs Pomodoro: When to Use Each Technique',
    subtitle: 'Choose the right focus strategy for different types of work and cognitive demands',
    excerpt: 'Understand when to use deep work sessions versus Pomodoro intervals to maximize your productivity across different types of tasks.',
    category: 'Productivity',
    icon: '🧠',
    publishDate: '2024-09-25',
    readTime: 12,
    tags: ['deep-work', 'focus', 'productivity', 'strategy', 'cal-newport'],
    content: `
      <p>Both Deep Work and the Pomodoro Technique are powerful productivity strategies, but they serve different purposes. Understanding when to use each approach can dramatically improve your effectiveness and work quality.</p>
      
      <h2>Understanding Deep Work</h2>
      <p>Deep Work, popularized by Cal Newport, refers to professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit. These efforts create new value, improve your skill, and are hard to replicate.</p>
      
      <h3>Characteristics of Deep Work:</h3>
      <ul>
        <li>Extended periods of focus (90 minutes to 4+ hours)</li>
        <li>Complex, cognitively demanding tasks</li>
        <li>Minimal to no interruptions</li>
        <li>High-value output</li>
        <li>Requires significant mental energy</li>
      </ul>
      
      <h2>Understanding the Pomodoro Technique</h2>
      <p>The Pomodoro Technique breaks work into 25-minute focused intervals separated by short breaks. It's designed to maintain attention and provide structure for work sessions.</p>
      
      <h3>Characteristics of Pomodoro:</h3>
      <ul>
        <li>Short, structured work intervals (25 minutes)</li>
        <li>Regular breaks to maintain energy</li>
        <li>Works well for various task types</li>
        <li>Provides momentum and accountability</li>
        <li>Helps manage attention and energy</li>
      </ul>
      
      <h2>When to Use Deep Work</h2>
      
      <h3>Creative Projects</h3>
      <ul>
        <li>Writing articles, books, or reports</li>
        <li>Designing complex systems or interfaces</li>
        <li>Solving complex problems</li>
        <li>Strategic planning and analysis</li>
      </ul>
      
      <h3>Learning New Skills</h3>
      <ul>
        <li>Mastering a new programming language</li>
        <li>Studying complex academic material</li>
        <li>Developing expertise in your field</li>
        <li>Research and analysis work</li>
      </ul>
      
      <h3>High-Stakes Projects</h3>
      <ul>
        <li>Important presentations or proposals</li>
        <li>Critical bug fixes or system architecture</li>
        <li>Exam preparation for crucial tests</li>
        <li>Work that directly impacts your career or business</li>
      </ul>
      
      <h2>When to Use Pomodoro</h2>
      
      <h3>Administrative Tasks</h3>
      <ul>
        <li>Email processing and responses</li>
        <li>Data entry and organization</li>
        <li>Meeting preparation</li>
        <li>Calendar management and scheduling</li>
      </ul>
      
      <h3>Procrastination-Prone Work</h3>
      <ul>
        <li>Tasks you've been avoiding</li>
        <li>Overwhelming projects that need to be started</li>
        <li>Routine maintenance work</li>
        <li>Tasks that feel boring or tedious</li>
      </ul>
      
      <h3>Energy Management</h3>
      <ul>
        <li>When you're feeling mentally fatigued</li>
        <li>During low-energy parts of your day</li>
        <li>When you need to maintain momentum</li>
        <li>For consistent daily habits</li>
      </ul>
      
      <h2>Hybrid Approaches</h2>
      
      <h3>The Modified Pomodoro</h3>
      <p>Extend Pomodoro intervals to 45-90 minutes for work that needs more continuity than traditional Pomodoros allow but isn't quite deep work.</p>
      
      <h3>Deep Work with Planned Breaks</h3>
      <p>Plan 15-30 minute breaks every 90-120 minutes during deep work sessions to maintain energy without losing flow.</p>
      
      <h3>Pomodoro Preparation for Deep Work</h3>
      <p>Use 1-2 Pomodoros to prepare for a deep work session:</p>
      <ul>
        <li>Clear your workspace and mind</li>
        <li>Review materials and plan your approach</li>
        <li>Handle urgent communications</li>
        <li>Set clear intentions for the deep work session</li>
      </ul>
      
      <h2>Daily Integration Strategies</h2>
      
      <h3>Morning Deep Work Schedule</h3>
      <ul>
        <li>6:00-6:30 AM: Morning routine</li>
        <li>6:30-9:30 AM: Deep work session (your most important project)</li>
        <li>9:30-12:00 PM: Pomodoro sessions for secondary tasks</li>
        <li>Afternoon: Meetings, communications, and administrative work</li>
      </ul>
      
      <h3>Energy-Based Approach</h3>
      <ul>
        <li><strong>High energy:</strong> Deep work on complex projects</li>
        <li><strong>Medium energy:</strong> Modified Pomodoros for focused tasks</li>
        <li><strong>Low energy:</strong> Standard Pomodoros for routine work</li>
      </ul>
      
      <h2>Measuring Success</h2>
      
      <h3>Deep Work Metrics</h3>
      <ul>
        <li>Hours of deep work completed per week</li>
        <li>Quality and complexity of output</li>
        <li>Progress on long-term projects</li>
        <li>Skill development and learning</li>
      </ul>
      
      <h3>Pomodoro Metrics</h3>
      <ul>
        <li>Number of Pomodoros completed</li>
        <li>Task completion rate</li>
        <li>Consistency of practice</li>
        <li>Energy levels throughout the day</li>
      </ul>
      
      <h2>Choosing Your Approach</h2>
      <p>Ask yourself these questions to determine the best technique:</p>
      <ul>
        <li>How complex is this task?</li>
        <li>How much uninterrupted time do I have?</li>
        <li>What's my current energy level?</li>
        <li>Am I prone to procrastinating on this task?</li>
        <li>Does this work require extended concentration?</li>
      </ul>
      
      <p>Remember, these techniques aren't mutually exclusive. The most productive people often use both strategies strategically throughout their day and week.</p>
    `
  },
  {
    id: 4,
    title: 'Best Focus Timer Practices for Remote Work',
    subtitle: 'Maintain productivity and work-life balance while working from home',
    excerpt: 'Discover specific strategies for using focus timers effectively in remote work environments, including managing distractions and staying connected with your team.',
    category: 'Remote Work',
    icon: '🏠',
    publishDate: '2024-09-20',
    readTime: 9,
    tags: ['remote-work', 'focus', 'work-from-home', 'productivity', 'time-management'],
    content: `
      <p>Remote work presents unique challenges for maintaining focus and productivity. Traditional office boundaries disappear, and new distractions emerge. Here's how to use focus timers effectively in your home office.</p>
      
      <h2>Unique Remote Work Challenges</h2>
      <ul>
        <li><strong>Household distractions:</strong> Family members, pets, deliveries</li>
        <li><strong>Lack of structure:</strong> No commute or office routine</li>
        <li><strong>Isolation:</strong> Missing colleague interactions and energy</li>
        <li><strong>Boundary blur:</strong> Work and personal life mixing</li>
        <li><strong>Technology overload:</strong> Multiple communication channels</li>
      </ul>
      
      <h2>Setting Up Your Remote Focus Environment</h2>
      
      <h3>Create Physical Boundaries</h3>
      <ul>
        <li>Designate a specific workspace, even if it's just a corner of a room</li>
        <li>Use visual cues (like a "Do Not Disturb" sign) during focus sessions</li>
        <li>Invest in noise-canceling headphones or white noise</li>
        <li>Keep your workspace clean and organized</li>
      </ul>
      
      <h3>Establish Digital Boundaries</h3>
      <ul>
        <li>Use separate browser profiles for work and personal browsing</li>
        <li>Set up communication protocols with your team</li>
        <li>Use website blockers during focus sessions</li>
        <li>Turn off non-essential notifications</li>
      </ul>
      
      <h2>Remote-Specific Pomodoro Adaptations</h2>
      
      <h3>The "Signal Pomodoro"</h3>
      <p>Start each work day with a 25-minute "signal" session that indicates to yourself and others that work has begun. This could be:</p>
      <ul>
        <li>Reviewing your daily priorities</li>
        <li>Checking and responding to urgent messages</li>
        <li>Planning your schedule for the day</li>
      </ul>
      
      <h3>Household Integration Breaks</h3>
      <p>Use breaks strategically to handle household needs:</p>
      <ul>
        <li>5-minute breaks: Quick pet care, stretch, hydrate</li>
        <li>15-minute breaks: Load dishwasher, start laundry, prep snacks</li>
        <li>30-minute breaks: Walk the dog, eat lunch, brief household tasks</li>
      </ul>
      
      <h3>Communication Windows</h3>
      <p>Dedicate specific Pomodoros to team communication:</p>
      <ul>
        <li>Morning: Check Slack/Teams and respond to urgent items</li>
        <li>Midday: Join scheduled meetings or calls</li>
        <li>End of day: Send updates and plan tomorrow's collaboration</li>
      </ul>
      
      <h2>Managing Family and Household Distractions</h2>
      
      <h3>Family Communication</h3>
      <ul>
        <li>Explain your work schedule and focus times</li>
        <li>Create visual signals for when you shouldn't be interrupted</li>
        <li>Establish emergency-only interruption rules</li>
        <li>Schedule regular breaks for family interaction</li>
      </ul>
      
      <h3>Pet Management</h3>
      <ul>
        <li>Exercise pets before important focus sessions</li>
        <li>Provide enrichment activities during your work time</li>
        <li>Use pet gates or crates when necessary</li>
        <li>Take advantage of their natural nap times</li>
      </ul>
      
      <h2>Staying Connected While Focused</h2>
      
      <h3>Virtual Coworking</h3>
      <ul>
        <li>Join virtual coworking sessions with colleagues</li>
        <li>Use "focus rooms" in video conferencing tools</li>
        <li>Share Pomodoro timers with remote teammates</li>
        <li>Create accountability partnerships</li>
      </ul>
      
      <h3>Team Pomodoro Protocols</h3>
      <ul>
        <li>Share your focus schedule with your team</li>
        <li>Use status indicators to show when you're in a focus session</li>
        <li>Agree on response time expectations</li>
        <li>Schedule "office hours" for quick questions</li>
      </ul>
      
      <h2>Technology Stack for Remote Focus</h2>
      
      <h3>Essential Apps and Tools</h3>
      <ul>
        <li><strong>Focus Timer:</strong> Our Pomodoro timer (bookmark this page!)</li>
        <li><strong>Website Blocker:</strong> Cold Turkey, Freedom, or browser extensions</li>
        <li><strong>Noise Control:</strong> Brain.fm, Noisli, or noise-canceling headphones</li>
        <li><strong>Communication:</strong> Slack/Teams with custom status messages</li>
        <li><strong>Task Management:</strong> Todoist, Asana, or Notion</li>
      </ul>
      
      <h3>Communication Status Examples</h3>
      <ul>
        <li>"🍅 In focus mode until 2:30 PM - urgent only"</li>
        <li>"🔕 Deep work session - will respond by 4 PM"</li>
        <li>"☕ On break - quick questions welcome"</li>
        <li>"📞 Available for calls and collaboration"</li>
      </ul>
      
      <h2>Sample Remote Work Schedules</h2>
      
      <h3>Early Bird Schedule</h3>
      <ul>
        <li>6:00-8:00 AM: Deep focus work (4 Pomodoros)</li>
        <li>8:00-9:00 AM: Family time and breakfast</li>
        <li>9:00-12:00 PM: Collaborative work and meetings</li>
        <li>12:00-1:00 PM: Lunch break</li>
        <li>1:00-3:00 PM: Administrative tasks (4 Pomodoros)</li>
        <li>3:00-4:00 PM: Team communication and planning</li>
      </ul>
      
      <h3>Flexible Family Schedule</h3>
      <ul>
        <li>9:00-10:30 AM: Focus work (3 Pomodoros)</li>
        <li>10:30-11:00 AM: Family needs and break</li>
        <li>11:00-12:30 PM: Meetings and collaboration</li>
        <li>12:30-2:00 PM: Lunch and family time</li>
        <li>2:00-4:00 PM: Focus work (4 Pomodoros)</li>
        <li>4:00-5:00 PM: Wrap-up and family transition</li>
      </ul>
      
      <h2>Measuring Remote Productivity</h2>
      
      <h3>Track These Metrics</h3>
      <ul>
        <li>Completed Pomodoros per day</li>
        <li>Deep work hours achieved</li>
        <li>Response time to communications</li>
        <li>Work-life balance satisfaction</li>
        <li>Energy levels throughout the day</li>
      </ul>
      
      <h3>Weekly Review Questions</h3>
      <ul>
        <li>Which distractions affected me most this week?</li>
        <li>When was I most productive?</li>
        <li>How well did I maintain work-life boundaries?</li>
        <li>What adjustments would improve next week?</li>
      </ul>
      
      <h2>Common Remote Work Timer Mistakes</h2>
      <ul>
        <li><strong>Skipping breaks:</strong> Working longer doesn't mean working better</li>
        <li><strong>Inconsistent schedule:</strong> Lack of routine reduces effectiveness</li>
        <li><strong>Perfectionism:</strong> Trying to eliminate all household distractions</li>
        <li><strong>Isolation:</strong> Working in complete isolation without team connection</li>
        <li><strong>Boundary blur:</strong> Letting work extend into personal time</li>
      </ul>
      
      <p>Remember, remote work is a skill that takes time to develop. Be patient with yourself as you find the right balance of structure and flexibility that works for your unique situation.</p>
    `
  },
  {
    id: 5,
    title: 'The Science Behind Pomodoro: Why 25 Minutes Works',
    subtitle: 'Understanding the neuroscience and psychology that makes the Pomodoro Technique effective',
    excerpt: 'Explore the scientific research behind why 25-minute work intervals and 5-minute breaks optimize attention, memory, and cognitive performance.',
    category: 'Pomodoro Technique',
    icon: '🧪',
    publishDate: '2024-09-15',
    readTime: 11,
    tags: ['science', 'neuroscience', 'attention', 'psychology', 'research'],
    content: `
      <p>The Pomodoro Technique isn't just a productivity hack—it's based on solid scientific principles about how our brains work. Understanding the science behind the technique can help you use it more effectively and adapt it to your specific needs.</p>
      
      <h2>The Neuroscience of Attention</h2>
      
      <h3>Attention Spans and Cognitive Load</h3>
      <p>Research by Dr. Mihaly Csikszentmihalyi and others has shown that maintaining focused attention becomes increasingly difficult over time. The brain's executive functions, which control attention and working memory, have limited capacity and become depleted with use.</p>
      
      <h3>The Default Mode Network</h3>
      <p>When we're not actively focused on a task, our brain switches to the Default Mode Network (DMN). This network is responsible for:</p>
      <ul>
        <li>Self-referential thinking</li>
        <li>Mental wandering</li>
        <li>Processing emotions and memories</li>
        <li>Consolidating information</li>
      </ul>
      
      <p>The 5-minute breaks in Pomodoro allow the DMN to activate, which helps consolidate what you've learned and prepares your brain for the next focused session.</p>
      
      <h2>Why 25 Minutes is Optimal</h2>
      
      <h3>Ultradian Rhythms</h3>
      <p>Our bodies operate on 90-120 minute ultradian rhythms throughout the day. These cycles affect our alertness, focus, and energy levels. The 25-minute Pomodoro fits within these natural rhythms, allowing for 3-4 focused sessions within each cycle.</p>
      
      <h3>Working Memory Capacity</h3>
      <p>Research by cognitive psychologist George Miller showed that we can hold about 7 (±2) items in working memory at once. After about 20-30 minutes of focused work, our working memory becomes saturated and needs to be cleared through rest or a change of activity.</p>
      
      <h3>Attention Restoration Theory</h3>
      <p>Developed by Rachel and Stephen Kaplan, Attention Restoration Theory explains that directed attention has a limited capacity and becomes fatigued with use. The theory identifies four components necessary for attention restoration:</p>
      <ul>
        <li><strong>Being away:</strong> Physical or mental distance from demands</li>
        <li><strong>Fascination:</strong> Engaging with something that captures attention effortlessly</li>
        <li><strong>Extent:</strong> An environment rich enough to engage the mind</li>
        <li><strong>Compatibility:</strong> Activities that align with personal preferences</li>
      </ul>
      
      <p>The 5-minute breaks in Pomodoro provide these restoration elements.</p>
      
      <h2>The Psychology of Time Perception</h2>
      
      <h3>Time Boxing and Parkinson's Law</h3>
      <p>Parkinson's Law states that "work expands to fill the time available for its completion." By constraining work to 25-minute blocks, the Pomodoro Technique creates artificial urgency that can improve efficiency and reduce procrastination.</p>
      
      <h3>The Zeigarnik Effect</h3>
      <p>Psychologist Bluma Zeigarnik discovered that people remember interrupted tasks better than completed ones. The Pomodoro Technique leverages this by creating natural stopping points, which can actually improve memory and motivation to continue work.</p>
      
      <h3>Flow State and Micro-Flow</h3>
      <p>While traditional flow states can last hours, research suggests that "micro-flow" states can occur in shorter periods. The 25-minute Pomodoro is long enough to achieve micro-flow while short enough to maintain it consistently.</p>
      
      <h2>The Benefits of Regular Breaks</h2>
      
      <h3>Memory Consolidation</h3>
      <p>Studies show that taking breaks helps transfer information from working memory to long-term memory. This process, called consolidation, is enhanced when the brain shifts from focused to diffuse mode thinking.</p>
      
      <h3>Preventing Decision Fatigue</h3>
      <p>Research by Roy Baumeister and others has demonstrated that decision-making ability depletes throughout the day. Regular breaks help restore decision-making capacity and prevent the mental fatigue that leads to poor choices.</p>
      
      <h3>Stress Hormone Regulation</h3>
      <p>Continuous work without breaks can elevate cortisol levels, which impairs memory and cognitive function. Short breaks help regulate stress hormones and maintain optimal cognitive performance.</p>
      
      <h2>Individual Variations and Adaptations</h2>
      
      <h3>Chronotype Considerations</h3>
      <p>Your natural circadian rhythm (chronotype) affects when you're most alert and focused:</p>
      <ul>
        <li><strong>Morning types ("larks"):</strong> May benefit from longer sessions early in the day</li>
        <li><strong>Evening types ("owls"):</strong> Might need shorter sessions in the morning</li>
        <li><strong>Intermediate types:</strong> Standard 25-minute sessions work well</li>
      </ul>
      
      <h3>Age-Related Changes</h3>
      <p>Attention span and cognitive flexibility change with age:</p>
      <ul>
        <li><strong>Children (8-12):</strong> 10-15 minute sessions may be more appropriate</li>
        <li><strong>Teenagers (13-18):</strong> 20-25 minutes works well</li>
        <li><strong>Adults (18-65):</strong> Standard 25-minute sessions are optimal</li>
        <li><strong>Older adults (65+):</strong> May benefit from 20-minute sessions with longer breaks</li>
      </ul>
      
      <h2>Optimizing Your Pomodoro Practice</h2>
      
      <h3>Pre-Session Preparation</h3>
      <p>Research on task-switching shows that preparation can reduce cognitive load:</p>
      <ul>
        <li>Clear your workspace of distractions</li>
        <li>Set specific intentions for the session</li>
        <li>Have all necessary materials ready</li>
        <li>Practice mindfulness or breathing exercises</li>
      </ul>
      
      <h3>Break Activities That Enhance Restoration</h3>
      <p>Based on attention restoration research, effective break activities include:</p>
      <ul>
        <li>Brief meditation or mindfulness practice</li>
        <li>Light physical movement or stretching</li>
        <li>Looking at nature or green spaces</li>
        <li>Deep breathing exercises</li>
        <li>Hydrating and light snacking</li>
      </ul>
      
      <h3>Activities to Avoid During Breaks</h3>
      <p>These activities can actually increase cognitive load:</p>
      <ul>
        <li>Checking social media or email</li>
        <li>Engaging with complex content</li>
        <li>Making decisions or planning</li>
        <li>Stressful conversations</li>
        <li>Consuming caffeine late in the day</li>
      </ul>
      
      <h2>Measuring Cognitive Performance</h2>
      
      <h3>Objective Measures</h3>
      <ul>
        <li>Task completion rate</li>
        <li>Error frequency</li>
        <li>Creative output</li>
        <li>Problem-solving speed</li>
      </ul>
      
      <h3>Subjective Measures</h3>
      <ul>
        <li>Perceived effort and fatigue</li>
        <li>Motivation and engagement</li>
        <li>Stress levels</li>
        <li>Overall satisfaction</li>
      </ul>
      
      <h2>Future Research and Developments</h2>
      
      <p>Ongoing research is exploring:</p>
      <ul>
        <li>Personalized timing based on individual cognitive patterns</li>
        <li>The role of technology in optimizing break activities</li>
        <li>Cultural differences in time perception and productivity</li>
        <li>Integration with wearable devices for real-time cognitive load monitoring</li>
      </ul>
      
      <h2>Practical Applications</h2>
      
      <p>Understanding the science helps you:</p>
      <ul>
        <li>Adapt timing to your personal rhythms</li>
        <li>Choose more effective break activities</li>
        <li>Recognize when to modify the technique</li>
        <li>Explain the benefits to skeptical colleagues or clients</li>
        <li>Combine Pomodoro with other evidence-based techniques</li>
      </ul>
      
      <p>The Pomodoro Technique works because it aligns with how our brains naturally function. By understanding these principles, you can use the technique more effectively and make informed adaptations for your specific needs and circumstances.</p>
    `
  }
])

// Computed properties
const featuredArticle = computed(() => {
  return articles.value.find(article => article.featured) || articles.value[0]
})

const filteredArticles = computed(() => {
  if (selectedCategory.value === 'all') {
    return articles.value.filter(article => !article.featured)
  }
  return articles.value.filter(article => 
    article.category.toLowerCase() === selectedCategory.value && !article.featured
  )
})

// Methods
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const selectArticle = (article) => {
  selectedArticle.value = article
  
  // Update SEO for the specific article
  updateSEO({
    title: `${article.title} - Pomo Productivity Blog`,
    description: article.excerpt,
    keywords: article.tags.join(', ')
  })
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToTimer = () => {
  emit('switchView', 'timer')
}

const shareArticle = (platform) => {
  const article = selectedArticle.value
  const url = window.location.href
  const text = `Check out this article: ${article.title}`
  
  switch (platform) {
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
      break
    case 'linkedin':
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)
      break
    case 'copy':
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!')
      })
      break
  }
}

const subscribeNewsletter = () => {
  // In a real app, this would connect to an email service
  alert(`Thank you for subscribing with ${newsletterEmail.value}! You'll receive our latest productivity tips soon.`)
  newsletterEmail.value = ''
}

// Lifecycle
onMounted(() => {
  // Update SEO for blog page
  updateSEO({
    title: 'Productivity Blog - Pomodoro Technique Tips & Time Management',
    description: 'Expert advice on the Pomodoro Technique, productivity tips, study strategies, and time management for students and professionals.',
    keywords: 'pomodoro technique, productivity blog, time management, study tips, focus techniques, procrastination help'
  })
})
</script>

<style scoped>
.blog {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: var(--text-primary);
}

/* Blog Header */
.blog-header {
  text-align: center;
  margin-bottom: 3rem;
}

.blog-header h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.blog-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Featured Article */
.featured-article {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: var(--shadow-lg);
}

.featured-badge {
  display: inline-block;
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
}

.featured-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
  line-height: 1.3;
}

.featured-excerpt {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.featured-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 0.9rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.read-more-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  align-self: flex-start;
}

.read-more-btn:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-colored);
}

.featured-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  width: 200px;
  height: 200px;
  background: var(--accent-blue-light);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
}

/* Article Filters */
.article-filters {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-weight: 500;
}

.filter-btn:hover {
  border-color: var(--primary-color);
  background: var(--accent-blue-light);
}

.filter-btn.active {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: white;
}

/* Articles Section */
.articles-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.article-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--accent-blue);
}

.article-image {
  position: relative;
  height: 120px;
  background: var(--accent-blue-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 3rem;
}

.article-category {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  font-weight: 600;
}

.article-content {
  padding: 1.5rem;
}

.article-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
  line-height: 1.4;
}

.article-excerpt {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.article-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.article-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.article-tag {
  background: var(--accent-blue-light);
  color: var(--accent-blue);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
}

/* Article Detail */
.article-detail {
  max-width: 800px;
  margin: 0 auto;
}

.back-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-bottom: 2rem;
  font-weight: 500;
}

.back-btn:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
}

.article-header {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.article-category-badge {
  display: inline-block;
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.article-title-full {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: var(--text-primary);
  line-height: 1.2;
}

.article-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.article-meta-full {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.article-tags-full {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.article-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-primary);
  margin-bottom: 3rem;
}

.article-body h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 2rem 0 1rem 0;
  color: var(--text-primary);
}

.article-body h3 {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem 0;
  color: var(--text-primary);
}

.article-body ul, .article-body ol {
  margin: 1rem 0;
  padding-left: 2rem;
}

.article-body li {
  margin: 0.5rem 0;
}

.article-body p {
  margin: 1rem 0;
}

.article-body strong {
  font-weight: 600;
  color: var(--text-primary);
}

/* Article Footer */
.article-footer {
  background: var(--surface-elevated);
  padding: 2rem;
  border-radius: var(--radius-lg);
  margin-top: 3rem;
}

.cta-section {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.cta-section h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.cta-section p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.cta-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: var(--radius-md);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.cta-btn:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-colored);
}

.share-section h4 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.share-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.share-btn {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-primary);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-weight: 500;
}

.share-btn:hover {
  background: var(--surface-hover);
  transform: translateY(-1px);
}

/* Newsletter Section */
.newsletter-section {
  background: var(--primary-color);
  color: white;
  padding: 3rem 2rem;
  border-radius: var(--radius-lg);
  text-align: center;
  margin-top: 3rem;
}

.newsletter-content h3 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.newsletter-content p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.newsletter-form {
  display: flex;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

.newsletter-input {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
}

.newsletter-btn {
  background: white;
  color: var(--primary-color);
  border: none;
  padding: 1rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.newsletter-btn:hover {
  background: var(--surface-elevated);
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .blog {
    padding: 1rem;
  }
  
  .blog-header h1 {
    font-size: 2rem;
  }
  
  .blog-subtitle {
    font-size: 1rem;
  }
  
  .featured-article {
    grid-template-columns: 1fr;
    padding: 1.5rem;
  }
  
  .featured-title {
    font-size: 1.5rem;
  }
  
  .article-filters {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .filter-btn {
    flex-shrink: 0;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
  }
  
  .article-title-full {
    font-size: 1.8rem;
  }
  
  .article-meta-full {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .newsletter-form {
    flex-direction: column;
  }
  
  .share-buttons {
    justify-content: center;
  }
}
</style>
