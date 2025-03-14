import React, { useEffect, useState } from "react";
import apiClient, { fetchPendingInvitations, updateInvitationStatus } from "../api/api";
import "./Users.css";

const Users = () => {
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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
        console.log("🟢 Données envoyées:", { invitationId, action });

        if (!invitationId || !action) {
            console.error("❌ Erreur: Paramètres manquants");
            alert("Erreur: Paramètres manquants");
            return;
        }

        try {
            const response = await updateInvitationStatus(invitationId, action);
            console.log("Réponse de l'API:", response);

            // Retire l'invitation de la liste après acceptation ou rejet
            setInvitations(prev => prev.filter(invite => invite._id !== invitationId));
        } catch (error) {
            console.error("❌ Erreur lors de l'action:", error);
            alert("Action impossible: " + error.message);
        }
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="app_container">
            <h2>Invitations Reçues</h2>
            <div className="tab">
                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Site</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invitations.map(invite => (
                            <tr key={invite._id}>
                                <td>{invite.userId?.nomPrenom || "Inconnu"}</td>
                                <td>{invite.userId?.email || "Inconnu"}</td>
                                <td>{invite.userId?.site || "Inconnu"}</td>
                                <td>
                                    <button 
                                        className="accepter" 
                                        onClick={() => handleAction(invite._id, "accept")}
                                    >
                                        Accepter
                                    </button>
                                    <button 
                                        className="rejeter" 
                                        onClick={() => handleAction(invite._id, "reject")}
                                    >
                                        Rejeter
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;