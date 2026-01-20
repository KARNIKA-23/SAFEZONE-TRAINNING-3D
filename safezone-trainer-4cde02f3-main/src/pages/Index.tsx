import { useGameState } from '@/hooks/useGameState';
import { MainMenu } from '@/components/game/MainMenu';
import { GameScene } from '@/components/game/GameScene';
import { Dashboard } from '@/components/game/Dashboard';

const Index = () => {
  const { gameState, progress, finalScore, startGame, completeLevel, resetGame } = useGameState();

  return (
    <div className="min-h-screen bg-background">
      {gameState === 'menu' && <MainMenu onStartGame={startGame} />}
      
      {gameState === 'playing' && progress && (
        <GameScene
          progress={progress}
          onCompleteLevel={completeLevel}
          onReset={resetGame}
        />
      )}
      
      {gameState === 'dashboard' && finalScore && (
        <Dashboard score={finalScore} onRestart={resetGame} />
      )}
    </div>
  );
};

export default Index;
