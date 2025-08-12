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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const ringtoneIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const speakRef = useRef(false); // Prevents multiple speech triggers

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // --- Realistic beep as ringtone ---
  const playBeep = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.25); // short beep

      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
      };
    } catch (e) {}
  };

  const startRingtone = () => {
    playBeep();
    ringtoneIntervalRef.current = setInterval(() => {
      playBeep();
    }, 1000);
  };

  const stopRingtone = () => {
    if (ringtoneIntervalRef.current) {
      clearInterval(ringtoneIntervalRef.current);
      ringtoneIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const cancelSpeech = () => {
    speechSynthesis.cancel();
    speakRef.current = false;
  };

  const speakCall = () => {
    if (speakRef.current || !isAnswered) return;
    speakRef.current = true;

    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find((voice) =>
      voice.name.toLowerCase().includes("female") ||
      voice.name.toLowerCase().includes("woman") ||
      voice.name.toLowerCase().includes("samantha") ||
      voice.name.toLowerCase().includes("alex")
    );

    const utter = (text: string, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const u = new SpeechSynthesisUtterance(text);
          u.rate = 0.5;
          u.pitch = 1.1;
          u.volume = 0.8;
          if (femaleVoice) u.voice = femaleVoice;
          u.onend = () => resolve();
          speechSynthesis.speak(u);
        }, delay);
      });
    };

    // Chain the utterances
    (async () => {
      await utter("Heyy!!", 800);
      await utter(`it's ${contact.name}.`, 10000);
      await utter("I really need you to come help me right now.", 10000);
      await utter("Can you please come over?", 15000);
      await utter("It's really important. I'm waiting for you.", 30000);
    })();
  };

  // Lifecycle: Open
  useEffect(() => {
    if (isOpen) {
      if ("vibrate" in navigator) navigator.vibrate([500, 200, 500]);
      setIsAnswered(false);
      setCallDuration(0);
      startRingtone();
    } else {
      stopRingtone();
      cancelSpeech();
      clearInterval(intervalRef.current!);
    }

    return () => {
      stopRingtone();
      cancelSpeech();
      clearInterval(intervalRef.current!);
    };
  }, [isOpen]);

  // Lifecycle: Answered
  useEffect(() => {
    if (isAnswered) {
      stopRingtone();

      intervalRef.current = setInterval(() => {
        setCallDuration((d) => d + 1);
      }, 1000);

      speakCall();
    } else {
      clearInterval(intervalRef.current!);
    }

    return () => {
      clearInterval(intervalRef.current!);
    };
  }, [isAnswered]);

  const handleAnswerCall = () => {
    setIsAnswered(true);
    if ("vibrate" in navigator) navigator.vibrate(100);
  };

  const handleDeclineCall = () => {
    setIsAnswered(false);
    cancelSpeech();
    stopRingtone();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 bg-gradient-to-b from-gray-800 to-black p-6 flex flex-col justify-center items-center text-white">
        <p className="text-sm opacity-75 mb-2">{isAnswered ? "Call in progress" : "Incoming call"}</p>

        <div className="w-32 h-32 rounded-full bg-gray-600 mb-4 flex items-center justify-center">
          <i className="fas fa-user text-4xl text-gray-400"></i>
        </div>

        <h2 className="text-2xl font-light mb-1">{contact.name}</h2>
        <p className="text-sm opacity-75 mb-4">{contact.relationship}</p>

        {isAnswered && (
          <div className="text-center">
            <div className="text-lg font-mono mb-2">{formatDuration(callDuration)}</div>
            <div className="flex space-x-4 mb-6">
              <button className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                <i className="fas fa-volume-up text-sm"></i>
              </button>
              <button className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                <i className="fas fa-microphone-slash text-sm"></i>
              </button>
              <button className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                <i className="fas fa-plus text-sm"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-8">
        <div className="flex justify-center space-x-16">
          <button
            onClick={handleDeclineCall}
            className="w-16 h-16 bg-ios-red rounded-full flex items-center justify-center shadow-lg"
          >
            <i className="fas fa-phone-slash text-xl"></i>
          </button>

          {!isAnswered && (
            <button
              onClick={handleAnswerCall}
              className="w-16 h-16 bg-ios-green rounded-full flex items-center justify-center shadow-lg"
            >
              <i className="fas fa-phone text-xl"></i>
            </button>
          )}
        </div>

        {isAnswered && (
          <div className="text-center mt-4">
            <p className="text-white/75 text-sm">Tap the red button to end call when ready</p>
          </div>
        )}
      </div>
    </div>
  );
}
