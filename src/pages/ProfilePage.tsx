
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '../store';
import NavBar from '../components/NavBar';
import ParentPinGate from '../components/ParentPinGate';
import { LogOut } from 'lucide-react';

export default function ProfilePage() {
  const user = useAppStore(state => state.user);
  const isLoggedIn = useAppStore(state => state.isLoggedIn);
  const logout = useAppStore(state => state.logout);
  const userPoints = useAppStore(state => state.userPoints);
  const learningProgress = useAppStore(state => state.learningProgress);
  const userAchievements = useAppStore(state => state.userAchievements);
  
  const [showPinGate, setShowPinGate] = useState(false);
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  const completedCourses = learningProgress.filter(p => p.completed).length;
  const totalPoints = userPoints?.totalPoints || 0;
  const achievementsCount = userAchievements.length;
  
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };
  
  const handleParentCenterClick = () => {
    setShowPinGate(true);
  };
  
  const handlePinVerified = () => {
    setShowPinGate(false);
    window.location.href = '/parent';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pb-24">
      <div className="max-w-lg mx-auto px-4 py-6 md:max-w-4xl md:py-8">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 text-white text-center mb-6 shadow-xl md:p-10">
          <div className="text-8xl mb-4 md:text-9xl">{user?.avatar}</div>
          <h1 className="text-3xl font-bold mb-2 md:text-4xl">{user?.username}</h1>
          <p className="opacity-90 md:text-lg">{user?.email}</p>
          <div className="mt-6 grid grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white/20 rounded-2xl p-3 md:p-4">
              <div className="text-2xl mb-1 md:text-3xl">📚</div>
              <div className="text-xl font-bold md:text-2xl">{completedCourses}</div>
              <div className="text-xs opacity-80 md:text-sm">课程</div>
            </div>
            <div className="bg-white/20 rounded-2xl p-3 md:p-4">
              <div className="text-2xl mb-1 md:text-3xl">⭐</div>
              <div className="text-xl font-bold md:text-2xl">{totalPoints}</div>
              <div className="text-xs opacity-80 md:text-sm">积分</div>
            </div>
            <div className="bg-white/20 rounded-2xl p-3 md:p-4">
              <div className="text-2xl mb-1 md:text-3xl">🏆</div>
              <div className="text-xl font-bold md:text-2xl">{achievementsCount}</div>
              <div className="text-xs opacity-80 md:text-sm">成就</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 md:space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-lg md:p-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center md:text-xl">
              <span className="text-2xl mr-3 md:text-3xl">⚙️</span>
              设置
            </h2>
            
            <div className="space-y-3 md:space-y-4">
              <button
                onClick={() => alert('头像功能开发中...')}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all md:p-5"
              >
                <span className="flex items-center gap-3 md:gap-4">
                  <span className="text-2xl md:text-3xl">🖼️</span>
                  <span className="font-medium text-gray-700 md:text-lg">更换头像</span>
                </span>
                <span className="text-gray-400">→</span>
              </button>
              
              <button
                onClick={handleParentCenterClick}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 hover:bg-indigo-100 transition-all md:p-5"
              >
                <span className="flex items-center gap-3 md:gap-4">
                  <span className="text-2xl md:text-3xl">🛡️</span>
                  <span className="font-medium text-indigo-700 md:text-lg">家长中心</span>
                </span>
                <span className="text-indigo-400">→</span>
              </button>
              
              <button
                onClick={() => alert('提醒功能开发中...')}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all md:p-5"
              >
                <span className="flex items-center gap-3 md:gap-4">
                  <span className="text-2xl md:text-3xl">🔔</span>
                  <span className="font-medium text-gray-700 md:text-lg">学习提醒</span>
                </span>
                <span className="text-gray-400">→</span>
              </button>
              
              <button
                onClick={() => alert('数据存储在本地浏览器中')}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all md:p-5"
              >
                <span className="flex items-center gap-3 md:gap-4">
                  <span className="text-2xl md:text-3xl">💾</span>
                  <span className="font-medium text-gray-700 md:text-lg">数据管理</span>
                </span>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-lg md:p-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center md:text-xl">
              <span className="text-2xl mr-3 md:text-3xl">ℹ️</span>
              关于
            </h2>
            
            <div className="space-y-3 md:space-y-4">
              <button
                onClick={() => alert('儿童教育平台 v1.0\n专为4-8岁儿童设计的在线学习平台')}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all md:p-5"
              >
                <span className="flex items-center gap-3 md:gap-4">
                  <span className="text-2xl md:text-3xl">📱</span>
                  <span className="font-medium text-gray-700 md:text-lg">关于我们</span>
                </span>
                <span className="text-gray-400">→</span>
              </button>
              
              <button
                onClick={() => alert('使用条款内容...')}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all md:p-5"
              >
                <span className="flex items-center gap-3 md:gap-4">
                  <span className="text-2xl md:text-3xl">📄</span>
                  <span className="font-medium text-gray-700 md:text-lg">使用条款</span>
                </span>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-3xl bg-red-100 text-red-600 font-bold hover:bg-red-200 transition-all md:text-lg md:py-5"
          >
            <LogOut className="w-5 h-5 md:w-6 md:h-6" />
            退出登录
          </button>
        </div>
      </div>
      
      <ParentPinGate
        isOpen={showPinGate}
        onClose={() => setShowPinGate(false)}
        onVerified={handlePinVerified}
      />
      
      <NavBar />
    </div>
  );
}
