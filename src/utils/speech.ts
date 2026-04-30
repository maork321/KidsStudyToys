
export const useSpeech = () => {
  const speak = (text: string, rate: number = 0.8) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      const voices = window.speechSynthesis.getVoices();
      const chineseVoice = voices.find(voice => 
        voice.lang.startsWith('zh') || voice.name.includes('Chinese')
      );
      
      if (chineseVoice) {
        utterance.voice = chineseVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('浏览器不支持语音合成');
    }
  };

  const stop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const getVoices = () => {
    if ('speechSynthesis' in window) {
      return window.speechSynthesis.getVoices();
    }
    return [];
  };

  const isSupported = () => {
    return 'speechSynthesis' in window;
  };

  return { speak, stop, getVoices, isSupported };
};

export default useSpeech;
