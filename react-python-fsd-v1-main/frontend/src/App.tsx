import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import CenterContent from "./components/CenterContent";
import { mockUser } from "./data/mockData";
import { StudyProvider } from "./components/context/StudyContext";

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <StudyProvider>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="flex flex-col flex-1 md:ml-64 overflow-hidden">
          <Header
            user={mockUser}
            setShowSidebar={setShowSidebar}
            onReset={() => {
              localStorage.clear();
              window.location.reload();
            }}
          />
          <CenterContent activeTab={activeTab} />
        </div>
      </div>
    </StudyProvider>
  );
}

export default App;
