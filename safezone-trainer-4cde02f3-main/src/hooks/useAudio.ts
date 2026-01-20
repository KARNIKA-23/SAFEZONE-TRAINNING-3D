import { useRef, useEffect, useCallback } from 'react';

interface AudioState {
  ambient: HTMLAudioElement | null;
  gasLeak: HTMLAudioElement | null;
}

export const useAudio = () => {
  const audioRef = useRef<AudioState>({
    ambient: null,
    gasLeak: null,
  });

  // Create audio context for generated sounds
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Generate ambient hum sound
  const playAmbient = useCallback(() => {
    const ctx = getAudioContext();
    
    // Create oscillators for industrial hum
    const oscillator1 = ctx.createOscillator();
    const oscillator2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    oscillator1.type = 'sine';
    oscillator1.frequency.setValueAtTime(60, ctx.currentTime); // 60Hz hum
    
    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(120, ctx.currentTime); // Harmonic
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0.03, ctx.currentTime); // Very low volume
    
    oscillator1.connect(filter);
    oscillator2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator1.start();
    oscillator2.start();
    
    return () => {
      oscillator1.stop();
      oscillator2.stop();
    };
  }, [getAudioContext]);

  // Play gas hissing sound
  const playGasLeak = useCallback(() => {
    const ctx = getAudioContext();
    
    // White noise for hissing
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    noise.start();
    
    return () => {
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
      setTimeout(() => noise.stop(), 100);
    };
  }, [getAudioContext]);

  // Play metallic valve sound
  const playValveSound = useCallback(() => {
    const ctx = getAudioContext();
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(180, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.4);
  }, [getAudioContext]);

  // Play PPE equip sound (fabric + beep)
  const playPPESound = useCallback(() => {
    const ctx = getAudioContext();
    
    // Fabric rustle (filtered noise)
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    noise.start();
    
    // Confirmation beep
    setTimeout(() => {
      const beep = ctx.createOscillator();
      const beepGain = ctx.createGain();
      
      beep.type = 'sine';
      beep.frequency.setValueAtTime(880, ctx.currentTime);
      beepGain.gain.setValueAtTime(0.1, ctx.currentTime);
      beepGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      
      beep.connect(beepGain);
      beepGain.connect(ctx.destination);
      beep.start();
      beep.stop(ctx.currentTime + 0.15);
    }, 200);
  }, [getAudioContext]);

  // Play UI click sound
  const playClick = useCallback(() => {
    const ctx = getAudioContext();
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.05);
  }, [getAudioContext]);

  // Play success chime
  const playSuccess = useCallback(() => {
    const ctx = getAudioContext();
    
    const frequencies = [523, 659, 784]; // C5, E5, G5
    
    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.3);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start(ctx.currentTime + i * 0.1);
      oscillator.stop(ctx.currentTime + i * 0.1 + 0.3);
    });
  }, [getAudioContext]);

  // Play failure warning
  const playFailure = useCallback(() => {
    const ctx = getAudioContext();
    
    for (let i = 0; i < 3; i++) {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(200, ctx.currentTime + i * 0.15);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start(ctx.currentTime + i * 0.15);
      oscillator.stop(ctx.currentTime + i * 0.15 + 0.1);
    }
  }, [getAudioContext]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    playAmbient,
    playGasLeak,
    playValveSound,
    playPPESound,
    playClick,
    playSuccess,
    playFailure,
  };
};
