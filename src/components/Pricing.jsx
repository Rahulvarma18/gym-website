import { useState } from "react";
import { pricingTiers, faqs } from "../data/content";
import Reveal from "./Reveal";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

export default function Pricing({ onOpenAuth }) {
  const [openFaq, setOpenFaq] = useState(null);
  const { user, token } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  async function handleSelectPlan(tier) {
    if (!user) {
      onOpenAuth?.("login");
      return;
    }

    setLoadingPlan(tier.name);
    setStatusMsg({ type: "", text: "" });

    try {
      const priceNumeric = parseInt(tier.price.replace(/\D/g, ""), 10) || 0;
      const res = await fetch(`${API}/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          planName: tier.name,
          planPrice: priceNumeric,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Registration failed");

      setStatusMsg({
        type: "success",
        text: `Selected ${tier.name} plan! Status is set to Pending. Admin will activate it once payment is received.`,
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
                ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-300"
                : "border-ember/40 bg-ember/10 text-ember"
              }`}
          >
            {statusMsg.text}
          </div>
        )}

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier, i) => (
            <Reveal
              key={tier.name}
              variant="scale"
              delay={i * 100}
              className={`flex flex-col border p-8 ${tier.featured
                  ? "border-ember bg-muted"
                  : "border-border bg-secondary"
                }`}
            >
              {tier.featured && (
                <span className="mb-4 inline-block w-fit bg-ember px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ink">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-2xl uppercase text-foreground">{tier.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>
              <div className="mt-6 font-display text-4xl text-foreground">
                {tier.price}
                <span className="font-mono text-sm text-muted-foreground">{tier.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1 h-1 w-1 shrink-0 bg-ember" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                id={`select-plan-${tier.name.toLowerCase()}`}
                disabled={loadingPlan === tier.name}
                onClick={() => handleSelectPlan(tier)}
                className={`mt-8 border px-5 py-3 text-center font-mono text-xs uppercase tracking-widest transition-colors ${tier.featured
                    ? "border-ember bg-ember text-ink hover:bg-transparent hover:text-ember"
                    : "border-border text-foreground hover:border-foreground"
                  } disabled:opacity-50`}
              >
                {loadingPlan === tier.name
                  ? "Submitting..."
                  : "Get started"}
              </button>
            </Reveal>
          ))}
        </div>

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