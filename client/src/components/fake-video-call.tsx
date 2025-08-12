import { useState, useEffect, useRef } from "react";

interface FakeVideoCallProps {
  isOpen: boolean;
  onClose: () => void;
  contact: { name: string; relationship: string };
}

export default function FakeVideoCall({ isOpen, onClose, contact }: FakeVideoCallProps) {
  const [callDuration, setCallDuration] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [hasWebcamAccess, setHasWebcamAccess] = useState(false);
  const [userStream, setUserStream] = useState<MediaStream | null>(null);

  const userVideoRef = useRef<HTMLVideoElement>(null);
  const callerVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && isAnswered) {
      timer = setInterval(() => setCallDuration((t) => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, isAnswered]);

  useEffect(() => {
    if (isOpen) {
      setCallDuration(0);
      setIsAnswered(false);
      initWebcam();
    } else {
      endCallMedia();
    }
  }, [isOpen]);

  const initWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setUserStream(stream);
      setHasWebcamAccess(true);
      if (userVideoRef.current) userVideoRef.current.srcObject = stream;
    } catch {
      setHasWebcamAccess(false);
    }
  };

  const endCallMedia = () => {
    speechSynthesis.cancel();
    if (userStream) {
      userStream.getTracks().forEach((t) => t.stop());
      setUserStream(null);
    }
    if (callerVideoRef.current) {
      callerVideoRef.current.pause();
      callerVideoRef.current.currentTime = 0;
    }
  };

  const handleAnswer = () => {
    setIsAnswered(true);
    const vid = callerVideoRef.current;
    if (vid) {
      vid.muted = false;
      vid.currentTime = 0;
      vid.volume = 1.0;
      vid
        .play()
        .then(() => console.log("Video playing"))
        .catch(() => playVoice());
    } else {
      playVoice();
    }
  };

  const playVoice = () => {
    if (!("speechSynthesis" in window)) return;
    const voices = speechSynthesis.getVoices();
    const voice = voices.find((v) => /female|woman|samantha|alex/i.test(v.name));
    const talk = (text: string, delay: number) => {
      setTimeout(() => {
        const msg = new SpeechSynthesisUtterance(text);
        if (voice) msg.voice = voice;
        msg.rate = 0.5;
        msg.pitch = 1.1;
        msg.volume = 0.8;
        speechSynthesis.speak(msg);
      }, delay);
    };
    talk("Hey! Thank goodness you answered…", 500);
    talk("Listen, I need you to come get me right now…", 2500);
    talk("Something came up and I really need to leave.", 7500);
    talk("Can you please come pick me up?", 7000);
    talk("I'll explain everything when you get here.", 9000);
  };

  const handleDecline = () => {
    speechSynthesis.cancel();
    endCallMedia();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="bg-black/80 flex justify-between text-white text-sm p-2">
        <span>{isAnswered ? "Video Call" : "Incoming Call"}</span>
        {isAnswered && <span className="font-mono">{Math.floor(callDuration / 60)}:{String(callDuration % 60).padStart(2, "0")}</span>}
      </div>
      <div className="flex-1 relative bg-gray-900">
        {isAnswered ? (
          <video ref={callerVideoRef} src="/videos/human.mp4" autoPlay loop className="w-full h-full object-cover" playsInline />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-2xl">{contact.name} ({contact.relationship})</div>
          </div>
        )}
        {isAnswered && (
          <div className="absolute top-2 right-2 w-24 h-32 bg-gray-800">
            {hasWebcamAccess && (
              <video ref={userVideoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
            )}
          </div>
        )}
      </div>
      <div className="p-4 bg-black">
        {isAnswered ? (
          <button onClick={handleDecline} className="bg-red-500 text-white px-4 py-2 rounded">End Call</button>
        ) : (
          <button onClick={handleAnswer} className="bg-green-500 text-white px-4 py-2 rounded">Answer</button>
        )}
      </div>
    </div>
  );
}
