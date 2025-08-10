import { useState } from "react";
import StatusBar from "@/components/status-bar";
import EmergencyButton from "@/components/emergency-button";
import QuickActions from "@/components/quick-actions";
import ExcuseDisplay from "@/components/excuse-display";
import ToneSettings from "@/components/tone-settings";
import RecentExcuses from "@/components/recent-excuses";
import BottomNavigation from "@/components/bottom-navigation";
import FakeCallModal from "@/components/fake-call-modal";
import FakeVideoCall from "@/components/fake-video-call";

export interface GeneratedExcuse {
  id: string;
  content: string;
  category: string;
  tone: string;
  believability?: number;
  createdAt?: Date;
}

export default function Home() {
  const [currentExcuse, setCurrentExcuse] = useState<GeneratedExcuse | null>(null);
  const [selectedTone, setSelectedTone] = useState<"friendly" | "urgent" | "subtle">("friendly");
  const [currentPage, setCurrentPage] = useState("home");
  const [showFakeCall, setShowFakeCall] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [fakeContact, setFakeContact] = useState({
    name: "Sarah Johnson",
    relationship: "Sister"
  });

  const handleExcuseGenerated = (excuse: GeneratedExcuse) => {
    setCurrentExcuse(excuse);
  };

  const handleEmergencyCall = (excuse: GeneratedExcuse, contact: { name: string; relationship: string }) => {
    setCurrentExcuse(excuse);
    setFakeContact(contact);
    setShowFakeCall(true);
  };

  const handleEmergencyVideo = (excuse: GeneratedExcuse, contact: { name: string; relationship: string }) => {
    setCurrentExcuse(excuse);
    setFakeContact(contact);
    setShowVideoCall(true);
  };

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen relative overflow-hidden">
      <StatusBar />
      
      <header className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-ios-dark">ExitScript</h1>
          <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ios-active">
            <i className="fas fa-cog text-gray-600"></i>
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">Quick excuses for any situation</p>
      </header>

      <main className="px-6 py-6 pb-24">
        <EmergencyButton 
          onEmergencyCall={handleEmergencyCall}
          onEmergencyVideo={handleEmergencyVideo}
          selectedTone={selectedTone}
        />
        
        <QuickActions 
          onExcuseGenerated={handleExcuseGenerated}
          selectedTone={selectedTone}
        />
        
        {currentExcuse && (
          <ExcuseDisplay 
            excuse={currentExcuse}
            onTriggerFakeCall={() => {
              setShowFakeCall(true);
            }}
            onTriggerVideoCall={() => {
              setShowVideoCall(true);
            }}
          />
        )}
        
        <ToneSettings 
          selectedTone={selectedTone}
          onToneChange={setSelectedTone}
        />
        
        <RecentExcuses 
          onExcuseSelected={handleExcuseGenerated}
        />
      </main>

      <BottomNavigation 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <FakeCallModal
        isOpen={showFakeCall}
        onClose={() => setShowFakeCall(false)}
        contact={fakeContact}
      />

      <FakeVideoCall
        isOpen={showVideoCall}
        onClose={() => setShowVideoCall(false)}
        contact={fakeContact}
      />
    </div>
  );
}
