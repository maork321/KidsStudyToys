
import { useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  
  const isPracticePage = location.pathname.includes('/math-practice');
  const isFullPage = ['/login', '/parent'].includes(location.pathname);
  
  if (isPracticePage || isFullPage) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 flex items-center justify-between px-4 bg-white/80 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-40">
      <div className="text-sm text-gray-600 font-medium">
        by <span className="font-bold text-indigo-600">ruok</span>
      </div>
      <div className="text-sm text-gray-400 font-medium">
        v{__APP_VERSION__}
      </div>
    </div>
  );
}
