import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { User, Settings, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

// These point at section ids that only exist on the homepage, so they're
// prefixed with "/" — if we're on /nutrition or /recovery this routes back
// to home first, then HashScroll (see ScrollToTop.jsx) scrolls to the id.
const left = [
  { label: "Classes", href: "/#classes" },
  { label: "Coaches", href: "/#coaches" },
  { label: "Pricing", href: "/#pricing" },
];
const right = [{ label: "Contact", href: "/#contact" }];

// react-router's Link doesn't trigger a scroll when the target route is the
// one you're already on (e.g. clicking the logo while already on "/"), so
// ScrollToTop.jsx's route-change effect never fires. Scroll explicitly here
// as well so the logo always takes you to the top, same-page or not.
function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}

export default function Navbar({ onAdminClick, onOpenAuth }) {
  const [modal, setModal] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  function triggerAuth(m) {
    if (onOpenAuth) onOpenAuth(m);
    else setModal(m);
  }

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50"
      >
        <div className="relative mx-auto flex min-h-16 w-full max-w-[1400px] flex-col items-center bg-background/70 backdrop-blur-md md:flex-row md:justify-between">
          {/* Desktop navbar */}
          <div className="hidden w-full flex-row items-center justify-between px-8 py-4 md:flex">
            <nav className="flex items-center gap-7">
              {left.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="label-xs text-foreground/70 transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link
              to="/"
              onClick={scrollToTop}
              className="flex items-center rounded-b-3xl bg-secondary px-12 py-3 shadow-[0_1px_0_var(--color-border)]"
            >
              <span className="font-display text-xl font-semibold tracking-[0.32em]">
                JAYRAM<span className="text-ember">FITNESS</span>
              </span>
            </Link>

            <div className="flex items-center gap-7">
              <nav className="flex items-center gap-7">
                {right.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="label-xs text-foreground/70 transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {user ? (
                <button
                  id="navbar-logout-btn"
                  onClick={logout}
                  className="label-xs rounded-full bg-primary px-5 py-3 text-primary-foreground transition-transform hover:scale-[1.04]"
                >
                  Log Out
                </button>
              ) : (
                <button
                  id="navbar-signup-btn"
                  onClick={() => triggerAuth("signup")}
                  className="label-xs rounded-full bg-primary px-5 py-3 text-primary-foreground transition-transform hover:scale-[1.04]"
                >
                  Join / Login
                </button>
              )}

              <button
                aria-label={user?.isAdmin ? "Admin panel" : user ? "Account" : "Log in"}
                title={user && !user.isAdmin ? `Logged in as ${user.firstName || user.email}` : undefined}
                onClick={() => {
                  if (user?.isAdmin) onAdminClick?.();
                  else if (!user) triggerAuth("login");
                  // logged-in, non-admin: no-op, they already have Log Out
                }}
                className={`flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform ${user && !user.isAdmin ? "cursor-default" : "hover:scale-[1.06]"
                  }`}
              >
                {user?.isAdmin ? (
                  <Settings className="size-4" />
                ) : (
                  <User className="size-4" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile navbar */}
          <div className="flex w-full items-center justify-between px-5 py-3 md:hidden">
            <Link
              to="/"
              onClick={scrollToTop}
              className="flex items-center rounded-full bg-secondary px-4 py-2 text-sm font-semibold tracking-wide"
            >
              JAYRAM<span className="text-ember">FITNESS</span>
            </Link>

            <div className="flex items-center gap-2">
              {user ? (
                <button
                  id="navbar-logout-btn"
                  onClick={logout}
                  className="label-xs rounded-full bg-primary px-3 py-2 text-primary-foreground transition-transform hover:scale-[1.04]"
                >
                  Log Out
                </button>
              ) : (
                <button
                  id="navbar-signup-btn"
                  onClick={() => triggerAuth("signup")}
                  className="label-xs rounded-full bg-primary px-3 py-2 text-primary-foreground transition-transform hover:scale-[1.04]"
                >
                  Join
                </button>
              )}

              <button
                aria-label={user?.isAdmin ? "Admin panel" : user ? "Account" : "Log in"}
                title={user && !user.isAdmin ? `Logged in as ${user.firstName || user.email}` : undefined}
                onClick={() => {
                  if (user?.isAdmin) onAdminClick?.();
                  else if (!user) triggerAuth("login");
                  // logged-in, non-admin: no-op, they already have Log Out
                }}
                className={`flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform ${user && !user.isAdmin ? "cursor-default" : "hover:scale-[1.06]"
                  }`}
              >
                {user?.isAdmin ? (
                  <Settings className="size-4" />
                ) : (
                  <User className="size-4" />
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-[1.06]"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="size-4" />
                ) : (
                  <Menu className="size-4" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full border-t border-border/40 bg-background/50 px-5 py-4 md:hidden"
            >
              <div className="flex flex-col gap-4">
                {[...left, ...right].map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="label-xs text-foreground/70 transition-colors hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </div>
      </motion.header>

      {modal && <AuthModal mode={modal} onClose={() => setModal(null)} />}
    </>
  );
}