import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { GeneratedExcuse } from "@/pages/home";

interface ExcuseDisplayProps {
  excuse: GeneratedExcuse;
  onTriggerFakeCall: () => void;
  onTriggerVideoCall: () => void;
}

export default function ExcuseDisplay({ excuse, onTriggerFakeCall, onTriggerVideoCall }: ExcuseDisplayProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyExcuse = async () => {
    try {
      await navigator.clipboard.writeText(excuse.content);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Excuse copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "ExitScript Excuse",
          text: excuse.content,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copy
      handleCopyExcuse();
    }
  };

  return (
    <div className="mb-8 animate-fade-in-up">
      <div className="bg-gradient-to-r from-ios-blue to-blue-600 dark:from-blue-800 dark:to-blue-900 p-6 rounded-2xl text-white">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold">Your Excuse</h3>
          <button 
            onClick={handleCopyExcuse}
            className="text-white/80 hover:text-white transition-colors ios-active"
          >
            <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
          </button>
        </div>
        
        <p className="text-white/90 mb-4 leading-relaxed">
          "{excuse.content}"
        </p>
        
        {excuse.believability && (
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-white/75 text-sm">Believability:</span>
              <div className="flex space-x-1">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < excuse.believability! ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
              <span className="text-white/75 text-sm">{excuse.believability}/10</span>
            </div>
          </div>
        )}
        
        <div className="flex space-x-2">
          <button 
            onClick={onTriggerFakeCall}
            className="bg-white/20 dark:bg-white/30 px-3 py-2 rounded-lg text-xs font-medium ios-active hover:bg-white/30 dark:hover:bg-white/40 transition-colors"
          >
            <i className="fas fa-phone mr-1"></i> Call
          </button>
          <button 
            onClick={onTriggerVideoCall}
            className="bg-white/20 dark:bg-white/30 px-3 py-2 rounded-lg text-xs font-medium ios-active hover:bg-white/30 dark:hover:bg-white/40 transition-colors"
          >
            <i className="fas fa-video mr-1"></i> Video
          </button>
          <button 
            onClick={handleShare}
            className="bg-white/20 dark:bg-white/30 px-3 py-2 rounded-lg text-xs font-medium ios-active hover:bg-white/30 dark:hover:bg-white/40 transition-colors"
          >
            <i className="fas fa-share mr-1"></i> Share
          </button>
        </div>
      </div>
    </div>
  );
}
