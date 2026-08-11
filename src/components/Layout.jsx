import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AuthModal from "./AuthModal";

export default function Layout({ children, onAdminClick }) {
    const [authModal, setAuthModal] = useState(null); // "login" | "signup" | null
    const openAuth = (mode) => setAuthModal(mode);

    return (
        <div className="min-h-screen bg-background">
            <Navbar onAdminClick={onAdminClick} onOpenAuth={openAuth} />
            <main>
                {typeof children === "function" ? children({ onOpenAuth: openAuth }) : children}
            </main>
            <Footer onOpenAuth={openAuth} />

            {authModal && (
                <AuthModal mode={authModal} onClose={() => setAuthModal(null)} />
            )}
        </div>
    );
}