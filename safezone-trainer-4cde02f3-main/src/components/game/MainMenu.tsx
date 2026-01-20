import { ScenarioType } from '@/types/game';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Flame } from 'lucide-react';

interface MainMenuProps {
  onStartGame: (scenario: ScenarioType) => void;
}

export const MainMenu = ({ onStartGame }: MainMenuProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-industrial to-background" />
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-warning via-danger to-warning animate-glow-pulse" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-lg mx-auto animate-fade-in">
        {/* Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-warning/20 flex items-center justify-center industrial-border">
              <AlertTriangle className="w-12 h-12 text-warning" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-danger rounded-full animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
          CHEMICAL DISASTER
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-warning mb-4">
          RESPONSE TRAINING
        </h2>
        <p className="text-muted-foreground text-sm md:text-base mb-10 leading-relaxed">
          Learn correct emergency response procedures for chemical gas leakage incidents
        </p>

        {/* Scenario Buttons */}
        <div className="space-y-4">
          <Button
            onClick={() => onStartGame('basic')}
            className="w-full h-16 text-lg font-semibold bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 hazard-glow"
          >
            <Shield className="w-6 h-6 mr-3" />
            BASIC SCENARIO
          </Button>
          
          <Button
            onClick={() => onStartGame('advanced')}
            variant="secondary"
            className="w-full h-16 text-lg font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all duration-300 danger-glow"
          >
            <Flame className="w-6 h-6 mr-3" />
            ADVANCED SCENARIO
          </Button>
        </div>

        {/* Instructions hint */}
        <div className="mt-10 p-4 bg-muted/50 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Training Objectives</p>
          <div className="flex justify-around text-sm">
            <span className="text-foreground">1. Wear PPE</span>
            <span className="text-foreground">2. Identify Leak</span>
            <span className="text-foreground">3. Close Valve</span>
          </div>
        </div>
      </div>
    </div>
  );
};
