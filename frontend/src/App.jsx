import { useState, useEffect } from "react";
import { useWallet } from "./hooks/useWallet";
import { useQuests } from "./hooks/useQuests";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import QuestBoard from "./components/QuestBoard";
import BossRaid from "./components/BossRaid";
import Leaderboard from "./components/Leaderboard";
import WalletAnalyzer from "./components/WalletAnalyzer";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "/dashboard.svg" },
  { id: "quests",    label: "Quests",    icon: "/quests.svg"    },
  { id: "bossraid",  label: "Boss",      icon: "/boss.svg"      },
  { id: "analyzer",  label: "Wallet",    icon: "/wallet.svg"    }
];

const ICON_BLUE = "#0082FF";

export default function App() {
  const [page, setPage]                     = useState("dashboard");
  const [activeTab, setActiveTab]           = useState("dashboard");
  const [highlightPosition, setHighlightPosition] = useState(0);
  const [isMobile, setIsMobile]             = useState(false);
  const [isTablet, setIsTablet]             = useState(false);

  const wallet = useWallet();
  const quests = useQuests(wallet);
  const walletWithProfile = { ...wallet, userProfile: quests.userProfile };

  /* ── Responsive breakpoints ── */
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setIsMobile(w < 640);
      setIsTablet(w >= 640 && w < 1024);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const pageIndex = { dashboard: 0, quests: 1, bossraid: 2, analyzer: 3 };
  const isLeaderboard = page === "leaderboard";

  /* ── Responsive values ── */
  const contentMaxWidth  = "1100px";
  const contentPadding   = isMobile ? "0 12px" : isTablet ? "0 24px" : "0 32px";
  const navMaxWidth      = isMobile ? "96%" : isTablet ? "520px" : "580px";
  const navBottom        = isMobile ? "12px" : "20px";
  const tabIconSize      = isMobile ? "20px" : "24px";
  const tabFontSize      = isMobile ? "9px"  : "11px";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0b0f",
        color: "white",
        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden",
        /* Prevent content from hiding under fixed nav on all screen sizes */
        boxSizing: "border-box"
      }}
    >
      <Navbar wallet={walletWithProfile} />

      {/* ── Slider viewport ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "100vw",
          overflowX: "hidden",
          paddingBottom: "40px"
        }}
      >
        {/* ── Sliding pages ── */}
        {!isLeaderboard && (
          <div
            style={{
              display: "flex",
              width: "400vw",
              transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: `translateX(-${pageIndex[page] * 25}%)`
            }}
          >
            {[
              <Dashboard  quests={quests} wallet={wallet} setPage={setPage} />,
              <QuestBoard quests={quests} wallet={wallet} />,
              <BossRaid   wallet={wallet} />,
              <WalletAnalyzer wallet={wallet} />
            ].map((Component, i) => (
              <div
                key={i}
                style={{
                  width: "100vw",
                  flexShrink: 0,
                  boxSizing: "border-box",
                  /* Each page centers its content */
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                <div
                  style={{
                    width: "100%",
                    maxWidth: contentMaxWidth,
                    padding: contentPadding,
                    boxSizing: "border-box"
                  }}
                >
                  {Component}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Leaderboard overlay ── */}
        {isLeaderboard && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              boxSizing: "border-box"
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: contentMaxWidth,
                padding: contentPadding,
                boxSizing: "border-box"
              }}
            >
              <Leaderboard wallet={wallet} />
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: isMobile ? "20px 16px 110px" : "24px 32px 100px",
            textAlign: "center",
            margin: "40px auto 0",
            maxWidth: contentMaxWidth,
            boxSizing: "border-box"
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginBottom: "12px" }}>
            <a
              href="https://twitter.com/Jee_phoenix"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#8892a4",
                fontSize: isMobile ? "12px" : "13px",
                fontWeight: "600",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
              onMouseEnter={e => e.currentTarget.style.color = "white"}
              onMouseLeave={e => e.currentTarget.style.color = "#8892a4"}
            >
              𝕏 Contact Us
            </a>
          </div>
          <div style={{ color: "#4a5568", fontSize: isMobile ? "11px" : "12px", marginBottom: "4px" }}>
            © 2026 BaseQuest™ — All rights reserved.
          </div>
          <div style={{ color: "#4a5568", fontSize: isMobile ? "10px" : "11px" }}>
            Built with 💙 on Base 🟦
          </div>
        </div>

      </div>{/* end slider viewport */}

      {/* ── Mobile / Tablet / Desktop Nav ── */}
      <div
        className="mobile-nav"
        style={{
          position: "fixed",
          bottom: navBottom,
          left: "50%",
          transform: "translateX(-50%)",
          width: navMaxWidth,
          display: "flex",
          justifyContent: "space-between",
          background: "rgba(10,11,15,0.55)",
          borderRadius: "9999px",
          padding: isMobile ? "2px 0" : "4px 0",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          zIndex: 100
        }}
      >
        {/* Sliding highlight pill */}
        <div
          style={{
            position: "absolute",
            top: "2%",
            left: `${highlightPosition}%`,
            width: `${100 / TABS.length}%`,
            height: "96%",
            borderRadius: "9999px",
            background: "rgba(0,82,255,0.28)",
            transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: -1
          }}
        />

        {TABS.map((tab, index) => (
          <div
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setPage(tab.id);
              setHighlightPosition(index * (100 / TABS.length));
            }}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: isMobile ? "6px 0" : "8px 0",
              /* Larger tap target on touch devices */
              minHeight: isMobile ? "52px" : "48px",
              userSelect: "none",
              WebkitTapHighlightColor: "transparent"
            }}
          >
            <img
              src={tab.icon}
              alt={tab.label}
              style={{
                width: tabIconSize,
                height: tabIconSize,
                marginBottom: "3px",
                filter:
                  activeTab === tab.id
                    ? "invert(37%) sepia(98%) saturate(4869%) hue-rotate(199deg) brightness(101%) contrast(101%)"
                    : "invert(70%)"
              }}
            />
            <span
              style={{
                fontSize: tabFontSize,
                fontWeight: 700,
                color: activeTab === tab.id ? ICON_BLUE : "#8892a4",
                letterSpacing: "0.02em"
              }}
            >
              {tab.label}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
