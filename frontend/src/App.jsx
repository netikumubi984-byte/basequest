import { useState } from "react";
import { useWallet } from "./hooks/useWallet";
import { useQuests } from "./hooks/useQuests";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import QuestBoard from "./components/QuestBoard";
import BossRaid from "./components/BossRaid";
import Leaderboard from "./components/Leaderboard";
import WalletAnalyzer from "./components/WalletAnalyzer";

const TABS = [
  { id: "dashboard",   label: "Dashboard",      icon: "🏠" },
  { id: "quests",      label: "Quests",         icon: "🗺️" },
  { id: "bossraid",    label: "Boss",           icon: "🐉" },
  { id: "leaderboard", label: "Leaderboard",    icon: "🏆" },
  { id: "analyzer",    label: "Wallet",         icon: "🔍" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const wallet = useWallet();
  const quests = useQuests(wallet);

  const walletWithProfile = { ...wallet, userProfile: quests.userProfile };

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":   return <Dashboard quests={quests} wallet={wallet} setActiveTab={setActiveTab} />;
      case "quests":      return <QuestBoard quests={quests} wallet={wallet} />;
      case "bossraid":    return <BossRaid wallet={wallet} />;
      case "leaderboard": return <Leaderboard wallet={wallet} />;
      case "analyzer":    return <WalletAnalyzer wallet={wallet} />;
      default:            return <Dashboard quests={quests} wallet={wallet} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0b0f",
      color: "white",
      fontFamily: "'Inter', sans-serif",
    }}>
      
      {/* Navbar */}
      <Navbar wallet={walletWithProfile} />

      {/* Page content */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 16px 80px" }}>
        {renderTab()}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "24px 16px 100px",
        textAlign: "center",
        marginTop: "40px",
      }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginBottom: "12px" }}>
          <a
            href="https://twitter.com/Jee_phoenix"
            target="_blank" rel="noreferrer"
            style={{ color: "#8892a4", fontSize: "13px", fontWeight: "600", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}
            onMouseEnter={e => e.currentTarget.style.color = "white"}
            onMouseLeave={e => e.currentTarget.style.color = "#8892a4"}
          >
            𝕏 Contact Us
          </a>
        </div>
        <div style={{ color: "#4a5568", fontSize: "12px", marginBottom: "4px" }}>
          © 2026 BaseQuest™ — All rights reserved.
        </div>
        <div style={{ color: "#4a5568", fontSize: "11px" }}>
          Built with 💙 on Base 🟦
        </div>
      </div>

      {/* Mobile floating bottom nav */}
      <div style={{
        display: "flex",
        position: "fixed",
        bottom: "12px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "480px",
        background: "rgba(10,11,15,0.95)",
        borderRadius: "24px",
        padding: "4px 8px",
        gap: "6px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
        zIndex: 100,
      }} className="mobile-nav">
        {TABS.map(tab => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px 0",
              borderRadius: "16px",
              background: activeTab === tab.id ? "linear-gradient(135deg, #0052ff, #0041cc)" : "transparent",
              color: activeTab === tab.id ? "white" : "#8892a4",
              fontWeight: activeTab === tab.id ? 700 : 400,
              fontSize: "12px",
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: "22px" }}>{tab.icon}</span>
            <span style={{ marginTop: "2px" }}>{tab.label}</span>
          </div>
        ))}
      </div>

      {/* Global styles */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0b0f; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background: rgba(0,82,255,0.3); border-radius: 3px; }
        input::placeholder { color: #4a5568; }
        a { color: inherit; }
        @media (min-width: 768px) { .mobile-nav { display: none !important; } }
        @media (max-width: 767px) { .mobile-nav { display: flex !important; } }
      `}</style>
    </div>
  );
}
