import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { ScenarioType } from '@/types/game';

interface LabEnvironmentProps {
  scenario: ScenarioType;
}

export const LabEnvironment = ({ scenario }: LabEnvironmentProps) => {
  const isAdvanced = scenario === 'advanced';
  const size = isAdvanced ? 20 : 12;
  
  return (
    <group>
      {/* Concrete Floor - Light grey with subtle texture feel */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#c5c5c0" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Floor drainage grills */}
      <FloorDrain position={[-2, 0.01, 0]} />
      <FloorDrain position={[2, 0.01, 0]} />
      {isAdvanced && <FloorDrain position={[0, 0.01, 4]} />}

      {/* Hazard warning tape on floor */}
      <HazardTape position={[-3, 0.02, -3]} rotation={0} />
      <HazardTape position={[3, 0.02, -3]} rotation={0} />

      {/* Walls - Off-white industrial paint */}
      <Walls size={size} height={4} />

      {/* Ceiling with ventilation ducts */}
      <Ceiling size={size} isAdvanced={isAdvanced} />

      {/* Lab tables with equipment */}
      <LabTable position={[-3, 0, -2]} />
      <LabTable position={[3, 0, -2]} />
      {isAdvanced && (
        <>
          <LabTable position={[-3, 0, 4]} />
          <LabTable position={[3, 0, 4]} />
        </>
      )}

      {/* Chemical storage cabinets */}
      <Cabinet position={[-5, 0, 0]} />
      {isAdvanced && <Cabinet position={[5, 0, 0]} />}

      {/* Chemical drums */}
      <ChemicalDrum position={[-4.5, 0, 2]} color="#e6c619" label="FLAMMABLE" />
      <ChemicalDrum position={[-4, 0, 2.5]} color="#1976d2" label="CORROSIVE" />
      {isAdvanced && (
        <>
          <ChemicalDrum position={[4.5, 0, 3]} color="#e6c619" label="TOXIC" />
          <ChemicalDrum position={[5, 0, 3.5]} color="#d32f2f" label="OXIDIZER" />
        </>
      )}

      {/* Pipe system with labels */}
      <PipeSystem scenario={scenario} />

      {/* Safety equipment */}
      <EmergencyShower position={[isAdvanced ? -8 : -5, 0, isAdvanced ? 8 : 4]} />
      <EyewashStation position={[isAdvanced ? -7 : -4, 0, isAdvanced ? 8 : 4]} />
      <FireExtinguisher position={[isAdvanced ? 8 : 5, 0, isAdvanced ? -8 : -4]} />

      {/* Electrical panel */}
      <ElectricalPanel position={[isAdvanced ? -9.5 : -5.5, 1.5, 0]} />

      {/* Safety posters */}
      <SafetyPoster position={[0, 2.5, -size/2 + 0.11]} text="MSDS" />
      <SafetyPoster position={[3, 2.5, -size/2 + 0.11]} text="PPE REQUIRED" />

      {/* Emergency exit sign */}
      <ExitSign position={[size/2 - 0.11, 3.2, 0]} rotation={Math.PI / 2} />

      {/* Ceiling lights - industrial fluorescent */}
      <CeilingLight position={[0, 3.9, 0]} />
      <CeilingLight position={[-3, 3.9, -3]} />
      <CeilingLight position={[3, 3.9, -3]} />
      {isAdvanced && (
        <>
          <CeilingLight position={[-5, 3.9, 5]} />
          <CeilingLight position={[5, 3.9, 5]} />
          <CeilingLight position={[0, 3.9, 6]} />
        </>
      )}
    </group>
  );
};

const Walls = ({ size, height }: { size: number; height: number }) => {
  const halfSize = size / 2;
  
  return (
    <group>
      {/* Back wall - off-white */}
      <mesh position={[0, height / 2, -halfSize]}>
        <boxGeometry args={[size, height, 0.2]} />
        <meshStandardMaterial color="#f0efe8" roughness={0.7} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-halfSize, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[size, height, 0.2]} />
        <meshStandardMaterial color="#e8e7e0" roughness={0.7} />
      </mesh>
      {/* Right wall */}
      <mesh position={[halfSize, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[size, height, 0.2]} />
        <meshStandardMaterial color="#e8e7e0" roughness={0.7} />
      </mesh>
      {/* Front wall (partial) */}
      <mesh position={[-halfSize + 1, height / 2, halfSize]}>
        <boxGeometry args={[2, height, 0.2]} />
        <meshStandardMaterial color="#f0efe8" roughness={0.7} />
      </mesh>
      <mesh position={[halfSize - 1, height / 2, halfSize]}>
        <boxGeometry args={[2, height, 0.2]} />
        <meshStandardMaterial color="#f0efe8" roughness={0.7} />
      </mesh>
    </group>
  );
};

const Ceiling = ({ size, isAdvanced }: { size: number; isAdvanced: boolean }) => (
  <group>
    {/* Main ceiling */}
    <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color="#e0dfd8" roughness={0.8} />
    </mesh>
    
    {/* Ventilation ducts */}
    <VentilationDuct position={[-2, 3.7, 0]} length={isAdvanced ? 18 : 10} />
    <VentilationDuct position={[2, 3.7, 0]} length={isAdvanced ? 18 : 10} />
    
    {/* Cable trays */}
    <CableTray position={[0, 3.5, -3]} length={isAdvanced ? 16 : 8} />
  </group>
);

const VentilationDuct = ({ position, length }: { position: [number, number, number]; length: number }) => (
  <mesh position={position} rotation={[0, 0, Math.PI / 2]}>
    <boxGeometry args={[0.4, length, 0.3]} />
    <meshStandardMaterial color="#8a8a8a" metalness={0.4} roughness={0.5} />
  </mesh>
);

const CableTray = ({ position, length }: { position: [number, number, number]; length: number }) => (
  <mesh position={position}>
    <boxGeometry args={[0.3, 0.1, length]} />
    <meshStandardMaterial color="#5a5a5a" metalness={0.3} roughness={0.6} />
  </mesh>
);

const LabTable = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Table top - 0.9m height */}
    <mesh position={[0, 0.9, 0]} castShadow>
      <boxGeometry args={[2, 0.05, 1]} />
      <meshStandardMaterial color="#d0d0cc" metalness={0.2} roughness={0.4} />
    </mesh>
    {/* Metal legs */}
    {[[-0.9, 0, -0.4], [0.9, 0, -0.4], [-0.9, 0, 0.4], [0.9, 0, 0.4]].map((pos, i) => (
      <mesh key={i} position={[pos[0], 0.45, pos[2]]}>
        <boxGeometry args={[0.04, 0.9, 0.04]} />
        <meshStandardMaterial color="#606060" metalness={0.5} roughness={0.4} />
      </mesh>
    ))}
    {/* Lab equipment - beaker */}
    <mesh position={[0.3, 1.05, 0]}>
      <cylinderGeometry args={[0.08, 0.06, 0.2]} />
      <meshStandardMaterial color="#b8d4e8" transparent opacity={0.5} roughness={0.1} />
    </mesh>
    {/* Bunsen burner base */}
    <mesh position={[-0.3, 0.95, 0.2]}>
      <cylinderGeometry args={[0.05, 0.06, 0.1]} />
      <meshStandardMaterial color="#404040" metalness={0.6} roughness={0.3} />
    </mesh>
  </group>
);

const Cabinet = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh position={[0, 1.2, 0]} castShadow>
      <boxGeometry args={[0.8, 2.4, 0.6]} />
      <meshStandardMaterial color="#f5f5dc" roughness={0.6} />
    </mesh>
    {/* Cabinet door handles */}
    <mesh position={[0.3, 1.4, 0.32]}>
      <boxGeometry args={[0.02, 0.15, 0.02]} />
      <meshStandardMaterial color="#808080" metalness={0.7} roughness={0.3} />
    </mesh>
    {/* Hazard label */}
    <mesh position={[0, 2, 0.31]}>
      <planeGeometry args={[0.3, 0.15]} />
      <meshBasicMaterial color="#ffcc00" />
    </mesh>
  </group>
);

const ChemicalDrum = ({ position, color, label }: { position: [number, number, number]; color: string; label: string }) => (
  <group position={position}>
    <mesh position={[0, 0.45, 0]} castShadow>
      <cylinderGeometry args={[0.25, 0.25, 0.9]} />
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
    </mesh>
    {/* Top rim */}
    <mesh position={[0, 0.9, 0]}>
      <cylinderGeometry args={[0.27, 0.27, 0.05]} />
      <meshStandardMaterial color="#404040" metalness={0.5} roughness={0.4} />
    </mesh>
  </group>
);

const FloorDrain = ({ position }: { position: [number, number, number] }) => (
  <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
    <circleGeometry args={[0.15, 8]} />
    <meshStandardMaterial color="#404040" metalness={0.4} roughness={0.6} />
  </mesh>
);

const HazardTape = ({ position, rotation }: { position: [number, number, number]; rotation: number }) => (
  <mesh position={position} rotation={[-Math.PI / 2, rotation, 0]}>
    <planeGeometry args={[2, 0.1]} />
    <meshBasicMaterial color="#ffd700" />
  </mesh>
);

const PipeSystem = ({ scenario }: { scenario: ScenarioType }) => {
  const isAdvanced = scenario === 'advanced';
  
  return (
    <group>
      {/* Main horizontal pipe - mounted at realistic height */}
      <mesh position={[0, 2.5, -4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, isAdvanced ? 16 : 8]} />
        <meshStandardMaterial color="#708090" metalness={0.5} roughness={0.4} />
      </mesh>
      
      {/* Pipe labels */}
      <PipeLabel position={[-1, 2.5, -3.85]} text="→ GAS" />
      <PipeLabel position={[1, 2.5, -3.85]} text="→ GAS" />
      
      {/* Vertical pipes - 1.5-2.5m height range */}
      <mesh position={[-2, 1.5, -4]}>
        <cylinderGeometry args={[0.08, 0.08, 2]} />
        <meshStandardMaterial color="#708090" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[2, 1.5, -4]}>
        <cylinderGeometry args={[0.08, 0.08, 2]} />
        <meshStandardMaterial color="#708090" metalness={0.5} roughness={0.4} />
      </mesh>
      
      {/* Pressure gauges */}
      <PressureGauge position={[-2, 2.2, -3.85]} />
      <PressureGauge position={[2, 2.2, -3.85]} />
      
      {isAdvanced && (
        <>
          <mesh position={[-5, 1.5, -4]}>
            <cylinderGeometry args={[0.08, 0.08, 2]} />
            <meshStandardMaterial color="#708090" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[5, 1.5, -4]}>
            <cylinderGeometry args={[0.08, 0.08, 2]} />
            <meshStandardMaterial color="#708090" metalness={0.5} roughness={0.4} />
          </mesh>
          <PressureGauge position={[-5, 2.2, -3.85]} />
          <PressureGauge position={[5, 2.2, -3.85]} />
        </>
      )}
    </group>
  );
};

const PipeLabel = ({ position, text }: { position: [number, number, number]; text: string }) => (
  <mesh position={position}>
    <planeGeometry args={[0.4, 0.12]} />
    <meshBasicMaterial color="#ffff00" />
  </mesh>
);

const PressureGauge = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.08, 0.08, 0.03]} />
      <meshStandardMaterial color="#e0e0e0" metalness={0.3} roughness={0.4} />
    </mesh>
    <mesh position={[0, 0, 0.02]}>
      <circleGeometry args={[0.06, 16]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  </group>
);

const EmergencyShower = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Pole */}
    <mesh position={[0, 1.2, 0]}>
      <cylinderGeometry args={[0.03, 0.03, 2.4]} />
      <meshStandardMaterial color="#708090" metalness={0.5} roughness={0.4} />
    </mesh>
    {/* Shower head */}
    <mesh position={[0, 2.3, 0]}>
      <cylinderGeometry args={[0.15, 0.1, 0.1]} />
      <meshStandardMaterial color="#c0c0c0" metalness={0.6} roughness={0.3} />
    </mesh>
    {/* Pull handle */}
    <mesh position={[0.15, 1.8, 0]} rotation={[0, 0, Math.PI / 4]}>
      <boxGeometry args={[0.02, 0.3, 0.02]} />
      <meshStandardMaterial color="#d32f2f" />
    </mesh>
  </group>
);

const EyewashStation = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Base */}
    <mesh position={[0, 0.5, 0]}>
      <cylinderGeometry args={[0.15, 0.15, 1]} />
      <meshStandardMaterial color="#2e7d32" metalness={0.3} roughness={0.5} />
    </mesh>
    {/* Bowl */}
    <mesh position={[0, 1.05, 0]}>
      <cylinderGeometry args={[0.2, 0.15, 0.1]} />
      <meshStandardMaterial color="#b0b0b0" metalness={0.5} roughness={0.3} />
    </mesh>
  </group>
);

const FireExtinguisher = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh position={[0, 0.4, 0]}>
      <cylinderGeometry args={[0.1, 0.1, 0.8]} />
      <meshStandardMaterial color="#d32f2f" roughness={0.4} />
    </mesh>
    <mesh position={[0, 0.85, 0]}>
      <cylinderGeometry args={[0.05, 0.08, 0.1]} />
      <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.4} />
    </mesh>
  </group>
);

const ElectricalPanel = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh>
      <boxGeometry args={[0.1, 1.2, 0.8]} />
      <meshStandardMaterial color="#808080" metalness={0.4} roughness={0.5} />
    </mesh>
    {/* Warning sign */}
    <mesh position={[0.06, 0.3, 0]}>
      <planeGeometry args={[0.15, 0.15]} />
      <meshBasicMaterial color="#ffcc00" />
    </mesh>
  </group>
);

const SafetyPoster = ({ position, text }: { position: [number, number, number]; text: string }) => (
  <mesh position={position}>
    <planeGeometry args={[0.6, 0.8]} />
    <meshBasicMaterial color="#ffffff" />
  </mesh>
);

const ExitSign = ({ position, rotation }: { position: [number, number, number]; rotation: number }) => (
  <mesh position={position} rotation={[0, rotation, 0]}>
    <boxGeometry args={[0.05, 0.2, 0.5]} />
    <meshStandardMaterial color="#2e7d32" emissive="#2e7d32" emissiveIntensity={0.5} />
  </mesh>
);

const CeilingLight = ({ position }: { position: [number, number, number] }) => {
  const lightRef = useRef<Mesh>(null);
  
  return (
    <group position={position}>
      {/* Light fixture housing */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.08, 0.3]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.5} />
      </mesh>
      {/* Light panel */}
      <mesh ref={lightRef} position={[0, -0.05, 0]}>
        <boxGeometry args={[1.1, 0.02, 0.25]} />
        <meshStandardMaterial 
          color="#fffef5" 
          emissive="#fffef5" 
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
};
