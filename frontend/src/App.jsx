import { useState, useEffect, useRef } from "react";
import { useWallet } from "./hooks/useWallet";
import { useQuests } from "./hooks/useQuests";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import QuestBoard from "./components/QuestBoard";
import BossRaid from "./components/BossRaid";
import WalletAnalyzer from "./components/WalletAnalyzer";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "quests", label: "Quests", icon: "🗺️" },
  { id: "bossraid", label: "Boss", icon: "🐉" },
  { id: "analyzer", label: "Wallet", icon: "🔍" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const wallet = useWallet();
  const quests = useQuests(wallet);
  const containerRef = useRef(null);
  const [highlightStyle, setHighlightStyle] = useState({ left: 0, width: 0 });

  const walletWithProfile = { ...wallet, userProfile: quests.userProfile };

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard quests={quests} wallet={wallet} setActiveTab={setActiveTab} />;
      case "quests":
        return <QuestBoard quests={quests} wallet={wallet} />;
      case "bossraid":
        return <BossRaid wallet={wallet} />;
      case "analyzer":
        return <WalletAnalyzer wallet={wallet} />;
      default:
        return <Dashboard quests={quests} wallet={wallet} setActiveTab={setActiveTab} />;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const buttons = Array.from(container.children);
    const activeIndex = TABS.findIndex(tab => tab.id === activeTab);
    const rect = buttons[activeIndex].getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    setHighlightStyle({
      left: buttons[activeIndex].offsetLeft,
      width: buttons[activeIndex].offsetWidth,
    });
  }, [activeTab]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0b0f",
      color: "white",
      fontFamily: "'Inter', sans-serif",
    }}>
      <Navbar wallet={walletWithProfile} />

      {/* Page content */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 16px 80px" }}>
        {renderTab()}
      </div>

      {/* Floating bottom nav */}
      <div style={{
        position: "fixed",
        bottom: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(10,11,15,0.95)",
        backdropFilter: "blur(20px)",
        borderRadius: "25px",
        padding: "8px",
        boxShadow: "0 8px 15px rgba(0,0,0,0.3)",
        display: "flex",
        gap: "12px",
        zIndex: 100,
        maxWidth: "90%",
      }}
        ref={containerRef}
      >
        {/* Sliding highlight */}
        <div style={{
          position: "absolute",
          top: 0,
          left: highlightStyle.left,
          width: highlightStyle.width,
          height: "100%",
          background: "rgba(0,82,255,0.2)",
          borderRadius: "25px",
          backdropFilter: "blur(10px)",
          transition: "left 0.3s ease, width 0.3s ease",
          pointerEvents: "none",
          zIndex: 0,
        }} />

        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              color: activeTab === tab.id ? "#0052ff" : "#8892a4",
              fontWeight: 600,
              fontSize: "12px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
              padding: "8px 12px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <span style={{ fontSize: "20px" }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
