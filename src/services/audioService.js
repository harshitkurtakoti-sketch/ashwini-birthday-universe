/**
 * AUDIO SERVICE (Web Audio API + Custom MP3 support)
 * 
 * Provides:
 * - Subtle sound effects (sparkle, chime, pop, card flip, celebrate)
 * - Calming ambient music synthesizer (zero dependencies, works offline & mobile)
 * - Support for user's custom background mp3 in /music/birthday-lofi.mp3
 */

class AudioService {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isPlayingMusic = false;
    this.customAudio = null;
    this.ambientInterval = null;
    this.customAudioPath = '/music/birthday-lofi.mp3';
  }

  initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Soft sparkle sound effect
  playSparkle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.06, this.ctx.currentTime + idx * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + idx * 0.05 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.05);
      osc.stop(this.ctx.currentTime + idx * 0.05 + 0.4);
    });
  }

  // Soft card pop / click
  playPop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(540, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.13);
  }

  // Quiz correct chime
  playSuccessChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.07, this.ctx.currentTime + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + i * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * 0.08);
      osc.stop(this.ctx.currentTime + i * 0.08 + 0.45);
    });
  }

  // Envelope paper rustle
  playRustle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.26);
  }

  // Toggle ambient / custom background music
  toggleMusic(onStateChange) {
    this.initContext();
    if (this.isPlayingMusic) {
      this.pauseMusic();
      if (onStateChange) onStateChange(false);
      return false;
    } else {
      this.playMusic();
      if (onStateChange) onStateChange(true);
      return true;
    }
  }

  playMusic() {
    this.initContext();
    this.isPlayingMusic = true;

    // Check if custom MP3 is available
    if (!this.customAudio) {
      this.customAudio = new Audio(this.customAudioPath);
      this.customAudio.loop = true;
      this.customAudio.volume = 0.35;
    }

    const playPromise = this.customAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback to synthesized ambient chord loop
        this.startAmbientSynth();
      });
    }
  }

  pauseMusic() {
    this.isPlayingMusic = false;
    if (this.customAudio) {
      this.customAudio.pause();
    }
    this.stopAmbientSynth();
  }

  startAmbientSynth() {
    this.stopAmbientSynth();
    // Warm music box chord progression: Cmaj7 -> Am9 -> Fmaj7 -> Gsus4
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // C E G B
      [220.00, 261.63, 329.63, 392.00], // A C E G
      [174.61, 261.63, 329.63, 349.23], // F C E F
      [196.00, 261.63, 329.63, 392.00]  // G C E G
    ];

    let chordIdx = 0;
    const playNextChord = () => {
      if (!this.isPlayingMusic || this.isMuted || !this.ctx) return;
      const notes = chords[chordIdx % chords.length];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.15);

        gain.gain.setValueAtTime(0.0001, this.ctx.currentTime + i * 0.15);
        gain.gain.linearRampToValueAtTime(0.025, this.ctx.currentTime + i * 0.15 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + i * 0.15 + 3.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + i * 0.15);
        osc.stop(this.ctx.currentTime + i * 0.15 + 3.3);
      });
      chordIdx++;
    };

    playNextChord();
    this.ambientInterval = setInterval(playNextChord, 3500);
  }

  stopAmbientSynth() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.customAudio) {
      this.customAudio.muted = this.isMuted;
    }
    return this.isMuted;
  }
}

export const audioService = new AudioService();
export default audioService;
