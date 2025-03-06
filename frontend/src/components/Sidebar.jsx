import React from "react";
import { Link } from "react-router-dom"; // Pour ajouter les liens vers les pages
import "./Sidebar.css"; // Assure-toi que le CSS du sidebar est bien appliqué

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <nav>
        <Link to="dashboard">Dashboard</Link>
        <Link to="settings">Settings</Link>
        {/* Ajoute d'autres liens vers d'autres pages */}
      </nav>
    </div>
  );
};

export default Sidebar;
