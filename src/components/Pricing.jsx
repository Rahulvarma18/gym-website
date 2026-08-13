import { useState, useEffect, useCallback, useRef } from "react";
import { faqs } from "../data/content";
import Reveal from "./Reveal";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const PLANS_CACHE_KEY = "jf_cached_plans";
// Free-tier hosts like Render spin the backend down after inactivity - the
// first request after that can take 30-60s to wake it back up. If we're
// still waiting past this point (and have nothing cached to show), tell
// people what's actually happening instead of leaving a bare spinner.
const SLOW_WAKE_HINT_MS = 4000;

function formatPeriod(duration) {
  if (!duration) return "";
  const { value, unit } = duration;
  if (unit === "days") return value === 7 ? "/week" : `/${value}d`;
  if (unit === "years") return value === 1 ? "/year" : `/${value}yr`;
  return value === 1 ? "/month" : `/${value}mo`;
}

function loadCachedPlans() {
  try {
    const raw = localStorage.getItem(PLANS_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Pricing({ onOpenAuth }) {
  const [openFaq, setOpenFaq] = useState(null);
  const { user, token } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  // Show last-known-good plans immediately (if we have them) while a fresh
  // fetch happens quietly in the background - avoids a blank screen every
  // time the backend has to wake up from a cold start.
  const cachedRef = useRef(loadCachedPlans());
  const [plans, setPlans] = useState(cachedRef.current || []);
  const [plansLoading, setPlansLoading] = useState(!cachedRef.current);
  const [plansError, setPlansError] = useState("");
  const [showWakeHint, setShowWakeHint] = useState(false);

  const fetchPlans = useCallback(async () => {
    const hadCache = Boolean(cachedRef.current);
    if (!hadCache) setPlansLoading(true);
    setPlansError("");

    const wakeTimer = hadCache
      ? null
      : setTimeout(() => setShowWakeHint(true), SLOW_WAKE_HINT_MS);

    try {
      const res = await fetch(`${API}/plans`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to load plans");
      setPlans(data.plans || []);
      try {
        localStorage.setItem(PLANS_CACHE_KEY, JSON.stringify(data.plans || []));
      } catch {
        // Storage full or unavailable (e.g. private browsing) - not critical.
      }
    } catch (err) {
      // If we have cached plans on screen already, fail silently - people
      // are still seeing real (if slightly stale) pricing, no need to
      // interrupt them with an error banner.
      if (!hadCache) {
        setPlansError(err.message || "Could not load pricing right now.");
      }
    } finally {
      if (wakeTimer) clearTimeout(wakeTimer);
      setShowWakeHint(false);
      setPlansLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // The status banner ("Selected X plan! ...") is only meaningful for the
  // user who triggered it - once they log out it's stale and shouldn't
  // keep showing to whoever uses this browser/tab next.
  useEffect(() => {
    if (!user) setStatusMsg({ type: "", text: "" });
  }, [user]);

  async function handleSelectPlan(plan) {
    if (!user) {
      onOpenAuth?.("login");
      return;
    }

    setLoadingPlan(plan.name);
    setStatusMsg({ type: "", text: "" });

    try {
      const res = await fetch(`${API}/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          planId: plan._id,
          planName: plan.name,
          planPrice: plan.discountPrice || plan.price,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Registration failed");

      setStatusMsg({
        type: "success",
        text: `Selected ${plan.name} plan! Status is set to Pending. Admin will activate it once payment is received.`,
      });
    } catch (err) {
      setStatusMsg({
        type: "error",
        text: err.message || "Could not register for plan.",
      });
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <section id="pricing" className="border-b border-border bg-background py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-ember">
            Pricing
          </span>
          <h2 className="mt-3 font-display text-4xl uppercase leading-[0.95] text-foreground sm:text-5xl">
            No contracts.
            <br />
            No BS.
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Weekly, monthly, or yearly. No joining fee, no lock-in contract.
          </p>
        </Reveal>

        {statusMsg.text && (
          <div
            className={`mt-6 rounded-xl border px-5 py-4 font-mono text-xs ${statusMsg.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700"
              : "border-ember/40 bg-ember/10 text-ember"
              }`}
          >
            {statusMsg.text}
          </div>
        )}

        {plansLoading ? (
          <div className="mt-12 flex flex-col items-center justify-center gap-4 py-12">
            <div className="h-8 w-8 rounded-full border-2 border-border border-t-ember animate-spin" />
            {showWakeHint && (
              <p className="max-w-sm text-center font-mono text-xs text-muted-foreground">
                Still loading — our server is waking up from being idle, this can take up to a minute on first load.
              </p>
            )}
          </div>
        ) : plansError ? (
          <div className="mt-12 border border-ember/30 bg-ember/10 px-6 py-8 text-center">
            <p className="font-semibold text-ember">{plansError}</p>
            <button
              onClick={fetchPlans}
              className="label-xs mt-4 rounded-full bg-ember px-5 py-2 text-ink transition-transform hover:scale-[1.04]"
            >
              Retry
            </button>
          </div>
        ) : plans.length === 0 ? (
          <div className="mt-12 border border-border bg-secondary px-6 py-12 text-center">
            <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
              Pricing is being updated — check back shortly.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan, i) => {
              const featured = Boolean(plan.badge);
              return (
                <Reveal
                  key={plan._id}
                  variant="scale"
                  delay={i * 100}
                  className={`flex flex-col border p-8 ${featured
                    ? "border-ember bg-muted"
                    : "border-border bg-secondary"
                    }`}
                >
                  {featured && (
                    <span className="mb-4 inline-block w-fit bg-ember px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ink">
                      {plan.badge}
                    </span>
                  )}
                  <h3 className="font-display text-2xl uppercase text-foreground">{plan.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  <div className="mt-6 font-display text-4xl text-foreground">
                    {plan.discountPrice ? (
                      <>
                        ₹{plan.discountPrice.toLocaleString("en-IN")}{" "}
                        <span className="text-lg text-muted-foreground line-through">
                          ₹{plan.price.toLocaleString("en-IN")}
                        </span>
                      </>
                    ) : (
                      `₹${(plan.price || 0).toLocaleString("en-IN")}`
                    )}
                    <span className="font-mono text-sm text-muted-foreground">
                      {formatPeriod(plan.duration)}
                    </span>
                  </div>
                  <ul className="mt-6 flex-1 space-y-3">
                    {(plan.features || []).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1 h-1 w-1 shrink-0 bg-ember" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    id={`select-plan-${plan.name.toLowerCase()}`}
                    disabled={loadingPlan === plan.name}
                    onClick={() => handleSelectPlan(plan)}
                    className={`mt-8 border px-5 py-3 text-center font-mono text-xs uppercase tracking-widest transition-colors ${featured
                      ? "border-ember bg-ember text-ink hover:bg-transparent hover:text-ember"
                      : "border-border text-foreground hover:border-foreground"
                      } disabled:opacity-50`}
                  >
                    {loadingPlan === plan.name
                      ? "Submitting..."
                      : "Get started"}
                  </button>
                </Reveal>
              );
            })}
          </div>
        )}

        <Reveal as="div" className="mt-20">
          <h3 className="font-display text-2xl uppercase text-foreground">
            Questions people actually ask
          </h3>
          <div className="mt-6 divide-y divide-border border-y border-border">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={faq.q}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-5 text-left"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium text-foreground">{faq.q}</span>
                    <span
                      className={`font-mono text-lg text-ember transition-transform ${isOpen ? "rotate-45" : ""
                        }`}
                    >
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}