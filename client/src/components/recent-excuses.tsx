import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { GeneratedExcuse } from "@/pages/home";
import type { Excuse } from "@shared/schema";

interface RecentExcusesProps {
  onExcuseSelected: (excuse: GeneratedExcuse) => void;
}

export default function RecentExcuses({ onExcuseSelected }: RecentExcusesProps) {
  const { toast } = useToast();

  const { data: recentExcuses = [], isLoading, error } = useQuery<Excuse[]>({
    queryKey: ["/api/excuses/recent"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleReuseExcuse = (excuse: Excuse) => {
    onExcuseSelected({
      id: excuse.id,
      content: excuse.content,
      category: excuse.category,
      tone: excuse.tone,
      createdAt: excuse.createdAt ? new Date(excuse.createdAt) : new Date(),
    });
    
    toast({
      title: "Excuse Reused",
      description: "Previous excuse is now active",
    });
  };

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const excuseDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - excuseDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour ago`;
    return `${Math.floor(diffInMinutes / 1440)} day ago`;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      work: "Work Emergency",
      family: "Family Emergency", 
      health: "Health Concern",
      transport: "Transport Issue"
    };
    return labels[category] || category;
  };

  if (error) {
    return (
      <div>
        <h3 className="font-semibold mb-3">Recent Excuses</h3>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600 text-sm">Unable to load recent excuses</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold mb-3">Recent Excuses</h3>
      
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 p-4 rounded-xl animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : recentExcuses.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
          <i className="fas fa-history text-gray-400 text-2xl mb-2"></i>
          <p className="text-gray-600 text-sm">No recent excuses</p>
          <p className="text-gray-500 text-xs mt-1">Generate an excuse to see it here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {recentExcuses.slice(0, 5).map((excuse: Excuse) => (
            <div key={excuse.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">
                    {getCategoryLabel(excuse.category)} • {formatTimeAgo(excuse.createdAt || new Date())}
                  </p>
                  <p className="text-sm text-gray-800 line-clamp-2">
                    "{excuse.content.length > 60 
                      ? excuse.content.substring(0, 60) + "..." 
                      : excuse.content}"
                  </p>
                </div>
                <button 
                  onClick={() => handleReuseExcuse(excuse)}
                  className="text-gray-400 ml-2 p-1 rounded hover:text-ios-blue hover:bg-gray-100 transition-colors ios-active"
                  title="Reuse this excuse"
                >
                  <i className="fas fa-redo text-xs"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
