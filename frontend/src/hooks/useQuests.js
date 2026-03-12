import { useState, useCallback, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { getCoreContract, getLevelInfo, getEthPrice, ADDRESSES } from "../utils/contracts";

const toast = {
  success: (msg) => console.log("✅", msg),
  error:   (msg) => console.error("❌", msg),
  info:    (msg) => console.log("ℹ️", msg),
};

try {
  const t = (await import("react-hot-toast")).default;
  toast.success = t.success;
  toast.error   = t.error;
  toast.info    = t.custom || t.info || toast.info;
} catch {}

export function useQuests(wallet) {
  const { address, signer, isConnected } = wallet || {};

  const [profile,     setProfile]     = useState(null);
  const [dailyTasks,  setDailyTasks]  = useState(null);
  const [subTasks,    setSubTasks]    = useState(null);
  const [levelInfo,   setLevelInfo]   = useState(null);
  const [ethPrice,    setEthPrice]    = useState(2500);
  const [taskLoading, setTaskLoading] = useState({});

  const loadingRef = useRef(false);

  const loadUserData = useCallback(async () => {
    if (!isConnected || !address || !signer || !ADDRESSES.core) return;
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const core = getCoreContract(signer);
      const [prof, tasks, subs] = await Promise.all([
        core.getUserProfile(address),
        core.getDailyTasks(address),
        core.getSubTasks(address),
      ]);
      const xp = Number(prof.totalXP);
      setProfile({
        totalXP:        xp,
        username:       prof.username,
        usernameSet:    prof.usernameSet,
        tasksCompleted: Number(prof.tasksCompleted),
        joinedAt:       Number(prof.joinedAt),
        streakCount:    Number(prof.streakCount),
        referralCount:  Number(prof.referralCount),
        referredBy:     prof.referredBy,
      });
      setDailyTasks({
        gmDone:       tasks.gmDone,
        deployDone:   tasks.deployDone,
        swapDone:     tasks.swapDone,
        bridgeDone:   tasks.bridgeDone,
        gameDone:     tasks.gameDone,
        referralDone: tasks.referralDone,
        profileDone:  tasks.profileDone,
        mintDone:     tasks.mintDone,
      });
      setSubTasks({
        swapAerodromeDone: subs.swapAerodromeDone,
        swapUniswapDone:   subs.swapUniswapDone,
        swapJumperDone:    subs.swapJumperDone,
        swapRelayDone:     subs.swapRelayDone,
        bridgeJumperDone:  subs.bridgeJumperDone,
        bridgeRelayDone:   subs.bridgeRelayDone,
      });
      setLevelInfo(getLevelInfo(xp));
    } catch (err) {
      console.warn("loadUserData error:", err.message);
    } finally {
      loadingRef.current = false;
    }
  }, [address, signer, isConnected]);

  useEffect(() => {
    if (isConnected && address && signer) loadUserData();
  }, [isConnected, address, signer, loadUserData]);

  useEffect(() => {
    getEthPrice().then(setEthPrice);
    const iv = setInterval(() => getEthPrice().then(setEthPrice), 120000);
    return () => clearInterval(iv);
  }, []);

  const setTaskLoad = (id, val) => setTaskLoading(p => ({ ...p, [id]: val }));

  const executeTask = useCallback(async (taskId, txFn, xp, taskName) => {
    if (!isConnected || !signer) { toast.error("Connect your wallet first!"); return false; }
    setTaskLoad(taskId, true);
    try {
      const tx      = await txFn();
      toast.info(`⏳ ${taskName} submitted...`);
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        toast.success(`🎉 ${taskName} done! +${xp} XP earned!`);
        await loadUserData();
        return true;
      } else {
        toast.error(`${taskName} transaction failed.`);
        return false;
      }
    } catch (err) {
      const msg = err?.reason || err?.data?.message || err?.message || "Transaction failed";
      if (msg.includes("user rejected") || msg.includes("User denied")) {
        toast.error("Transaction cancelled.");
      } else if (msg.includes("already done")) {
        toast.error("Task already completed today!");
      } else if (msg.includes("insufficient funds")) {
        toast.error("Insufficient ETH balance.");
      } else {
        toast.error(msg.slice(0, 80));
      }
      return false;
    } finally {
      setTaskLoad(taskId, false);
    }
  }, [isConnected, signer, loadUserData]);

  // ── Main tasks ────────────────────────────────────────────────────────
  const completeGM = useCallback(async () =>
    executeTask("gm", () => getCoreContract(signer).completeGMTask({ value: ethers.parseEther("0.00005") }), 50, "GM Base"),
  [signer, executeTask]);

  const completeDeploy = useCallback(async (contractAddr) => {
    if (!ethers.isAddress(contractAddr)) { toast.error("Invalid contract address."); return false; }
    return executeTask("deploy", () => getCoreContract(signer).completeDeployTask(contractAddr, { value: ethers.parseEther("0.00005") }), 100, "Deploy Contract");
  }, [signer, executeTask]);

  const completeSwap = useCallback(async () =>
    executeTask("swap", () => getCoreContract(signer).completeSwapTask({ value: ethers.parseEther("0.00005") }), 75, "Swap on Base"),
  [signer, executeTask]);

  const completeBridge = useCallback(async () =>
    executeTask("bridge", () => getCoreContract(signer).completeBridgeTask({ value: ethers.parseEther("0.00005") }), 100, "Bridge to Base"),
  [signer, executeTask]);

  const completeGame = useCallback(async () =>
    executeTask("game", () => getCoreContract(signer).completeGameTask({ value: ethers.parseEther("0.00005") }), 75, "Mini-Game"),
  [signer, executeTask]);

  const completeReferral = useCallback(async (referred) => {
    if (!ethers.isAddress(referred)) { toast.error("Invalid wallet address."); return false; }
    if (referred.toLowerCase() === address?.toLowerCase()) { toast.error("Cannot refer yourself!"); return false; }
    return executeTask("referral", () => getCoreContract(signer).completeReferralTask(referred, { value: ethers.parseEther("0.00005") }), 150, "Refer a Friend");
  }, [signer, address, executeTask]);

  const completeProfile = useCallback(async (username) => {
    if (!username || username.trim().length === 0) { toast.error("Username cannot be empty."); return false; }
    if (username.length > 32) { toast.error("Username too long (max 32 chars)."); return false; }
    return executeTask("profile", () => getCoreContract(signer).completeProfileTask(username.trim(), { value: ethers.parseEther("0.00005") }), 50, "Set Profile");
  }, [signer, executeTask]);

  const completeMintNFT = useCallback(async (nftContract) => {
    if (!ethers.isAddress(nftContract)) { toast.error("Invalid NFT contract address."); return false; }
    return executeTask("mint", () => getCoreContract(signer).completeMintNFTTask(nftContract, { value: ethers.parseEther("0.00005") }), 125, "Mint NFT");
  }, [signer, executeTask]);

  // ── Swap sub-tasks ────────────────────────────────────────────────────
  const completeSwapAerodrome = useCallback(async () =>
    executeTask("swapAerodrome", () => getCoreContract(signer).completeSwapAerodrome({ value: ethers.parseEther("0.00005") }), 50, "Swap on Aerodrome"),
  [signer, executeTask]);

  const completeSwapUniswap = useCallback(async () =>
    executeTask("swapUniswap", () => getCoreContract(signer).completeSwapUniswap({ value: ethers.parseEther("0.00005") }), 50, "Swap on Uniswap"),
  [signer, executeTask]);

  const completeSwapJumper = useCallback(async () =>
    executeTask("swapJumper", () => getCoreContract(signer).completeSwapJumper({ value: ethers.parseEther("0.00005") }), 50, "Swap on Jumper"),
  [signer, executeTask]);

  const completeSwapRelay = useCallback(async () =>
    executeTask("swapRelay", () => getCoreContract(signer).completeSwapRelay({ value: ethers.parseEther("0.00005") }), 50, "Swap on Relay"),
  [signer, executeTask]);

  // ── Bridge sub-tasks ──────────────────────────────────────────────────
  const completeBridgeJumper = useCallback(async () =>
    executeTask("bridgeJumper", () => getCoreContract(signer).completeBridgeJumper({ value: ethers.parseEther("0.00005") }), 50, "Bridge via Jumper"),
  [signer, executeTask]);

  const completeBridgeRelay = useCallback(async () =>
    executeTask("bridgeRelay", () => getCoreContract(signer).completeBridgeRelay({ value: ethers.parseEther("0.00005") }), 50, "Bridge via Relay"),
  [signer, executeTask]);

  return {
    profile,
    dailyTasks,
    subTasks,
    levelInfo,
    ethPrice,
    taskLoading,
    loadUserData,
    completeGM,
    completeDeploy,
    completeSwap,
    completeBridge,
    completeGame,
    completeReferral,
    completeProfile,
    completeMintNFT,
    completeSwapAerodrome,
    completeSwapUniswap,
    completeSwapJumper,
    completeSwapRelay,
    completeBridgeJumper,
    completeBridgeRelay,
  };
}
