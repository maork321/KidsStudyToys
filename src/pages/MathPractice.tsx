
import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
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
    return <Navigate to="/login" replace />;
  }
  
  if (mode === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-24">
        <div className="max-w-lg mx-auto px-4 py-6 md:max-w-4xl md:py-8">
          <div className="flex items-center mb-6 md:mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white rounded-full shadow-lg mr-4 md:p-3"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700 md:w-7 md:h-7" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">数学练习</h1>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-xl mb-6 md:p-8 md:max-w-2xl md:mx-auto">
            <div className="flex items-center mb-6">
              <Calculator className="w-8 h-8 text-indigo-500 mr-3 md:w-10 md:h-10" />
              <h2 className="text-xl font-bold text-gray-800 md:text-2xl">选择难度和设置</h2>
            </div>
            
            <div className="mb-6 md:mb-8">
              <label className="block text-gray-700 font-medium mb-3 md:text-lg">运算类型</label>
              <div className="grid grid-cols-4 gap-2 md:gap-4 md:max-w-md md:mx-auto">
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
                    className={`p-4 rounded-xl text-2xl font-bold transition-all md:text-3xl md:py-6 ${
                      config.operators.includes(op)
                        ? 'bg-indigo-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
              {config.operators.length === 0 && (
                <p className="text-red-500 text-sm mt-2 md:text-base text-center">请至少选择一个运算类型</p>
              )}
            </div>
            
            <div className="mb-6 md:mb-8">
              <label className="block text-gray-700 font-medium mb-3 md:text-lg">
                最大数: {config.maxNumber}
              </label>
              <div className="grid grid-cols-5 gap-2 md:grid-cols-5 md:gap-3 md:max-w-md md:mx-auto">
                {([5, 10, 20, 50, 100] as const).map(num => (
                  <button
                    key={num}
                    onClick={() => setConfig(prev => ({ ...prev, maxNumber: num }))}
                    className={`py-3 rounded-xl font-bold transition-all md:text-lg md:py-4 ${
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
            
            <div className="mb-6 md:mb-8">
              <label className="block text-gray-700 font-medium mb-3 md:text-lg">
                题目数量: {config.questionCount}
              </label>
              <div className="grid grid-cols-4 gap-2 md:grid-cols-4 md:gap-3 md:max-w-md md:mx-auto">
                {([5, 10, 20, 50] as const).map(num => (
                  <button
                    key={num}
                    onClick={() => setConfig(prev => ({ ...prev, questionCount: num }))}
                    className={`py-3 rounded-xl font-bold transition-all md:text-lg md:py-4 ${
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
            
            <div className="mb-6 md:mb-8">
              <label className="block text-gray-700 font-medium mb-3 md:text-lg">答题方式</label>
              <div className="grid grid-cols-2 gap-3 md:gap-4 md:max-w-md md:mx-auto">
                <button
                  onClick={() => setAnswerMode('choice')}
                  className={`p-4 rounded-xl font-medium transition-all md:text-lg md:py-5 ${
                    answerMode === 'choice'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  选择题
                </button>
                <button
                  onClick={() => setAnswerMode('input')}
                  className={`p-4 rounded-xl font-medium transition-all md:text-lg md:py-5 ${
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
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all md:text-xl md:py-5 ${
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
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 flex items-center justify-center p-4 md:p-8">
        <Confetti isActive={score > problems.length / 2} />
        <div className="bg-white rounded-3xl p-8 text-center max-w-md shadow-2xl md:max-w-lg md:p-10">
          <div className="text-6xl mb-4 md:text-7xl">
            {percentage >= 90 ? '🎉' : percentage >= 70 ? '👏' : percentage >= 50 ? '💪' : '📚'}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 md:text-4xl">
            {percentage >= 90 ? '太棒了！' : percentage >= 70 ? '做得好！' : percentage >= 50 ? '还不错！' : '继续加油！'}
          </h1>
          <p className="text-gray-600 mb-6 md:text-lg">
            你答对了 {score} / {problems.length} 道题
          </p>
          
          <div className="flex justify-center gap-2 mb-6 md:gap-3">
            {[1, 2, 3].map(i => (
              <span key={i} className="text-4xl md:text-5xl">
                {i <= stars ? '⭐' : '☆'}
              </span>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-6 md:p-8">
            <div className="text-5xl font-bold text-indigo-600 mb-2 md:text-6xl">{percentage}%</div>
            <div className="text-gray-600 md:text-lg">正确率</div>
          </div>
          
          <div className="flex gap-3 md:gap-4">
            <button
              onClick={resetPractice}
              className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-700 font-bold md:text-lg md:py-5"
            >
              重新设置
            </button>
            <button
              onClick={startPractice}
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold md:text-lg md:py-5"
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
      
      <div className="max-w-lg mx-auto px-4 py-6 md:max-w-4xl md:py-8">
        <div className="flex items-center mb-6 md:mb-8">
          <button
            onClick={resetPractice}
            className="p-2 bg-white rounded-full shadow-lg mr-4 md:p-3"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700 md:w-7 md:h-7" />
          </button>
          <div className="flex-1">
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden md:h-5">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="ml-4 font-bold text-gray-700 md:text-lg">
            {currentIndex + 1}/{problems.length}
          </span>
        </div>
        
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-6 md:p-10 md:max-w-2xl md:mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <div className="text-6xl font-bold text-indigo-600 mb-4 md:text-7xl">
              {currentProblem.operand1} {currentProblem.operator} {currentProblem.operand2}
            </div>
            <div className="text-2xl text-gray-500 md:text-3xl">= ?</div>
          </div>
          
          {answerMode === 'input' ? (
            <div className="space-y-4 md:max-w-md md:mx-auto">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isCorrect !== null}
                className={`w-full p-6 text-4xl text-center border-4 rounded-2xl font-bold transition-all md:text-5xl ${
                  isCorrect === true
                    ? 'border-green-500 bg-green-50 text-green-600'
                    : isCorrect === false
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-gray-200 focus:border-indigo-500 focus:outline-none'
                }`}
                placeholder="输入答案"
              />
              
              {showFeedback && (
                <div className={`text-center text-2xl font-bold md:text-3xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? '✓ 正确！' : `✗ 正确答案是 ${currentProblem.answer}`}
                </div>
              )}
              
              {isCorrect === null && (
                <button
                  onClick={handleInputSubmit}
                  disabled={!userAnswer.trim()}
                  className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-bold text-lg md:text-xl md:py-5"
                >
                  确认答案
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-6 md:max-w-lg md:mx-auto">
              {currentProblem.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleChoiceSelect(option)}
                  disabled={isCorrect !== null}
                  className={`p-6 text-3xl font-bold rounded-2xl transition-all md:text-4xl md:py-8 ${
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
            <div className="mt-6 text-center md:mt-8">
              {isCorrect ? (
                <div className="flex items-center justify-center text-green-600">
                  <CheckCircle2 className="w-8 h-8 mr-2 md:w-10 md:h-10" />
                  <span className="text-2xl font-bold md:text-3xl">太棒了！</span>
                </div>
              ) : (
                <div className="flex items-center justify-center text-red-600">
                  <XCircle className="w-8 h-8 mr-2 md:w-10 md:h-10" />
                  <span className="text-2xl font-bold md:text-3xl">加油！</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <button
          onClick={speakProblem}
          disabled={!soundEnabled}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all md:text-lg md:py-5 md:max-w-lg md:mx-auto ${
            soundEnabled
              ? 'bg-white text-indigo-600 shadow-lg'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          <Volume2 className={`w-6 h-6 ${isSpeaking ? 'animate-pulse' : ''} md:w-7 md:h-7`} />
          听题目 {isSpeaking && '(朗读中...)'}
        </button>
      </div>
    </div>
  );
}
