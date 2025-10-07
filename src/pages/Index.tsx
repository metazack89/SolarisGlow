import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { MapView } from "@/components/MapView";
import { BillSimulator } from "@/components/BillSimulator";
import { NewsSection } from "@/components/NewsSection";

const GOOGLE_API_KEY = "AIzaSyBa1vyF1T7MMYo4wNNWIUmHs3ehQ1xF618";

const Index = () => {
  const [activeView, setActiveView] = useState("dashboard");

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1">
        {activeView === "dashboard" && <Dashboard />}
        {activeView === "map" && <MapView apiKey={GOOGLE_API_KEY} />}
        {activeView === "simulator" && <BillSimulator />}
        {activeView === "news" && <NewsSection />}
      </main>
    </div>
  );
};

export default Index;
