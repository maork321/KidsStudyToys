import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { ArrowLeft, Settings as SettingsIcon, Volume2, VolumeX, Tv2 } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const subjects = useAppStore(state => state.subjects);
  const toggleSubject = useAppStore(state => state.toggleSubject);
  const soundEnabled = useAppStore(state => state.soundEnabled);
  const toggleSound = useAppStore(state => state.toggleSound);
  const tvMode = useAppStore(state => state.tvMode);
  const toggleTvMode = useAppStore(state => state.toggleTvMode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-24">
      <div className="max-w-lg mx-auto md:max-w-3xl px-4 py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center mb-6 md:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-full shadow-lg mr-4"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex items-center">
            <SettingsIcon className="w-8 h-8 text-purple-500 mr-3" />
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">设置</h1>
          </div>
        </div>

        {/* Subject Toggle Section */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 md:text-2xl">学科开关</h2>
          <p className="text-gray-500 mb-4 md:text-base">选择孩子要学习的学科</p>
          <div className="space-y-3 md:space-y-4">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className={`flex items-center justify-between p-4 rounded-2xl ${
                  subject.enabled ? 'bg-gradient-to-r ' + subject.color + ' bg-opacity-10' : 'bg-gray-100'
                } md:p-5`}
              >
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                    subject.enabled ? 'bg-gradient-to-r ' + subject.color : 'bg-gray-300'
                  } md:w-14 md:h-14 md:text-3xl`}>
                    {subject.icon}
                  </div>
                  <div className="ml-4 md:ml-5">
                    <h3 className={`font-bold ${subject.enabled ? 'text-gray-800' : 'text-gray-500'} md:text-lg`}>
                      {subject.name}
                    </h3>
                    <p className="text-sm text-gray-500 md:text-base">{subject.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSubject(subject.id)}
                  className={`w-14 h-7 rounded-full transition-all md:w-16 md:h-8 ${
                    subject.enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-all ${
                      subject.enabled ? 'translate-x-7' : 'translate-x-1'
                    } md:w-6 md:h-6 md:translate-x-1 md:enabled:translate-x-8`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Other Settings */}
        <div className="bg-white rounded-3xl p-6 shadow-lg md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 md:text-2xl">其他设置</h2>
          <div className="space-y-4 md:space-y-5">
            {/* Sound Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl md:p-5">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center text-2xl md:w-14 md:h-14">
                  {soundEnabled ? <Volume2 className="w-6 h-6 text-yellow-500" /> : <VolumeX className="w-6 h-6 text-gray-400" />}
                </div>
                <div className="ml-4 md:ml-5">
                  <h3 className="font-bold text-gray-800 md:text-lg">声音提示</h3>
                  <p className="text-sm text-gray-500 md:text-base">答题时播放音效</p>
                </div>
              </div>
              <button
                onClick={toggleSound}
                className={`w-14 h-7 rounded-full transition-all md:w-16 md:h-8 ${
                  soundEnabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-all ${
                    soundEnabled ? 'translate-x-7' : 'translate-x-1'
                  } md:w-6 md:h-6 md:translate-x-1 md:enabled:translate-x-8`}
                />
              </button>
            </div>

            {/* TV Mode Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl md:p-5">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl md:w-14 md:h-14">
                  <Tv2 className="w-6 h-6 text-blue-500" />
                </div>
                <div className="ml-4 md:ml-5">
                  <h3 className="font-bold text-gray-800 md:text-lg">电视模式</h3>
                  <p className="text-sm text-gray-500 md:text-base">适配大屏幕和遥控器操作</p>
                </div>
              </div>
              <button
                onClick={toggleTvMode}
                className={`w-14 h-7 rounded-full transition-all md:w-16 md:h-8 ${
                  tvMode ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-all ${
                    tvMode ? 'translate-x-7' : 'translate-x-1'
                  } md:w-6 md:h-6 md:translate-x-1 md:enabled:translate-x-8`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
