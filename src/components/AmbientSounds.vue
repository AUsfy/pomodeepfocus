<template>
  <div class="ambient-sounds" :class="{ expanded: showPanel }">
    <!-- Toggle Button -->
    <button 
      @click="showPanel = !showPanel"
      class="ambient-toggle"
      :class="{ active: isPlaying }"
      :title="showPanel ? 'Hide ambient sounds' : 'Show ambient sounds'"
    >
      <span class="toggle-icon">{{ currentSoundIcon }}</span>
      <span class="toggle-text">Ambient</span>
    </button>

    <!-- Sound Panel -->
    <div v-if="showPanel" class="sound-panel">
      <div class="panel-header">
        <h3>Ambient Sounds</h3>
        <p>Background sounds to help you focus</p>
      </div>

      <!-- Sound Grid -->
      <div class="sound-grid">
        <button
          v-for="sound in availableSounds"
          :key="sound.id"
          @click="selectSound(sound.id)"
          class="sound-btn"
          :class="{ 
            active: selectedSound === sound.id,
            playing: selectedSound === sound.id && isPlaying 
          }"
        >
          <span class="sound-icon">{{ sound.icon }}</span>
          <span class="sound-name">{{ sound.name }}</span>
        </button>
      </div>

      <!-- Volume Control -->
      <div v-if="selectedSound !== 'none'" class="volume-control">
        <label class="volume-label">
          <span class="volume-icon">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            :value="volume"
            @input="updateVolume($event.target.value)"
            class="volume-slider"
          />
          <span class="volume-value">{{ Math.round(volume * 100) }}%</span>
        </label>
      </div>

      <!-- Quick Controls -->
      <div class="quick-controls">
        <button
          @click="togglePlayback"
          class="control-btn"
          :disabled="selectedSound === 'none'"
        >
          {{ isPlaying ? '⏸️ Pause' : '▶️ Play' }}
        </button>
        
        <button
          @click="stopSound"
          class="control-btn"
          :disabled="!isPlaying"
        >
          ⏹️ Stop
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAmbientSounds } from '../composables/useAmbientSounds.js'

// Ambient sounds composable
const {
  isPlaying,
  selectedSound,
  volume,
  availableSounds,
  currentSoundIcon,
  playAmbientSound,
  stopAmbientSound,
  toggleSound,
  setVolume,
  loadPreferences,
  savePreferences
} = useAmbientSounds()

// Component state
const showPanel = ref(false)

// Methods
const selectSound = async (soundId) => {
  await playAmbientSound(soundId)
  savePreferences()
}

const updateVolume = (newVolume) => {
  setVolume(parseFloat(newVolume))
  savePreferences()
}

const togglePlayback = () => {
  toggleSound()
  savePreferences()
}

const stopSound = () => {
  stopAmbientSound()
  savePreferences()
}

// Handle click outside to close panel
const handleClickOutside = (event) => {
  const ambientSounds = document.querySelector('.ambient-sounds')
  if (ambientSounds && !ambientSounds.contains(event.target)) {
    showPanel.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadPreferences()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  stopAmbientSound()
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.ambient-sounds {
  position: relative;
  z-index: 100;
}

.ambient-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.ambient-toggle:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary);
}

.ambient-toggle.active {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.toggle-icon {
  font-size: 1.2rem;
}

.sound-panel {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  min-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.panel-header {
  margin-bottom: 1rem;
}

.panel-header h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
}

.panel-header p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.sound-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.sound-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 0.5rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
}

.sound-btn:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary);
}

.sound-btn.active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.sound-btn.playing {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.sound-icon {
  font-size: 1.5rem;
}

.sound-name {
  font-weight: 500;
}

.volume-control {
  margin-bottom: 1rem;
}

.volume-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text);
}

.volume-icon {
  font-size: 1rem;
}

.volume-slider {
  flex: 1;
  height: 4px;
  background: var(--color-border);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--color-primary);
  border-radius: 50%;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: var(--color-primary);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.volume-value {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  min-width: 35px;
  text-align: right;
}

.quick-controls {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  flex: 1;
  padding: 0.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.control-btn:hover:not(:disabled) {
  background: var(--color-accent);
}

.control-btn:disabled {
  background: var(--color-border);
  color: var(--color-text-muted);
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .sound-panel {
    right: 0;
    left: 0;
    min-width: unset;
    width: calc(100vw - 2rem);
    margin-left: -1rem;
  }
  
  .sound-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .sound-btn {
    padding: 0.5rem 0.25rem;
  }
  
  .sound-name {
    font-size: 0.7rem;
  }
}
</style>
