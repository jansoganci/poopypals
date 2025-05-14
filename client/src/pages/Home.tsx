import { useState } from "react";
import StatusCard from "@/components/StatusCard";
import LogButton from "@/components/LogButton";
import FeatureGrid from "@/components/FeatureGrid";
import RecentActivity from "@/components/RecentActivity";
import LoggingForm from "@/components/LoggingForm";
import DailyChallenges from "@/components/DailyChallenges";

export default function Home() {
  const [isLoggingFormOpen, setIsLoggingFormOpen] = useState(false);
  
  const handleOpenLoggingForm = () => {
    setIsLoggingFormOpen(true);
  };
  
  const handleCloseLoggingForm = () => {
    setIsLoggingFormOpen(false);
  };
  
  return (
    <main className="flex-1 overflow-y-auto pb-20">
      <StatusCard />
      <LogButton onClick={handleOpenLoggingForm} />
      <div className="px-4 mb-4">
        <DailyChallenges />
      </div>
      <FeatureGrid />
      <RecentActivity />
      
      {isLoggingFormOpen && (
        <LoggingForm 
          isOpen={isLoggingFormOpen} 
          onClose={handleCloseLoggingForm} 
        />
      )}
    </main>
  );
}
