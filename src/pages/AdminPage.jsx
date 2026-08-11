import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

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
    `Hi ${name}!\n\nThis is a reminder from *IronWorks Gym*.\n\nYour *${planName}* plan is expiring on *${fmt(expiryDate)}*.\n\nRenew now to keep your training active!\n\nReply to this message or visit us at the gym.`
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

export default function AdminPage({ onClose }) {
  const { token, user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPlan, setFilterPlan] = useState("");
  const [tab, setTab] = useState("all"); // "all" | "pending" | "expiring"
  const [activatingId, setActivatingId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [regRes, dashRes] = await Promise.all([
        fetch(`${API}/admin/registrations`, { headers }),
        fetch(`${API}/admin/dashboard`, { headers }),
      ]);
      const regData = await regRes.json();
      const dashData = await dashRes.json();
      if (!regData.success) throw new Error(regData.message);
      setRegistrations(regData.registrations || []);
      setStats(dashData.stats || null);
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
    } catch (err) {
      alert(err.message || "Failed to activate registration");
    } finally {
      setActivatingId(null);
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
                  IRON<span className="text-ember">WORKS</span>
                </p>
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  {user.email}
                </p>
              </div>
              <span className="bg-brass px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-ink">
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
              { label: "Pending Approvals", value: pendingCount, color: "text-brass" },
              { label: "Expiring Soon", value: expiringCount, color: "text-ember" },
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

        {/* Content */}
        {loading ? (
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
                    {["Member", "Phone", "Plan", "Pricing / Price", "Requested Date", "Status", "Action"].map((h) => (
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
                        <span
                          className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink"
                          style={{ backgroundColor: r.planColor || "#c89b3c" }}
                        >
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
                        {r.status === "pending" ? (
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
                    <span
                      className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink"
                      style={{ backgroundColor: r.planColor || "#c89b3c" }}
                    >
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
                  {r.status === "pending" ? (
                    <button
                      disabled={activatingId === r.registrationId}
                      onClick={() => handleActivate(r.registrationId)}
                      className="w-full rounded-full bg-brass py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:opacity-90 disabled:opacity-50"
                    >
                      {activatingId === r.registrationId
                        ? "Activating..."
                        : "✓ Confirm Payment & Activate"}
                    </button>
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
    </div>
  );
}