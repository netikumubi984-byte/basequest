import { useState } from "react";
import { TASKS } from "../utils/contracts";

export default function QuestBoard({ quests, wallet }) {
  const {
    dailyTasks, taskLoading, ethPrice,
    completeGM, completeDeploy, completeSwap,
    completeBridge, completeGame, completeReferral,
    completeProfile, completeMintNFT,
  } = quests;

  const { isConnected } = wallet;
  const [fields, setFields] = useState({});

  const isTaskDone = (id) => {
    if (!dailyTasks) return false;
    const map = {
      gm:       dailyTasks.gmDone,
      deploy:   dailyTasks.deployDone,
      swap:     dailyTasks.swapDone,
      bridge:   dailyTasks.bridgeDone,
      game:     dailyTasks.gameDone,
      mint:     dailyTasks.mintDone,
      referral: dailyTasks.referralDone,
      profile:  dailyTasks.profileDone,
    };
    return !!map[id];
  };

  const handleTask = async (taskId) => {
    const field = fields[taskId] || "";
    if (taskId === "gm")       return completeGM();
    if (taskId === "deploy")   return completeDeploy(field);
    if (taskId === "swap")     return completeSwap();
    if (taskId === "bridge")   return completeBridge();
    if (taskId === "game")     return completeGame();
    if (taskId === "mint")     return completeMintNFT(field);
    if (taskId === "referral") return completeReferral(field);
    if (taskId === "profile")  return completeProfile(field);
  };

  const visibleTasks = TASKS.filter(t => !t.auto);

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ color: "white", fontSize: "22px", fontWeight: "800", margin: "0 0 6px" }}>
          🗺️ Quest Board
        </h2>
        <p style={{ color: "#8892a4", fontSize: "14px", margin: 0 }}>
          Complete daily on-chain tasks to earn XP and climb the leaderboard.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
        {visibleTasks.map((task) => {
          const done    = isTaskDone(task.id);
          const loading = taskLoading?.[task.id];
          const usdCost = (parseFloat(task.ethCost || 0) * ethPrice).toFixed(2);

          return (
            <div key={task.id} style={{
              background:    done ? "rgba(0,200,83,0.06)" : "rgba(255,255,255,0.03)",
              border:        `1px solid ${done ? "rgba(0,200,83,0.3)" : "rgba(255,255,255,0.08)"}`,
              borderRadius:  "16px",
              padding:       "20px",
              display:       "flex",
              flexDirection: "column",
              gap:           "14px",
              transition:    "border 0.2s",
            }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "26px" }}>{task.icon}</span>
                  <div>
                    <div style={{ color: "white", fontWeight: "700", fontSize: "15px" }}>{task.name}</div>
                    <div style={{ color: "#8892a4", fontSize: "12px", marginTop: "2px" }}>{task.description}</div>
                  </div>
                </div>
                {done && (
                  <div style={{
                    background: "rgba(0,200,83,0.15)", border: "1px solid rgba(0,200,83,0.4)",
                    borderRadius: "20px", padding: "3px 10px", color: "#00c853",
                    fontSize: "11px", fontWeight: "700", whiteSpace: "nowrap"
                  }}>✓ Done</div>
                )}
              </div>

              {/* XP + cost badges */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{
                  background: "rgba(240,180,41,0.12)", border: "1px solid rgba(240,180,41,0.3)",
                  borderRadius: "20px", padding: "3px 10px", color: "#f0b429",
                  fontSize: "12px", fontWeight: "700"
                }}>+{task.xp} XP</span>

                {task.ethCost !== "0" && (
                  <span style={{
                    background: "rgba(0,82,255,0.12)", border: "1px solid rgba(0,82,255,0.3)",
                    borderRadius: "20px", padding: "3px 10px", color: "#6699ff",
                    fontSize: "12px", fontWeight: "600"
                  }}>{task.ethCost} ETH (~${usdCost})</span>
                )}

                {task.oneTime && (
                  <span style={{
                    background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.3)",
                    borderRadius: "20px", padding: "3px 10px", color: "#a855f7",
                    fontSize: "11px", fontWeight: "600"
                  }}>One-time</span>
                )}

                {task.daily && (
                  <span style={{
                    background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)",
                    borderRadius: "20px", padding: "3px 10px", color: "#00d4ff",
                    fontSize: "11px", fontWeight: "600"
                  }}>Daily</span>
                )}
              </div>

              {/* Special info for Mint NFT */}
              {task.id === "mint" && (
                <div style={{
                  background: "rgba(0,82,255,0.08)", border: "1px solid rgba(0,82,255,0.2)",
                  borderRadius: "10px", padding: "10px 12px", fontSize: "12px", color: "#8892a4", lineHeight: "1.5"
                }}>
                  💡 <strong style={{ color: "#6699ff" }}>How to mint:</strong> Go to any Base NFT marketplace
                  (e.g. <a href="https://zora.co" target="_blank" rel="noreferrer" style={{ color: "#00d4ff" }}>Zora</a>,{" "}
                  <a href="https://opensea.io/base" target="_blank" rel="noreferrer" style={{ color: "#00d4ff" }}>OpenSea</a>,{" "}
                  <a href="https://mint.fun" target="_blank" rel="noreferrer" style={{ color: "#00d4ff" }}>mint.fun</a>),
                  mint an NFT, then paste the NFT contract address below to record it on-chain.
                </div>
              )}

              {/* Input field */}
              {task.field && !done && (
                <input
                  type="text"
                  placeholder={task.fieldPlaceholder}
                  value={fields[task.id] || ""}
                  onChange={e => setFields(p => ({ ...p, [task.id]: e.target.value }))}
                  style={{
                    background:   "rgba(255,255,255,0.05)",
                    border:       "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    padding:      "10px 14px",
                    color:        "white",
                    fontSize:     "13px",
                    outline:      "none",
                    width:        "100%",
                    boxSizing:    "border-box",
                  }}
                />
              )}

              {/* Action button */}
              {!done && (
                <button
                  onClick={() => handleTask(task.id)}
                  disabled={loading || !isConnected}
                  style={{
                    background:    loading ? "rgba(0,82,255,0.3)" : "linear-gradient(135deg, #0052ff, #0066ff)",
                    border:        "none",
                    borderRadius:  "12px",
                    padding:       "12px",
                    color:         "white",
                    fontWeight:    "700",
                    fontSize:      "14px",
                    cursor:        loading || !isConnected ? "not-allowed" : "pointer",
                    opacity:       !isConnected ? 0.5 : 1,
                    transition:    "opacity 0.2s",
                    width:         "100%",
                  }}
                >
                  {loading ? "⏳ Processing..." : isConnected ? `${task.icon} ${task.name}` : "Connect Wallet"}
                </button>
              )}

              {done && (
                <div style={{
                  textAlign:    "center",
                  color:        "#00c853",
                  fontWeight:   "700",
                  fontSize:     "14px",
                  padding:      "10px",
                  background:   "rgba(0,200,83,0.08)",
                  borderRadius: "12px",
                }}>
                  ✅ Completed {task.daily ? "today!" : ""}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
                    }
