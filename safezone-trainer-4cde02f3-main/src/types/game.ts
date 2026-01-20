export type ScenarioType = 'basic' | 'advanced';

export type LevelType = 'ppe' | 'identify' | 'valve';

export type GameState = 'menu' | 'playing' | 'dashboard';

export interface LevelProgress {
  level: LevelType;
  completed: boolean;
  attempts: number;
  timeSpent: number;
  failureReason?: string;
}

export interface GameProgress {
  scenario: ScenarioType;
  currentLevel: LevelType;
  levels: LevelProgress[];
  startTime: number;
  ppeEquipped: boolean;
  gasIdentified: boolean;
  valveClosed: boolean;
}

export interface FinalScore {
  scenario: ScenarioType;
  levels: LevelProgress[];
  totalTime: number;
  totalAttempts: number;
  score: number;
  feedback: string;
}
