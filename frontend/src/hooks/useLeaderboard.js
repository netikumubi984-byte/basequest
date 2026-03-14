import { useState, useEffect, useCallback } from "react";
import { getCoreContract, getReadProvider, getLevelInfo, shortAddr } from "../utils/contracts.js";

export function useLeaderboard(currentAddress, refreshInterval = 60000) {
  const [entries,     setEntries]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [totalUsers,  setTotalUsers]  = useState(0);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const provider = getReadProvider();
      const core     = getCoreContract(provider);

      const totalRaw = await core.getTotalUsers();
      const total    = Number(totalRaw);
      setTotalUsers(total);

      if (total === 0) { setEntries([]); setLoading(false); return; }

      const count  = Math.min(total, 50);
      const topRaw = await core.getTopUsers(count);

      const addrs = Array.from(topRaw[0] || []);
      const xps   = Array.from(topRaw[1] || []);

      if (!addrs || addrs.length === 0) { setEntries([]); setLoading(false); return; }

      const profiles = await Promise.allSettled(addrs.map(addr => core.getUserProfile(addr)));

      const enriched = addrs.map((addr, i) => {
        const xp  = Number(xps[i]);
        const lvl = getLevelInfo(xp);
        let tasksCompleted = 0, streakCount = 0, username = "";
        const result = profiles[i];
        if (result.status === "fulfilled") {
          tasksCompleted = Number(result.value.tasksCompleted);
          streakCount    = Number(result.value.streakCount);
          username       = result.value.username || "";
        }
        return {
          rank:          i + 1,
          address:       addr,
          display:       username || shortAddr(addr),
          xp,
          level:         lvl.current,
          tasksCompleted,
          streakCount,
          isCurrentUser: addr.toLowerCase() === currentAddress?.toLowerCase(),
        };
      });

      setEntries(enriched);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
      setError(err.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  }, [currentAddress]);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchLeaderboard, refreshInterval]);

  const myRank = currentAddress ? (entries.find(e => e.isCurrentUser)?.rank ?? null) : null;
  return { entries, loading, error, lastUpdated, totalUsers, myRank, refresh: fetchLeaderboard };
}
