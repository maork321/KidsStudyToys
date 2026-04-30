
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '../store';
import NavBar from '../components/NavBar';
import { Shield, Clock, Volume2, VolumeX, RefreshCw, AlertTriangle } from 'lucide-react';

export default function ParentCenter() {
  const isLoggedIn = useAppStore(state => state.isLoggedIn);
  const dailyTimeLimit = useAppStore(state => state.dailyTimeLimit);
  const soundEnabled = useAppStore(state => state.soundEnabled);
  const todayStudyTime = useAppStore(state => state.todayStudyTime);
  const tvMode = useAppStore(state => state.tvMode);
  
  const setDailyTimeLimit = useAppStore(state => state.setDailyTimeLimit);
  const toggleSound = useAppStore(state => state.toggleSound);
  const toggleTvMode = useAppStore(state => state.toggleTvMode);
  const resetAllData = useAppStore(state => state.resetAllData);
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [timeLimitValue, setTimeLimitValue] = useState(dailyTimeLimit);
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  const handleReset = () => {
    resetAllData();
    window.location.href = '/login';
  };
  
  const handleTimeLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setTimeLimitValue(value);
  };
  
  const saveTimeLimit = () => {
    setDailyTimeLimit(timeLimitValue);
  };
  
  const timeRemaining = Math.max(0, dailyTimeLimit - todayStudyTime);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-24">
      <div className="max-w-lg mx-auto px-4 py-6 md:max-w-4xl md:py-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 text-white mb-6 shadow-xl md:p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-2xl p-4">
              <Shield className="w-10 h-10 md:w-12 md:h-12" />
            </div>
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">家长中心</h1>
              <p className="opacity-90 md:text-lg">管理孩子的学习设置</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center md:text-2xl">
            <Clock className="w-6 h-6 mr-3 text-indigo-500 md:w-7 md:h-7" />
            每日使用时长
          </h2>
          
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-4 mb-4 md:p-6">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <span className="text-gray-700 md:text-lg">今日已学习</span>
              <span className="font-bold text-gray-800 md:text-xl">{todayStudyTime} 分钟</span>
            </div>
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <span className="text-gray-700 md:text-lg">剩余时间</span>
              <span className={`font-bold md:text-xl ${timeRemaining > 10 ? 'text-green-600' : 'text-red-600'}`}>
                {timeRemaining} 分钟
              </span>
            </div>
            <div className="bg-white/50 rounded-full h-4 overflow-hidden md:h-5">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${timeRemaining > 10 ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-red-400 to-red-600'}`}
                style={{ width: `${Math.min(100, (timeRemaining / dailyTimeLimit) * 100)}%` }}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2 md:text-lg">设置每日时长限制（分钟）</label>
            <div className="flex items-center gap-4 md:gap-6">
              <input
                type="range"
                min="15"
                max="120"
                step="15"
                value={timeLimitValue}
                onChange={handleTimeLimitChange}
                className="flex-1 h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-500 md:h-4"
              />
              <input
                type="number"
                min="15"
                max="120"
                value={timeLimitValue}
                onChange={handleTimeLimitChange}
                className="w-20 px-3 py-2 border-2 border-gray-200 rounded-xl text-center font-bold text-lg md:w-24 md:text-xl"
              />
            </div>
            <div className="flex justify-center gap-3 mt-4 md:gap-4 md:mt-6">
              {[15, 30, 45, 60, 90, 120].map(val => (
                <button
                  key={val}
                  onClick={() => setTimeLimitValue(val)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all md:text-base md:px-5 md:py-3 ${
                    timeLimitValue === val 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {val}分钟
                </button>
              ))}
            </div>
            <button
              onClick={saveTimeLimit}
              className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl font-bold md:text-lg md:py-4"
            >
              保存设置
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center md:text-2xl">
            <Volume2 className="w-6 h-6 mr-3 text-purple-500 md:w-7 md:h-7" />
            声音设置
          </h2>
          
          <button
            onClick={toggleSound}
            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all md:p-6 ${
              soundEnabled 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            <div className="flex items-center gap-4 md:gap-5">
              {soundEnabled ? <Volume2 className="w-8 h-8 md:w-10 md:h-10" /> : <VolumeX className="w-8 h-8 md:w-10 md:h-10" />}
              <div className="text-left">
                <div className="font-bold md:text-lg">{soundEnabled ? '声音已开启' : '声音已关闭'}</div>
                <div className="text-sm opacity-70 md:text-base">
                  {soundEnabled ? '语音合成功能可用' : '将关闭所有语音提示'}
                </div>
              </div>
            </div>
            <div className={`w-14 h-8 rounded-full transition-all relative ${soundEnabled ? 'bg-green-500' : 'bg-gray-300'} md:w-16 md:h-9`}>
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${soundEnabled ? 'left-7 md:left-8' : 'left-1'}`} />
            </div>
          </button>
        </div>
        
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center md:text-2xl">
            <span className="text-2xl mr-3 md:text-3xl">📺</span>
            电视模式
          </h2>
          
          <button
            onClick={toggleTvMode}
            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all md:p-6 ${
              tvMode 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            <div className="flex items-center gap-4 md:gap-5">
              <span className="text-4xl md:text-5xl">📺</span>
              <div className="text-left">
                <div className="font-bold md:text-lg">{tvMode ? '电视模式已开启' : '电视模式已关闭'}</div>
                <div className="text-sm opacity-70 md:text-base">
                  {tvMode ? '大屏幕优化布局，支持遥控器导航' : '标准手机/平板布局'}
                </div>
              </div>
            </div>
            <div className={`w-14 h-8 rounded-full transition-all relative ${tvMode ? 'bg-blue-500' : 'bg-gray-300'} md:w-16 md:h-9`}>
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${tvMode ? 'left-7 md:left-8' : 'left-1'}`} />
            </div>
          </button>
        </div>
        
        <div className="bg-white rounded-3xl p-6 shadow-lg md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center md:text-2xl">
            <RefreshCw className="w-6 h-6 mr-3 text-red-500 md:w-7 md:h-7" />
            数据管理
          </h2>
          
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-all font-bold md:text-lg md:p-5"
          >
            <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" />
            重置所有数据
          </button>
          <p className="text-center text-gray-500 text-sm mt-3 md:text-base">
            这将删除所有学习记录、积分和成就
          </p>
        </div>
      </div>
      
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full md:p-8">
            <div className="text-center">
              <div className="text-6xl mb-4 md:text-7xl">⚠️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 md:text-2xl">确认重置？</h3>
              <p className="text-gray-600 mb-6 md:text-lg">
                此操作将删除所有学习记录、积分和成就，且无法恢复。
              </p>
              <div className="flex gap-3 md:gap-4">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold md:text-lg md:py-4"
                >
                  取消
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold md:text-lg md:py-4"
                >
                  确认重置
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <NavBar />
    </div>
  );
}
