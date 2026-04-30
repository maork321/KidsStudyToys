
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { useSpeech } from '../utils/speech';
import { generateMathExercise, MathProblem, MathConfig } from '../utils/mathGenerator';
import { ArrowLeft, Volume2, Calculator, CheckCircle2, XCircle, Home, RotateCcw, AlertCircle } from 'lucide-react';
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
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  // 使用 ref 保存最新的状态，避免闭包问题
  const problemsRef = useRef<MathProblem[]>([]);
  const currentIndexRef = useRef(0);
  const soundEnabledRef = useRef(soundEnabled);
  const scoreRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // 同步 ref 和 state
  useEffect(() => {
    problemsRef.current = problems;
  }, [problems]);
  
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);
  
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);
  
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);
  
  // 清理 timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // 朗读题目 - 使用 ref 确保读取最新的值
  const speakProblem = () => {
    const currentProblems = problemsRef.current;
    const index = currentIndexRef.current;
    const enabled = soundEnabledRef.current;
    const problem = currentProblems[index];
    
    if (!enabled || !problem) return;
    
    const text = `${problem.operand1} ${problem.operator === '×' ? '乘以' : problem.operator === '÷' ? '除以' : problem.operator} ${problem.operand2} 等于多少？`;
    
    setIsSpeaking(true);
    speak(text);
    setTimeout(() => setIsSpeaking(false), text.length * 150);
  };
  
  // 开始练习
  const startPractice = () => {
    // 清理之前的 timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    const newProblems = generateMathExercise(config);
    setProblems(newProblems);
    problemsRef.current = newProblems;
    setCurrentIndex(0);
    currentIndexRef.current = 0;
    setScore(0);
    scoreRef.current = 0;
    setUserAnswer('');
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
    setMode('practice');
    
    // 延迟朗读第一题
    setTimeout(() => speakProblem(), 500);
  };
  
  // 处理选择题答案
  const handleChoiceSelect = (answer: number) => {
    if (isCorrect !== null) return;
    
    // 清理之前的 timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    const currentProblems = problemsRef.current;
    const index = currentIndexRef.current;
    const problem = currentProblems[index];
    const correct = answer === problem.answer;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(prev => prev + 1);
      scoreRef.current = scoreRef.current + 1;
      setShowConfetti(true);
      if (soundEnabledRef.current) {
        speak('回答正确！太棒了！');
      }
    } else {
      if (soundEnabledRef.current) {
        speak('回答错误，正确答案是' + problem.answer);
      }
    }
    
    // 自动跳转到下一题
    timeoutRef.current = setTimeout(() => {
      if (currentIndexRef.current < currentProblems.length - 1) {
        const nextIndex = currentIndexRef.current + 1;
        setCurrentIndex(nextIndex);
        currentIndexRef.current = nextIndex;
        setSelectedAnswer(null);
        setIsCorrect(null);
        setShowFeedback(false);
        setUserAnswer('');
        
        // 朗读下一题
        setTimeout(() => {
          speakProblem();
        }, 500);
      } else {
        setMode('result');
        if (soundEnabledRef.current) {
          speak('练习完成！你答对了' + scoreRef.current + '道题');
        }
      }
    }, 1500);
  };
  
  // 处理输入框提交
  const handleInputSubmit = () => {
    if (!userAnswer.trim() || isCorrect !== null) return;
    
    // 清理之前的 timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    const currentProblems = problemsRef.current;
    const index = currentIndexRef.current;
    const problem = currentProblems[index];
    const numAnswer = parseInt(userAnswer);
    const correct = numAnswer === problem.answer;
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(prev => prev + 1);
      scoreRef.current = scoreRef.current + 1;
      setShowConfetti(true);
      if (soundEnabledRef.current) {
        speak('回答正确！太棒了！');
      }
    } else {
      if (soundEnabledRef.current) {
        speak('回答错误，正确答案是' + problem.answer);
      }
    }
    
    // 自动跳转到下一题
    timeoutRef.current = setTimeout(() => {
      if (currentIndexRef.current < currentProblems.length - 1) {
        const nextIndex = currentIndexRef.current + 1;
        setCurrentIndex(nextIndex);
        currentIndexRef.current = nextIndex;
        setIsCorrect(null);
        setShowFeedback(false);
        setUserAnswer('');
        
        // 朗读下一题
        setTimeout(() => {
          speakProblem();
        }, 500);
      } else {
        setMode('result');
        if (soundEnabledRef.current) {
          speak('练习完成！你答对了' + scoreRef.current + '道题');
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
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setMode('setup');
    setProblems([]);
    problemsRef.current = [];
    setCurrentIndex(0);
    currentIndexRef.current = 0;
    setScore(0);
    scoreRef.current = 0;
    setUserAnswer('');
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
  };
  
  const handleExit = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    resetPractice();
  };
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (mode === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-lg md:max-w-2xl">
          <div className="bg-white rounded-[2rem] p-8 shadow-2xl md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg md:w-24 md:h-24">
                <Calculator className="w-10 h-10 text-white md:w-12 md:h-12" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent md:text-4xl">
                数学练习
              </h1>
              <p className="text-gray-500 mt-2 md:text-lg">挑战自我，提升计算能力</p>
            </div>
            
            <div className="space-y-8">
              <div>
                <label className="block text-gray-700 font-bold mb-4 flex items-center md:text-lg">
                  <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mr-3">🎯</span>
                  选择运算类型
                </label>
                <div className="grid grid-cols-4 gap-3 md:gap-4">
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
                      className={`relative p-4 rounded-2xl text-3xl font-bold transition-all duration-300 transform md:text-4xl md:py-6 ${
                        config.operators.includes(op)
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:scale-105'
                      }`}
                    >
                      {op}
                      {config.operators.includes(op) && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {config.operators.length === 0 && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    请至少选择一个运算类型
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-700 font-bold mb-4 flex items-center md:text-lg">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">📊</span>
                  最大数字: <span className="text-indigo-600 ml-2">{config.maxNumber}</span>
                </label>
                <div className="grid grid-cols-5 gap-2 md:gap-3">
                  {([5, 10, 20, 50, 100] as const).map(num => (
                    <button
                      key={num}
                      onClick={() => setConfig(prev => ({ ...prev, maxNumber: num }))}
                      className={`py-3 rounded-xl font-bold transition-all duration-200 md:text-lg md:py-4 ${
                        config.maxNumber === num
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-bold mb-4 flex items-center md:text-lg">
                  <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mr-3">📝</span>
                  题目数量: <span className="text-indigo-600 ml-2">{config.questionCount}</span> 道
                </label>
                <div className="grid grid-cols-4 gap-2 md:gap-3">
                  {([5, 10, 20, 50] as const).map(num => (
                    <button
                      key={num}
                      onClick={() => setConfig(prev => ({ ...prev, questionCount: num }))}
                      className={`py-3 rounded-xl font-bold transition-all duration-200 md:text-lg md:py-4 ${
                        config.questionCount === num
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {num}题
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-bold mb-4 flex items-center md:text-lg">
                  <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mr-3">⌨️</span>
                  答题方式
                </label>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <button
                    onClick={() => setAnswerMode('choice')}
                    className={`p-4 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center gap-2 md:text-lg md:py-5 ${
                      answerMode === 'choice'
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {answerMode === 'choice' ? '✓' : ''} 选择题
                  </button>
                  <button
                    onClick={() => setAnswerMode('input')}
                    className={`p-4 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center gap-2 md:text-lg md:py-5 ${
                      answerMode === 'input'
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {answerMode === 'input' ? '✓' : ''} 手动输入
                  </button>
                </div>
              </div>
              
              <button
                onClick={startPractice}
                disabled={config.operators.length === 0}
                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg md:text-xl md:py-6 ${
                  config.operators.length > 0
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:shadow-xl hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                🚀 开始练习
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (mode === 'result') {
    const percentage = Math.round((score / problems.length) * 100);
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 flex items-center justify-center p-4 md:p-8">
        <Confetti isActive={score > problems.length / 2} />
        <div className="w-full max-w-md md:max-w-lg">
          <div className="bg-white rounded-[2rem] p-8 shadow-2xl text-center md:p-12">
            <div className="relative mb-6">
              <div className="text-8xl md:text-9xl animate-bounce">
                {percentage >= 90 ? '🎉' : percentage >= 70 ? '👏' : percentage >= 50 ? '💪' : '📚'}
              </div>
              {percentage >= 90 && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg animate-pulse">
                  完美
                </div>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-800 mb-2 md:text-5xl">
              {percentage >= 90 ? '太棒了！' : percentage >= 70 ? '做得好！' : percentage >= 50 ? '还不错！' : '继续加油！'}
            </h1>
            
            <p className="text-gray-600 mb-6 md:text-lg">
              你答对了 <span className="font-bold text-indigo-600">{score}</span> / {problems.length} 道题
            </p>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3].map(i => (
                <span key={i} className="text-5xl md:text-6xl transition-transform duration-300" style={{ animationDelay: `${i * 0.1}s` }}>
                  {i <= stars ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-6 md:p-8">
              <div className="text-6xl font-black bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-2 md:text-7xl">
                {percentage}%
              </div>
              <div className="text-gray-600 font-medium md:text-lg">正确率</div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <button
                onClick={handleExit}
                className="py-4 rounded-2xl bg-gray-100 text-gray-700 font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all md:text-lg md:py-5"
              >
                <Home className="w-5 h-5" />
                返回首页
              </button>
              <button
                onClick={startPractice}
                className="py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all md:text-lg md:py-5"
              >
                <RotateCcw className="w-5 h-5" />
                再练一次
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const currentProblem = problems[currentIndex];
  const progress = ((currentIndex + 1) / problems.length) * 100;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 pb-24">
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="w-full max-w-lg mx-auto px-4 py-6 md:max-w-3xl md:py-8">
        {/* Header */}
        <div className="flex items-center mb-6 md:mb-8">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1 mx-4">
            <div className="bg-white/30 backdrop-blur rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-lg">
            <span className="font-bold text-gray-700">
              {currentIndex + 1}/{problems.length}
            </span>
          </div>
        </div>
        
        {/* Question Card */}
        <div className="bg-white rounded-[2rem] p-8 shadow-2xl mb-6 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-6 shadow-lg">
              <span className="text-white font-bold text-lg">题目</span>
            </div>
            <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 drop-shadow-lg md:text-8xl">
              {currentProblem.operand1} {currentProblem.operator} {currentProblem.operand2}
            </div>
            <div className="text-3xl text-gray-400 font-bold md:text-4xl">= ?</div>
          </div>
          
          {/* Answer Options */}
          {answerMode === 'input' ? (
            <div className="space-y-4">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isCorrect !== null}
                className={`w-full p-6 text-5xl text-center border-4 rounded-2xl font-bold transition-all md:text-6xl ${
                  isCorrect === true
                    ? 'border-green-500 bg-green-50 text-green-600'
                    : isCorrect === false
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-gray-200 focus:border-indigo-500 focus:outline-none'
                }`}
                placeholder="?"
                autoFocus
              />
              
              {showFeedback && (
                <div className={`text-center text-2xl font-bold p-4 rounded-xl md:text-3xl ${
                  isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {isCorrect ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-8 h-8" />
                      太棒了！
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <XCircle className="w-8 h-8" />
                      答案是 {currentProblem.answer}
                    </span>
                  )}
                </div>
              )}
              
              {isCorrect === null && (
                <button
                  onClick={handleInputSubmit}
                  disabled={!userAnswer.trim()}
                  className={`w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-lg md:text-xl md:py-6 ${
                    userAnswer.trim()
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  确认答案 ✓
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {currentProblem.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleChoiceSelect(option)}
                  disabled={isCorrect !== null}
                  className={`relative p-6 text-4xl font-bold rounded-2xl transition-all duration-300 md:text-5xl md:py-8 ${
                    isCorrect !== null
                      ? option === currentProblem.answer
                        ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-xl scale-105'
                        : selectedAnswer === option
                        ? 'bg-gradient-to-br from-red-400 to-red-600 text-white shadow-xl'
                        : 'bg-gray-100 text-gray-400'
                      : 'bg-white border-4 border-gray-200 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50 hover:scale-105 hover:shadow-lg'
                  }`}
                >
                  {option}
                  {isCorrect !== null && option === currentProblem.answer && (
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {isCorrect !== null && selectedAnswer === option && option !== currentProblem.answer && (
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <XCircle className="w-6 h-6 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
          
          {showFeedback && isCorrect !== null && (
            <div className="mt-6 text-center">
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xl md:text-2xl ${
                isCorrect 
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
                  : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
              }`}>
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-7 h-7" />
                    回答正确！太棒了！
                  </>
                ) : (
                  <>
                    <XCircle className="w-7 h-7" />
                    再接再厉！
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Speak Button */}
        <button
          onClick={speakProblem}
          disabled={!soundEnabled}
          className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-3 md:text-lg md:py-5 ${
            soundEnabled
              ? 'bg-white/90 backdrop-blur text-indigo-600 hover:bg-white'
              : 'bg-gray-300 text-gray-500'
          }`}
        >
          <Volume2 className={`w-6 h-6 ${isSpeaking ? 'animate-pulse' : ''}`} />
          听题目 {isSpeaking ? '(朗读中...)' : ''}
        </button>
      </div>
      
      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">🤔</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">确定要退出吗？</h3>
              <p className="text-gray-600 mb-6">
                退出后本次练习的进度将不会保存
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="py-4 rounded-2xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all"
                >
                  继续练习
                </button>
                <button
                  onClick={handleExit}
                  className="py-4 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold hover:shadow-lg transition-all"
                >
                  确认退出
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
