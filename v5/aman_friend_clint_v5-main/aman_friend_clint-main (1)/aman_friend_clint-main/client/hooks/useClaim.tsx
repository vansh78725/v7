import React, { createContext, useContext, useMemo, useState } from "react";
import { toast } from "sonner";
import AuthGate from "@/components/AuthGate";

export type ClaimContextValue = {
  uid: string;
  setUid: (v: string) => void;
  selectedIds: string[];
  toggleSelected: (id: string) => void;
  clearSelected: () => void;
  isUidValid: boolean;
  canClaim: boolean;
  claim: () => void;
  isAuthed: boolean;
  login: (pw: string) => boolean;
  logout: () => void;
};

const ClaimContext = createContext<ClaimContextValue | undefined>(undefined);

export function ClaimProvider({ children }: { children: React.ReactNode }) {
  const [uid, setUid] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Auth
  const [isAuthed, setIsAuthed] = useState<boolean>(() => {
    try {
      return typeof window !== "undefined" && localStorage.getItem("zenze_auth") === "true";
    } catch {
      return false;
    }
  });

  const PASSWORD = "zenze@123";

  const login = (pw: string) => {
    if (pw === PASSWORD) {
      setIsAuthed(true);
      try {
        localStorage.setItem("zenze_auth", "true");
      } catch {}
      return true;
    }
    toast.error("Incorrect password");
    return false;
  };

  const logout = () => {
    setIsAuthed(false);
    try {
      localStorage.removeItem("zenze_auth");
    } catch {}
  };

  const isUidValid = useMemo(() => /^\d{10}$/.test(uid), [uid]);
  const canClaim = isUidValid && selectedIds.length > 0;

  const claim = () => {
    if (!canClaim) return;
    const summary = selectedIds.join(", ");
    toast(
      <div className="relative p-4 rounded-xl text-white shadow-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5">
        <div className="text-base font-extrabold tracking-tight">Request Received</div>
        <div className="text-sm text-white/80 mt-1">Your items will be credited in 24 hours.</div>
        <div className="mt-3 h-px bg-white/10" />
        <div className="mt-3 text-xs text-white/60">UID: {uid} • Bundles: {summary}</div>
      </div>,
      { duration: 5000 }
    );
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const clearSelected = () => setSelectedIds([]);

  const value = useMemo(
    () => ({ uid, setUid, selectedIds, toggleSelected, clearSelected, isUidValid, canClaim, claim, isAuthed, login, logout }),
    [uid, selectedIds, isUidValid, canClaim, isAuthed]
  );

  return (
    <ClaimContext.Provider value={value}>
      {!isAuthed ? <AuthGate onLogin={login} /> : null}
      {isAuthed ? children : null}
    </ClaimContext.Provider>
  );
}

export function useClaim() {
  const ctx = useContext(ClaimContext);
  if (!ctx) throw new Error("useClaim must be used within <ClaimProvider>");
  return ctx;
}
