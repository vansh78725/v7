import { useState } from "react";

export default function AuthGate({ onLogin }: { onLogin: (pw: string) => boolean }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const ok = onLogin(password);
    if (!ok) {
      setError("Incorrect password");
      setPassword("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <form onSubmit={submit} className="w-full max-w-sm p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
        <h2 className="text-xl font-bold text-white mb-3">Protected</h2>
        <p className="text-sm text-white/80 mb-4">Enter password to access this site.</p>
        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-md">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            aria-label="Password"
            className="flex-1 bg-transparent outline-none text-white placeholder:text-white/60"
          />
          <button
            type="submit"
            className="ml-2 px-3 py-1 rounded-md bg-white text-black font-semibold"
          >
            Enter
          </button>
        </div>
        {error && <div className="mt-3 text-sm text-rose-400">{error}</div>}
        <div className="mt-4 text-xs text-white/60">If you don’t have the password contact the site admin.</div>
      </form>
    </div>
  );
}
