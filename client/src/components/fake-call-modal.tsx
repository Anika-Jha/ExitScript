import { useState, useEffect } from "react";

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
      
      // Reset state
      setCallDuration(0);
      setIsAnswered(false);
    }
  }, [isOpen]);

  const handleAnswerCall = () => {
    setIsAnswered(true);
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
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
