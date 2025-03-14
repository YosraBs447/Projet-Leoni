import React, { useEffect, useState } from "react";
import apiClient, { fetchPendingInvitations, updateInvitationStatus } from "../api/api";
import "./Users.css";

const Users = () => {
    const [invitations, setInvitations] = useState([]);
    const [sentInvitations, setSentInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("pending"); // "pending" ou "sent"

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchPendingInvitations();
                setInvitations(data.filter(invite => invite.status === "pending"));
                setSentInvitations(data.filter(invite => invite.status !== "pending"));
            } catch (err) {
                setError("Impossible de récupérer les invitations");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAction = async (invitationId, action) => {
        if (!invitationId || !action) {
            alert("Erreur: Paramètres manquants");
            return;
        }

        try {
            await updateInvitationStatus(invitationId, action);

            // Met à jour les listes après acceptation ou rejet
            setInvitations(prev => prev.filter(invite => invite._id !== invitationId));
            const updatedInvite = invitations.find(invite => invite._id === invitationId);
            if (updatedInvite) {
                updatedInvite.status = action === "accept" ? "accepted" : "rejected";
                updatedInvite.actionDate = new Date(); // Ajoute la date d'action (acceptation/rejet)
                setSentInvitations(prev => [...prev, updatedInvite]);
            }
        } catch (error) {
            alert("Action impossible: " + error.message);
        }
    };

    // Fonction pour parser la date au format DD/MM/YYYY
    const formatDate = (dateString) => {
        try {
            // Vérifie si la date est déjà un objet Date
            if (dateString instanceof Date) {
                return dateString.toLocaleDateString('fr-FR'); // Formate la date
            }

            // Si la date est une chaîne, tente de la parser
            const parts = dateString.split('/');
            if (parts.length === 3) {
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1; // Mois est 0-indexé
                const year = parseInt(parts[2], 10);

                const date = new Date(year, month, day);
                return date.toLocaleDateString('fr-FR'); // Formate la date
            } else {
                return "Inconnue";
            }
        } catch (error) {
            console.error("Erreur lors du formatage de la date :", error);
            return "Inconnue";
        }
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="app_container">
            <h2>Gestion des Invitations</h2>
            <p>Gérez les demandes d'inscription et les invitations des techniciens</p>

            {/* Onglets */}
            <div className="tabs">
                <button 
                    className={`tab_button ${activeTab === "pending" ? "active" : ""}`} 
                    onClick={() => setActiveTab("pending")}
                >
                    Demandes en attente
                </button>
                <button 
                    className={`tab_button ${activeTab === "sent" ? "active" : ""}`} 
                    onClick={() => setActiveTab("sent")}
                >
                    Invitations envoyées
                </button>
            </div>

            {/* Tableau */}
            <div className="tab">
                {activeTab === "pending" && (
                    <table>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Site</th>
                                <th>Rôle</th>
                                <th>Date d'inscription</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invitations.map(invite => (
                                <tr key={invite._id}>
                                    <td>{invite.userId?.nomPrenom || "Inconnu"}</td>
                                    <td>{invite.userId?.email || "Inconnu"}</td>
                                    <td>{invite.userId?.site || "Inconnu"}</td>
                                    <td>{invite.userId?.role || "Inconnu"}</td>
                                    {/* Affiche la date d'inscription */}
                                    <td>{formatDate(invite.userId?.date)}</td>
                                    <td>En attente</td>
                                    <td>
                                        <button 
                                            className="accepter" 
                                            onClick={() => handleAction(invite._id, "accept")}
                                        >
                                            ✔️
                                        </button>
                                        <button 
                                            className="rejeter" 
                                            onClick={() => handleAction(invite._id, "reject")}
                                        >
                                            ❌
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === "sent" && (
                    <table>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Site</th>
                                <th>Rôle</th>
                                <th>Date d'action</th> {/* Date d'acceptation ou de rejet */}
                                <th>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sentInvitations.map(invite => (
                                <tr key={invite._id}>
                                    <td>{invite.userId?.nomPrenom || "Inconnu"}</td>
                                    <td>{invite.userId?.email || "Inconnu"}</td>
                                    <td>{invite.userId?.site || "Inconnu"}</td>
                                    <td>{invite.userId?.role || "Inconnu"}</td>
                                    {/* Affiche la date d'action */}
                                    <td>{formatDate(invite.actionDate)}</td> 
                                    {/* Statut accepté ou rejeté */}
                                    <td>{invite.status === "accepted" ? "Acceptée" : "Rejetée"}</td> 
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Users;
