import React, { useEffect, useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState({
    totalChecklists: 0,
    totalAnomalies: 0,
    totalValidated: 0,
    totalTechnicians: 0,
    totalSites: 0,
  });

  // Récupérer les données du backend
  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) =>
        console.log("Erreur lors de la récupération des données", err)
      );
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Tableau de bord</h1>
      <p>Bienvenue sur le tableau de bord administrateur.</p>

      {/* Statistiques */}
      <div className="stats-container">
        <div className="stat-card">
          <h2>Total Checklists</h2>
          <p>{data.totalChecklists}</p>
        </div>
        <div className="stat-card">
          <h2>Anomalies</h2>
          <p>{data.totalAnomalies}</p>
        </div>
        <div className="stat-card">
          <h2>Checklists Validées</h2>
          <p>{data.totalValidated}</p>
        </div>
        {/* Nouvelle carte pour les techniciens */}
        <div className="stat-card">
          <h2>Techniciens</h2>
          <p>{data.totalTechnicians}</p>
        </div>
        {/* Nouvelle carte pour les sites */}
        <div className="stat-card">
          <h2>Sites</h2>
          <p>{data.totalSites}</p>
        </div>
      </div>

      {/* Tableau des dernières checklists */}
      <div className="checklist-table">
        <h2>Dernières Checklists</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>001</td>
              <td>Contrôle qualité</td>
              <td>Validée</td>
            </tr>
            <tr>
              <td>002</td>
              <td>Maintenance</td>
              <td>Anomalie</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
