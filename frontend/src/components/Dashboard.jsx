import { getLevelInfo, shortAddr } from "../utils/contracts";

export default function Dashboard({ quests, wallet, setPage }) {

  const { address, isConnected } = wallet;
  const { userProfile, completedCount, totalDaily, loading } = quests;

  const levelInfo = userProfile ? getLevelInfo(userProfile.totalXP) : null;

  if (!isConnected) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "80px", marginBottom: "20px" }}>🟦</div>

        <h1 style={{ color: "white", fontSize: "28px", fontWeight: "900", margin: "0 0 12px" }}>
          Skill issue if you're not on chain yet.
        </h1>

        <p style={{ color: "#8892a4", fontSize: "16px", maxWidth: "400px", margin: "0 auto 8px" }}>
          Stack XP. Build legacy. Eat the airdrop.
        </p>
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
    <div style={{ padding: "24px 0" }}>

      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: "white", fontSize: "22px", fontWeight: "800", margin: "0 0 4px" }}>
          👋 Welcome back {userProfile?.usernameSet ? userProfile.username : shortAddr(address)}
        </h2>

        <p style={{ color: "#8892a4", fontSize: "14px", margin: 0 }}>
          BaseQuest overview
        </p>
      </div>

      {levelInfo && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(0,82,255,0.15), rgba(0,82,255,0.05))",
            border: "1px solid rgba(0,82,255,0.3)",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "16px"
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px"
            }}
          >

            <div>
              <div style={{ color: "#8892a4", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>
                CURRENT LEVEL
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "36px" }}>{levelInfo.current.emoji}</span>

                <div>
                  <div style={{ color: levelInfo.current.color, fontWeight: "900", fontSize: "22px" }}>
                    Level {levelInfo.current.level}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#f0b429", fontWeight: "900", fontSize: "32px" }}>
                {levelInfo.xp.toLocaleString()}
              </div>

              <div style={{ color: "#8892a4", fontSize: "13px" }}>
                Total XP
              </div>
            </div>
          </div>

        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))",
          gap: "12px",
          marginBottom: "16px"
        }}
      >

        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            padding: "16px",
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>✅</div>
          <div style={{ color: "#00c853", fontWeight: "800", fontSize: "20px" }}>
            {userProfile?.tasksCompleted?.toLocaleString() || "0"}
          </div>
          <div style={{ color: "#8892a4", fontSize: "11px" }}>
            Tasks Completed
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            padding: "16px",
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>🔥</div>
          <div style={{ color: "#f0b429", fontWeight: "800", fontSize: "20px" }}>
            {userProfile?.streakCount || "0"}
          </div>
          <div style={{ color: "#8892a4", fontSize: "11px" }}>
            Day Streak
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            padding: "16px",
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>🗺️</div>
          <div style={{ color: "#0052ff", fontWeight: "800", fontSize: "20px" }}>
            {completedCount}/{totalDaily}
          </div>
          <div style={{ color: "#8892a4", fontSize: "11px" }}>
            Daily Progress
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            padding: "16px",
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>📅</div>
          <div style={{ color: "#a855f7", fontWeight: "800", fontSize: "20px" }}>
            {userProfile?.joinedAt
              ? new Date(userProfile.joinedAt * 1000).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric"
                })
              : "—"}
          </div>
          <div style={{ color: "#8892a4", fontSize: "11px" }}>
            Member Since
          </div>
        </div>

      </div>

      <button
        onClick={() => setPage("leaderboard")}
        style={{
          width: "100%",
          background: "rgba(240,180,41,0.1)",
          border: "1px solid rgba(240,180,41,0.3)",
          borderRadius: "14px",
          padding: "16px",
          color: "#f0b429",
          fontWeight: "800",
          fontSize: "14px",
          cursor: "pointer"
        }}
      >
        🏆 Leaderboard
      </button>

    </div>
  );
}
