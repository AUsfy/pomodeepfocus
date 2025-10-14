<template>
  <div v-if="showBanner" class="cookie-banner" role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-description">
    <div class="cookie-content">
      <div class="cookie-text">
        <h3 id="cookie-title" class="cookie-title">🍪 Cookie Consent</h3>
        <p id="cookie-description" class="cookie-description">
          We use cookies to enhance your experience and analyze site usage. 
          This helps us improve our Pomodoro timer for everyone.
          <button @click="showDetails = !showDetails" class="cookie-learn-more">
            {{ showDetails ? 'Show less' : 'Learn more' }}
          </button>
        </p>
        
        <!-- Detailed cookie information (expandable) -->
        <div v-if="showDetails" class="cookie-details">
          <div class="cookie-category">
            <h4>📊 Analytics Cookies</h4>
            <p>Google Analytics helps us understand how you use our timer, which features are most helpful, and how we can improve the experience.</p>
            <ul>
              <li><strong>_ga:</strong> Distinguishes unique users (expires in 2 years)</li>
              <li><strong>_ga_*:</strong> Maintains session state (expires in 2 years)</li>
              <li><strong>_gid:</strong> Distinguishes unique users (expires in 24 hours)</li>
            </ul>
          </div>
          
          <div class="cookie-category">
            <h4>💾 Functional Storage</h4>
            <p>We use local storage (not cookies) to save your timer preferences, tasks, and settings on your device.</p>
          </div>
          
          <div class="cookie-links">
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Google Privacy Policy
            </a>
          </div>
        </div>
      </div>
      
      <div class="cookie-actions">
        <button @click="acceptAll" class="btn btn-primary cookie-btn-accept">
          <span class="btn-icon">✅</span>
          Accept All
        </button>
        <button @click="acceptEssential" class="btn btn-secondary cookie-btn-essential">
          <span class="btn-icon">🔧</span>
          Essential Only
        </button>
        <button @click="rejectAll" class="btn btn-outline cookie-btn-reject">
          <span class="btn-icon">❌</span>
          Reject All
        </button>
      </div>
    </div>
    
    <!-- Close button for accessibility -->
    <button @click="acceptEssential" class="cookie-close" aria-label="Close cookie banner" title="Close and accept essential only">
      ×
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

// Component state
const showBanner = ref(false)
const showDetails = ref(false)

// Emits for parent component
const emit = defineEmits(['consentChanged'])

// Cookie consent values
const CONSENT_ACCEPTED = 'accepted'
const CONSENT_ESSENTIAL = 'essential'
const CONSENT_REJECTED = 'rejected'

// Check if consent has been given
const getConsentStatus = () => {
  return localStorage.getItem('cookie-consent')
}

// Update Google Analytics consent
const updateGtagConsent = (consentType) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const analyticsGranted = consentType === CONSENT_ACCEPTED
    
    window.gtag('consent', 'update', {
      'analytics_storage': analyticsGranted ? 'granted' : 'denied',
      'ad_storage': 'denied', // We don't use ads
      'functionality_storage': 'granted', // Always allow for app functionality
      'security_storage': 'granted' // Always allow for security
    })
    
    console.log(`📊 Analytics consent: ${analyticsGranted ? 'granted' : 'denied'}`)
  }
}

// Accept all cookies
const acceptAll = () => {
  localStorage.setItem('cookie-consent', CONSENT_ACCEPTED)
  localStorage.setItem('cookie-consent-date', new Date().toISOString())
  updateGtagConsent(CONSENT_ACCEPTED)
  showBanner.value = false
  emit('consentChanged', CONSENT_ACCEPTED)
  
  // Show success message
  showConsentMessage('All cookies accepted. Thank you! 🍪', 'success')
}

// Accept only essential cookies
const acceptEssential = () => {
  localStorage.setItem('cookie-consent', CONSENT_ESSENTIAL)
  localStorage.setItem('cookie-consent-date', new Date().toISOString())
  updateGtagConsent(CONSENT_ESSENTIAL)
  showBanner.value = false
  emit('consentChanged', CONSENT_ESSENTIAL)
  
  // Show info message
  showConsentMessage('Essential cookies only. Your privacy is respected. 🔒', 'info')
}

// Reject all cookies
const rejectAll = () => {
  localStorage.setItem('cookie-consent', CONSENT_REJECTED)
  localStorage.setItem('cookie-consent-date', new Date().toISOString())
  updateGtagConsent(CONSENT_REJECTED)
  showBanner.value = false
  emit('consentChanged', CONSENT_REJECTED)
  
  // Show warning message
  showConsentMessage('All cookies rejected. Some features may be limited. 🚫', 'warning')
}

// Show temporary consent message
const showConsentMessage = (message, type) => {
  // Create temporary notification
  const notification = document.createElement('div')
  notification.className = `consent-notification consent-${type}`
  notification.textContent = message
  
  // Style the notification
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '500',
    zIndex: '10000',
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease-out',
    backgroundColor: type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'
  })
  
  document.body.appendChild(notification)
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)'
  }, 100)
  
  // Animate out and remove
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)'
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Check if consent banner should be shown
const checkConsentStatus = () => {
  const consent = getConsentStatus()
  const consentDate = localStorage.getItem('cookie-consent-date')
  
  // Show banner if no consent or consent is older than 6 months
  if (!consent || !consentDate) {
    showBanner.value = true
    return
  }
  
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  const consentDateObj = new Date(consentDate)
  
  if (consentDateObj < sixMonthsAgo) {
    showBanner.value = true
    return
  }
  
  // Apply existing consent
  updateGtagConsent(consent)
  emit('consentChanged', consent)
}

// Initialize on mount
onMounted(() => {
  checkConsentStatus()
})

// Expose method to show banner again (for settings)
defineExpose({
  showConsentBanner: () => {
    showBanner.value = true
  },
  getConsentStatus
})
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--border);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: slideUp 0.3s ease-out;
}

[data-theme="dark"] .cookie-banner {
  background: rgba(30, 41, 59, 0.98);
  border-top-color: var(--border);
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.cookie-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-xl);
  position: relative;
}

.cookie-text {
  flex: 1;
  min-width: 0;
}

.cookie-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.cookie-description {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
}

.cookie-learn-more {
  background: none;
  border: none;
  color: var(--primary-color);
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;
  padding: 0;
  margin-left: var(--spacing-xs);
}

.cookie-learn-more:hover {
  color: var(--primary-dark);
}

.cookie-details {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--surface-elevated);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

.cookie-category {
  margin-bottom: var(--spacing-md);
}

.cookie-category:last-child {
  margin-bottom: 0;
}

.cookie-category h4 {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.cookie-category p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.cookie-category ul {
  list-style: none;
  padding-left: 0;
}

.cookie-category li {
  color: var(--text-muted);
  font-size: var(--font-size-xs);
  margin-bottom: var(--spacing-xs);
  padding-left: var(--spacing-md);
  position: relative;
}

.cookie-category li:before {
  content: '•';
  color: var(--primary-color);
  position: absolute;
  left: 0;
}

.cookie-links {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border);
}

.cookie-links a {
  color: var(--primary-color);
  text-decoration: none;
  font-size: var(--font-size-sm);
}

.cookie-links a:hover {
  text-decoration: underline;
}

.cookie-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-decoration: none;
  white-space: nowrap;
  min-width: 140px;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--surface);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  background: var(--surface-hover);
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.btn-outline:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
}

.btn-icon {
  font-size: var(--font-size-sm);
}

.cookie-close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 50%;
  cursor: pointer;
  font-size: var(--font-size-xl);
  font-weight: bold;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cookie-close:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
  transform: scale(1.1);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .cookie-content {
    flex-direction: column;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    padding-right: 3rem; /* Space for close button */
  }
  
  .cookie-actions {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
  
  .btn {
    flex: 1;
    min-width: 0;
    font-size: var(--font-size-xs);
    padding: var(--spacing-sm);
  }
  
  .btn-icon {
    display: none;
  }
  
  .cookie-details {
    padding: var(--spacing-sm);
  }
}

@media (max-width: 480px) {
  .cookie-actions {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .btn {
    width: 100%;
  }
  
  .btn-icon {
    display: inline;
  }
}
</style>