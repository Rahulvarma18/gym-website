import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import NutritionPage from "./pages/NutritionPage";
import RecoveryPage from "./pages/RecoveryPage";

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/recovery" element={<RecoveryPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;