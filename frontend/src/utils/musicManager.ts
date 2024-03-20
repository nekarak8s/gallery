class MusicManager {
  isPlaying: boolean = false
  private audio: HTMLAudioElement | null = null
  private MAX_VOLUME: number = 1

  constructor() {}

  // Set the audio
  setAudio(id?: string) {
    this.audio = document.querySelector(id ? `#${id}` : 'audio') as HTMLAudioElement
  }

  // Set the audio source
  setAudioSrc(src: string) {
    if (!this.audio) return

    this.audio.src = src
  }

  // Play the audio
  playAudio() {
    if (!this.audio) return

    this.isPlaying = true
    this.audio.play()
  }

  // Pause the audio
  pauseAudio() {
    if (!this.audio) return

    this.isPlaying = false
    this.audio.pause()
  }

  // Toggle the audio
  toggleAudio() {
    if (!this.audio) return

    this.isPlaying ? this.pauseAudio() : this.playAudio()
  }

  // Set max volume
  setMaxVolume(volume: number) {
    if (volume > 1) this.MAX_VOLUME = 1
    else if (volume < 0) this.MAX_VOLUME = 0
    else this.MAX_VOLUME = volume
  }

  // Set audio volume
  setVolume(volume: number) {
    if (!this.audio) return

    if (volume > this.MAX_VOLUME) this.audio.volume = 1
    else if (volume < 0) this.audio.volume = 0
    else this.audio.volume = volume
  }

  // Volume up
  volumeUp() {
    if (!this.audio) return

    this.setVolume(this.audio.volume + 0.1)
  }

  // Volume down
  volumeDown() {
    if (!this.audio) return

    this.setVolume(this.audio.volume - 0.1)
  }

  // Mute the audio
  muteAudio() {
    if (!this.audio) return

    this.audio.muted = true
  }

  // Unmute the audio
  unmuteAudio() {
    if (!this.audio) return

    this.audio.muted = false
  }
}

export default new MusicManager()
