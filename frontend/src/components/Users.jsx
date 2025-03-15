import React, { useEffect, useState } from "react";
import apiClient, { fetchPendingInvitations, updateInvitationStatus } from "../api/api";
import "./Users.css";

const Users = () => {
    const [invitations, setInvitations] = useState([]);
    const [sentInvitations, setSentInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("pending");

    // Récupérer les invitations envoyées du localStorage
    useEffect(() => {
        const storedSentInvitations = JSON.parse(localStorage.getItem("sentInvitations")) || [];
        setSentInvitations(storedSentInvitations);

        const fetchData = async () => {
            try {
                const data = await fetchPendingInvitations();
                setInvitations(data.filter(invite => invite.status === "pending"));
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

            // Retirer l'invitation des en attente
            setInvitations(prev => prev.filter(invite => invite._id !== invitationId));

            const updatedInvite = { 
                ...invitations.find(invite => invite._id === invitationId),
                status: action === "accept" ? "accepted" : "rejected", 
                actionDate: new Date() 
            };
            
            // Mettre à jour les invitations envoyées localement
            setSentInvitations(prev => {
                const updatedSentInvitations = [...prev, updatedInvite];
                localStorage.setItem("sentInvitations", JSON.stringify(updatedSentInvitations));
                return updatedSentInvitations;
            });

        } catch (error) {
            alert("Action impossible: " + error.message);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Inconnue";
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="user_container">
            <h2>Gestion des Invitations</h2>
            <p>Gérez les demandes d'inscription et les invitations des techniciens</p>
            
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
                            {invitations.length > 0 ? (
                                invitations.map(invite => (
                                    <tr key={invite._id}>
                                        <td>{invite.userId?.nomPrenom || "Inconnu"}</td>
                                        <td>{invite.userId?.email || "Inconnu"}</td>
                                        <td>{invite.userId?.site || "Inconnu"}</td>
                                        <td>{invite.userId?.role || "Inconnu"}</td>
                                        <td>{formatDate(invite.userId?.dateInscription)}</td>
                                        <td>En attente</td>
                                        <td>
                                            <button 
                                                className="accepter" 
                                                onClick={() => handleAction(invite._id, "accept")}
                                                title="Accepter la demande"
                                            >
                                               ✓
                                            </button>
                                            <button 
                                                className="rejeter" 
                                                onClick={() => handleAction(invite._id, "reject")}
                                                title="Rejeter la demande"
                                            >
                                                X 
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                                        Aucune demande en attente.
                                    </td>
                                </tr>
                            )}
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
                                <th>Date d'action</th>
                                <th>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sentInvitations.length > 0 ? (
                                sentInvitations.map(invite => (
                                    <tr key={invite._id}>
                                        <td>{invite.userId?.nomPrenom || "Inconnu"}</td>
                                        <td>{invite.userId?.email || "Inconnu"}</td>
                                        <td>{invite.userId?.site || "Inconnu"}</td>
                                        <td>{invite.userId?.role || "Inconnu"}</td>
                                        <td>{formatDate(invite.actionDate)}</td>
                                        <td>{invite.status === "accepted" ? "Acceptée" : "Rejetée"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                                        Aucune invitation envoyée.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Users;