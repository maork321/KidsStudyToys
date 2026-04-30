
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
