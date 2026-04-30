
import { useParams, useNavigate } from 'react-router-dom';
import { subjects, courses } from '../data/initialData';
import CourseCard from '../components/CourseCard';
import NavBar from '../components/NavBar';
import { useAppStore } from '../store';
import { ArrowLeft, Calculator } from 'lucide-react';

export default function SubjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isLoggedIn = useAppStore(state => state.isLoggedIn);
  
  const subject = subjects.find(s => s.id === id);
  const subjectCourses = courses.filter(c => c.subjectId === id);
  
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }
  
  if (!subject) {
    return <div>学科不存在</div>;
  }
  
  const levels = Array.from(new Set(subjectCourses.map(c => c.level))).sort((a, b) => a - b);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-24">
      <div className="max-w-lg mx-auto">
        <div className={`bg-gradient-to-br ${subject.color} px-4 pt-12 pb-8`}>
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-white/90 hover:text-white mb-4"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            <span className="font-medium">返回</span>
          </button>
          
          <div className="text-center">
            <div className="text-7xl mb-4">{subject.icon}</div>
            <h1 className="text-3xl font-bold text-white mb-2">{subject.name}</h1>
            <p className="text-white/80">{subject.description}</p>
          </div>
        </div>
        
        <div className="px-4 py-6">
          {id === 'math' && (
            <div className="mb-6">
              <button
                onClick={() => navigate('/math-practice')}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
              >
                <Calculator className="w-8 h-8" />
                <div className="text-left">
                  <div className="text-xl font-bold">🎯 快速练习</div>
                  <div className="text-sm opacity-90">加减乘除，定制难度</div>
                </div>
              </button>
            </div>
          )}
          
          {levels.map(level => (
            <div key={level} className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">
                  {level === 1 ? '🌱' : level === 2 ? '🌿' : '🌳'}
                </span>
                等级 {level}
              </h2>
              <div className="grid grid-cols-2 gap-4">
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
