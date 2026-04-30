
import { useState, useEffect } from 'react';
import { subjects } from '../data/initialData';
import SubjectCard from '../components/SubjectCard';
import CourseCard from '../components/CourseCard';
import NavBar from '../components/NavBar';
import { useAppStore } from '../store';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Home() {
  const user = useAppStore(state => state.user);
  const isLoggedIn = useAppStore(state => state.isLoggedIn);
  const tvMode = useAppStore(state => state.tvMode);
  const getRecommendedCourses = useAppStore(state => state.getRecommendedCourses);
  const navigate = useNavigate();
  
  const recommendedCourses = getRecommendedCourses();
  const completedCount = useAppStore(state => state.learningProgress.filter(p => p.completed).length);
  
  const [focusedSubject, setFocusedSubject] = useState(0);
  const [focusedCourse, setFocusedCourse] = useState(0);
  const [focusSection, setFocusSection] = useState<'subjects' | 'courses'>('subjects');
  
  useEffect(() => {
    if (!tvMode) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (focusSection === 'subjects') {
            setFocusedSubject(prev => Math.max(0, prev - 1));
          } else {
            setFocusedCourse(prev => Math.max(0, prev - 1));
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (focusSection === 'subjects') {
            setFocusedSubject(prev => Math.min(subjects.length - 1, prev + 1));
          } else {
            setFocusedCourse(prev => Math.min(recommendedCourses.length - 1, prev + 1));
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (focusSection === 'subjects') {
            setFocusSection('courses');
            setFocusedCourse(0);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (focusSection === 'courses') {
            setFocusSection('subjects');
            setFocusedSubject(0);
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (focusSection === 'subjects') {
            navigate(`/subject/${subjects[focusedSubject].id}`);
          } else {
            navigate(`/course/${recommendedCourses[focusedCourse].id}`);
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tvMode, focusedSubject, focusedCourse, focusSection, navigate, recommendedCourses]);
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  const headerBg = tvMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-purple-500 to-pink-500';
  const textSize = tvMode ? 'text-4xl' : 'text-2xl';
  const subtitleSize = tvMode ? 'text-lg' : 'text-base';
  const avatarSize = tvMode ? 'text-8xl' : 'text-6xl';
  const avatarBadgeSize = tvMode ? 'text-3xl' : 'text-2xl';
  const badgePadding = tvMode ? 'px-6 py-3' : 'px-4 py-2';
  const sectionTitleSize = tvMode ? 'text-3xl' : 'text-xl';
  const iconSize = tvMode ? 'text-4xl' : 'text-2xl';
  const gridCols = tvMode ? 'grid-cols-4' : 'grid-cols-2';
  const sectionGap = tvMode ? 'gap-6 mb-12' : 'gap-4 mb-8';
  const sectionTextColor = tvMode ? 'text-white' : 'text-gray-800';
  const pageBg = tvMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50';
  const badgeGap = tvMode ? 'gap-6' : 'gap-4';
  
  return (
    <div className={`min-h-screen pb-24 ${pageBg}`}>
      <div className={`${tvMode ? 'max-w-5xl' : 'max-w-lg'} mx-auto px-4 py-6`}>
        <div className={`rounded-3xl p-6 mb-6 shadow-xl ${headerBg}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`font-bold ${textSize} text-white`}>
                你好，{user?.username}！
              </h1>
              <p className={`mt-1 opacity-90 text-white ${subtitleSize}`}>
                今天也要加油学习哦 ✨
              </p>
            </div>
            <div className={avatarSize}>{user?.avatar}</div>
          </div>
          <div className={`mt-4 flex items-center ${badgeGap}`}>
            <div className={`rounded-2xl bg-white/20 ${badgePadding}`}>
              <span className={avatarBadgeSize}>📚</span>
              <span className={`ml-2 font-bold text-white ${avatarBadgeSize}`}>
                {completedCount}
              </span>
              <span className={`ml-1 text-white ${subtitleSize}`}>已完成</span>
            </div>
            <div className={`rounded-2xl bg-white/20 ${badgePadding}`}>
              <span className={avatarBadgeSize}>⭐</span>
              <span className={`ml-2 font-bold text-white ${avatarBadgeSize}`}>
                Lv.{user?.level}
              </span>
            </div>
          </div>
        </div>
        
        <div className={sectionGap}>
          <h2 className={`font-bold mb-4 flex items-center ${sectionTitleSize} ${sectionTextColor}`}>
            <span className={`mr-2 ${iconSize}`}>🎯</span>
            探索学科
          </h2>
          <div className={`grid ${gridCols} gap-4`}>
            {subjects.map((subject, index) => (
              <SubjectCard 
                key={subject.id} 
                subject={subject} 
                isTvFocused={tvMode && focusSection === 'subjects' && focusedSubject === index}
                onClick={() => tvMode && navigate(`/subject/${subject.id}`)}
              />
            ))}
          </div>
        </div>
        
        <div>
          <h2 className={`font-bold mb-4 flex items-center ${sectionTitleSize} ${sectionTextColor}`}>
            <span className={`mr-2 ${iconSize}`}>✨</span>
            为你推荐
          </h2>
          <div className={`grid ${gridCols} gap-4`}>
            {recommendedCourses.map((course, index) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                isTvFocused={tvMode && focusSection === 'courses' && focusedCourse === index}
                onClick={() => tvMode && navigate(`/course/${course.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
      
      <NavBar />
    </div>
  );
}
