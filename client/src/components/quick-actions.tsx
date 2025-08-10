import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { GeneratedExcuse } from "@/pages/home";

interface QuickActionsProps {
  onExcuseGenerated: (excuse: GeneratedExcuse) => void;
  selectedTone: "friendly" | "urgent" | "subtle";
}

const categories = [
  { id: "work", icon: "fas fa-briefcase", label: "Work Emergency", color: "text-ios-blue" },
  { id: "family", icon: "fas fa-home", label: "Family Issue", color: "text-ios-green" },
  { id: "health", icon: "fas fa-heart", label: "Health Concern", color: "text-ios-red" },
  { id: "transport", icon: "fas fa-car", label: "Transport Issue", color: "text-orange-500" },
];

export default function QuickActions({ onExcuseGenerated, selectedTone }: QuickActionsProps) {
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async ({ category, tone }: { category: string; tone: string }) => {
      const response = await apiRequest("POST", "/api/excuses/generate", { category, tone });
      return response.json();
    },
    onSuccess: (data) => {
      onExcuseGenerated(data);
      toast({
        title: "Excuse Generated",
        description: "Your excuse is ready to use!",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Unable to generate excuse. Please try again.",
        variant: "destructive",
      });
      console.error("Excuse generation failed:", error);
    },
  });

  const handleCategoryClick = (category: string) => {
    generateMutation.mutate({ category, tone: selectedTone });
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Quick Generate</h2>
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            disabled={generateMutation.isPending}
            className={`bg-white p-4 rounded-xl border border-gray-200 shadow-sm ios-active transition-all duration-200 ${
              generateMutation.isPending ? 'opacity-50' : ''
            }`}
          >
            <i className={`${category.icon} ${category.color} text-xl mb-2`}></i>
            <p className="font-medium text-sm">{category.label}</p>
            {generateMutation.isPending && (
              <div className="mt-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto"></div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
