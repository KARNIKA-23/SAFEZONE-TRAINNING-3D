import { Suspense, useCallback, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { GameProgress } from '@/types/game';
import { LabEnvironment } from './LabEnvironment';
import { InteractableObjects } from './InteractableObjects';
import { GameHUD } from './GameHUD';
import { useAudio } from '@/hooks/useAudio';
import { toast } from 'sonner';

interface GameSceneProps {
  progress: GameProgress;
  onCompleteLevel: (success: boolean, failureReason?: string) => void;
  onReset: () => void;
}

export const GameScene = ({ progress, onCompleteLevel, onReset }: GameSceneProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const audio = useAudio();
  const ambientStopRef = useRef<(() => void) | null>(null);
  const gasStopRef = useRef<(() => void) | null>(null);

  // Start ambient sound on mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      ambientStopRef.current = audio.playAmbient();
    }, 500);
    
    return () => {
      clearTimeout(timeout);
      if (ambientStopRef.current) {
        ambientStopRef.current();
      }
    };
  }, [audio]);

  // Play gas leak sound when in identify or valve level
  useEffect(() => {
    if (progress.currentLevel === 'identify' || progress.currentLevel === 'valve') {
      gasStopRef.current = audio.playGasLeak();
    }
    
    return () => {
      if (gasStopRef.current) {
        gasStopRef.current();
        gasStopRef.current = null;
      }
    };
  }, [progress.currentLevel, audio]);

  const handleInteraction = useCallback((objectType: string, correct: boolean) => {
    audio.playClick();
    
    if (!correct) {
      audio.playFailure();
      toast.error('Incorrect! Try again.', {
        description: objectType === 'valve' ? 'That was the wrong valve.' : 'Wrong selection.',
      });
      onCompleteLevel(false, `Wrong ${objectType} selected`);
      return;
    }

    // Play appropriate success sound
    if (objectType === 'ppe') {
      audio.playPPESound();
    } else if (objectType === 'valve') {
      audio.playValveSound();
      // Stop gas leak sound
      if (gasStopRef.current) {
        gasStopRef.current();
        gasStopRef.current = null;
      }
    }
    
    audio.playSuccess();

    // Show success feedback
    const messages = {
      ppe: 'PPE equipped successfully!',
      gas: 'Gas leakage identified!',
      valve: 'Valve closed. Incident controlled!',
    };

    setShowSuccess(true);
    toast.success(messages[objectType as keyof typeof messages] || 'Success!');

    setTimeout(() => {
      setShowSuccess(false);
      onCompleteLevel(true);
    }, 1500);
  }, [onCompleteLevel, audio]);

  return (
    <div className="fixed inset-0 touch-none">
      <GameHUD progress={progress} onReset={onReset} />
      
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={60} />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={15}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            touches={{
              ONE: 1, // ROTATE
              TWO: 2, // DOLLY
            }}
          />
          
          {/* DAYLIGHT LIGHTING - Warm white industrial */}
          {/* Ambient light - gradient sky simulation */}
          <ambientLight intensity={0.6} color="#d2e6ff" />
          
          {/* Main directional light - simulates daylight through windows */}
          <directionalLight
            position={[5, 10, 5]}
            intensity={1.1}
            color="#fff4ea"
            castShadow
            shadow-mapSize={1024}
          />
          
          {/* Fill light from opposite side */}
          <directionalLight
            position={[-5, 8, -3]}
            intensity={0.4}
            color="#e8e8e8"
          />
          
          {/* Overhead fluorescent simulation */}
          <pointLight position={[0, 3.5, 0]} intensity={0.6} color="#fffef5" />
          <pointLight position={[-3, 3.5, -3]} intensity={0.4} color="#fffef5" />
          <pointLight position={[3, 3.5, -3]} intensity={0.4} color="#fffef5" />
          
          {/* Subtle ground bounce light */}
          <hemisphereLight
            args={['#d2e6ff', '#b4b4b4', 0.3]}
          />

          <LabEnvironment scenario={progress.scenario} />
          <InteractableObjects
            currentLevel={progress.currentLevel}
            scenario={progress.scenario}
            ppeEquipped={progress.ppeEquipped}
            onInteract={handleInteraction}
          />
        </Suspense>
      </Canvas>

      {/* Success overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-success/20 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-card/95 backdrop-blur p-8 rounded-xl border-2 border-success animate-fade-in">
            <div className="text-center">
              <div className="text-5xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-success">SUCCESS!</h2>
            </div>
          </div>
        </div>
      )}

      {/* Touch instruction */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="px-4 py-2 bg-card/80 backdrop-blur rounded-full border border-border">
          <p className="text-xs text-muted-foreground">
            Drag to rotate • Pinch to zoom • Tap objects to interact
          </p>
        </div>
      </div>
    </div>
  );
};
