
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAppStore(state => state.login);
  const register = useAppStore(state => state.register);
  const isLoggedIn = useAppStore(state => state.isLoggedIn);
  const navigate = useNavigate();
  
  useEffect(() => {
    try {
      const oldData = localStorage.getItem('kids-edu-storage');
      if (oldData) {
        const parsed = JSON.parse(oldData);
        if (!parsed || parsed.soundEnabled === undefined) {
          localStorage.removeItem('kids-edu-storage');
        }
      }
    } catch {
      localStorage.removeItem('kids-edu-storage');
      localStorage.removeItem('kids-edu-users');
    }
  }, []);
  
  if (isLoggedIn) {
    navigate('/');
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      let success = false;
      if (isLogin) {
        success = await login(email);
        if (!success) setError('邮箱不存在');
      } else {
        success = await register(username, email);
        if (!success) setError('该邮箱已被注册');
      }
      
      if (success) {
        navigate('/');
      }
    } catch {
      setError('发生错误，请重试');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎓</div>
          <h1 className="text-3xl font-bold text-gray-800">
            {isLogin ? '欢迎回来！' : '加入我们！'}
          </h1>
          <p className="text-gray-500 mt-2">
            {isLogin ? '登录你的账户' : '创建一个新账户'}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-600 rounded-2xl p-4 mb-6 text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                👤 昵称
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-all text-lg"
                placeholder="输入你的昵称"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              📧 邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-all text-lg"
              placeholder="输入你的邮箱"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              🔒 密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-all text-lg"
              placeholder="输入你的密码"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50"
          >
            {loading ? '请稍候...' : (isLogin ? '🚀 登录' : '🎉 注册')}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-purple-600 font-medium hover:text-purple-700 transition-colors"
          >
            {isLogin ? '还没有账户？立即注册 →' : '已有账户？去登录 →'}
          </button>
        </div>
      </div>
    </div>
  );
}
