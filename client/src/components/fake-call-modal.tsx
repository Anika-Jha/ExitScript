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
  const ringtoneIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const speechUtterancesRef = useRef<SpeechSynthesisUtterance[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Format call duration as mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Play a beep sound to simulate ringtone
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
      gain.gain.setValueAtTime(0.3, ctx.currentTime);

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.2); // short beep 200ms

      oscillator.onended = () => {
        gain.disconnect();
        oscillator.disconnect();
      };
    } catch (e) {
      // fallback: do nothing
    }
  };

  // Start playing ringtone loop
  const startRingtone = () => {
    playBeep();
    ringtoneIntervalRef.current = setInterval(() => {
      playBeep();
    }, 800);
  };

  // Stop ringtone loop and close audio context
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

  // Speak a message with optional delay
  const speakMessage = (text: string, delay = 0, voice?: SpeechSynthesisVoice) => {
    return new Promise<void>(resolve => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      if (voice) utterance.voice = voice;

      utterance.onend = () => {
        resolve();
      };

      setTimeout(() => {
        speechSynthesis.speak(utterance);
        speechUtterancesRef.current.push(utterance);
      }, delay);
    });
  };

  // Cleanup speech synthesis utterances and stop all speech
  const cancelSpeech = () => {
    speechUtterancesRef.current.forEach(utt => {
      // There's no direct stop on individual utterances; speechSynthesis.cancel stops all
    });
    speechUtterancesRef.current = [];
    speechSynthesis.cancel();
  };

  useEffect(() => {
    if (isOpen) {
      // Vibrate device
      if ("vibrate" in navigator) navigator.vibrate([500, 200, 500]);

      // Reset states
      setCallDuration(0);
      setIsAnswered(false);

      // Start ringtone
      startRingtone();
    } else {
      // When modal closes, clean everything up
      stopRingtone();
      cancelSpeech();
      setIsAnswered(false);
      setCallDuration(0);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      stopRingtone();
      cancelSpeech();

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    // If call answered, stop ringtone and start timer
    if (isAnswered) {
      stopRingtone();

      intervalRef.current = setInterval(() => {
        setCallDuration((d) => d + 1);
      }, 1000);

      // Speak conversation with natural pauses
      if ("speechSynthesis" in window) {
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find((voice) =>
          voice.name.toLowerCase().includes("female") ||
          voice.name.toLowerCase().includes("woman") ||
          voice.name.toLowerCase().includes("samantha") ||
          voice.name.toLowerCase().includes("alex")
        );

        // Chain speech messages with pauses
        (async () => {
          await speakMessage(`Hey, it's ${contact.name}.`, 500, femaleVoice);
          await speakMessage("how are you??", 400, femaleVoice);
          await speakMessage("I really need you to come help me right now.", 1400, femaleVoice);
          await speakMessage("Can you please come over?", 400, femaleVoice);
          await new Promise(r => setTimeout(r, 11500));
          await speakMessage("It's really important, I'm waiting for you.", 0, femaleVoice);
        })();
      }
    } else {
      // If call ended, stop timer and speech
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      cancelSpeech();
    }

    // Cleanup on unmount or isAnswered change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      cancelSpeech();
    };
  }, [isAnswered]);

  const handleAnswerCall = () => {
    setIsAnswered(true);
    if ("vibrate" in navigator) navigator.vibrate(100);
  };

  const handleDeclineCall = () => {
    setIsAnswered(false);
    stopRingtone();
    cancelSpeech();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 bg-gradient-to-b from-gray-800 to-black p-6 flex flex-col justify-center items-center text-white">
        <p className="text-sm opacity-75 mb-2">{isAnswered ? "Call in progress" : "Incoming call"}</p>

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
              <button className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center ios-active" title="Speaker">
                <i className="fas fa-volume-up text-sm"></i>
              </button>
              <button className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center ios-active" title="Mute">
                <i className="fas fa-microphone-slash text-sm"></i>
              </button>
              <button className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center ios-active" title="Add call">
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
            aria-label="Decline call"
          >
            <i className="fas fa-phone-slash text-xl"></i>
          </button>

          {!isAnswered && (
            <button
              onClick={handleAnswerCall}
              className="w-16 h-16 bg-ios-green rounded-full flex items-center justify-center ios-active shadow-lg"
              aria-label="Answer call"
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
