import { useState, useEffect } from "react";
import {
  TASKS, SWAP_PLATFORMS, BRIDGE_PLATFORMS, NFT_PLATFORMS,
  generateReferralCode, generateShareLink, parseReferralInput, getRefFromUrl,
} from "../utils/contracts";

export default function QuestBoard({ quests, wallet }) {
  const {
    dailyTasks, subTasks, taskLoading, ethPrice,
    completeGM, completeDeploy, completeSwap, completeBridge,
    completeGame, completeReferral, completeProfile, completeMintNFT,
    completeSwapAerodrome, completeSwapUniswap, completeSwapJumper, completeSwapRelay,
    completeBridgeJumper, completeBridgeRelay,
  } = quests;

  const { isConnected, address } = wallet;
  const [fields,    setFields]    = useState({});
  const [copied,    setCopied]    = useState("");
  const [refAlert,  setRefAlert]  = useState(null);
  const [expanded,  setExpanded]  = useState({});

  useEffect(() => {
    const ref = getRefFromUrl();
    if (ref) {
      setFields(p => ({ ...p, referred: ref }));
      setRefAlert(`🎉 You were referred by ${ref.slice(0, 6)}...${ref.slice(-4)}! Complete the referral task to register it on-chain.`);
    }
  }, []);

  const referralCode = address ? generateReferralCode(address) : null;
  const shareLink    = address ? generateShareLink(address)    : null;

  const copyToClipboard = async (text, key) => {
    try { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(""), 2000); } catch {}
  };

  const toggleExpand = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const isTaskDone = (id) => {
    if (!dailyTasks) return false;
    const map = {
      gm: dailyTasks.gmDone, deploy: dailyTasks.deployDone,
      swap: dailyTasks.swapDone, bridge: dailyTasks.bridgeDone,
      game: dailyTasks.gameDone, referral: dailyTasks.referralDone,
      profile: dailyTasks.profileDone, mint: dailyTasks.mintDone,
    };
    return !!map[id];
  };

  const isSubDone = (id) => {
    if (!subTasks) return false;
    const map = {
      swapAerodrome: subTasks.swapAerodromeDone,
      swapUniswap:   subTasks.swapUniswapDone,
      swapJumper:    subTasks.swapJumperDone,
      swapRelay:     subTasks.swapRelayDone,
      bridgeJumper:  subTasks.bridgeJumperDone,
      bridgeRelay:   subTasks.bridgeRelayDone,
    };
    return !!map[id];
  };

  const handleTask = async (taskId) => {
    const raw = fields[taskId] || "";
    if (taskId === "gm")             return completeGM();
    if (taskId === "deploy")         return completeDeploy(raw);
    if (taskId === "swap")           return completeSwap();
    if (taskId === "bridge")         return completeBridge();
    if (taskId === "game")           return completeGame();
    if (taskId === "mint")           return completeMintNFT(raw);
    if (taskId === "profile")        return completeProfile(raw);
    if (taskId === "swapAerodrome")  return completeSwapAerodrome();
    if (taskId === "swapUniswap")    return completeSwapUniswap();
    if (taskId === "swapJumper")     return completeSwapJumper();
    if (taskId === "swapRelay")      return completeSwapRelay();
    if (taskId === "bridgeJumper")   return completeBridgeJumper();
    if (taskId === "bridgeRelay")    return completeBridgeRelay();
    if (taskId === "referral") {
      const addr = parseReferralInput(raw);
      if (!addr) { alert("Please enter a valid wallet address or share link."); return; }
      return completeReferral(addr);
    }
  };

  const visibleTasks = TASKS.filter(t => !t.auto);

  // ── Styles ──────────────────────────────────────────────────────────────
  const cardStyle = (done) => ({
    background:    done ? "rgba(0,200,83,0.06)" : "rgba(255,255,255,0.03)",
    border:        `1px solid ${done ? "rgba(0,200,83,0.3)" : "rgba(255,255,255,0.08)"}`,
    borderRadius:  "16px",
    padding:       "20px",
    display:       "flex",
    flexDirection: "column",
    gap:           "14px",
  });

  const btnStyle = (disabled, color = "#0052ff") => ({
    background:   disabled ? "rgba(100,100,100,0.2)" : `linear-gradient(135deg, ${color}, ${color}cc)`,
    border:       "none",
    borderRadius: "10px",
    padding:      "10px 14px",
    color:        "white",
    fontWeight:   "700",
    fontSize:     "13px",
    cursor:       disabled ? "not-allowed" : "pointer",
    opacity:      disabled ? 0.5 : 1,
    width:        "100%",
    transition:   "opacity 0.2s",
  });

  const inputStyle = {
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px", padding: "10px 14px", color: "white",
    fontSize: "13px", outline: "none", width: "100%", boxSizing: "border-box",
  };

  const badge = (bg, border, color, text) => (
    <span style={{ background: bg, border: `1px solid ${border}`, borderRadius: "20px", padding: "3px 10px", color, fontSize: "11px", fontWeight: "700" }}>
      {text}
    </span>
  );

  // ── Sub-task section renderer ────────────────────────────────────────────
  const renderSwapSubs = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
      <div style={{ color: "#8892a4", fontSize: "12px", fontWeight: "700", letterSpacing: "1px" }}>
        🔀 SWAP SUB-TASKS — +50 XP EACH
      </div>
      {SWAP_PLATFORMS.map(p => {
        const done    = isSubDone(p.id);
        const loading = taskLoading?.[p.id];
        return (
          <div key={p.id} style={{
            background:   done ? "rgba(0,200,83,0.06)" : "rgba(255,255,255,0.03)",
            border:       `1px solid ${done ? "rgba(0,200,83,0.25)" : "rgba(255,255,255,0.06)"}`,
            borderRadius: "12px", padding: "14px", display: "flex",
            flexDirection: "column", gap: "10px",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "20px" }}>{p.icon}</span>
                <span style={{ color: "white", fontWeight: "700", fontSize: "14px" }}>{p.name}</span>
              </div>
              {done
                ? <span style={{ color: "#00c853", fontWeight: "700", fontSize: "12px" }}>✓ Done</span>
                : badge("rgba(240,180,41,0.12)", "rgba(240,180,41,0.3)", "#f0b429", "+50 XP")
              }
            </div>
            {!done && (
              <div style={{ display: "flex", gap: "8px" }}>
                <a href={p.url} target="_blank" rel="noreferrer" style={{
                  flex: 1, background: `${p.color}22`, border: `1px solid ${p.color}55`,
                  borderRadius: "8px", padding: "8px 12px", color: p.color,
                  fontWeight: "700", fontSize: "12px", textDecoration: "none",
                  textAlign: "center", display: "block",
                }}>
                  🔗 Go to {p.name.split(" on ")[1]}
                </a>
                <button
                  onClick={() => handleTask(p.id)}
                  disabled={loading || !isConnected}
                  style={{ ...btnStyle(loading || !isConnected, p.color), flex: 1, width: "auto" }}
                >
                  {loading ? "⏳..." : "✅ Mark Done"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderBridgeSubs = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
      <div style={{ color: "#8892a4", fontSize: "12px", fontWeight: "700", letterSpacing: "1px" }}>
        🌉 BRIDGE SUB-TASKS — +50 XP EACH
      </div>
      {BRIDGE_PLATFORMS.map(p => {
        const done    = isSubDone(p.id);
        const loading = taskLoading?.[p.id];
        return (
          <div key={p.id} style={{
            background:   done ? "rgba(0,200,83,0.06)" : "rgba(255,255,255,0.03)",
            border:       `1px solid ${done ? "rgba(0,200,83,0.25)" : "rgba(255,255,255,0.06)"}`,
            borderRadius: "12px", padding: "14px", display: "flex",
            flexDirection: "column", gap: "10px",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "20px" }}>{p.icon}</span>
                <span style={{ color: "white", fontWeight: "700", fontSize: "14px" }}>{p.name}</span>
              </div>
              {done
                ? <span style={{ color: "#00c853", fontWeight: "700", fontSize: "12px" }}>✓ Done</span>
                : badge("rgba(240,180,41,0.12)", "rgba(240,180,41,0.3)", "#f0b429", "+50 XP")
              }
            </div>
            {!done && (
              <div style={{ display: "flex", gap: "8px" }}>
                <a href={p.url} target="_blank" rel="noreferrer" style={{
                  flex: 1, background: `${p.color}22`, border: `1px solid ${p.color}55`,
                  borderRadius: "8px", padding: "8px 12px", color: p.color,
                  fontWeight: "700", fontSize: "12px", textDecoration: "none",
                  textAlign: "center", display: "block",
                }}>
                  🔗 Go to {p.name.split(" via ")[1]}
                </a>
                <button
                  onClick={() => handleTask(p.id)}
                  disabled={loading || !isConnected}
                  style={{ ...btnStyle(loading || !isConnected, p.color), flex: 1, width: "auto" }}
                >
                  {loading ? "⏳..." : "✅ Mark Done"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderNFTSubs = (nftField, done) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
      <div style={{ color: "#8892a4", fontSize: "12px", fontWeight: "700", letterSpacing: "1px" }}>
        🎨 POPULAR BASE NFT PLATFORMS
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {NFT_PLATFORMS.map(p => (
          <a key={p.id} href={p.url} target="_blank" rel="noreferrer" style={{
            background:     `${p.color}18`,
            border:         `1px solid ${p.color}44`,
            borderRadius:   "10px",
            padding:        "10px 12px",
            color:          p.color,
            fontWeight:     "700",
            fontSize:       "12px",
            textDecoration: "none",
            display:        "flex",
            alignItems:     "center",
            gap:            "6px",
          }}>
            <span style={{ fontSize: "16px" }}>{p.icon}</span>
            {p.name.replace("Mint on ", "").replace("Mint on ", "")}
          </a>
        ))}
      </div>
      {!done && (
        <>
          <div style={{ color: "#8892a4", fontSize: "12px", marginTop: "4px" }}>
            💡 After minting, paste the NFT contract address below to earn <strong style={{ color: "#f0b429" }}>+125 XP</strong>
          </div>
          <input
            type="text"
            placeholder="NFT Contract Address (0x...)"
            value={nftField || ""}
            onChange={e => setFields(p => ({ ...p, nftContract: e.target.value }))}
            style={inputStyle}
          />
        </>
      )}
    </div>
  );

  // ── Main render ──────────────────────────────────────────────────────────
  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ color: "white", fontSize: "22px", fontWeight: "800", margin: "0 0 6px" }}>🗺️ Quest Board</h2>
        <p style={{ color: "#8892a4", fontSize: "14px", margin: 0 }}>Complete daily on-chain tasks to earn XP and climb the leaderboard.</p>
      </div>

      {/* Ref alert */}
      {refAlert && (
        <div style={{ background: "rgba(240,180,41,0.1)", border: "1px solid rgba(240,180,41,0.3)", borderRadius: "12px", padding: "14px 18px", marginBottom: "24px", color: "#f0b429", fontSize: "13px", fontWeight: "600" }}>
          {refAlert}
        </div>
      )}

      {/* Referral card */}
      {isConnected && address && (
        <div style={{ background: "rgba(0,82,255,0.06)", border: "1px solid rgba(0,82,255,0.25)", borderRadius: "16px", padding: "20px", marginBottom: "28px" }}>
          <div style={{ color: "white", fontWeight: "800", fontSize: "16px", marginBottom: "4px" }}>👥 Your Referral Code</div>
          <div style={{ color: "#8892a4", fontSize: "13px", marginBottom: "16px" }}>
            Share your code or link. You earn <strong style={{ color: "#f0b429" }}>+150 XP</strong>, your friend gets <strong style={{ color: "#00c853" }}>+10 XP</strong>!
          </div>
          {/* Code */}
          <div style={{ marginBottom: "12px" }}>
            <div style={{ color: "#8892a4", fontSize: "11px", fontWeight: "700", marginBottom: "6px", letterSpacing: "1px" }}>REFERRAL CODE</div>
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(0,82,255,0.3)", borderRadius: "10px", padding: "10px 16px", color: "#00d4ff", fontWeight: "800", fontSize: "18px", letterSpacing: "2px", textAlign: "center" }}>
                {referralCode}
              </div>
              <button onClick={() => copyToClipboard(referralCode, "code")} style={{ background: copied === "code" ? "rgba(0,200,83,0.2)" : "rgba(0,82,255,0.2)", border: `1px solid ${copied === "code" ? "rgba(0,200,83,0.4)" : "rgba(0,82,255,0.4)"}`, borderRadius: "10px", padding: "10px 16px", color: copied === "code" ? "#00c853" : "#6699ff", fontWeight: "700", fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap" }}>
                {copied === "code" ? "✓ Copied!" : "📋 Copy"}
              </button>
            </div>
          </div>
          {/* Link */}
          <div>
            <div style={{ color: "#8892a4", fontSize: "11px", fontWeight: "700", marginBottom: "6px", letterSpacing: "1px" }}>SHARE LINK</div>
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 14px", color: "#8892a4", fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {shareLink}
              </div>
              <button onClick={() => copyToClipboard(shareLink, "link")} style={{ background: copied === "link" ? "rgba(0,200,83,0.2)" : "rgba(0,82,255,0.2)", border: `1px solid ${copied === "link" ? "rgba(0,200,83,0.4)" : "rgba(0,82,255,0.4)"}`, borderRadius: "10px", padding: "10px 16px", color: copied === "link" ? "#00c853" : "#6699ff", fontWeight: "700", fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap" }}>
                {copied === "link" ? "✓ Copied!" : "🔗 Copy Link"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {visibleTasks.map((task) => {
          const done    = isTaskDone(task.id);
          const loading = taskLoading?.[task.id];
          const usdCost = (parseFloat(task.ethCost || 0) * ethPrice).toFixed(2);
          const isOpen  = expanded[task.id];

          return (
            <div key={task.id} style={cardStyle(done)}>

              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "26px" }}>{task.icon}</span>
                  <div>
                    <div style={{ color: "white", fontWeight: "700", fontSize: "15px" }}>{task.name}</div>
                    <div style={{ color: "#8892a4", fontSize: "12px", marginTop: "2px" }}>{task.description}</div>
                  </div>
                </div>
                {done && <div style={{ background: "rgba(0,200,83,0.15)", border: "1px solid rgba(0,200,83,0.4)", borderRadius: "20px", padding: "3px 10px", color: "#00c853", fontSize: "11px", fontWeight: "700", whiteSpace: "nowrap" }}>✓ Done</div>}
              </div>

              {/* Badges */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {badge("rgba(240,180,41,0.12)", "rgba(240,180,41,0.3)", "#f0b429", `+${task.xp} XP`)}
                {task.ethCost !== "0" && badge("rgba(0,82,255,0.12)", "rgba(0,82,255,0.3)", "#6699ff", `${task.ethCost} ETH (~$${usdCost})`)}
                {task.oneTime && badge("rgba(168,85,247,0.12)", "rgba(168,85,247,0.3)", "#a855f7", "One-time")}
                {task.daily   && badge("rgba(0,212,255,0.08)",  "rgba(0,212,255,0.2)",  "#00d4ff", "Daily")}
                {task.id === "referral" && badge("rgba(0,200,83,0.1)", "rgba(0,200,83,0.3)", "#00c853", "Friend gets +10 XP")}
                {task.hasSubs && badge("rgba(240,180,41,0.08)", "rgba(240,180,41,0.2)", "#f0b429", "+50 XP per sub-task")}
              </div>

              {/* Referral hint */}
              {task.id === "referral" && !done && (
                <div style={{ background: "rgba(0,82,255,0.08)", border: "1px solid rgba(0,82,255,0.2)", borderRadius: "10px", padding: "10px 12px", fontSize: "12px", color: "#8892a4", lineHeight: "1.6" }}>
                  💡 Paste your <strong style={{ color: "#6699ff" }}>friend's wallet address</strong> or their <strong style={{ color: "#6699ff" }}>share link</strong> below.
                </div>
              )}

              {/* Input field (non-NFT) */}
              {task.field && task.id !== "mint" && !done && (
                <input
                  type="text"
                  placeholder={task.fieldPlaceholder}
                  value={fields[task.id] || ""}
                  onChange={e => setFields(p => ({ ...p, [task.id]: e.target.value }))}
                  style={inputStyle}
                />
              )}

              {/* Main action button */}
              {!done ? (
                <button
                  onClick={() => handleTask(task.id)}
                  disabled={loading || !isConnected}
                  style={btnStyle(loading || !isConnected)}
                >
                  {loading ? "⏳ Processing..." : isConnected ? `${task.icon} ${task.name}` : "Connect Wallet"}
                </button>
              ) : (
                <div style={{ textAlign: "center", color: "#00c853", fontWeight: "700", fontSize: "14px", padding: "10px", background: "rgba(0,200,83,0.08)", borderRadius: "12px" }}>
                  ✅ Completed {task.daily ? "today!" : ""}
                </div>
              )}

              {/* Sub-tasks toggle */}
              {task.hasSubs && (
                <>
                  <button
                    onClick={() => toggleExpand(task.id)}
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "8px", color: "#8892a4", fontWeight: "700", fontSize: "12px", cursor: "pointer", width: "100%" }}
                  >
                    {isOpen ? "▲ Hide Sub-Tasks" : `▼ Show Sub-Tasks (+50 XP each)`}
                  </button>

                  {isOpen && (
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "14px" }}>
                      {task.id === "swap"   && renderSwapSubs()}
                      {task.id === "bridge" && renderBridgeSubs()}
                      {task.id === "mint"   && renderNFTSubs(fields["nftContract"], done)}
                    </div>
                  )}
                </>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
            }
