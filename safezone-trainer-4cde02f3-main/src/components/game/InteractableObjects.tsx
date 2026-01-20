import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Html } from '@react-three/drei';
import { LevelType, ScenarioType } from '@/types/game';

interface InteractableObjectsProps {
  currentLevel: LevelType;
  scenario: ScenarioType;
  ppeEquipped: boolean;
  onInteract: (objectType: string, correct: boolean) => void;
}

export const InteractableObjects = ({
  currentLevel,
  scenario,
  ppeEquipped,
  onInteract,
}: InteractableObjectsProps) => {
  return (
    <group>
      {/* PPE Suit - only interactable in level 1 */}
      <PPESuit
        position={scenario === 'basic' ? [4, 0, 2] : [6, 0, 5]}
        active={currentLevel === 'ppe'}
        equipped={ppeEquipped}
        onInteract={() => onInteract('ppe', true)}
      />

      {/* Gas leak source - only visible/interactable in level 2 */}
      {(currentLevel === 'identify' || currentLevel === 'valve') && (
        <GasLeak
          position={scenario === 'basic' ? [-2, 0.5, -4] : [2, 0.5, -4]}
          active={currentLevel === 'identify'}
          onInteract={() => onInteract('gas', true)}
        />
      )}

      {/* Valves - only interactable in level 3 */}
      <Valve
        position={[-2, 1.5, -3.8]}
        isCorrect={scenario === 'basic'}
        active={currentLevel === 'valve'}
        onInteract={(correct) => onInteract('valve', correct)}
        label="V-01"
      />
      <Valve
        position={[2, 1.5, -3.8]}
        isCorrect={scenario === 'advanced'}
        active={currentLevel === 'valve'}
        onInteract={(correct) => onInteract('valve', correct)}
        label="V-02"
      />
    </group>
  );
};

const PPESuit = ({
  position,
  active,
  equipped,
  onInteract,
}: {
  position: [number, number, number];
  active: boolean;
  equipped: boolean;
  onInteract: () => void;
}) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && active && !equipped) {
      meshRef.current.position.y = position[1] + 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  if (equipped) return null;

  return (
    <group position={position}>
      {/* PPE rack */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.8, 2, 0.3]} />
        <meshStandardMaterial color="#3a4a5a" />
      </mesh>
      
      {/* PPE suit */}
      <mesh
        ref={meshRef}
        position={[0, 1, 0.3]}
        onClick={active ? onInteract : undefined}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.5, 0.8, 0.2]} />
        <meshStandardMaterial
          color={active ? (hovered ? '#00ff88' : '#ffcc00') : '#5a6a7a'}
          emissive={active ? '#ffcc00' : '#000000'}
          emissiveIntensity={active ? 0.3 : 0}
        />
      </mesh>

      {active && (
        <Html position={[0, 2.5, 0]} center>
          <div className="px-3 py-2 bg-warning/90 text-primary-foreground rounded-lg text-sm font-bold whitespace-nowrap animate-pulse">
            TAP TO EQUIP PPE
          </div>
        </Html>
      )}
    </group>
  );
};

const GasLeak = ({
  position,
  active,
  onInteract,
}: {
  position: [number, number, number];
  active: boolean;
  onInteract: () => void;
}) => {
  const cloudRef1 = useRef<Mesh>(null);
  const cloudRef2 = useRef<Mesh>(null);
  const cloudRef3 = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Realistic slow upward drift with slight variation
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (cloudRef1.current) {
      // Slow upward drift, reset when too high
      const y1 = (time * 0.15) % 2;
      cloudRef1.current.position.y = y1;
      cloudRef1.current.position.x = Math.sin(time * 0.5) * 0.1;
      // Fade out as it rises
      const opacity = Math.max(0.1, 0.5 - y1 * 0.2);
      (cloudRef1.current.material as any).opacity = opacity;
    }
    
    if (cloudRef2.current) {
      const y2 = ((time * 0.12) + 0.5) % 1.8;
      cloudRef2.current.position.y = y2 + 0.3;
      cloudRef2.current.position.x = Math.sin(time * 0.3 + 1) * 0.15;
      const opacity = Math.max(0.1, 0.4 - y2 * 0.15);
      (cloudRef2.current.material as any).opacity = opacity;
    }
    
    if (cloudRef3.current) {
      const y3 = ((time * 0.18) + 1) % 2.2;
      cloudRef3.current.position.y = y3 - 0.2;
      cloudRef3.current.position.z = Math.sin(time * 0.4) * 0.08;
      const opacity = Math.max(0.05, 0.35 - y3 * 0.12);
      (cloudRef3.current.material as any).opacity = opacity;
    }
  });

  // Light green, transparent gas - industrial look
  const gasColor = "#8fbc8f"; // Muted sage green
  const gasEmissive = "#6b8e6b";

  return (
    <group position={position}>
      {/* Main gas cloud - thicker near source */}
      <mesh
        ref={cloudRef1}
        onClick={active ? onInteract : undefined}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.5, 12, 12]} />
        <meshStandardMaterial
          color={gasColor}
          transparent
          opacity={0.5}
          emissive={gasEmissive}
          emissiveIntensity={0.15}
          depthWrite={false}
        />
      </mesh>
      
      {/* Secondary cloud - smaller, offset */}
      <mesh ref={cloudRef2}>
        <sphereGeometry args={[0.35, 10, 10]} />
        <meshStandardMaterial
          color={gasColor}
          transparent
          opacity={0.4}
          emissive={gasEmissive}
          emissiveIntensity={0.1}
          depthWrite={false}
        />
      </mesh>
      
      {/* Tertiary cloud - wisps */}
      <mesh ref={cloudRef3}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshStandardMaterial
          color={gasColor}
          transparent
          opacity={0.3}
          emissive={gasEmissive}
          emissiveIntensity={0.1}
          depthWrite={false}
        />
      </mesh>

      {active && (
        <Html position={[0, 1.5, 0]} center>
          <div className="px-3 py-2 bg-warning/90 text-warning-foreground rounded-lg text-sm font-bold whitespace-nowrap">
            {hovered ? 'TAP TO IDENTIFY' : '⚠ GAS DETECTED'}
          </div>
        </Html>
      )}
    </group>
  );
};

const Valve = ({
  position,
  isCorrect,
  active,
  onInteract,
  label,
}: {
  position: [number, number, number];
  isCorrect: boolean;
  active: boolean;
  onInteract: (correct: boolean) => void;
  label: string;
}) => {
  const handleRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (handleRef.current && active) {
      handleRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 4) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Valve body */}
      <mesh>
        <cylinderGeometry args={[0.15, 0.15, 0.1]} />
        <meshStandardMaterial color="#4a5a6a" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Valve handle */}
      <mesh
        ref={handleRef}
        position={[0, 0, 0.15]}
        rotation={[Math.PI / 2, 0, 0]}
        onClick={active ? () => onInteract(isCorrect) : undefined}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[0.08, 0.08, 0.3]} />
        <meshStandardMaterial
          color={active ? (hovered ? '#ff8844' : '#cc4444') : '#3a4a5a'}
          emissive={active ? '#cc4444' : '#000000'}
          emissiveIntensity={active ? 0.3 : 0}
        />
      </mesh>

      {/* Label */}
      <Html position={[0, -0.3, 0.2]} center>
        <div className={`px-2 py-1 rounded text-xs font-bold ${active ? 'bg-danger/90 text-secondary-foreground' : 'bg-muted/80 text-muted-foreground'}`}>
          {label}
        </div>
      </Html>
    </group>
  );
};
