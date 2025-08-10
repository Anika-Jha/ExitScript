import { useState, useEffect, useRef } from "react";

interface FakeCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: {
    name: string;
    relationship: string;
  };
}

export default function FakeCallModal({ isOpen, onClose, contact }: FakeCallModalProps) {
  const [callDuration, setCallDuration] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isOpen && isAnswered) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, isAnswered]);

  useEffect(() => {
    if (isOpen) {
      // Vibrate when call starts
      if ('vibrate' in navigator) {
        navigator.vibrate([500, 200, 500, 200, 500]);
      }
      
      // Play realistic ringtone using Web Audio API
      const createRingtone = () => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(554, audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
        
        return audioContext;
      };
      
      // Play ringtone every 2 seconds until answered
      const ringtoneInterval = setInterval(() => {
        if (!isAnswered) {
          try {
            createRingtone();
          } catch (error) {
            console.log("Audio context not available");
          }
        }
      }, 2000);
      
      // Initial ringtone
      try {
        createRingtone();
      } catch (error) {
        console.log("Audio context not available");
      }
      
      // Reset state
      setCallDuration(0);
      setIsAnswered(false);
      
      return () => {
        clearInterval(ringtoneInterval);
      };
    }
  }, [isOpen, isAnswered]);

  const handleAnswerCall = () => {
    setIsAnswered(true);
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
    
    // Speak a realistic conversation starter when call is answered
    if ('speechSynthesis' in window) {
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(`Hey, it's ${contact.name}. I really need you to come help me right now. Can you please come over?`);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        
        // Try to use a female voice
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('female') || 
          voice.name.toLowerCase().includes('woman') ||
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('alex')
        );
        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }
        
        speechSynthesis.speak(utterance);
        
        // Add a follow-up after a pause
        setTimeout(() => {
          const followUp = new SpeechSynthesisUtterance("It's really important, I'm waiting for you.");
          followUp.rate = 0.9;
          followUp.pitch = 1.1;
          followUp.volume = 0.8;
          if (femaleVoice) {
            followUp.voice = femaleVoice;
          }
          speechSynthesis.speak(followUp);
        }, 4000);
      }, 1000);
    }
  };

  const handleDeclineCall = () => {
    onClose();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 bg-gradient-to-b from-gray-800 to-black p-6 flex flex-col justify-center items-center text-white">
        <p className="text-sm opacity-75 mb-2">
          {isAnswered ? 'Call in progress' : 'Incoming call'}
        </p>
        
        {/* Profile image placeholder */}
        <div className="w-32 h-32 rounded-full bg-gray-600 mb-4 flex items-center justify-center">
          <i className="fas fa-user text-4xl text-gray-400"></i>
        </div>
        
        <h2 className="text-2xl font-light mb-1">{contact.name}</h2>
        <p className="text-sm opacity-75 mb-4">{contact.relationship}</p>
        
        {isAnswered && (
          <div className="text-center">
            <div className="text-lg font-mono mb-2">{formatDuration(callDuration)}</div>
            <div className="flex space-x-4 mb-6">
              <button className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center ios-active">
                <i className="fas fa-volume-up text-sm"></i>
              </button>
              <button className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center ios-active">
                <i className="fas fa-microphone-slash text-sm"></i>
              </button>
              <button className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center ios-active">
                <i className="fas fa-plus text-sm"></i>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Call Actions */}
      <div className="p-8">
        <div className="flex justify-center space-x-16">
          <button 
            onClick={handleDeclineCall}
            className="w-16 h-16 bg-ios-red rounded-full flex items-center justify-center ios-active shadow-lg"
          >
            <i className="fas fa-phone-slash text-xl"></i>
          </button>
          
          {!isAnswered && (
            <button 
              onClick={handleAnswerCall}
              className="w-16 h-16 bg-ios-green rounded-full flex items-center justify-center ios-active shadow-lg"
            >
              <i className="fas fa-phone text-xl"></i>
            </button>
          )}
        </div>
        
        {isAnswered && (
          <div className="text-center mt-4">
            <p className="text-white/75 text-sm">
              Tap the red button to end call when ready
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
