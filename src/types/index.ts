
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  level: number;
  createdAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  enabled: boolean;
}

// 题库相关类型
export interface QuestionBank {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  type: string;
  difficulty: 1 | 2 | 3;
  content: string;
  options?: string[];
  correctAnswer: string | string[] | number;
  explanation?: string;
  image?: string;
}

// 语文学科特定格式
export interface ChineseQuestion extends Question {
  type: 'pinyin' | 'character' | 'poem' | 'reading' | 'multiple_choice' | 'fill_blank' | 'true_false' | 'matching' | 'calculation';
  pinyin?: string;
  radicals?: string[];
  strokes?: number;
}

// 数学学科特定格式
export interface MathQuestion extends Question {
  type: 'calculation' | 'geometry' | 'application' | 'multiple_choice' | 'fill_blank' | 'true_false' | 'matching';
  operand1?: number;
  operand2?: number;
  operator?: '+' | '-' | '×' | '÷';
  unit?: string;
}

// 英语学科特定格式
export interface EnglishQuestion extends Question {
  type: 'vocabulary' | 'spelling' | 'listening' | 'reading' | 'multiple_choice' | 'fill_blank' | 'true_false' | 'matching' | 'calculation';
  phonetic?: string;
  translation?: string;
  audio?: string;
}

// 科学学科特定格式
export interface ScienceQuestion extends Question {
  type: 'nature' | 'physics' | 'chemistry' | 'biology' | 'multiple_choice' | 'fill_blank' | 'true_false' | 'matching' | 'calculation';
  category?: string;
  experiment?: boolean;
}

export interface Course {
  id: string;
  subjectId: string;
  title: string;
  cover: string;
  level: number;
  description: string;
  content: LessonStep[];
  points: number;
}

export interface LessonStep {
  id: string;
  type: 'intro' | 'quiz' | 'drag' | 'match' | 'complete';
  title: string;
  description?: string;
  question?: string;
  options?: string[];
  correctAnswer?: string | string[];
  image?: string;
}

export interface LearningProgress {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  completed: boolean;
  lastStudied: Date;
  studyTime: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'courses' | 'streak' | 'points';
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
}

export interface UserPoints {
  id: string;
  userId: string;
  totalPoints: number;
  availablePoints: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  type: 'avatar' | 'decoration' | 'badge';
}

export interface UserInventory {
  id: string;
  userId: string;
  itemId: string;
  purchasedAt: Date;
}
