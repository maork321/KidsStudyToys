
import { Course } from '../types';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';

interface CourseCardProps {
  course: Course;
  isTvFocused?: boolean;
  onClick?: () => void;
}

export default function CourseCard({ course, isTvFocused = false, onClick }: CourseCardProps) {
  const navigate = useNavigate();
  const getCourseProgress = useAppStore(state => state.getCourseProgress);
  const progress = getCourseProgress(course.id);
  
  const handleClick = () => {
    onClick?.();
    navigate(`/course/${course.id}`);
  };
  
  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg transition-all duration-300 ${
        isTvFocused 
          ? 'scale-110 shadow-2xl ring-4 ring-blue-500' 
          : 'hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      <div className="relative">
        <img 
          src={course.cover} 
          alt={course.title}
          className={`w-full object-cover ${isTvFocused ? 'h-56' : 'h-40 md:h-48'}`}
        />
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full font-bold ${isTvFocused ? 'bg-yellow-400 text-yellow-900 text-lg px-4 py-2' : 'bg-yellow-400 text-yellow-900 text-sm md:text-base md:px-4 md:py-2'}`}>
          L{course.level}
        </div>
        {progress && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-white/30 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-green-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <div className={`p-4 ${isTvFocused ? 'p-6' : 'md:p-5'}`}>
        <h3 className={`font-bold text-gray-800 mb-2 ${isTvFocused ? 'text-2xl' : 'text-lg md:text-xl'}`}>
          {course.title}
        </h3>
        <p className={`text-gray-500 mb-3 ${isTvFocused ? 'text-base' : 'text-sm md:text-base'}`}>
          {course.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-yellow-500">
            <span className={`${isTvFocused ? 'text-2xl' : 'text-xl md:text-2xl'}`}>⭐</span>
            <span className={`ml-1 font-bold ${isTvFocused ? 'text-xl' : 'md:text-lg'}`}>{course.points}</span>
          </div>
          {progress?.completed && (
            <div className={`px-3 py-1 rounded-full font-bold ${isTvFocused ? 'bg-green-100 text-green-600 text-base px-4' : 'bg-green-100 text-green-600 text-sm md:text-base md:px-4'}`}>
              ✓ 已完成
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
