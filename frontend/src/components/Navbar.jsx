import { useState } from "react";
import { shortAddr, getLevelInfo } from "../utils/contracts";

export default function Navbar({ wallet }) {
  const { address, isConnected, isConnecting, isCorrectNetwork,
          connect, disconnect, switchNetwork, userProfile } = wallet;

  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [showUserMenu,   setShowUserMenu]   = useState(false);

  const levelInfo = userProfile ? getLevelInfo(userProfile.totalXP) : null;

  const WALLETS = [
    { id: "metamask", label: "MetaMask",        icon: "🦊" },
    { id: "coinbase", label: "Coinbase Wallet",  icon: "🔵" },
    { id: "injected", label: "Rabby / Other",    icon: "🔑" },
  ];

  return (
    <nav style={{
      position:       "sticky",
      top:            0,
      zIndex:         100,
      borderBottom:   "1px solid rgba(255,255,255,0.06)",
      background:     "rgba(10,11,15,0.95)",
      backdropFilter: "blur(20px)",
      height:         "64px",
      display:        "flex",
      alignItems:     "center",
    }}>
      <div style={{
        maxWidth:       "1100px",
        margin:         "0 auto",
        padding:        "0 16px",
        width:          "100%",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        gap:            "16px",
      }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width:          "34px",
            height:         "34px",
            borderRadius:   "10px",
            background:     "rgba(0,82,255,0.15)",
            border:         "1px solid rgba(0,82,255,0.3)",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            fontSize:       "18px",
            overflow:       "hidden",
          }}>
            <img src="/logo.svg" alt="BQ" style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={e => { e.target.style.display = "none"; e.target.parentNode.innerHTML = '<span style="color:#00d4ff;font-weight:900;font-size:12px">BQ</span>'; }} />
          </div>
          <span style={{ color: "white", fontWeight: "900", fontSize: "18px", letterSpacing: "-0.5px" }}>
            Base<span style={{ color: "#00d4ff" }}>Quest</span>
          </span>
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

          {/* XP badge — shown when connected */}
          {isConnected && levelInfo && (
            <div style={{
              display:      "flex",
              alignItems:   "center",
              gap:          "8px",
              padding:      "6px 12px",
              background:   "rgba(255,255,255,0.04)",
              border:       "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
            }}>
              <span style={{ fontSize: "18px" }}>{levelInfo.current.emoji}</span>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ color: "#00d4ff", fontWeight: "800", fontSize: "12px" }}>
                  {userProfile.totalXP.toLocaleString()} XP
                </div>
                <div style={{ color: "#8892a4", fontSize: "10px" }}>
                  Lvl {levelInfo.current.level} · {levelInfo.current.name}
                </div>
              </div>
            </div>
          )}

          {/* Wrong network warning */}
          {isConnected && !isCorrectNetwork && (
            <button
              onClick={switchNetwork}
              style={{
                background:   "rgba(255,59,59,0.15)",
                border:       "1px solid rgba(255,59,59,0.4)",
                borderRadius: "8px",
                padding:      "6px 12px",
                color:        "#ff6b6b",
                fontWeight:   "700",
                fontSize:     "12px",
                cursor:       "pointer",
              }}
            >
              ⚠ Wrong Network
            </button>
          )}

          {/* Connect / Wallet menu */}
          {!isConnected ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowWalletMenu(v => !v)}
                disabled={isConnecting}
                style={{
                  background:   isConnecting ? "rgba(0,82,255,0.4)" : "linear-gradient(135deg, #0052ff, #0041cc)",
                  border:       "none",
                  borderRadius: "10px",
                  padding:      "9px 18px",
                  color:        "white",
                  fontWeight:   "700",
                  fontSize:     "13px",
                  cursor:       isConnecting ? "not-allowed" : "pointer",
                  boxShadow:    "0 4px 16px rgba(0,82,255,0.3)",
                }}
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>

              {showWalletMenu && (
                <div style={{
                  position:     "absolute",
                  right:        0,
                  top:          "calc(100% + 8px)",
                  width:        "200px",
                  background:   "#12141a",
                  border:       "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "14px",
                  padding:      "8px",
                  zIndex:       200,
                  boxShadow:    "0 8px 32px rgba(0,0,0,0.4)",
                }}>
                  {WALLETS.map(w => (
                    <button
                      key={w.id}
                      onClick={() => { connect(w.id); setShowWalletMenu(false); }}
                      style={{
                        width:        "100%",
                        display:      "flex",
                        alignItems:   "center",
                        gap:          "10px",
                        padding:      "10px 12px",
                        background:   "none",
                        border:       "none",
                        borderRadius: "8px",
                        color:        "white",
                        fontSize:     "13px",
                        fontWeight:   "600",
                        cursor:       "pointer",
                        textAlign:    "left",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}
                    >
                      <span style={{ fontSize: "20px" }}>{w.icon}</span>
                      {w.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

          ) : (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowUserMenu(v => !v)}
                style={{
                  display:      "flex",
                  alignItems:   "center",
                  gap:          "8px",
                  padding:      "8px 14px",
                  background:   "rgba(255,255,255,0.04)",
                  border:       "1px solid rgba(0,82,255,0.3)",
                  borderRadius: "10px",
                  color:        "white",
                  fontWeight:   "600",
                  fontSize:     "13px",
                  cursor:       "pointer",
                }}
              >
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00c853" }} />
                {userProfile?.usernameSet ? userProfile.username : shortAddr(address)}
              </button>

              {showUserMenu && (
                <div style={{
                  position:     "absolute",
                  right:        0,
                  top:          "calc(100% + 8px)",
                  width:        "200px",
                  background:   "#12141a",
                  border:       "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "14px",
                  padding:      "8px",
                  zIndex:       200,
                  boxShadow:    "0 8px 32px rgba(0,0,0,0.4)",
                }}>
                  <div style={{ padding: "8px 12px 10px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "6px" }}>
                    <div style={{ color: "#8892a4", fontSize: "11px", marginBottom: "2px" }}>Connected</div>
                    <div style={{ color: "white", fontSize: "13px", fontWeight: "600" }}>{shortAddr(address)}</div>
                  </div>
                  <a
                    href={`https://basescan.org/address/${address}`}
                    target="_blank" rel="noreferrer"
                    onClick={() => setShowUserMenu(false)}
                    style={{
                      display:      "flex",
                      alignItems:   "center",
                      gap:          "8px",
                      padding:      "9px 12px",
                      borderRadius: "8px",
                      color:        "#8892a4",
                      fontSize:     "13px",
                      textDecoration: "none",
                      cursor:       "pointer",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >
                    🔍 View on Basescan
                  </a>
                  <button
                    onClick={() => { disconnect(); setShowUserMenu(false); }}
                    style={{
                      width:        "100%",
                      display:      "flex",
                      alignItems:   "center",
                      gap:          "8px",
                      padding:      "9px 12px",
                      background:   "none",
                      border:       "none",
                      borderRadius: "8px",
                      color:        "#ff6b6b",
                      fontSize:     "13px",
                      fontWeight:   "600",
                      cursor:       "pointer",
                      textAlign:    "left",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,59,59,0.08)"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >
                    🚪 Disconnect
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Close menus on outside click */}
      {(showWalletMenu || showUserMenu) && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 99 }}
          onClick={() => { setShowWalletMenu(false); setShowUserMenu(false); }}
        />
      )}
    </nav>
  );
                  }
