import React from "react";
import { Link, Outlet } from "react-router-dom"; // Importez Outlet pour les routes imbriquées
import "./AdminPage.css"; // Assurez-vous que les styles CSS sont appliqués

function AdminPage() {
  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Panneau Admin</h2>
        </div>
        <div className="sidebar-links">
          <Link to="/admin-panel/dashboard" className="sidebar-link">
            Dashboard
          </Link>
          <Link to="/admin-panel/users" className="sidebar-link">
            Utilisateurs
          </Link>
          <Link to="/admin-panel/settings" className="sidebar-link">
            Paramètres
          </Link>
          <Link to="/admin-panel/Checklists" className="sidebar-link">
            Les Checklists
          </Link>
          <Link to="/admin-panel/Site" className="sidebar-link">
            Les Sites
          </Link>
          <Link to="/admin-panel/Anomaly" className="sidebar-link">
            Anomalies
          </Link>
          <Link to="/admin-panel/Notification" className="sidebar-link">
            Notification
          </Link>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="main-content">
        <Outlet /> {/* Contenu dynamique ici */}
      </div>
    </div>
  );
}

export default AdminPage;
