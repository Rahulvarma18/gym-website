import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

const inputCls =
  "w-full rounded-lg border border-steel-dim/40 bg-concrete px-4 py-3 text-sm text-paper placeholder-steel focus:border-ember focus:outline-none transition-colors";
const labelCls = "block mb-1.5 text-xs font-semibold uppercase tracking-widest text-steel";

export default function AuthModal({ mode: initialMode, onClose }) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState(initialMode); // "login" | "signup"
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function handleChange(e) {
    setError("");
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await signup(
          form.firstName,
          form.lastName,
          form.email,
          form.phone,
          form.password,
          form.confirmPassword
        );
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function switchMode(m) {
    setMode(m);
    setError("");
    setForm({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "" });
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(10,8,6,0.85)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-steel-dim/30 bg-concrete shadow-2xl"
        style={{ animation: "modalIn 0.25s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        {/* Close button */}
        <button
          id="auth-modal-close"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-steel hover:bg-steel-dim/30 hover:text-paper transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="px-8 pb-8 pt-7">
          {/* Logo */}
          <p className="font-display text-lg tracking-wide text-paper mb-1">
            IRON<span className="text-ember">WORKS</span>
          </p>

          {/* Tab switcher */}
          <div className="mt-5 mb-6 flex rounded-xl bg-ink p-1 gap-1">
            {["login", "signup"].map((m) => (
              <button
                key={m}
                id={`auth-tab-${m}`}
                onClick={() => switchMode(m)}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold uppercase tracking-widest transition-all ${
                  mode === m
                    ? "bg-ember text-ink shadow"
                    : "text-steel hover:text-paper"
                }`}
              >
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form id="auth-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls} htmlFor="auth-firstName">First Name</label>
                  <input
                    id="auth-firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Rahul"
                    value={form.firstName}
                    onChange={handleChange}
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls} htmlFor="auth-lastName">Last Name</label>
                  <input
                    id="auth-lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Varma"
                    value={form.lastName}
                    onChange={handleChange}
                    className={inputCls}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className={labelCls} htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={handleChange}
                className={inputCls}
                required
              />
            </div>

            {mode === "signup" && (
              <div>
                <label className={labelCls} htmlFor="auth-phone">Phone Number</label>
                <input
                  id="auth-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputCls}
                  required
                />
              </div>
            )}

            <div>
              <label className={labelCls} htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                name="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className={inputCls}
                required
              />
            </div>

            {mode === "signup" && (
              <div>
                <label className={labelCls} htmlFor="auth-confirmPassword">Confirm Password</label>
                <input
                  id="auth-confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={inputCls}
                  required
                />
              </div>
            )}

            {error && (
              <p className="rounded-lg bg-ember/10 border border-ember/30 px-4 py-2.5 text-xs text-ember">
                {error}
              </p>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-full bg-ember py-3.5 font-mono text-xs font-semibold uppercase tracking-widest text-ink transition-all hover:bg-brass disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Please wait…"
                : mode === "login"
                ? "Log In →"
                : "Create Account →"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-steel">
            {mode === "login" ? "No account yet?" : "Already a member?"}{" "}
            <button
              id={`auth-switch-${mode === "login" ? "signup" : "login"}`}
              onClick={() => switchMode(mode === "login" ? "signup" : "login")}
              className="text-brass underline-offset-2 hover:underline"
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </div>
  );
}
