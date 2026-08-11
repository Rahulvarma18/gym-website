import { useState } from "react";
import Hero from "../components/Hero";
import MarqueeBand from "../components/Marqueeband";
import Trio from "../components/Trio";
import WideCards from "../components/WideCards";
import StickyPoster from "../components/StickyPoster";
import ClassGrid from "../components/ClassGrid";
import Stats from "../components/Stats";
import Coaches from "../components/Coaches";
import Pricing from "../components/Pricing";
import Contact from "../components/Contact";
import Layout from "../components/Layout";
import AdminPage from "./AdminPage";

export default function Home() {
    const [showAdmin, setShowAdmin] = useState(false);

    if (showAdmin) {
        return <AdminPage onClose={() => setShowAdmin(false)} />;
    }

    return (
        <Layout onAdminClick={() => setShowAdmin(true)}>
            {({ onOpenAuth }) => (
                <>
                    <Hero />
                    <MarqueeBand />
                    <Trio />
                    <WideCards />
                    <StickyPoster />
                    <ClassGrid />
                    <Stats />
                    <Coaches />
                    <Pricing onOpenAuth={onOpenAuth} />
                    <Contact />
                </>
            )}
        </Layout>
    );
}