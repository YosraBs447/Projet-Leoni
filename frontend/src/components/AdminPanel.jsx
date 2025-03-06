import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom"; // Permet de rendre le contenu dynamique selon la route
import "./AdminPanel.css"; // Assure-toi que le CSS est bien importé

const AdminPanel = () => {
  return (
    <div className="admin-panel">
      <Sidebar />
      <div className="main-content">
        {/* Affiche le contenu des sous-pages ici */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPanel;
