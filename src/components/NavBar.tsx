
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from '../store';
import { Home, BookOpen, Trophy, User, Settings as SettingsIcon, Coins } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/learning', icon: BookOpen, label: '学习' },
  { path: '/achievements', icon: Trophy, label: '成就' },
  { path: '/profile', icon: User, label: '我的' },
  { path: '/settings', icon: SettingsIcon, label: '设置' },
];

export default function NavBar() {
  const userPoints = useAppStore(state => state.userPoints);
  const tvMode = useAppStore(state => state.tvMode);
  const location = useLocation();
  
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    const currentIndex = navItems.findIndex(item => location.pathname === item.path);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [location.pathname]);
  
  useEffect(() => {
    if (!tvMode) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setActiveIndex(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setActiveIndex(prev => Math.min(navItems.length - 1, prev + 1));
          break;
        case 'Enter':
          e.preventDefault();
          window.location.href = navItems[activeIndex].path;
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tvMode, activeIndex]);
  
  return (
    <nav className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 ${tvMode ? 'bg-gray-900 border-gray-700' : ''}`}>
      <div className={`${tvMode ? 'max-w-4xl' : 'max-w-lg md:max-w-4xl'} mx-auto`}>
        <div className={`flex items-center justify-around py-3 ${tvMode ? 'py-6' : 'md:py-4'}`}>
          {navItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => {
                const isTvActive = tvMode && activeIndex === index;
                return `flex flex-col items-center px-4 py-2 md:px-6 md:py-3 rounded-2xl transition-all ${
                  tvMode
                    ? isTvActive
                      ? 'bg-blue-600 text-white scale-110'
                      : isActive
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:text-white'
                    : isActive
                    ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`;
              }}
              onClick={() => tvMode && setActiveIndex(index)}
            >
              <item.icon className={`${tvMode ? 'w-12 h-12' : 'w-6 h-6 md:w-7 md:h-7'}`} />
              <span className={`mt-1 font-medium ${tvMode ? 'text-lg' : 'text-xs md:text-sm'}`}>
                {item.label}
              </span>
            </NavLink>
          ))}
          
          <div className={`flex flex-col items-center ${tvMode ? 'px-6' : 'md:px-4'}`}>
            <div className={`${tvMode ? 'bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full px-6 py-3 shadow-lg' : 'bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full px-4 py-2 md:px-5 md:py-2 shadow-lg'}`}>
              <div className="flex items-center gap-2">
                <Coins className={`${tvMode ? 'w-8 h-8' : 'w-5 h-5 md:w-6 md:h-6'} text-white`} />
                <span className={`font-bold text-white ${tvMode ? 'text-2xl' : 'text-sm md:text-base'}`}>
                  {userPoints?.availablePoints || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
