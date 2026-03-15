import { getLevelInfo, shortAddr } from "../utils/contracts";

const glassBase = {
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(24px) saturate(180%)",
  WebkitBackdropFilter: "blur(24px) saturate(180%)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "24px",
};

const glassBlue = {
  background: "linear-gradient(135deg, rgba(0,82,255,0.18) 0%, rgba(0,180,255,0.10) 100%)",
  backdropFilter: "blur(32px) saturate(200%)",
  WebkitBackdropFilter: "blur(32px) saturate(200%)",
  border: "1px solid rgba(0,140,255,0.28)",
  borderRadius: "28px",
};

const glassGold = {
  background: "linear-gradient(135deg, rgba(240,180,41,0.16) 0%, rgba(255,140,0,0.08) 100%)",
  backdropFilter: "blur(24px) saturate(180%)",
  WebkitBackdropFilter: "blur(24px) saturate(180%)",
  border: "1px solid rgba(240,180,41,0.30)",
  borderRadius: "20px",
};

const statCard = {
  ...glassBase,
  padding: "18px 14px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "6px",
  transition: "transform 0.18s ease, box-shadow 0.18s ease",
};

export default function Dashboard({ quests, wallet, setPage }) {
  const { address, isConnected } = wallet;
  const { userProfile, completedCount, totalDaily, loading } = quests;
  const levelInfo = userProfile ? getLevelInfo(userProfile.totalXP) : null;

  if (!isConnected) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <div
          style={{
            ...glassBlue,
            padding: "48px 32px",
            display: "inline-block",
            maxWidth: "380px",
            width: "100%",
          }}
        >
          <div style={{ fontSize: "72px", marginBottom: "20px", lineHeight: 1 }}>🟦</div>
          <h1
            style={{
              color: "white",
              fontSize: "24px",
              fontWeight: "900",
              margin: "0 0 12px",
              letterSpacing: "-0.5px",
            }}
          >
            Skill issue if you're not on chain yet.
          </h1>
          <p style={{ color: "#8892a4", fontSize: "15px", margin: 0, lineHeight: 1.6 }}>
            Stack XP. Build legacy. Eat the airdrop.
          </p>
        </div>
      </div>
    );
  }

  if (loading && !userProfile) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>⏳</div>
        <div style={{ color: "#8892a4" }}>Loading your profile...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 0 8px" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: "20px" }}>
        <h2
          style={{
            color: "white",
            fontSize: "22px",
            fontWeight: "900",
            margin: "0 0 4px",
            letterSpacing: "-0.4px",
          }}
        >
          👋 Welcome back,{" "}
          <span style={{ color: "#4da6ff" }}>
            {userProfile?.usernameSet ? userProfile.username : shortAddr(address)}
          </span>
        </h2>
        <p style={{ color: "#5a6478", fontSize: "13px", margin: 0, fontWeight: 600, letterSpacing: "0.04em" }}>
          BASEQUEST OVERVIEW
        </p>
      </div>

      {/* ── Level + XP Hero Card ── */}
      {levelInfo && (
        <div style={{ ...glassBlue, padding: "22px 20px", marginBottom: "14px" }}>

          {/* Top row: level badge + XP total */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            {/* Level badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "18px",
                  background: `${levelInfo.current.color}22`,
                  border: `2px solid ${levelInfo.current.color}55`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  flexShrink: 0,
                }}
              >
                {levelInfo.current.emoji}
              </div>
              <div>
                <div
                  style={{
                    color: "#7a8799",
                    fontSize: "10px",
                    fontWeight: "800",
                    letterSpacing: "0.1em",
                    marginBottom: "3px",
                  }}
                >
                  CURRENT LEVEL
                </div>
                <div
                  style={{
                    color: levelInfo.current.color,
                    fontWeight: "900",
                    fontSize: "24px",
                    lineHeight: 1,
                    textShadow: `0 0 20px ${levelInfo.current.color}66`,
                  }}
                >
                  Level {levelInfo.current.level}
                </div>
                <div
                  style={{
                    color: levelInfo.current.color,
                    fontSize: "12px",
                    fontWeight: "700",
                    opacity: 0.75,
                    marginTop: "2px",
                  }}
                >
                  {levelInfo.current.name}
                </div>
              </div>
            </div>

            {/* XP pill */}
            <div
              style={{
                background: "rgba(240,180,41,0.12)",
                border: "1px solid rgba(240,180,41,0.30)",
                borderRadius: "14px",
                padding: "10px 16px",
                textAlign: "right",
              }}
            >
              <div
                style={{
                  color: "#f0b429",
                  fontWeight: "900",
                  fontSize: "28px",
                  lineHeight: 1,
                  textShadow: "0 0 16px rgba(240,180,41,0.45)",
                }}
              >
                {levelInfo.xp.toLocaleString()}
              </div>
              <div style={{ color: "#9a7a30", fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em" }}>
                TOTAL XP
              </div>
            </div>
          </div>

          {/* XP Progress bar */}
          {levelInfo.next && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "7px",
                }}
              >
                <span style={{ color: "#5a6478", fontSize: "11px", fontWeight: "700" }}>
                  {levelInfo.xpIntoLevel?.toLocaleString() ?? 0} XP earned
                </span>
                <span style={{ color: "#5a6478", fontSize: "11px", fontWeight: "700" }}>
                  {levelInfo.xpForNext?.toLocaleString() ?? "?"} to Level {levelInfo.next.level}
                </span>
              </div>
              <div
                style={{
                  height: "8px",
                  background: "rgba(255,255,255,0.07)",
                  borderRadius: "99px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, levelInfo.progress ?? 0)}%`,
                    background: `linear-gradient(90deg, ${levelInfo.current.color}, #4da6ff)`,
                    borderRadius: "99px",
                    boxShadow: `0 0 12px ${levelInfo.current.color}88`,
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Stat Cards 2×2 ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          marginBottom: "14px",
        }}
      >
        {/* Tasks Completed */}
        <div style={statCard}>
          <div style={{ fontSize: "26px", lineHeight: 1 }}>✅</div>
          <div style={{ color: "#00e676", fontWeight: "900", fontSize: "22px", lineHeight: 1 }}>
            {userProfile?.tasksCompleted?.toLocaleString() || "0"}
          </div>
          <div style={{ color: "#4a5568", fontSize: "10px", fontWeight: "800", letterSpacing: "0.08em" }}>
            TASKS DONE
          </div>
        </div>

        {/* Streak */}
        <div style={statCard}>
          <div style={{ fontSize: "26px", lineHeight: 1 }}>🔥</div>
          <div style={{ color: "#f0b429", fontWeight: "900", fontSize: "22px", lineHeight: 1 }}>
            {userProfile?.streakCount || "0"}
          </div>
          <div style={{ color: "#4a5568", fontSize: "10px", fontWeight: "800", letterSpacing: "0.08em" }}>
            DAY STREAK
          </div>
        </div>

        {/* Daily Progress */}
        <div style={statCard}>
          <div style={{ fontSize: "26px", lineHeight: 1 }}>🗺️</div>
          <div style={{ color: "#4da6ff", fontWeight: "900", fontSize: "22px", lineHeight: 1 }}>
            {completedCount}
            <span style={{ color: "#3a4a5e", fontSize: "16px" }}>/{totalDaily}</span>
          </div>
          <div style={{ color: "#4a5568", fontSize: "10px", fontWeight: "800", letterSpacing: "0.08em" }}>
            DAILY QUESTS
          </div>
        </div>

        {/* Member Since */}
        <div style={statCard}>
          <div style={{ fontSize: "26px", lineHeight: 1 }}>📅</div>
          <div style={{ color: "#c084fc", fontWeight: "900", fontSize: "17px", lineHeight: 1 }}>
            {userProfile?.joinedAt
              ? new Date(userProfile.joinedAt * 1000).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </div>
          <div style={{ color: "#4a5568", fontSize: "10px", fontWeight: "800", letterSpacing: "0.08em" }}>
            MEMBER SINCE
          </div>
        </div>
      </div>

      {/* ── Leaderboard Button ── */}
      <button
        onClick={() => setPage("leaderboard")}
        style={{
          width: "100%",
          ...glassGold,
          padding: "17px 20px",
          color: "#f0b429",
          fontWeight: "900",
          fontSize: "15px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          letterSpacing: "0.02em",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          boxShadow: "0 4px 24px rgba(240,180,41,0.10)",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(240,180,41,0.22)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 24px rgba(240,180,41,0.10)";
        }}
      >
        <span style={{ fontSize: "20px" }}>🏆</span>
        View Leaderboard
        <span style={{ marginLeft: "auto", opacity: 0.5, fontSize: "18px" }}>›</span>
      </button>

    </div>
  );
          }
