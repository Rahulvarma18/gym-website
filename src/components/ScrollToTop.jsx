import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Runs on every route change. If the URL has a hash (e.g. coming from
// Navbar links like "/#pricing"), scroll to that section once it's mounted.
// Otherwise, reset scroll to the top of the new page.
export default function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            // Give the new page a tick to render before we look for the id.
            const id = hash.replace("#", "");
            const scrollToHash = () => {
                const el = document.getElementById(id);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                    return true;
                }
                return false;
            };

            if (!scrollToHash()) {
                const timeout = setTimeout(scrollToHash, 80);
                return () => clearTimeout(timeout);
            }
            return;
        }

        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, [pathname, hash]);

    return null;
}