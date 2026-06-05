import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AgentDashboard from "./pages/AgentDashboard";
import PackageBuilder from "./pages/PackageBuilder";
import AdminDashboard from "./pages/AdminDashboard";
import QuotationPage from "./pages/QuotationPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [userRole, setUserRole] = useState(null);
  const [packageData, setPackageData] = useState(null);

  const navigate = (page, data = null) => {
    setCurrentPage(page);
    if (data) setPackageData(data);
  };

  const handleLogin = (role) => {
    setUserRole(role);
    navigate(role === "admin" ? "admin-dashboard" : "agent-dashboard");
  };

  const handleLogout = () => {
    setUserRole(null);
    navigate("landing");
  };

  return (
    <div className="app">
      {currentPage === "landing" && <LandingPage navigate={navigate} />}
      {currentPage === "login" && <LoginPage onLogin={handleLogin} navigate={navigate} />}
      {currentPage === "agent-dashboard" && <AgentDashboard navigate={navigate} onLogout={handleLogout} />}
      {currentPage === "package-builder" && <PackageBuilder navigate={navigate} onLogout={handleLogout} initialData={packageData} />}
      {currentPage === "quotation" && <QuotationPage navigate={navigate} onLogout={handleLogout} packageData={packageData} />}
      {currentPage === "admin-dashboard" && <AdminDashboard navigate={navigate} onLogout={handleLogout} />}
    </div>
  );
}
