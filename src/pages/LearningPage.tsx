
import { Navigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { courses } from '../data/initialData';
import CourseCard from '../components/CourseCard';
import NavBar from '../components/NavBar';

export default function LearningPage() {
  const isLoggedIn = useAppStore(state => state.isLoggedIn);
  const learningProgress = useAppStore(state => state.learningProgress);
  const getCompletedCourses = useAppStore(state => state.getCompletedCourses);
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  const completedCourses = getCompletedCourses();
  const inProgressCourses = courses.filter(c => 
    learningProgress.some(p => p.courseId === c.id && !p.completed)
  );
  const totalStudyTime = learningProgress.reduce((sum, p) => sum + p.studyTime, 0);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-24">
      <div className="max-w-lg mx-auto px-4 py-6 md:max-w-5xl md:py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center md:text-4xl">
            <span className="text-4xl mr-3 md:text-5xl">📊</span>
            学习中心
          </h1>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-6">
            <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl p-6 text-white text-center shadow-lg md:p-8">
              <div className="text-4xl mb-2 md:text-5xl">📚</div>
              <div className="text-3xl font-bold md:text-4xl">{completedCourses.length}</div>
              <div className="text-sm opacity-90 md:text-base">已完成课程</div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-400 to-cyan-400 rounded-3xl p-6 text-white text-center shadow-lg md:p-8">
              <div className="text-4xl mb-2 md:text-5xl">⏱️</div>
              <div className="text-3xl font-bold md:text-4xl">{totalStudyTime}</div>
              <div className="text-sm opacity-90 md:text-base">学习次数</div>
            </div>
          </div>
        </div>
        
        {inProgressCourses.length > 0 && (
          <div className="mb-8 md:mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center md:text-2xl">
              <span className="text-2xl mr-2 md:text-3xl">🚀</span>
              正在学习
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {inProgressCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        )}
        
        {completedCourses.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center md:text-2xl">
              <span className="text-2xl mr-2 md:text-3xl">🏆</span>
              已完成
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {completedCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        )}
        
        {completedCourses.length === 0 && inProgressCourses.length === 0 && (
          <div className="text-center py-12 md:py-16">
            <div className="text-8xl mb-4 md:text-9xl">📖</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2 md:text-2xl">还没有学习记录</h3>
            <p className="text-gray-500 mb-6 md:text-lg md:mb-8">快去首页开始你的学习之旅吧！</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg md:text-xl md:px-10 md:py-5"
            >
              开始学习 🎉
            </button>
          </div>
        )}
      </div>
      
      <NavBar />
    </div>
  );
}
