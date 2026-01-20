import { useState, useCallback } from 'react';
import { GameState, ScenarioType, LevelType, GameProgress, LevelProgress, FinalScore } from '@/types/game';

const initialLevels: LevelProgress[] = [
  { level: 'ppe', completed: false, attempts: 0, timeSpent: 0 },
  { level: 'identify', completed: false, attempts: 0, timeSpent: 0 },
  { level: 'valve', completed: false, attempts: 0, timeSpent: 0 },
];

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [finalScore, setFinalScore] = useState<FinalScore | null>(null);
  const [levelStartTime, setLevelStartTime] = useState<number>(0);

  const startGame = useCallback((scenario: ScenarioType) => {
    setProgress({
      scenario,
      currentLevel: 'ppe',
      levels: initialLevels.map(l => ({ ...l })),
      startTime: Date.now(),
      ppeEquipped: false,
      gasIdentified: false,
      valveClosed: false,
    });
    setLevelStartTime(Date.now());
    setGameState('playing');
  }, []);

  const completeLevel = useCallback((success: boolean, failureReason?: string) => {
    if (!progress) return;

    const timeSpent = (Date.now() - levelStartTime) / 1000;
    const currentLevelIndex = progress.levels.findIndex(l => l.level === progress.currentLevel);
    
    setProgress(prev => {
      if (!prev) return prev;
      
      const updatedLevels = [...prev.levels];
      updatedLevels[currentLevelIndex] = {
        ...updatedLevels[currentLevelIndex],
        attempts: updatedLevels[currentLevelIndex].attempts + 1,
        timeSpent: updatedLevels[currentLevelIndex].timeSpent + timeSpent,
        completed: success,
        failureReason: success ? undefined : failureReason,
      };

      if (success) {
        const levelOrder: LevelType[] = ['ppe', 'identify', 'valve'];
        const nextLevelIndex = levelOrder.indexOf(prev.currentLevel) + 1;
        
        if (nextLevelIndex >= levelOrder.length) {
          // Game complete - calculate final score
          const totalTime = updatedLevels.reduce((sum, l) => sum + l.timeSpent, 0);
          const totalAttempts = updatedLevels.reduce((sum, l) => sum + l.attempts, 0);
          const baseScore = 1000;
          const timeBonus = Math.max(0, 300 - totalTime) * 2;
          const attemptPenalty = (totalAttempts - 3) * 50;
          const score = Math.max(0, baseScore + timeBonus - attemptPenalty);
          
          setFinalScore({
            scenario: prev.scenario,
            levels: updatedLevels,
            totalTime,
            totalAttempts,
            score,
            feedback: score >= 1000 ? 'Excellent response! You handled the situation professionally.' :
                      score >= 700 ? 'Good job! Minor improvements needed in response time.' :
                      'Needs improvement. Review the safety protocols and try again.',
          });
          setGameState('dashboard');
          return prev;
        }

        setLevelStartTime(Date.now());
        return {
          ...prev,
          levels: updatedLevels,
          currentLevel: levelOrder[nextLevelIndex],
          ppeEquipped: prev.currentLevel === 'ppe' ? true : prev.ppeEquipped,
          gasIdentified: prev.currentLevel === 'identify' ? true : prev.gasIdentified,
          valveClosed: prev.currentLevel === 'valve' ? true : prev.valveClosed,
        };
      }

      return { ...prev, levels: updatedLevels };
    });
  }, [progress, levelStartTime]);

  const resetGame = useCallback(() => {
    setGameState('menu');
    setProgress(null);
    setFinalScore(null);
  }, []);

  return {
    gameState,
    progress,
    finalScore,
    startGame,
    completeLevel,
    resetGame,
  };
};
