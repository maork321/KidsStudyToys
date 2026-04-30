
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { useSpeech } from '../utils/speech';
import { generateMathExercise, MathProblem, MathConfig } from '../utils/mathGenerator';
import { ArrowLeft, Volume2, Calculator, CheckCircle2, XCircle } from 'lucide-react';
import Confetti from '../components/Confetti';

export default function MathPractice() {
  const navigate = useNavigate();
  const { speak } = useSpeech();
  
  const isLoggedIn = useAppStore(state => state.isLoggedIn);
  const soundEnabled = useAppStore(state => state.soundEnabled);
  
  const [mode, setMode] = useState<'setup' | 'practice' | 'result'>('setup');
  const [config, setConfig] = useState<MathConfig>({
    maxNumber: 10,
    questionCount: 10,
    operators: ['+']
  });
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerMode, setAnswerMode] = useState<'choice' | 'input'>('choice');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);
  
  const speakProblem = () => {
    if (!soundEnabled || !problems[currentIndex]) return;
    
    const problem = problems[currentIndex];
    const text = `${problem.operand1} ${problem.operator === '×' ? '乘以' : problem.operator === '÷' ? '除以' : problem.operator} ${problem.operand2} 等于多少？`;
    
    setIsSpeaking(true);
    speak(text);
    setTimeout(() => setIsSpeaking(false), text.length * 150);
  };
  
  const startPractice = () => {
    const newProblems = generateMathExercise(config);
    setProblems(newProblems);
    setCurrentIndex(0);
    setScore(0);
    setUserAnswer('');
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
    setMode('practice');
    
    setTimeout(() => speakProblem(), 500);
  };
  
  const handleChoiceSelect = (answer: number) => {
    if (isCorrect !== null) return;
    
    setSelectedAnswer(answer);
    const correct = answer === problems[currentIndex].answer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(prev => prev + 1);
      setShowConfetti(true);
      if (soundEnabled) {
        speak('回答正确！太棒了！');
      }
    } else {
      if (soundEnabled) {
        speak('回答错误，正确答案是' + problems[currentIndex].answer);
      }
    }
    
    setTimeout(() => {
      if (currentIndex < problems.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setShowFeedback(false);
        setUserAnswer('');
        setTimeout(() => speakProblem(), 500);
      } else {
        setMode('result');
        if (soundEnabled) {
          speak('练习完成！你答对了' + (score + (correct ? 1 : 0)) + '道题');
        }
      }
    }, 1500);
  };
  
  const handleInputSubmit = () => {
    if (!userAnswer.trim() || isCorrect !== null) return;
    
    const numAnswer = parseInt(userAnswer);
    const correct = numAnswer === problems[currentIndex].answer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(prev => prev + 1);
      setShowConfetti(true);
      if (soundEnabled) {
        speak('回答正确！太棒了！');
      }
    } else {
      if (soundEnabled) {
        speak('回答错误，正确答案是' + problems[currentIndex].answer);
      }
    }
    
    setTimeout(() => {
      if (currentIndex < problems.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setIsCorrect(null);
        setShowFeedback(false);
        setUserAnswer('');
        setTimeout(() => speakProblem(), 500);
      } else {
        setMode('result');
        if (soundEnabled) {
          speak('练习完成！你答对了' + (score + (correct ? 1 : 0)) + '道题');
        }
      }
    }, 1500);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    }
  };
  
  const resetPractice = () => {
    setMode('setup');
    setProblems([]);
    setCurrentIndex(0);
    setScore(0);
    setUserAnswer('');
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
  };
  
  if (!isLoggedIn) {
    return null;
  }
  
  if (mode === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-24">
        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white rounded-full shadow-lg mr-4"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">数学练习</h1>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
            <div className="flex items-center mb-6">
              <Calculator className="w-8 h-8 text-indigo-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-800">选择难度和设置</h2>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">运算类型</label>
              <div className="grid grid-cols-4 gap-2">
                {(['+', '-', '×', '÷'] as const).map(op => (
                  <button
                    key={op}
                    onClick={() => {
                      setConfig(prev => ({
                        ...prev,
                        operators: prev.operators.includes(op)
                          ? prev.operators.filter(o => o !== op)
                          : [...prev.operators, op]
                      }));
                    }}
                    className={`p-4 rounded-xl text-2xl font-bold transition-all ${
                      config.operators.includes(op)
                        ? 'bg-indigo-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
              {config.operators.length === 0 && (
                <p className="text-red-500 text-sm mt-2">请至少选择一个运算类型</p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">
                最大数: {config.maxNumber}
              </label>
              <div className="grid grid-cols-5 gap-2">
                {([5, 10, 20, 50, 100] as const).map(num => (
                  <button
                    key={num}
                    onClick={() => setConfig(prev => ({ ...prev, maxNumber: num }))}
                    className={`py-3 rounded-xl font-bold transition-all ${
                      config.maxNumber === num
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">
                题目数量: {config.questionCount}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {([5, 10, 20, 50] as const).map(num => (
                  <button
                    key={num}
                    onClick={() => setConfig(prev => ({ ...prev, questionCount: num }))}
                    className={`py-3 rounded-xl font-bold transition-all ${
                      config.questionCount === num
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {num}题
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">答题方式</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setAnswerMode('choice')}
                  className={`p-4 rounded-xl font-medium transition-all ${
                    answerMode === 'choice'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  选择题
                </button>
                <button
                  onClick={() => setAnswerMode('input')}
                  className={`p-4 rounded-xl font-medium transition-all ${
                    answerMode === 'input'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  手动输入
                </button>
              </div>
            </div>
            
            <button
              onClick={startPractice}
              disabled={config.operators.length === 0}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                config.operators.length > 0
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              开始练习 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (mode === 'result') {
    const percentage = Math.round((score / problems.length) * 100);
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 flex items-center justify-center p-4">
        <Confetti isActive={score > problems.length / 2} />
        <div className="bg-white rounded-3xl p-8 text-center max-w-md shadow-2xl">
          <div className="text-6xl mb-4">
            {percentage >= 90 ? '🎉' : percentage >= 70 ? '👏' : percentage >= 50 ? '💪' : '📚'}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {percentage >= 90 ? '太棒了！' : percentage >= 70 ? '做得好！' : percentage >= 50 ? '还不错！' : '继续加油！'}
          </h1>
          <p className="text-gray-600 mb-6">
            你答对了 {score} / {problems.length} 道题
          </p>
          
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3].map(i => (
              <span key={i} className="text-4xl">
                {i <= stars ? '⭐' : '☆'}
              </span>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-6">
            <div className="text-5xl font-bold text-indigo-600 mb-2">{percentage}%</div>
            <div className="text-gray-600">正确率</div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={resetPractice}
              className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-700 font-bold"
            >
              重新设置
            </button>
            <button
              onClick={startPractice}
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold"
            >
              再练一次
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const currentProblem = problems[currentIndex];
  const progress = ((currentIndex + 1) / problems.length) * 100;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-24">
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <button
            onClick={resetPractice}
            className="p-2 bg-white rounded-full shadow-lg mr-4"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1">
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="ml-4 font-bold text-gray-700">
            {currentIndex + 1}/{problems.length}
          </span>
        </div>
        
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-6">
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-indigo-600 mb-4">
              {currentProblem.operand1} {currentProblem.operator} {currentProblem.operand2}
            </div>
            <div className="text-2xl text-gray-500">= ?</div>
          </div>
          
          {answerMode === 'input' ? (
            <div className="space-y-4">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isCorrect !== null}
                className={`w-full p-6 text-4xl text-center border-4 rounded-2xl font-bold transition-all ${
                  isCorrect === true
                    ? 'border-green-500 bg-green-50 text-green-600'
                    : isCorrect === false
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-gray-200 focus:border-indigo-500 focus:outline-none'
                }`}
                placeholder="输入答案"
              />
              
              {showFeedback && (
                <div className={`text-center text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? '✓ 正确！' : `✗ 正确答案是 ${currentProblem.answer}`}
                </div>
              )}
              
              {isCorrect === null && (
                <button
                  onClick={handleInputSubmit}
                  disabled={!userAnswer.trim()}
                  className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-bold text-lg"
                >
                  确认答案
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {currentProblem.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleChoiceSelect(option)}
                  disabled={isCorrect !== null}
                  className={`p-6 text-3xl font-bold rounded-2xl transition-all ${
                    isCorrect !== null
                      ? option === currentProblem.answer
                        ? 'bg-green-100 border-4 border-green-500 text-green-600'
                        : selectedAnswer === option
                        ? 'bg-red-100 border-4 border-red-500 text-red-600'
                        : 'bg-gray-100 text-gray-400'
                      : 'bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:scale-105'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          
          {showFeedback && (
            <div className="mt-6 text-center">
              {isCorrect ? (
                <div className="flex items-center justify-center text-green-600">
                  <CheckCircle2 className="w-8 h-8 mr-2" />
                  <span className="text-2xl font-bold">太棒了！</span>
                </div>
              ) : (
                <div className="flex items-center justify-center text-red-600">
                  <XCircle className="w-8 h-8 mr-2" />
                  <span className="text-2xl font-bold">加油！</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <button
          onClick={speakProblem}
          disabled={!soundEnabled}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all ${
            soundEnabled
              ? 'bg-white text-indigo-600 shadow-lg'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          <Volume2 className={`w-6 h-6 ${isSpeaking ? 'animate-pulse' : ''}`} />
          听题目 {isSpeaking && '(朗读中...)'}
        </button>
      </div>
    </div>
  );
}
