import { useState, useEffect } from "react";

interface FakeVideoCallProps {
  isOpen: boolean;
  onClose: () => void;
  contact: {
    name: string;
    relationship: string;
  };
}

export default function FakeVideoCall({ isOpen, onClose, contact }: FakeVideoCallProps) {
  const [callDuration, setCallDuration] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

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
      // Vibrate when video call starts
      if ('vibrate' in navigator) {
        navigator.vibrate([500, 200, 500, 200, 500]);
      }
      
      // Reset state
      setCallDuration(0);
      setIsAnswered(false);
      setIsMuted(false);
      setCameraOff(false);
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

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    setCameraOff(!cameraOff);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Top status bar */}
      <div className="bg-black/80 px-4 py-2 flex justify-between items-center text-white text-sm">
        <span className="text-green-400">
          <i className="fas fa-circle text-xs mr-1"></i>
          {isAnswered ? 'Video Call' : 'Incoming Video Call'}
        </span>
        {isAnswered && (
          <span className="font-mono">{formatDuration(callDuration)}</span>
        )}
      </div>

      {/* Main video area */}
      <div className="flex-1 bg-gradient-to-b from-gray-900 to-black relative">
        {/* Remote video (contact) */}
        <div className="w-full h-full relative flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 mb-4 flex items-center justify-center shadow-2xl">
            <i className="fas fa-user text-6xl text-gray-400"></i>
          </div>
          
          {/* Contact info overlay */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center text-white">
            <h2 className="text-2xl font-light mb-1">{contact.name}</h2>
            <p className="text-sm opacity-75">{contact.relationship}</p>
          </div>
        </div>

        {/* Local video preview (user) */}
        {isAnswered && (
          <div className="absolute top-4 right-4 w-24 h-32 bg-gray-800 rounded-lg border border-gray-600 flex items-center justify-center">
            {cameraOff ? (
              <i className="fas fa-video-slash text-gray-400 text-xl"></i>
            ) : (
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-gray-400 text-lg"></i>
              </div>
            )}
          </div>
        )}

        {/* Connection status */}
        {!isAnswered && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
            <div className="animate-pulse mb-4">
              <i className="fas fa-video text-4xl text-green-400"></i>
            </div>
            <p className="text-lg">Incoming video call...</p>
          </div>
        )}
      </div>

      {/* Call controls */}
      <div className="bg-black/90 p-6">
        {isAnswered ? (
          <div className="flex justify-center items-center space-x-6">
            <button 
              onClick={toggleMute}
              className={`w-14 h-14 rounded-full flex items-center justify-center ios-active shadow-lg transition-colors ${
                isMuted ? 'bg-ios-red' : 'bg-gray-700'
              }`}
            >
              <i className={`fas ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'} text-xl text-white`}></i>
            </button>
            
            <button 
              onClick={handleDeclineCall}
              className="w-16 h-16 bg-ios-red rounded-full flex items-center justify-center ios-active shadow-lg"
            >
              <i className="fas fa-phone-slash text-xl text-white"></i>
            </button>
            
            <button 
              onClick={toggleCamera}
              className={`w-14 h-14 rounded-full flex items-center justify-center ios-active shadow-lg transition-colors ${
                cameraOff ? 'bg-ios-red' : 'bg-gray-700'
              }`}
            >
              <i className={`fas ${cameraOff ? 'fa-video-slash' : 'fa-video'} text-xl text-white`}></i>
            </button>
          </div>
        ) : (
          <div className="flex justify-center space-x-16">
            <button 
              onClick={handleDeclineCall}
              className="w-16 h-16 bg-ios-red rounded-full flex items-center justify-center ios-active shadow-lg"
            >
              <i className="fas fa-phone-slash text-xl text-white"></i>
            </button>
            
            <button 
              onClick={handleAnswerCall}
              className="w-16 h-16 bg-ios-green rounded-full flex items-center justify-center ios-active shadow-lg"
            >
              <i className="fas fa-video text-xl text-white"></i>
            </button>
          </div>
        )}
        
        {isAnswered && (
          <div className="text-center mt-4">
            <p className="text-white/75 text-sm">
              Tap the red button to end video call when ready
            </p>
          </div>
        )}
      </div>
    </div>
  );
}