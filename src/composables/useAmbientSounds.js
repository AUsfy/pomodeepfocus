import { ref, computed } from 'vue'

// Ambient sound management composable
export function useAmbientSounds() {
  const isPlaying = ref(false)
  const selectedSound = ref('none')
  const volume = ref(0.3)

  // Available ambient sounds
  const availableSounds = [
    { id: 'none', name: 'None', icon: '🔇' },
    { id: 'rain', name: 'Rain', icon: '🌧️' },
    { id: 'forest', name: 'Forest', icon: '🌲' },
    { id: 'ocean', name: 'Ocean Waves', icon: '🌊' },
    { id: 'cafe', name: 'Coffee Shop', icon: '☕' },
    { id: 'fire', name: 'Fireplace', icon: '🔥' },
    { id: 'wind', name: 'Wind', icon: '💨' },
    { id: 'birds', name: 'Birds', icon: '🐦' }
  ]

  // Audio context for web audio API
  let audioContext = null
  let currentAudioSource = null

  // Initialize audio context
  const initializeAudio = () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)()
    }
  }

  // Play ambient sound
  const playAmbientSound = async (soundId) => {
    if (soundId === 'none') {
      stopAmbientSound()
      selectedSound.value = soundId
      return
    }

    try {
      initializeAudio()
      
      // Stop current sound if playing
      if (currentAudioSource) {
        stopAmbientSound()
      }

      // For this demo, we'll use a simple oscillator to simulate different sounds
      // In a real app, you would load actual audio files
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      // Configure oscillator based on sound type
      switch (soundId) {
        case 'rain':
          oscillator.type = 'white'
          oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
          break
        case 'ocean':
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(80, audioContext.currentTime)
          break
        case 'forest':
          oscillator.type = 'triangle'
          oscillator.frequency.setValueAtTime(150, audioContext.currentTime)
          break
        case 'cafe':
          oscillator.type = 'brown'
          oscillator.frequency.setValueAtTime(300, audioContext.currentTime)
          break
        case 'fire':
          oscillator.type = 'pink'
          oscillator.frequency.setValueAtTime(120, audioContext.currentTime)
          break
        case 'wind':
          oscillator.type = 'white'
          oscillator.frequency.setValueAtTime(100, audioContext.currentTime)
          break
        case 'birds':
          oscillator.type = 'square'
          oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
          break
        default:
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
      }

      // Set volume
      gainNode.gain.setValueAtTime(volume.value, audioContext.currentTime)
      
      // Connect nodes
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Start playing
      oscillator.start()
      
      currentAudioSource = oscillator
      selectedSound.value = soundId
      isPlaying.value = true

      // Note: In a real implementation, you would:
      // 1. Load actual audio files for each sound
      // 2. Use proper looping
      // 3. Add fade in/out effects
      // 4. Handle audio file errors gracefully
      
    } catch (error) {
      console.error('Failed to play ambient sound:', error)
    }
  }

  // Stop ambient sound
  const stopAmbientSound = () => {
    if (currentAudioSource) {
      try {
        currentAudioSource.stop()
        currentAudioSource.disconnect()
      } catch (error) {
        // Ignore errors when stopping
      }
      currentAudioSource = null
    }
    isPlaying.value = false
  }

  // Set volume
  const setVolume = (newVolume) => {
    volume.value = Math.max(0, Math.min(1, newVolume))
    
    // If currently playing, update the gain
    if (currentAudioSource && audioContext) {
      const gainNode = audioContext.createGain()
      gainNode.gain.setValueAtTime(volume.value, audioContext.currentTime)
    }
    
    // Save to localStorage
    localStorage.setItem('pomodoro-ambient-volume', volume.value.toString())
  }

  // Toggle sound
  const toggleSound = () => {
    if (isPlaying.value) {
      stopAmbientSound()
      selectedSound.value = 'none'
    } else {
      // Resume last selected sound or default to rain
      const lastSound = selectedSound.value !== 'none' ? selectedSound.value : 'rain'
      playAmbientSound(lastSound)
    }
  }

  // Load preferences
  const loadPreferences = () => {
    try {
      const savedVolume = localStorage.getItem('pomodoro-ambient-volume')
      if (savedVolume) {
        volume.value = parseFloat(savedVolume)
      }
      
      const savedSound = localStorage.getItem('pomodoro-ambient-sound')
      if (savedSound) {
        selectedSound.value = savedSound
      }
    } catch (error) {
      console.error('Failed to load ambient sound preferences:', error)
    }
  }

  // Save preferences
  const savePreferences = () => {
    try {
      localStorage.setItem('pomodoro-ambient-volume', volume.value.toString())
      localStorage.setItem('pomodoro-ambient-sound', selectedSound.value)
    } catch (error) {
      console.error('Failed to save ambient sound preferences:', error)
    }
  }

  // Computed properties
  const currentSoundName = computed(() => {
    const sound = availableSounds.find(s => s.id === selectedSound.value)
    return sound ? sound.name : 'None'
  })

  const currentSoundIcon = computed(() => {
    const sound = availableSounds.find(s => s.id === selectedSound.value)
    return sound ? sound.icon : '🔇'
  })

  return {
    // State
    isPlaying,
    selectedSound,
    volume,
    availableSounds,
    
    // Computed
    currentSoundName,
    currentSoundIcon,
    
    // Methods
    playAmbientSound,
    stopAmbientSound,
    toggleSound,
    setVolume,
    loadPreferences,
    savePreferences
  }
}
