import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AnnouncementTicker from "../../pages/AnnouncementTicker";

function MainLayout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f0f4f8" }}>
      <Header />
      <Navbar />
      <AnnouncementTicker />
      <main className="main-wrap">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;