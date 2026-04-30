
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { courses } from '../data/initialData';
import CourseCard from '../components/CourseCard';
import NavBar from '../components/NavBar';
import { useAppStore } from '../store';
import { ArrowLeft, Calculator } from 'lucide-react';

export default function SubjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isLoggedIn = useAppStore(state => state.isLoggedIn);
  const subjects = useAppStore(state => state.subjects);
  
  const subject = subjects.find(s => s.id === id);
  const subjectCourses = courses.filter(c => c.subjectId === id);
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (!subject) {
    return <Navigate to="/" replace />;
  }
  
  if (!subject.enabled) {
    return <Navigate to="/" replace />;
  }
  
  const levels = Array.from(new Set(subjectCourses.map(c => c.level))).sort((a, b) => a - b);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-24">
      <div className="max-w-lg mx-auto md:max-w-5xl">
        <div className={`bg-gradient-to-br ${subject.color} px-4 pt-12 pb-8 md:px-8`}>
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-white/90 hover:text-white mb-4"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            <span className="font-medium">返回</span>
          </button>
          
          <div className="text-center">
            <div className="text-7xl mb-4 md:text-8xl">{subject.icon}</div>
            <h1 className="text-3xl font-bold text-white mb-2 md:text-4xl">{subject.name}</h1>
            <p className="text-white/80 md:text-lg">{subject.description}</p>
          </div>
        </div>
        
        <div className="px-4 py-6 md:px-8 md:py-8">
          {id === 'math' && (
            <div className="mb-6">
              <button
                onClick={() => navigate('/math-practice')}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
              >
                <Calculator className="w-8 h-8 md:w-10 md:h-10" />
                <div className="text-left">
                  <div className="text-xl font-bold md:text-2xl">🎯 快速练习</div>
                  <div className="text-sm opacity-90 md:text-base">加减乘除，定制难度</div>
                </div>
              </button>
            </div>
          )}
          
          {levels.map(level => (
            <div key={level} className="mb-8 md:mb-10">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center md:text-2xl">
                <span className="text-2xl mr-2 md:text-3xl">
                  {level === 1 ? '🌱' : level === 2 ? '🌿' : '🌳'}
                </span>
                等级 {level}
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                {subjectCourses
                  .filter(c => c.level === level)
                  .map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <NavBar />
    </div>
  );
}
