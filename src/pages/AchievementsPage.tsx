
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { achievements, shopItems } from '../data/initialData';
import NavBar from '../components/NavBar';

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState<'achievements' | 'shop'>('achievements');
  const navigate = useNavigate();
  const isLoggedIn = useAppStore(state => state.isLoggedIn);
  const userPoints = useAppStore(state => state.userPoints);
  const userAchievements = useAppStore(state => state.userAchievements);
  const userInventory = useAppStore(state => state.userInventory);
  const purchaseItem = useAppStore(state => state.purchaseItem);
  const learningProgress = useAppStore(state => state.learningProgress);
  
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }
  
  const completedCount = learningProgress.filter(p => p.completed).length;
  const totalPoints = userPoints?.totalPoints || 0;
  
  const checkAchievementUnlocked = (achievement: typeof achievements[0]) => {
    return userAchievements.some(a => a.achievementId === achievement.id);
  };
  
  const checkAchievementProgress = (achievement: typeof achievements[0]) => {
    let current = 0;
    switch (achievement.type) {
      case 'courses':
        current = completedCount;
        break;
      case 'points':
        current = totalPoints;
        break;
    }
    return {
      current,
      requirement: achievement.requirement,
      percent: Math.min(100, Math.round((current / achievement.requirement) * 100))
    };
  };
  
  const handlePurchase = (itemId: string) => {
    const success = purchaseItem(itemId);
    if (success) {
      alert('购买成功！🎉');
    } else {
      alert('积分不足或已拥有此商品');
    }
  };
  
  const isItemPurchased = (itemId: string) => {
    return userInventory.some(i => i.itemId === itemId);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 pb-24">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-6 text-white mb-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">我的成就</h1>
              <p className="opacity-90 mt-1">继续加油哦！</p>
            </div>
            <div className="text-center">
              <div className="text-5xl">💰</div>
              <div className="text-2xl font-bold">{userPoints?.availablePoints || 0}</div>
              <div className="text-sm opacity-80">积分</div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-3 rounded-2xl font-bold transition-all ${
              activeTab === 'achievements'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-white text-gray-600'
            }`}
          >
            🏆 成就
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex-1 py-3 rounded-2xl font-bold transition-all ${
              activeTab === 'shop'
                ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                : 'bg-white text-gray-600'
            }`}
          >
            🛒 积分商城
          </button>
        </div>
        
        {activeTab === 'achievements' && (
          <div className="space-y-4">
            {achievements.map(achievement => {
              const unlocked = checkAchievementUnlocked(achievement);
              const progress = checkAchievementProgress(achievement);
              
              return (
                <div
                  key={achievement.id}
                  className={`bg-white rounded-3xl p-6 shadow-lg ${
                    unlocked ? 'border-2 border-yellow-400' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-5xl ${!unlocked ? 'grayscale opacity-50' : ''}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">{achievement.name}</h3>
                      <p className="text-gray-500 text-sm">{achievement.description}</p>
                      {!unlocked && (
                        <div className="mt-2">
                          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-purple-400 to-pink-400 h-full rounded-full"
                              style={{ width: `${progress.percent}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {progress.current} / {progress.requirement}
                          </p>
                        </div>
                      )}
                    </div>
                    {unlocked && (
                      <div className="bg-green-100 text-green-600 px-4 py-2 rounded-full font-bold text-sm">
                        ✓ 已获得
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {activeTab === 'shop' && (
          <div className="grid grid-cols-2 gap-4">
            {shopItems.map(item => {
              const purchased = isItemPurchased(item.id);
              const canAfford = (userPoints?.availablePoints || 0) >= item.price;
              
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-4 shadow-lg"
                >
                  <div className="text-5xl text-center mb-3">{item.icon}</div>
                  <h3 className="text-lg font-bold text-gray-800 text-center">{item.name}</h3>
                  <p className="text-gray-500 text-xs text-center mb-4">{item.description}</p>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-bold text-yellow-700">{item.price}</span>
                  </div>
                  {purchased ? (
                    <div className="bg-green-100 text-green-600 text-center py-2 rounded-xl font-bold text-sm">
                      ✓ 已拥有
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePurchase(item.id)}
                      disabled={!canAfford}
                      className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                        canAfford
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:shadow-lg'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      购买
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <NavBar />
    </div>
  );
}
