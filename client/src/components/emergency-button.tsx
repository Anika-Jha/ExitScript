import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { GeneratedExcuse } from "@/pages/home";

interface EmergencyButtonProps {
  onEmergencyCall: (excuse: GeneratedExcuse, contact: { name: string; relationship: string }) => void;
  onEmergencyVideo: (excuse: GeneratedExcuse, contact: { name: string; relationship: string }) => void;
  selectedTone: "friendly" | "urgent" | "subtle";
}

export default function EmergencyButton({ onEmergencyCall, onEmergencyVideo, selectedTone }: EmergencyButtonProps) {
  const { toast } = useToast();

  const emergencyMutation = useMutation({
    mutationFn: async (callType: string = "audio") => {
      const response = await apiRequest("POST", "/api/excuses/emergency", { callType });
      return response.json();
    },
    onSuccess: (data) => {
      // Use data.callType to determine if it's video or audio call
      if (data.callType === 'video') {
        onEmergencyVideo(data, data.fakeContact || { name: "Sarah Johnson", relationship: "Sister" });
      } else {
        onEmergencyCall(data, data.fakeContact || { name: "Sarah Johnson", relationship: "Sister" });
      }
      
      // Trigger haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    },
    onError: (error) => {
      toast({
        title: "Emergency Failed",
        description: "Unable to generate emergency excuse. Please try manual options below.",
        variant: "destructive",
      });
      console.error("Emergency excuse generation failed:", error);
    },
  });

  const handleEmergencyCall = () => {
    emergencyMutation.mutate("audio");
  };

  const handleEmergencyVideo = () => {
    emergencyMutation.mutate("video");
  };

  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 gap-3 mb-3">
        <button 
          onClick={handleEmergencyCall}
          disabled={emergencyMutation.isPending}
          className={`bg-ios-red text-white py-3 rounded-xl font-semibold text-sm shadow-lg ios-active transition-all duration-200 ${
            emergencyMutation.isPending ? 'opacity-75 animate-pulse' : ''
          }`}
        >
          <i className="fas fa-phone mr-2"></i>
          {emergencyMutation.isPending ? 'Calling...' : 'Emergency Call'}
        </button>
        
        <button 
          onClick={handleEmergencyVideo}
          disabled={emergencyMutation.isPending}
          className={`bg-ios-orange text-white py-3 rounded-xl font-semibold text-sm shadow-lg ios-active transition-all duration-200 ${
            emergencyMutation.isPending ? 'opacity-75 animate-pulse' : ''
          }`}
        >
          <i className="fas fa-video mr-2"></i>
          {emergencyMutation.isPending ? 'Calling...' : 'Emergency Video'}
        </button>
      </div>
      <p className="text-xs text-gray-500 text-center">
        Instant excuse + fake call/video when you feel unsafe
      </p>
    </div>
  );
}
