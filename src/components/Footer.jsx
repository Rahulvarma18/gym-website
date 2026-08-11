import { Link } from "react-router-dom";

const links = ["Classes", "Coaches", "Pricing", "Contact"];

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1400px] px-5 py-12 md:px-8">
      <div className="border-t border-foreground/10 pt-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap gap-6">
            {links.map((l) => (
              <Link
                key={l}
                to={`/#${l.toLowerCase()}`}
                className="text-sm text-foreground/60 transition-colors hover:text-foreground"
              >
                {l}
              </Link>
            ))}
          </nav>
          <span className="text-xs text-foreground/40">© 2026 Ironworks</span>
        </div>
      </div>
    </footer>
  );
}