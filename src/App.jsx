import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MarqueeBand from "./components/MarqueeBand";
import Trio from "./components/Trio";
import WideCards from "./components/WideCards";
import StickyPoster from "./components/StickyPoster";
import ClassGrid from "./components/ClassGrid";
import Stats from "./components/Stats";
import Coaches from "./components/Coaches";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminPage from "./pages/AdminPage";
import AuthModal from "./components/AuthModal";

function MainContent() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [authModal, setAuthModal] = useState(null); // "login" | "signup" | null

  return (
    <>
      {showAdmin ? (
        <AdminPage onClose={() => setShowAdmin(false)} />
      ) : (
        <div className="min-h-screen bg-background">
          <Navbar
            onAdminClick={() => setShowAdmin(true)}
            onOpenAuth={(mode) => setAuthModal(mode)}
          />
          <main>
            <Hero />
            <MarqueeBand />
            <Trio />
            <WideCards />
            <StickyPoster />
            <ClassGrid />
            <Stats />
            <Coaches />
            <Pricing onOpenAuth={(mode) => setAuthModal(mode)} />
            <Contact />
          </main>
          <Footer onOpenAuth={(mode) => setAuthModal(mode)} />
        </div>
      )}

      {authModal && (
        <AuthModal mode={authModal} onClose={() => setAuthModal(null)} />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;