import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function fmt(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function waLink(phone, name, planName, expiryDate) {
  const num = phone?.replace(/\D/g, "");
  const intl = num?.startsWith("91") ? num : `91${num}`;
  const msg = encodeURIComponent(
    `Hi ${name}!\n\nThis is a reminder from *Jayram Fitness*.\n\nYour *${planName}* plan is expiring on *${fmt(expiryDate)}*.\n\nRenew now to keep your training active!\n\nReply to this message or visit us at the gym.`
  );
  return `https://wa.me/${intl}?text=${msg}`;
}

// Status hues are drawn from the site's own palette rather than a generic
// dashboard's blue/red/amber/emerald: brass reads as "awaiting", ember as
// "needs action", a quiet border as neutral. Active reuses the emerald
// already established for the success toast in Pricing.jsx.
function StatusBadge({ status, daysRemaining }) {
  if (status === "pending")
    return (
      <span className="inline-flex items-center rounded-full border border-brass/40 bg-brass/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-brass">
        Pending
      </span>
    );
  // Checked before the days-remaining math below: endDate is frozen while
  // paused, so daysRemaining is stale/misleading for these rows until the
  // member is reactivated and the backend pushes endDate forward again.
  if (status === "paused")
    return (
      <span
        title="Plan expiry is frozen while the member is inactive"
        className="inline-flex items-center gap-1 rounded-full border border-muted-foreground/40 bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
      >
        <svg width="9" height="9" viewBox="0 0 16 16" fill="currentColor">
          <rect x="3" y="2" width="3.5" height="12" rx="1" />
          <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
        </svg>
        Paused
      </span>
    );
  if (status === "expired" || daysRemaining < 0)
    return (
      <span className="inline-flex items-center rounded-full bg-ember px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-ink">
        Expired
      </span>
    );
  if (daysRemaining <= 3)
    return (
      <span className="inline-flex items-center rounded-full border border-ember/40 bg-ember/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-ember">
        {daysRemaining}d left
      </span>
    );
  if (status === "active")
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
        Active
      </span>
    );
  return (
    <span className="inline-flex items-center rounded-full border border-border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
      {status}
    </span>
  );
}

function MemberStatusBadge({ active, autoInactive }) {
  if (active)
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
        Active
      </span>
    );
  return (
    <span
      title={autoInactive ? "Auto-deactivated for missed attendance" : "Deactivated by admin"}
      className="inline-flex items-center gap-1 rounded-full border border-muted-foreground/40 bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
    >
      Inactive{autoInactive ? " · No visits" : ""}
    </span>
  );
}

// Modern replacement for window.confirm(), styled to match AuthModal.
function ConfirmDialog({ title, message, confirmLabel, tone = "ember", onConfirm, onCancel }) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  const toneCls =
    tone === "emerald"
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : "bg-ember hover:opacity-90 text-ink";

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(23,21,15,0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        className="w-full max-w-sm border border-border border-t-4 border-t-ember bg-background p-6 shadow-2xl"
        style={{ animation: "modalIn 0.2s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        <p className="font-display text-lg tracking-wide text-foreground">{title}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{message}</p>
        <div className="mt-6 flex justify-end gap-2.5">
          <button
            id="confirm-dialog-cancel"
            onClick={onCancel}
            className="label-xs rounded-full border border-border px-4 py-2 text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            id="confirm-dialog-confirm"
            onClick={onConfirm}
            className={`label-xs rounded-full px-4 py-2 transition-transform hover:scale-[1.04] ${toneCls}`}
          >
            {confirmLabel}
          </button>
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

// Modern replacement for window.alert() - a dismissing toast in the corner.
function Toast({ message, tone = "ember", onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const toneCls =
    tone === "emerald"
      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700"
      : "border-ember/40 bg-ember/10 text-ember";

  return (
    <div className="fixed bottom-6 right-6 z-[300] max-w-sm" style={{ animation: "toastIn 0.25s cubic-bezier(0.16,1,0.3,1) both" }}>
      <div className={`flex items-start gap-3 border px-4 py-3.5 shadow-2xl bg-background ${toneCls}`}>
        <p className="flex-1 text-sm">{message}</p>
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function formatPlanPeriod(duration) {
  if (!duration) return "";
  const { value, unit } = duration;
  if (unit === "days") return value === 7 ? "/week" : `/${value}d`;
  if (unit === "years") return value === 1 ? "/year" : `/${value}yr`;
  return value === 1 ? "/month" : `/${value}mo`;
}

function PlansPanel({ plans, onSave, onError, onRequestDelete }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null); // null = create mode

  const sorted = [...plans].sort((a, b) => (a.price || 0) - (b.price || 0));

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {plans.length} {plans.length === 1 ? "plan" : "plans"} live on the pricing page
        </p>
        <button
          id="admin-add-plan-btn"
          onClick={() => { setEditingPlan(null); setFormOpen(true); }}
          className="label-xs rounded-full bg-ember px-4 py-2 text-ink transition-transform hover:scale-[1.04]"
        >
          + Add Plan
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="border border-border bg-secondary px-6 py-16 text-center">
          <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
            No plans yet — add one to show it on the pricing page
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((p) => (
            <div key={p._id} className="flex flex-col border border-border bg-secondary p-5">
              {p.badge && (
                <span className="mb-3 inline-block w-fit bg-ember px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ink">
                  {p.badge}
                </span>
              )}
              <h4 className="font-display text-lg uppercase text-foreground">{p.name}</h4>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
              <div className="mt-4 flex items-baseline gap-2">
                {p.discountPrice ? (
                  <>
                    <span className="font-display text-2xl text-foreground">
                      ₹{p.discountPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground line-through">
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                  </>
                ) : (
                  <span className="font-display text-2xl text-foreground">
                    ₹{(p.price || 0).toLocaleString("en-IN")}
                  </span>
                )}
                <span className="font-mono text-xs text-muted-foreground">{formatPlanPeriod(p.duration)}</span>
              </div>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {(p.features || []).length} feature{(p.features || []).length === 1 ? "" : "s"}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => { setEditingPlan(p); setFormOpen(true); }}
                  className="label-xs flex-1 rounded-full border border-border py-2 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                >
                  Edit
                </button>
                <button
                  onClick={() => onRequestDelete(p)}
                  className="label-xs flex-1 rounded-full border border-ember/40 py-2 text-ember transition-colors hover:bg-ember/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <PlanFormModal
          plan={editingPlan}
          onClose={() => setFormOpen(false)}
          onSave={async (payload) => {
            try {
              await onSave(editingPlan?._id || null, payload);
              setFormOpen(false);
            } catch (err) {
              onError(err.message || "Failed to save plan");
            }
          }}
        />
      )}
    </div>
  );
}

function PlanFormModal({ plan, onClose, onSave }) {
  const isEdit = Boolean(plan);
  const [name, setName] = useState(plan?.name || "");
  const [description, setDescription] = useState(plan?.description || "");
  const [price, setPrice] = useState(plan?.price ?? "");
  const [discountPrice, setDiscountPrice] = useState(plan?.discountPrice ?? "");
  const [durationValue, setDurationValue] = useState(plan?.duration?.value ?? 1);
  const [durationUnit, setDurationUnit] = useState(plan?.duration?.unit || "months");
  const [badge, setBadge] = useState(plan?.badge || "");
  const [featuresText, setFeaturesText] = useState((plan?.features || []).join("\n"));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && !saving && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, saving]);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (!name.trim() || !description.trim() || price === "" || Number(price) < 0) {
      setFormError("Name, description, and a valid price are required.");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        discountPrice: discountPrice === "" ? null : Number(discountPrice),
        duration: { value: Number(durationValue) || 1, unit: durationUnit },
        badge: badge.trim() || null,
        features: featuresText
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(23,21,15,0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && !saving && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md border border-border border-t-4 border-t-ember bg-background p-6 shadow-2xl my-8"
      >
        <p className="font-display text-lg tracking-wide text-foreground">
          {isEdit ? `Edit "${plan.name}"` : "Add a new plan"}
        </p>

        {formError && (
          <p className="mt-3 border border-ember/30 bg-ember/10 px-3 py-2 text-xs text-ember">{formError}</p>
        )}

        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Plan name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Weekly"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-ember focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short one-liner shown under the name"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-ember focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Price (₹)
              </label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-ember focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Discount price (optional)
              </label>
              <input
                type="number"
                min="0"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Leave blank"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-ember focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Duration
              </label>
              <input
                type="number"
                min="1"
                value={durationValue}
                onChange={(e) => setDurationValue(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-ember focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Unit
              </label>
              <select
                value={durationUnit}
                onChange={(e) => setDurationUnit(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-ember focus:outline-none"
              >
                <option value="days">Days</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Badge (optional)
            </label>
            <input
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. POPULAR — shows a highlighted tag"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-ember focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Features (one per line)
            </label>
            <textarea
              rows={4}
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder={"Full gym access\nLocker room\nGroup classes"}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-ember focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="label-xs rounded-full border border-border px-4 py-2 text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="label-xs rounded-full bg-ember px-4 py-2 text-ink transition-transform hover:scale-[1.04] disabled:opacity-50"
          >
            {saving ? "Saving..." : isEdit ? "Save changes" : "Create plan"}
          </button>
        </div>
      </form>
    </div>
  );
}

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function MessagesPanel({ messages, onMarkRead, onRequestDelete }) {
  if (messages.length === 0) {
    return (
      <div className="border border-border bg-secondary px-6 py-16 text-center">
        <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
          No messages yet — submissions from the Contact form will show up here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((m) => (
        <div
          key={m._id}
          className={`border p-5 ${m.status === "new" ? "border-ember/40 bg-ember/5" : "border-border bg-secondary"
            }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-display text-base text-foreground">{m.name}</p>
                {m.status === "new" && (
                  <span className="rounded-full bg-ember px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-ink">
                    New
                  </span>
                )}
              </div>
              <p className="font-mono text-xs text-muted-foreground">{m.email}</p>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {timeAgo(m.createdAt)}
            </p>
          </div>

          {m.interest && (
            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-brass">
              Interested in: {m.interest}
            </p>
          )}
          {m.message && (
            <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/90">{m.message}</p>
          )}

          <div className="mt-4 flex gap-2">
            <a
              href={`mailto:${m.email}`}
              className="label-xs rounded-full border border-border px-3.5 py-1.5 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              Reply by email
            </a>
            {m.status === "new" && (
              <button
                onClick={() => onMarkRead(m._id)}
                className="label-xs rounded-full border border-border px-3.5 py-1.5 text-muted-foreground transition-colors hover:border-emerald-500 hover:text-emerald-700"
              >
                Mark as read
              </button>
            )}
            <button
              onClick={() => onRequestDelete(m)}
              className="label-xs rounded-full border border-ember/40 px-3.5 py-1.5 text-ember transition-colors hover:bg-ember/10"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminPage({ onClose }) {
  const { token, user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [plans, setPlans] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPlan, setFilterPlan] = useState("");
  const [tab, setTab] = useState("all"); // "all" | "pending" | "expiring"
  const [activatingId, setActivatingId] = useState(null);
  const [markingId, setMarkingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null); // { kind: 'deactivate-member', userId, nextActive } | { kind: 'delete-plan', planId, planName } | null
  const [toast, setToast] = useState(null); // { message, tone } | null

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [regRes, dashRes, plansRes, messagesRes] = await Promise.all([
        fetch(`${API}/admin/registrations`, { headers }),
        fetch(`${API}/admin/dashboard`, { headers }),
        fetch(`${API}/plans`, { headers }),
        fetch(`${API}/contact`, { headers }),
      ]);
      const regData = await regRes.json();
      const dashData = await dashRes.json();
      const plansData = await plansRes.json();
      const messagesData = await messagesRes.json();
      if (!regData.success) throw new Error(regData.message);
      setRegistrations(regData.registrations || []);
      setStats(dashData.stats || null);
      setPlans(plansData.plans || []);
      setMessages(messagesData.messages || []);
      setUnreadCount(messagesData.unreadCount || 0);
    } catch (e) {
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleActivate(regId) {
    setActivatingId(regId);
    try {
      const res = await fetch(`${API}/registrations/${regId}/activate`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Activation failed");
      await fetchData();
      setToast({ message: "Payment confirmed and plan activated.", tone: "emerald" });
    } catch (err) {
      setToast({ message: err.message || "Failed to activate registration", tone: "ember" });
    } finally {
      setActivatingId(null);
    }
  }

  async function handleMarkPresent(userId) {
    setMarkingId(userId);
    try {
      const res = await fetch(`${API}/attendance/mark/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to mark attendance");
      await fetchData();
      setToast({ message: "Marked present for today.", tone: "emerald" });
    } catch (err) {
      setToast({ message: err.message || "Failed to mark attendance", tone: "ember" });
    } finally {
      setMarkingId(null);
    }
  }

  async function updateMemberStatus(userId, nextActive) {
    setTogglingId(userId);
    try {
      const res = await fetch(`${API}/admin/members/${userId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: nextActive }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to update status");
      await fetchData();
      setToast({
        message: nextActive ? "Member reactivated." : "Member deactivated. Their plan is now paused.",
        tone: nextActive ? "emerald" : "ember",
      });
    } catch (err) {
      setToast({ message: err.message || "Failed to update member status", tone: "ember" });
    } finally {
      setTogglingId(null);
    }
  }

  function handleToggleActive(userId, nextActive) {
    if (!nextActive) {
      // Deactivating pauses the plan - confirm via a modal instead of window.confirm().
      setConfirmDialog({ kind: "deactivate-member", userId, nextActive });
      return;
    }
    updateMemberStatus(userId, nextActive);
  }

  async function handleSavePlan(planId, payload) {
    const isEdit = Boolean(planId);
    const res = await fetch(`${API}/plans${isEdit ? `/${planId}` : ""}`, {
      method: isEdit ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Failed to save plan");
    await fetchData();
    setToast({ message: isEdit ? "Plan updated." : "Plan created.", tone: "emerald" });
  }

  async function handleDeletePlan(planId) {
    try {
      const res = await fetch(`${API}/plans/${planId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to delete plan");
      await fetchData();
      setToast({ message: "Plan removed from the pricing page.", tone: "emerald" });
    } catch (err) {
      setToast({ message: err.message || "Failed to delete plan", tone: "ember" });
    }
  }

  async function handleRejectRegistration(regId) {
    try {
      const res = await fetch(`${API}/registrations/${regId}/reject`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to reject request");
      await fetchData();
      setToast({ message: "Plan request rejected and removed.", tone: "emerald" });
    } catch (err) {
      setToast({ message: err.message || "Failed to reject request", tone: "ember" });
    }
  }

  async function handleMarkMessageRead(messageId) {
    try {
      const res = await fetch(`${API}/contact/${messageId}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to update message");
      await fetchData();
    } catch (err) {
      setToast({ message: err.message || "Failed to update message", tone: "ember" });
    }
  }

  async function handleDeleteMessage(messageId) {
    try {
      const res = await fetch(`${API}/contact/${messageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to delete message");
      await fetchData();
      setToast({ message: "Message deleted.", tone: "emerald" });
    } catch (err) {
      setToast({ message: err.message || "Failed to delete message", tone: "ember" });
    }
  }

  // Unique plan names for filter dropdown
  const planNames = [...new Set(registrations.map((r) => r.planName).filter(Boolean))];

  // Filter logic
  const filtered = registrations.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.phone?.includes(q);
    const matchStatus = !filterStatus || r.status === filterStatus;
    const matchPlan = !filterPlan || r.planName === filterPlan;
    const matchTab =
      tab === "expiring"
        ? r.isExpiringSoon
        : tab === "pending"
          ? r.status === "pending"
          : true;
    return matchSearch && matchStatus && matchPlan && matchTab;
  });

  const expiringCount = registrations.filter((r) => r.isExpiringSoon && r.status === "active").length;
  const pendingCount = registrations.filter((r) => r.status === "pending").length;

  if (!user?.isAdmin) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="font-display text-3xl text-ember">ACCESS DENIED</p>
          <p className="mt-2 text-sm text-muted-foreground">Admin access only.</p>
          <button
            onClick={onClose}
            className="label-xs mt-6 rounded-full bg-primary px-6 py-2.5 text-primary-foreground transition-transform hover:scale-[1.04]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              id="admin-back-btn"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-ember hover:text-ember transition-colors"
              aria-label="Go back"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div>
                <p className="font-display text-xl tracking-wide text-foreground">
                  JAYRAM<span className="text-ember">FITNESS</span>
                </p>
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  {user.email}
                </p>
              </div>
              <span className="border border-border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-foreground">
                Admin
              </span>
            </div>
          </div>
          <button
            id="admin-refresh-btn"
            onClick={fetchData}
            className="label-xs flex items-center gap-2 rounded-full border border-border px-4 py-2 text-muted-foreground hover:border-brass hover:text-brass transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M14 8A6 6 0 1 1 8 2a6 6 0 0 1 4.243 1.757L14 2v4h-4l1.5-1.5A4 4 0 1 0 12 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Total Members", value: stats.totalUsers, color: "text-foreground" },
              { label: "Pending Approvals", value: pendingCount, color: "text-foreground" },
              { label: "Expiring Soon", value: expiringCount, color: "text-foreground" },
              { label: "Total Revenue", value: `₹${(stats.totalRevenue || 0).toLocaleString("en-IN")}`, color: "text-foreground" },
            ].map((s) => (
              <div
                key={s.label}
                className="border border-border bg-secondary p-5"
              >
                <p className={`font-display text-2xl tracking-wide ${s.color}`}>{s.value}</p>
                <p className="mt-1 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex items-center gap-3 flex-wrap">
          <div className="flex rounded-full bg-muted p-1 gap-1">
            {[
              { key: "all", label: "All Members", activeCls: "bg-primary text-primary-foreground" },
              { key: "pending", label: `Pending Approvals${pendingCount > 0 ? ` (${pendingCount})` : ""}`, activeCls: "bg-brass text-ink" },
              { key: "expiring", label: `Expiring Soon${expiringCount > 0 ? ` (${expiringCount})` : ""}`, activeCls: "bg-ember text-ink" },
              { key: "plans", label: "Plans & Pricing", activeCls: "bg-primary text-primary-foreground" },
              { key: "messages", label: `Messages${unreadCount > 0 ? ` (${unreadCount})` : ""}`, activeCls: "bg-brass text-ink" },
            ].map((t) => (
              <button
                key={t.key}
                id={`admin-tab-${t.key}`}
                onClick={() => setTab(t.key)}
                className={`label-xs rounded-full px-4 py-2 transition-all ${tab === t.key ? `${t.activeCls} shadow` : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        {tab !== "plans" && tab !== "messages" && (
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
            <input
              id="admin-search"
              type="text"
              placeholder="Search by name, email, phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/60 focus:border-ember focus:outline-none transition-colors"
            />
            <select
              id="admin-filter-plan"
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-ember focus:outline-none transition-colors"
            >
              <option value="">All Plans</option>
              {planNames.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select
              id="admin-filter-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-ember focus:outline-none transition-colors"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {(search || filterStatus || filterPlan) && (
              <button
                id="admin-clear-filters"
                onClick={() => { setSearch(""); setFilterStatus(""); setFilterPlan(""); }}
                className="label-xs rounded-full border border-border px-4 py-2.5 text-muted-foreground hover:border-ember hover:text-ember transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Plans & Pricing panel */}
        {tab === "plans" && (
          <PlansPanel
            plans={plans}
            onSave={handleSavePlan}
            onError={(message) => setToast({ message, tone: "ember" })}
            onRequestDelete={(plan) => setConfirmDialog({ kind: "delete-plan", planId: plan._id, planName: plan.name })}
          />
        )}

        {/* Messages inbox */}
        {tab === "messages" && (
          <MessagesPanel
            messages={messages}
            onMarkRead={handleMarkMessageRead}
            onRequestDelete={(msg) => setConfirmDialog({ kind: "delete-message", messageId: msg._id, name: msg.name })}
          />
        )}

        {/* Content */}
        {tab === "plans" || tab === "messages" ? null : loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 rounded-full border-2 border-border border-t-ember animate-spin" />
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Loading members…</p>
            </div>
          </div>
        ) : error ? (
          <div className="border border-ember/30 bg-ember/10 px-6 py-8 text-center">
            <p className="font-semibold text-ember">{error}</p>
            <button
              onClick={fetchData}
              className="label-xs mt-4 rounded-full bg-ember px-5 py-2 text-ink transition-transform hover:scale-[1.04]"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-border bg-secondary px-6 py-16 text-center">
            <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
              {tab === "pending"
                ? "No pending plan requests"
                : tab === "expiring"
                  ? "No members expiring in the next 3 days"
                  : "No members found"}
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Showing {filtered.length} {filtered.length === 1 ? "record" : "records"}
            </p>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary">
                    {["Member", "Phone", "Plan", "Pricing / Price", "Requested Date", "Status", "Attendance", "Action"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr
                      key={r.registrationId}
                      className={`border-b border-border/60 transition-colors hover:bg-muted/60 ${r.status === "pending"
                        ? "bg-brass/5"
                        : r.isExpiringSoon && r.status === "active"
                          ? "bg-ember/5"
                          : i % 2 === 0
                            ? "bg-secondary/40"
                            : ""
                        }`}
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-foreground">
                          {r.firstName} {r.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{r.email}</p>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-foreground">{r.phone || "—"}</td>
                      <td className="px-5 py-4">
                        <span className="inline-block rounded-full border border-border px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground">
                          {r.planName}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-foreground font-semibold">
                        ₹{r.planPrice ? r.planPrice.toLocaleString("en-IN") : "—"}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                        {r.status === "pending" ? fmt(r.registrationDate) : fmt(r.startDate)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={r.status} daysRemaining={r.daysRemaining} />
                      </td>
                      <td className="px-5 py-4">
                        {r.userId ? (
                          <div className="flex flex-col items-start gap-1.5">
                            <MemberStatusBadge active={r.memberActive} autoInactive={r.autoInactive} />
                            <p className="text-[10px] font-mono text-muted-foreground">
                              Last visit: {fmt(r.lastAttendanceDate)}
                            </p>
                            <div className="flex items-center gap-2">
                              <button
                                id={`mark-present-btn-${r.userId}`}
                                disabled={markingId === r.userId}
                                onClick={() => handleMarkPresent(r.userId)}
                                className="label-xs rounded-full border border-border px-2.5 py-1 text-[10px] text-muted-foreground transition-colors hover:border-emerald-500 hover:text-emerald-700 disabled:opacity-50"
                              >
                                {markingId === r.userId ? "Marking..." : "Mark Present"}
                              </button>
                              <button
                                id={`toggle-active-btn-${r.userId}`}
                                disabled={togglingId === r.userId}
                                onClick={() => handleToggleActive(r.userId, !r.memberActive)}
                                className={`label-xs rounded-full border px-2.5 py-1 text-[10px] transition-colors disabled:opacity-50 ${r.memberActive
                                  ? "border-border text-muted-foreground hover:border-ember hover:text-ember"
                                  : "border-emerald-500/40 text-emerald-700 hover:bg-emerald-500/10"
                                  }`}
                              >
                                {togglingId === r.userId
                                  ? "Updating..."
                                  : r.memberActive
                                    ? "Deactivate"
                                    : "Reactivate"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs font-mono text-muted-foreground/60">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {r.status === "pending" ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              id={`activate-btn-${r.registrationId}`}
                              disabled={activatingId === r.registrationId}
                              onClick={() => handleActivate(r.registrationId)}
                              className="inline-flex items-center gap-1.5 rounded-full bg-brass px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-ink transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                            >
                              {activatingId === r.registrationId
                                ? "Activating..."
                                : "✓ Confirm Payment & Activate"}
                            </button>
                            <button
                              id={`reject-btn-${r.registrationId}`}
                              onClick={() => setConfirmDialog({ kind: "reject-registration", regId: r.registrationId, name: r.firstName, planName: r.planName })}
                              className="inline-flex items-center gap-1.5 rounded-full border border-ember/40 px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-ember transition-colors hover:bg-ember/10"
                            >
                              ✕ Reject
                            </button>
                          </div>
                        ) : r.isExpiringSoon && r.status === "active" && r.phone ? (
                          <a
                            id={`wa-btn-${r.registrationId}`}
                            href={waLink(r.phone, `${r.firstName}`, r.planName, r.endDate)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#25D366] bg-[#25D366]/10 px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#128C7E] transition-colors hover:bg-[#25D366]/20"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            WhatsApp
                          </a>
                        ) : (
                          <span className="text-xs font-mono text-muted-foreground/60">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="flex md:hidden flex-col gap-4">
              {filtered.map((r) => (
                <div
                  key={r.registrationId}
                  className={`border p-5 ${r.status === "pending"
                    ? "border-brass/40 bg-brass/5"
                    : r.isExpiringSoon && r.status === "active"
                      ? "border-ember/40 bg-ember/5"
                      : "border-border bg-secondary"
                    }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-semibold text-foreground">
                        {r.firstName} {r.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{r.email}</p>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5">{r.phone}</p>
                    </div>
                    <StatusBadge status={r.status} daysRemaining={r.daysRemaining} />
                  </div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="rounded-full border border-border px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground">
                      {r.planName}
                    </span>
                    <span className="font-mono text-xs font-semibold text-foreground">
                      ₹{r.planPrice ? r.planPrice.toLocaleString("en-IN") : "—"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-muted-foreground mb-3">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest mb-0.5">Requested</p>
                      <p className="text-foreground">{fmt(r.registrationDate)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest mb-0.5">Expiry</p>
                      <p className={r.isExpiringSoon ? "text-ember" : "text-foreground"}>{fmt(r.endDate)}</p>
                    </div>
                  </div>
                  {r.userId && (
                    <div className="mb-3 flex flex-col gap-2 border-t border-border/60 pt-3">
                      <div className="flex items-center justify-between">
                        <MemberStatusBadge active={r.memberActive} autoInactive={r.autoInactive} />
                        <p className="text-[10px] font-mono text-muted-foreground">
                          Last visit: {fmt(r.lastAttendanceDate)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          disabled={markingId === r.userId}
                          onClick={() => handleMarkPresent(r.userId)}
                          className="flex-1 label-xs rounded-full border border-border py-1.5 text-[10px] text-muted-foreground transition-colors hover:border-emerald-500 hover:text-emerald-700 disabled:opacity-50"
                        >
                          {markingId === r.userId ? "Marking..." : "Mark Present"}
                        </button>
                        <button
                          disabled={togglingId === r.userId}
                          onClick={() => handleToggleActive(r.userId, !r.memberActive)}
                          className={`flex-1 label-xs rounded-full border py-1.5 text-[10px] transition-colors disabled:opacity-50 ${r.memberActive
                            ? "border-border text-muted-foreground hover:border-ember hover:text-ember"
                            : "border-emerald-500/40 text-emerald-700 hover:bg-emerald-500/10"
                            }`}
                        >
                          {togglingId === r.userId
                            ? "Updating..."
                            : r.memberActive
                              ? "Deactivate"
                              : "Reactivate"}
                        </button>
                      </div>
                    </div>
                  )}
                  {r.status === "pending" ? (
                    <div className="flex flex-col gap-2">
                      <button
                        disabled={activatingId === r.registrationId}
                        onClick={() => handleActivate(r.registrationId)}
                        className="w-full rounded-full bg-brass py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:opacity-90 disabled:opacity-50"
                      >
                        {activatingId === r.registrationId
                          ? "Activating..."
                          : "✓ Confirm Payment & Activate"}
                      </button>
                      <button
                        onClick={() => setConfirmDialog({ kind: "reject-registration", regId: r.registrationId, name: r.firstName, planName: r.planName })}
                        className="w-full rounded-full border border-ember/40 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-ember transition-colors hover:bg-ember/10"
                      >
                        ✕ Reject Request
                      </button>
                    </div>
                  ) : r.isExpiringSoon && r.status === "active" && r.phone ? (
                    <a
                      href={waLink(r.phone, `${r.firstName}`, r.planName, r.endDate)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full rounded-full border border-[#25D366] bg-[#25D366]/10 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-[#128C7E] transition-colors hover:bg-[#25D366]/20"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Send WhatsApp Reminder
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {confirmDialog?.kind === "deactivate-member" && (
        <ConfirmDialog
          title="Deactivate member?"
          message="Their plan's expiry will be paused until they're reactivated or they check in again."
          confirmLabel="Deactivate"
          tone="ember"
          onCancel={() => setConfirmDialog(null)}
          onConfirm={() => {
            const { userId, nextActive } = confirmDialog;
            setConfirmDialog(null);
            updateMemberStatus(userId, nextActive);
          }}
        />
      )}

      {confirmDialog?.kind === "reject-registration" && (
        <ConfirmDialog
          title="Reject this plan request?"
          message={`"${confirmDialog.name}"'s pending request for the ${confirmDialog.planName} plan will be permanently deleted. They can submit a new request anytime.`}
          confirmLabel="Reject"
          tone="ember"
          onCancel={() => setConfirmDialog(null)}
          onConfirm={() => {
            const { regId } = confirmDialog;
            setConfirmDialog(null);
            handleRejectRegistration(regId);
          }}
        />
      )}

      {confirmDialog?.kind === "delete-plan" && (
        <ConfirmDialog
          title="Delete this plan?"
          message={`"${confirmDialog.planName}" will be hidden from the public pricing page immediately. Members already on it are not affected.`}
          confirmLabel="Delete"
          tone="ember"
          onCancel={() => setConfirmDialog(null)}
          onConfirm={() => {
            const { planId } = confirmDialog;
            setConfirmDialog(null);
            handleDeletePlan(planId);
          }}
        />
      )}

      {confirmDialog?.kind === "delete-message" && (
        <ConfirmDialog
          title="Delete this message?"
          message={`The message from "${confirmDialog.name}" will be permanently removed. This can't be undone.`}
          confirmLabel="Delete"
          tone="ember"
          onCancel={() => setConfirmDialog(null)}
          onConfirm={() => {
            const { messageId } = confirmDialog;
            setConfirmDialog(null);
            handleDeleteMessage(messageId);
          }}
        />
      )}

      {toast && <Toast message={toast.message} tone={toast.tone} onDismiss={() => setToast(null)} />}
    </div>
  );
}