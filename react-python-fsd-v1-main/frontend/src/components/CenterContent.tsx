import React, { useState } from "react";
import Dashboard from "./Dashboard";
import StudyTimer from "./StudyTimer";
import { Plus } from "lucide-react";
import AddSessionModal from "./AddSessionModal";
import { StudySession, User } from "../types";
import { generateMockSessions, mockUser } from "../data/mockData";
import useLocalStorage from "../hooks/useLocalStorage";
import AchievementsView from "./achievements/AchievementsView";
import AnalyticsView from "./analytics/AnalyticsView";
import StudyGroupsView from "./social/StudyGroupsView";
import MessagesView from "./messages/MessagesView";
import Header from "./Header";
import { StudyProvider } from "./context/StudyContext";
import AvailabilityTab from "./availability/AvailabilityTab";
import SubjectsTab from "./subjects/SubjectsTab";
import TimetableTab from "./timetable/TimetableTab";
// import SubjectsTab from "./subjects/SubjectsTab";

interface CenterContentProps {
  activeTab: string;
}

const CenterContent: React.FC<CenterContentProps> = ({ activeTab }) => {
  const [user, setUser] = useLocalStorage<User>("user", mockUser);
  const [sessions, setSessions] = useLocalStorage<StudySession[]>(
    "sessions",
    generateMockSessions()
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddSession = (newSession: StudySession) => {
    setSessions([...sessions, newSession]);

    const updatedUser = { ...user };
    updatedUser.totalStudyHours += newSession.duration / 60;

    if (newSession.date === new Date().toISOString().split("T")[0]) {
      updatedUser.currentStreak += 1;
      updatedUser.longestStreak = Math.max(
        updatedUser.currentStreak,
        updatedUser.longestStreak
      );
    }

    setUser(updatedUser);
  };

  const handleTimerComplete = (duration: number) => {
    const newSession: StudySession = {
      id: Math.random().toString(36).substr(2, 9),
      subject: "Unspecified",
      duration,
      date: new Date().toISOString().split("T")[0],
      mood: "focused",
    };

    handleAddSession(newSession);
  };

  const handleReset = () => {
    setSessions([]);
    setUser({
      ...mockUser,
      currentStreak: 0,
      longestStreak: 0,
      totalStudyHours: 0,
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard user={user} sessions={sessions} onReset={handleReset} />
        );
      case "subjects":
        return (
          <StudyProvider>
            <div className="min-h-screen bg-slate-50">
              <main className="container mx-auto px-4 py-6">
                <div className="max-w-6xl mx-auto">
                  <SubjectsTab />
                </div>
              </main>

              <footer className="bg-white border-t border-slate-200 py-6 mt-12">
                <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
                  <p>StudyPlanner &copy; {new Date().getFullYear()}</p>
                  <p className="mt-1">
                    A smart solution to optimize your study time and achieve
                    better results
                  </p>
                </div>
              </footer>
            </div>
          </StudyProvider>
        );
      case "availability":
        return (
          <StudyProvider>
            <div className="min-h-screen bg-slate-50">
              <Header
                user={user}
                setShowSidebar={() => {}}
                onReset={handleReset}
              />

              <main className="container mx-auto px-4 py-6">
                <div className="max-w-6xl mx-auto">
                  <AvailabilityTab />
                </div>
              </main>

              <footer className="bg-white border-t border-slate-200 py-6 mt-12">
                <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
                  <p>StudyPlanner &copy; {new Date().getFullYear()}</p>
                  <p className="mt-1">
                    A smart solution to optimize your study time and achieve
                    better results
                  </p>
                </div>
              </footer>
            </div>
          </StudyProvider>
        );
      case "timetable":
        return (
          <StudyProvider>
            <div className="min-h-screen bg-slate-50">
              <Header
                user={user}
                setShowSidebar={() => {}}
                onReset={handleReset}
              />

              <main className="container mx-auto px-4 py-6">
                <div className="max-w-6xl mx-auto">
                  <TimetableTab />
                </div>
              </main>

              <footer className="bg-white border-t border-slate-200 py-6 mt-12">
                <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
                  <p>StudyPlanner &copy; {new Date().getFullYear()}</p>
                  <p className="mt-1">
                    A smart solution to optimize your study time and achieve
                    better results
                  </p>
                </div>
              </footer>
            </div>
          </StudyProvider>
        );

      case "schedule":
        return (
          <StudyProvider>
            <div className="min-h-screen bg-slate-50">
              <main className="container mx-auto px-4 py-6">
                <div className="max-w-6xl mx-auto">
                  <AvailabilityTab />
                </div>
              </main>

              <footer className="bg-white border-t border-slate-200 py-6 mt-12">
                <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
                  <p>StudyPlanner &copy; {new Date().getFullYear()}</p>
                  <p className="mt-1">
                    A smart solution to optimize your study time and achieve
                    better results
                  </p>
                </div>
              </footer>
            </div>
          </StudyProvider>
        );

      case "timer":
        return (
          <div className="p-4 sm:p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Study Timer
            </h2>
            <StudyTimer onSessionComplete={handleTimerComplete} />
          </div>
        );
      case "achievements":
        return (
          <AchievementsView
            user={user}
            totalStudyHours={user.totalStudyHours}
            totalSessions={sessions.length}
          />
        );
      case "analytics":
        return <AnalyticsView sessions={sessions} />;
      case "social":
        return <StudyGroupsView />;
      case "messages":
        return <MessagesView />;
      default:
        return (
          <div className="p-4 sm:p-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <p className="text-gray-500">This feature is coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 relative">
      {renderContent()}

      {activeTab !== "messages" && (
        <button
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-3 sm:p-4 rounded-full shadow-lg flex items-center justify-center z-10 transition-transform hover:scale-105"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={24} />
        </button>
      )}

      <AddSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSessionAdded={() => {}}
      />
    </div>
  );
};

export default CenterContent;
