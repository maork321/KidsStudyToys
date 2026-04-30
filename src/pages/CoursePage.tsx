
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courses } from '../data/initialData';
import { useAppStore } from '../store';
import { useSpeech } from '../utils/speech';
import { ArrowLeft, CheckCircle2, Trophy, Volume2, VolumeX } from 'lucide-react';

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const course = courses.find(c => c.id === id);
  
  const { speak } = useSpeech();
  
  const isLoggedIn = useAppStore(state => state.isLoggedIn);
  const soundEnabled = useAppStore(state => state.soundEnabled);
  const startCourse = useAppStore(state => state.startCourse);
  const updateProgress = useAppStore(state => state.updateProgress);
  const completeCourse = useAppStore(state => state.completeCourse);
  const getCourseProgress = useAppStore(state => state.getCourseProgress);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const progress = course ? getCourseProgress(course.id) : null;
  
  useEffect(() => {
    if (course && isLoggedIn && !progress) {
      startCourse(course.id);
    }
  }, [course, isLoggedIn, progress, startCourse]);
  
  const speakText = useCallback((text: string) => {
    if (soundEnabled && !isSpeaking) {
      setIsSpeaking(true);
      speak(text);
      setTimeout(() => setIsSpeaking(false), text.length * 100);
    }
  }, [soundEnabled, isSpeaking, speak]);
  
  useEffect(() => {
    if (!soundEnabled || !course) return;
    const step = course.content[currentStep];
    if (step) {
      const textToSpeak = step.type === 'quiz' 
        ? `${step.title}。${step.question}` 
        : step.title + (step.description ? `。${step.description}` : '');
      setTimeout(() => speakText(textToSpeak), 500);
    }
  }, [currentStep, soundEnabled, course, speakText]);
  
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }
  
  if (!course) {
    return <div>课程不存在</div>;
  }
  
  if (progress?.completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 text-center max-w-md shadow-2xl">
          <div className="text-8xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">太棒了！</h1>
          <p className="text-gray-600 mb-6">你已经完成了这个课程</p>
          <div className="bg-yellow-100 rounded-2xl p-4 mb-6">
            <span className="text-2xl">⭐</span>
            <span className="ml-2 font-bold text-yellow-700 text-xl">+{course.points} 积分</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }
  
  const step = course.content[currentStep];
  const progressPercent = Math.round(((currentStep) / course.content.length) * 100);
  
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === step.correctAnswer;
    setIsCorrect(correct);
    
    if (soundEnabled) {
      speakText(correct ? '回答正确！' : '回答错误，再试试吧！');
    }
  };
  
  const handleNext = () => {
    if (currentStep + 1 >= course.content.length) {
      completeCourse(course.id);
      setShowCelebration(true);
    } else {
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
      setIsCorrect(false);
      updateProgress(course.id, Math.round(((currentStep + 1) / course.content.length) * 100), 1);
    }
  };
  
  if (showCelebration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 text-center max-w-md shadow-2xl animate-bounce">
          <div className="text-8xl mb-6">🏆</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">恭喜完成！</h1>
          <p className="text-gray-600 mb-6">你完成了 {course.title}</p>
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-6">
            <div className="text-4xl mb-2">⭐ +{course.points}</div>
            <p className="text-orange-700 font-bold">获得 {course.points} 积分！</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg"
          >
            继续探索 🚀
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-full shadow-lg mr-4"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1">
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-center text-gray-500 text-sm mt-2">
              {currentStep + 1} / {course.content.length}
            </p>
          </div>
          <button
            onClick={() => {
              if (step) {
                const text = step.type === 'quiz' 
                  ? `${step.title}。${step.question}` 
                  : step.title + (step.description ? `。${step.description}` : '');
                speakText(text);
              }
            }}
            disabled={!soundEnabled}
            className={`p-2 rounded-full shadow-lg transition-all ${
              soundEnabled 
                ? 'bg-white hover:bg-blue-50' 
                : 'bg-gray-200 opacity-50 cursor-not-allowed'
            }`}
          >
            {isSpeaking ? (
              <VolumeX className="w-6 h-6 text-blue-500 animate-pulse" />
            ) : (
              <Volume2 className={`w-6 h-6 ${soundEnabled ? 'text-blue-500' : 'text-gray-400'}`} />
            )}
          </button>
        </div>
        
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          {step.type === 'intro' && (
            <div className="text-center">
              {step.image && (
                <img src={step.image} alt="" className="w-48 h-48 object-cover rounded-2xl mx-auto mb-6" />
              )}
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{step.title}</h2>
              {step.description && (
                <p className="text-gray-600 text-lg">{step.description}</p>
              )}
              <button
                onClick={handleNext}
                className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                继续 🚀
              </button>
            </div>
          )}
          
          {step.type === 'quiz' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{step.title}</h2>
              {step.question && (
                <p className="text-xl text-gray-700 text-center mb-8">{step.question}</p>
              )}
              <div className="space-y-4">
                {step.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 rounded-2xl text-left font-medium text-lg transition-all ${
                      selectedAnswer === null
                        ? 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
                        : option === step.correctAnswer
                        ? 'bg-green-100 border-2 border-green-500'
                        : selectedAnswer === option
                        ? 'bg-red-100 border-2 border-red-500'
                        : 'bg-gray-100 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {selectedAnswer === option && (
                        isCorrect ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : (
                          <span className="text-red-500">✗</span>
                        )
                      )}
                      {selectedAnswer !== null && option === step.correctAnswer && selectedAnswer !== option && (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {selectedAnswer && (
                <button
                  onClick={handleNext}
                  className="mt-8 w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                >
                  {isCorrect ? '太棒了！继续 →' : '再试一次 →'}
                </button>
              )}
            </div>
          )}
          
          {step.type === 'complete' && (
            <div className="text-center">
              <div className="text-8xl mb-6">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{step.title}</h2>
              {step.description && (
                <p className="text-gray-600 text-lg mb-8">{step.description}</p>
              )}
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                完成课程 🏆
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
