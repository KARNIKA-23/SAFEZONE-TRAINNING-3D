import { FinalScore, LevelType } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, Clock, Target, AlertTriangle, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface DashboardProps {
  score: FinalScore;
  onRestart: () => void;
}

const levelLabels: Record<LevelType, string> = {
  ppe: 'Wear PPE',
  identify: 'Identify Leak',
  valve: 'Close Valve',
};

export const Dashboard = ({ score, onRestart }: DashboardProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = () => {
    if (score.score >= 1000) return 'text-accent';
    if (score.score >= 700) return 'text-warning';
    return 'text-danger';
  };

  const getScoreGrade = () => {
    if (score.score >= 1000) return 'A';
    if (score.score >= 800) return 'B';
    if (score.score >= 600) return 'C';
    return 'D';
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 overflow-auto">
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">TRAINING COMPLETE</h1>
          <p className="text-muted-foreground">
            {score.scenario === 'basic' ? 'Basic' : 'Advanced'} Scenario Results
          </p>
        </div>

        {/* Score card */}
        <Card className="p-6 bg-card border-2 border-warning/50 industrial-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-warning/20 rounded-xl">
                <Trophy className="w-10 h-10 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Final Score</p>
                <p className={`text-4xl font-bold ${getScoreColor()}`}>{score.score}</p>
              </div>
            </div>
            <div className={`text-6xl font-bold ${getScoreColor()}`}>
              {getScoreGrade()}
            </div>
          </div>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-card">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground uppercase">Total Time</p>
                <p className="text-xl font-bold text-foreground">{formatTime(score.totalTime)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-card">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground uppercase">Total Attempts</p>
                <p className="text-xl font-bold text-foreground">{score.totalAttempts}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Level breakdown */}
        <Card className="p-6 bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Level Breakdown
          </h3>
          <div className="space-y-4">
            {score.levels.map((level, index) => (
              <div
                key={level.level}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center text-warning font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{levelLabels[level.level]}</p>
                    <p className="text-xs text-muted-foreground">
                      {level.attempts} attempt{level.attempts !== 1 ? 's' : ''} • {formatTime(level.timeSpent)}
                    </p>
                  </div>
                </div>
                {level.completed ? (
                  <CheckCircle className="w-6 h-6 text-accent" />
                ) : (
                  <XCircle className="w-6 h-6 text-danger" />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Feedback */}
        <Card className="p-6 bg-card border-l-4 border-accent">
          <h3 className="text-lg font-semibold text-foreground mb-2">Training Feedback</h3>
          <p className="text-muted-foreground">{score.feedback}</p>
        </Card>

        {/* Action buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={onRestart}
            className="flex-1 h-14 text-lg bg-warning hover:bg-warning/90 text-primary-foreground font-bold"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            TRY AGAIN
          </Button>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground pt-4">
          Chemical Disaster Response Training Simulator v1.0
        </p>
      </div>
    </div>
  );
};
