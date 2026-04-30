
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, LearningProgress, UserPoints, UserAchievement, UserInventory, Course } from '../types';
import { courses, achievements, shopItems, subjects } from '../data/initialData';

interface AppState {
  user: User | null;
  isLoggedIn: boolean;
  learningProgress: LearningProgress[];
  userPoints: UserPoints | null;
  userAchievements: UserAchievement[];
  userInventory: UserInventory[];
  
  // 家长控制设置
  dailyTimeLimit: number; // 分钟
  soundEnabled: boolean;
  tvMode: boolean;
  
  // 今日学习时间（分钟）
  todayStudyTime: number;
  lastStudyDate: string;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  startCourse: (courseId: string) => void;
  updateProgress: (courseId: string, progress: number, studyTime: number) => void;
  completeCourse: (courseId: string) => void;
  
  getCourseProgress: (courseId: string) => LearningProgress | undefined;
  getCompletedCourses: () => Course[];
  getRecommendedCourses: () => Course[];
  
  purchaseItem: (itemId: string) => boolean;
  checkAchievements: () => void;
  
  // 家长控制 Actions
  setDailyTimeLimit: (minutes: number) => void;
  toggleSound: () => void;
  toggleTvMode: () => void;
  resetAllData: () => void;
  addStudyTime: (minutes: number) => void;
  checkTimeLimit: () => boolean;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const getTodayString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      learningProgress: [],
      userPoints: null,
      userAchievements: [],
      userInventory: [],
      
      dailyTimeLimit: 60,
      soundEnabled: true,
      tvMode: false,
      todayStudyTime: 0,
      lastStudyDate: getTodayString(),
      
      login: async (email: string, password: string) => {
        const storedUsers = JSON.parse(localStorage.getItem('kids-edu-users') || '[]');
        const user = storedUsers.find((u: any) => u.email === email);
        
        if (user) {
          const today = getTodayString();
          const savedDate = user.lastStudyDate || today;
          const savedTime = savedDate === today ? (user.todayStudyTime || 0) : 0;
          
          set({ 
            user, 
            isLoggedIn: true,
            learningProgress: user.learningProgress || [],
            userPoints: user.userPoints || null,
            userAchievements: user.userAchievements || [],
            userInventory: user.userInventory || [],
            dailyTimeLimit: user.dailyTimeLimit || 60,
            soundEnabled: user.soundEnabled !== undefined ? user.soundEnabled : true,
            tvMode: user.tvMode || false,
            todayStudyTime: savedTime,
            lastStudyDate: today
          });
          return true;
        }
        return false;
      },
      
      register: async (username: string, email: string, password: string) => {
        const storedUsers = JSON.parse(localStorage.getItem('kids-edu-users') || '[]');
        const existingUser = storedUsers.find((u: any) => u.email === email);
        
        if (existingUser) {
          return false;
        }
        
        const newUser: User = {
          id: generateId(),
          username,
          email,
          avatar: '😊',
          level: 1,
          createdAt: new Date()
        };
        
        const newUserPoints: UserPoints = {
          id: generateId(),
          userId: newUser.id,
          totalPoints: 0,
          availablePoints: 0
        };
        
        const updatedUsers = [...storedUsers, { 
          ...newUser, 
          learningProgress: [], 
          userPoints: newUserPoints, 
          userAchievements: [], 
          userInventory: [],
          dailyTimeLimit: 60,
          soundEnabled: true,
          tvMode: false,
          todayStudyTime: 0,
          lastStudyDate: getTodayString()
        }];
        
        localStorage.setItem('kids-edu-users', JSON.stringify(updatedUsers));
        
        set({ 
          user: newUser, 
          isLoggedIn: true,
          learningProgress: [],
          userPoints: newUserPoints,
          userAchievements: [],
          userInventory: [],
          dailyTimeLimit: 60,
          soundEnabled: true,
          tvMode: false,
          todayStudyTime: 0,
          lastStudyDate: getTodayString()
        });
        
        return true;
      },
      
      logout: () => {
        const { user, learningProgress, userPoints, userAchievements, userInventory, 
                dailyTimeLimit, soundEnabled, tvMode, todayStudyTime, lastStudyDate } = get();
        
        if (user) {
          const storedUsers = JSON.parse(localStorage.getItem('kids-edu-users') || '[]');
          const updatedUsers = storedUsers.map((u: any) => 
            u.id === user.id 
              ? { ...u, learningProgress, userPoints, userAchievements, userInventory,
                  dailyTimeLimit, soundEnabled, tvMode, todayStudyTime, lastStudyDate }
              : u
          );
          localStorage.setItem('kids-edu-users', JSON.stringify(updatedUsers));
        }
        
        set({ 
          user: null, 
          isLoggedIn: false,
          learningProgress: [],
          userPoints: null,
          userAchievements: [],
          userInventory: [],
          dailyTimeLimit: 60,
          soundEnabled: true,
          tvMode: false,
          todayStudyTime: 0,
          lastStudyDate: getTodayString()
        });
      },
      
      startCourse: (courseId: string) => {
        const { user, learningProgress } = get();
        if (!user) return;
        
        const existing = learningProgress.find(p => p.courseId === courseId);
        if (!existing) {
          const newProgress: LearningProgress = {
            id: generateId(),
            userId: user.id,
            courseId,
            progress: 0,
            completed: false,
            lastStudied: new Date(),
            studyTime: 0
          };
          
          set({ learningProgress: [...learningProgress, newProgress] });
        }
      },
      
      updateProgress: (courseId: string, progress: number, studyTime: number) => {
        const { user, learningProgress } = get();
        if (!user) return;
        
        get().addStudyTime(studyTime);
        
        set({
          learningProgress: learningProgress.map(p => 
            p.courseId === courseId 
              ? { ...p, progress, lastStudied: new Date(), studyTime: p.studyTime + studyTime }
              : p
          )
        });
      },
      
      completeCourse: (courseId: string) => {
        const { user, learningProgress, userPoints } = get();
        if (!user || !userPoints) return;
        
        const course = courses.find(c => c.id === courseId);
        if (!course) return;
        
        const updatedProgress = learningProgress.map(p => 
          p.courseId === courseId 
            ? { ...p, progress: 100, completed: true, lastStudied: new Date() }
            : p
        );
        
        const updatedPoints = {
          ...userPoints,
          totalPoints: userPoints.totalPoints + course.points,
          availablePoints: userPoints.availablePoints + course.points
        };
        
        set({
          learningProgress: updatedProgress,
          userPoints: updatedPoints
        });
        
        get().checkAchievements();
      },
      
      getCourseProgress: (courseId: string) => {
        return get().learningProgress.find(p => p.courseId === courseId);
      },
      
      getCompletedCourses: () => {
        const completedIds = get().learningProgress.filter(p => p.completed).map(p => p.courseId);
        return courses.filter(c => completedIds.includes(c.id));
      },
      
      getRecommendedCourses: () => {
        const { learningProgress } = get();
        const completedIds = learningProgress.filter(p => p.completed).map(p => p.courseId);
        
        const notStarted = courses.filter(c => !completedIds.includes(c.id));
        return notStarted.slice(0, 4);
      },
      
      purchaseItem: (itemId: string) => {
        const { user, userPoints, userInventory } = get();
        if (!user || !userPoints) return false;
        
        const item = shopItems.find(i => i.id === itemId);
        if (!item || userPoints.availablePoints < item.price) return false;
        
        const alreadyPurchased = userInventory.some(i => i.itemId === itemId);
        if (alreadyPurchased) return false;
        
        set({
          userPoints: {
            ...userPoints,
            availablePoints: userPoints.availablePoints - item.price
          },
          userInventory: [
            ...userInventory,
            {
              id: generateId(),
              userId: user.id,
              itemId,
              purchasedAt: new Date()
            }
          ]
        });
        
        return true;
      },
      
      checkAchievements: () => {
        const { user, userAchievements, learningProgress, userPoints } = get();
        if (!user || !userPoints) return;
        
        const completedCount = learningProgress.filter(p => p.completed).length;
        const totalPoints = userPoints.totalPoints;
        
        const newAchievements: UserAchievement[] = [];
        
        achievements.forEach(achievement => {
          const alreadyUnlocked = userAchievements.some(a => a.achievementId === achievement.id);
          if (alreadyUnlocked) return;
          
          let unlocked = false;
          switch (achievement.type) {
            case 'courses':
              unlocked = completedCount >= achievement.requirement;
              break;
            case 'points':
              unlocked = totalPoints >= achievement.requirement;
              break;
          }
          
          if (unlocked) {
            newAchievements.push({
              id: generateId(),
              userId: user.id,
              achievementId: achievement.id,
              unlockedAt: new Date()
            });
          }
        });
        
        if (newAchievements.length > 0) {
          set({
            userAchievements: [...userAchievements, ...newAchievements]
          });
        }
      },
      
      setDailyTimeLimit: (minutes: number) => {
        set({ dailyTimeLimit: minutes });
      },
      
      toggleSound: () => {
        set(state => ({ soundEnabled: !state.soundEnabled }));
      },
      
      toggleTvMode: () => {
        set(state => ({ tvMode: !state.tvMode }));
      },
      
      resetAllData: () => {
        const { user } = get();
        if (user) {
          localStorage.removeItem('kids-edu-users');
          localStorage.removeItem('kids-edu-storage');
        }
        set({ 
          user: null, 
          isLoggedIn: false,
          learningProgress: [],
          userPoints: null,
          userAchievements: [],
          userInventory: [],
          dailyTimeLimit: 60,
          soundEnabled: true,
          tvMode: false,
          todayStudyTime: 0,
          lastStudyDate: getTodayString()
        });
      },
      
      addStudyTime: (minutes: number) => {
        const { lastStudyDate, todayStudyTime } = get();
        const today = getTodayString();
        
        if (lastStudyDate === today) {
          set({ todayStudyTime: todayStudyTime + minutes });
        } else {
          set({ todayStudyTime: minutes, lastStudyDate: today });
        }
      },
      
      checkTimeLimit: () => {
        const { dailyTimeLimit, todayStudyTime } = get();
        return todayStudyTime < dailyTimeLimit;
      }
    }),
    {
      name: 'kids-edu-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        learningProgress: state.learningProgress,
        userPoints: state.userPoints,
        userAchievements: state.userAchievements,
        userInventory: state.userInventory,
        dailyTimeLimit: state.dailyTimeLimit,
        soundEnabled: state.soundEnabled,
        tvMode: state.tvMode,
        todayStudyTime: state.todayStudyTime,
        lastStudyDate: state.lastStudyDate
      })
    }
  )
);
