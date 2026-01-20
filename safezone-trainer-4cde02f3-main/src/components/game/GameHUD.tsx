import { GameProgress, LevelType } from '@/types/game';
import { Shield, Search, Settings, CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameHUDProps {
  progress: GameProgress;
  onReset: () => void;
}

const levelInfo: Record<LevelType, { label: string; icon: React.ReactNode; instruction: string }> = {
  ppe: {
    label: 'WEAR PPE',
    icon: <Shield className="w-5 h-5" />,
    instruction: 'Locate and equip the PPE suit before entering the hazard area',
  },
  identify: {
    label: 'IDENTIFY LEAK',
    icon: <Search className="w-5 h-5" />,
    instruction: 'Find and tap on the source of the gas leakage',
  },
  valve: {
    label: 'CLOSE VALVE',
    icon: <Settings className="w-5 h-5" />,
    instruction: 'Locate the correct valve and tap to close it',
  },
};

export const GameHUD = ({ progress, onReset }: GameHUDProps) => {
  const currentLevelInfo = levelInfo[progress.currentLevel];
  const levelOrder: LevelType[] = ['ppe', 'identify', 'valve'];

  return (
    <div className="absolute inset-x-0 top-0 z-20 pointer-events-none">
      {/* Top bar */}
      <div className="p-4 pointer-events-auto">
        <div className="flex items-center justify-between mb-4">
          {/* Scenario badge */}
          <div className="px-3 py-1 bg-muted/90 backdrop-blur rounded-full border border-border">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {progress.scenario === 'basic' ? 'Basic' : 'Advanced'} Scenario
            </span>
          </div>

          {/* Exit button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground"
          >
            EXIT
          </Button>
        </div>

        {/* Level progress */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {levelOrder.map((level, index) => {
            const info = levelInfo[level];
            const levelProgress = progress.levels.find(l => l.level === level);
            const isCompleted = levelProgress?.completed;
            const isCurrent = progress.currentLevel === level;

            return (
              <div key={level} className="flex items-center">
                <div
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg transition-all
                    ${isCurrent ? 'bg-warning/20 border-2 border-warning' : ''}
                    ${isCompleted ? 'bg-accent/20 border border-accent' : ''}
                    ${!isCurrent && !isCompleted ? 'bg-muted/50 border border-border' : ''}
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-accent" />
                  ) : isCurrent ? (
                    <Circle className="w-4 h-4 text-warning fill-warning" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className={`text-xs font-medium ${isCurrent ? 'text-warning' : isCompleted ? 'text-accent' : 'text-muted-foreground'}`}>
                    {index + 1}
                  </span>
                </div>
                {index < levelOrder.length - 1 && (
                  <div className={`w-8 h-0.5 ${isCompleted ? 'bg-accent' : 'bg-border'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Current objective */}
        <div className="bg-card/90 backdrop-blur p-4 rounded-lg border border-warning/50 industrial-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-warning/20 rounded-lg text-warning">
              {currentLevelInfo.icon}
            </div>
            <div>
              <h3 className="font-bold text-warning text-sm">{currentLevelInfo.label}</h3>
              <p className="text-xs text-muted-foreground">Level {levelOrder.indexOf(progress.currentLevel) + 1} of 3</p>
            </div>
          </div>
          <p className="text-sm text-foreground">{currentLevelInfo.instruction}</p>
        </div>
      </div>
    </div>
  );
};
