import { useState, useEffect, useRef } from "react";

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
  const [userStream, setUserStream] = useState<MediaStream | null>(null);
  const [hasWebcamAccess, setHasWebcamAccess] = useState(false);

  const userVideoRef = useRef<HTMLVideoElement>(null);
  const callerVideoRef = useRef<HTMLVideoElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const followUpRef = useRef<SpeechSynthesisUtterance | null>(null);

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
      if ("vibrate" in navigator) navigator.vibrate([500, 200, 500, 200, 500]);
      initializeWebcam();
      setCallDuration(0);
      setIsAnswered(false);
      setIsMuted(false);
      setCameraOff(false);
    } else {
      if (userStream) {
        userStream.getTracks().forEach(track => track.stop());
        setUserStream(null);
      }
      setHasWebcamAccess(false);
      speechSynthesis.cancel();

      if (callerVideoRef.current) {
        callerVideoRef.current.pause();
        callerVideoRef.current.currentTime = 0;
      }
    }
  }, [isOpen]);

  const initializeWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 },
        audio: true,
      });
      setUserStream(stream);
      setHasWebcamAccess(true);

      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.log("Webcam access denied or not available:", error);
      setHasWebcamAccess(false);
    }
  };

  const handleAnswerCall = () => {
    setIsAnswered(true);
    if ("vibrate" in navigator) navigator.vibrate(100);

    if ("speechSynthesis" in window) {
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice =>
        voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("woman") ||
        voice.name.toLowerCase().includes("samantha") ||
        voice.name.toLowerCase().includes("alex")
      );

      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(
          "Hey! Thank goodness you answered. Listen, I need you to come get me right now. Something came up and I really need to leave."
        );
        utterance.rate = 0.5;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        if (femaleVoice) utterance.voice = femaleVoice;

        speechSynthesis.speak(utterance);
        utteranceRef.current = utterance;

        utterance.onend = () => {
          setTimeout(() => {
            const followUp = new SpeechSynthesisUtterance(
              "Can you please come pick me up? I'll explain everything when you get here."
            );
            followUp.rate = 0.9;
            followUp.pitch = 1.1;
            followUp.volume = 0.8;
            if (femaleVoice) followUp.voice = femaleVoice;

            speechSynthesis.speak(followUp);
            followUpRef.current = followUp;
          }, 3000); // Pause for 3 seconds
        };
      }, 1000); // Start after 1 second
    }
  };

  const handleDeclineCall = () => {
    speechSynthesis.cancel();
    utteranceRef.current = null;
    followUpRef.current = null;
    onClose();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    setCameraOff(!cameraOff);
    if (userStream) {
      const videoTrack = userStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = cameraOff;
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="bg-black/80 px-4 py-2 flex justify-between items-center text-white text-sm">
        <span className="text-green-400">
          <i className="fas fa-circle text-xs mr-1"></i>
          {isAnswered ? "Video Call" : "Incoming Video Call"}
        </span>
        {isAnswered && <span className="font-mono">{formatDuration(callDuration)}</span>}
      </div>

      <div className="flex-1 bg-gradient-to-b from-gray-900 to-black relative">
        <div className="w-full h-full relative">
          {isAnswered ? (
            <video
              ref={callerVideoRef}
              autoPlay
              loop
              muted
              playsInline
              src="client/public/videos/human.mp4"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 mb-4 flex items-center justify-center shadow-2xl">
                <i className="fas fa-user text-6xl text-gray-400"></i>
              </div>
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center text-white">
                <h2 className="text-2xl font-light mb-1">{contact.name}</h2>
                <p className="text-sm opacity-75">{contact.relationship}</p>
              </div>
            </div>
          )}
        </div>

        {isAnswered && (
          <div className="absolute top-4 right-4 w-24 h-32 bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
            {cameraOff ? (
              <div className="w-full h-full flex items-center justify-center">
                <i className="fas fa-video-slash text-gray-400 text-xl"></i>
              </div>
            ) : hasWebcamAccess && userStream ? (
              <video
                ref={userVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center">
                <i className="fas fa-user text-white text-lg"></i>
              </div>
            )}
            {!hasWebcamAccess && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-yellow-400 text-xs"></i>
              </div>
            )}
          </div>
        )}

        {!isAnswered && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
            <div className="animate-pulse mb-4">
              <i className="fas fa-video text-4xl text-green-400"></i>
            </div>
            <p className="text-lg">Incoming video call...</p>
          </div>
        )}
      </div>

      <div className="bg-black/90 p-6">
        {isAnswered ? (
          <div className="flex justify-center items-center space-x-6">
            <button
              onClick={toggleMute}
              className={`w-14 h-14 rounded-full flex items-center justify-center ios-active shadow-lg transition-colors ${
                isMuted ? "bg-ios-red" : "bg-gray-700"
              }`}
            >
              <i className={`fas ${isMuted ? "fa-microphone-slash" : "fa-microphone"} text-xl text-white`}></i>
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
                cameraOff ? "bg-ios-red" : "bg-gray-700"
              }`}
            >
              <i className={`fas ${cameraOff ? "fa-video-slash" : "fa-video"} text-xl text-white`}></i>
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
            <p className="text-white/75 text-sm">Tap the red button to end video call when ready</p>
          </div>
        )}
      </div>
    </div>
  );
}
