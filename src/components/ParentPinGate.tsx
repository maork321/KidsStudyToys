import { useState } from 'react';
import { Shield, X } from 'lucide-react';

interface ParentPinGateProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export default function ParentPinGate({ isOpen, onClose, onVerified }: ParentPinGateProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  
  const correctPin = '1234';
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin === correctPin) {
      setPin('');
      setError('');
      setAttempts(0);
      onVerified();
    } else {
      setAttempts(prev => prev + 1);
      setError(`密码错误，还剩 ${3 - (attempts + 1)} 次机会`);
      setPin('');
      
      if (attempts >= 2) {
        setTimeout(() => {
          onClose();
          setPin('');
          setError('');
          setAttempts(0);
        }, 1500);
      }
    }
  };
  
  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError('');
    }
  };
  
  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
        <div className="text-center mb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">家长验证</h2>
          <p className="text-gray-500 text-sm">请输入家长密码进入家长中心</p>
          <p className="text-gray-400 text-xs mt-1">(默认密码: 1234)</p>
        </div>
        
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all ${
                i < pin.length ? 'bg-indigo-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-600 rounded-xl p-3 mb-4 text-center text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => handleNumberClick(num)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-2xl font-bold py-4 rounded-2xl transition-all active:scale-95"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleDelete}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium py-4 rounded-2xl transition-all active:scale-95"
            >
              删除
            </button>
            <button
              type="button"
              onClick={() => handleNumberClick('0')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-2xl font-bold py-4 rounded-2xl transition-all active:scale-95"
            >
              0
            </button>
            <button
              type="submit"
              disabled={pin.length !== 4}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl transition-all"
            >
              确认
            </button>
          </div>
        </form>
        
        <button
          onClick={onClose}
          className="w-full mt-4 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 py-2"
        >
          <X className="w-5 h-5" />
          取消
        </button>
      </div>
    </div>
  );
}
