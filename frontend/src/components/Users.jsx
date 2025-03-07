// src/components/Users.jsx
import React, { useEffect, useState } from 'react';
import {
    getAllUsers,
    deleteUser,
    fetchPendingInvitations,
    updateInvitationStatus,
} from '../api/api'; // Importez les fonctions API
import './Users.css'; // Importez le fichier CSS

const Users = () => {
    // États pour gérer les utilisateurs, invitations, chargement et erreurs
    const [users, setUsers] = useState([]); // Liste des utilisateurs
    const [invitations, setInvitations] = useState([]); // Liste des invitations en attente
    const [loading, setLoading] = useState(true); // État de chargement
    const [error, setError] = useState(null); // Gestion des erreurs

    // Récupération des données au chargement du composant
    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersData = await getAllUsers(); // Récupère les utilisateurs
                const invitationsData = await fetchPendingInvitations(); // Récupère les invitations
                setUsers(usersData);
                setInvitations(invitationsData);
                setLoading(false);
            } catch (err) {
                setError("Une erreur est survenue lors du chargement des données.");
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Le tableau vide garantit que cela s'exécute une seule fois au chargement

    // Supprimer un utilisateur
    const handleDeleteUser = async (userId) => {
        try {
            await deleteUser(userId); // Appel API pour supprimer
            setUsers(users.filter((user) => user._id !== userId)); // Met à jour l'état local
        } catch (err) {
            setError("Erreur lors de la suppression de l'utilisateur.");
        }
    };

    // Accepter une invitation
    const handleAcceptInvitation = async (invitationId) => {
        try {
            await updateInvitationStatus(invitationId, 'accepted'); // Appel API pour accepter
            setInvitations(invitations.filter((inv) => inv._id !== invitationId)); // Met à jour l'état local
        } catch (err) {
            setError("Erreur lors de l'acceptation de l'invitation.");
        }
    };

    // Refuser une invitation
    const handleRejectInvitation = async (invitationId) => {
        try {
            await updateInvitationStatus(invitationId, 'rejected'); // Appel API pour refuser
            setInvitations(invitations.filter((inv) => inv._id !== invitationId)); // Met à jour l'état local
        } catch (err) {
            setError("Erreur lors du refus de l'invitation.");
        }
    };

    // Affichage du chargement ou des erreurs
    if (loading) return <p>Chargement des données...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="users-container">
            {/* Section des utilisateurs */}
            <section>
                <h1>Gestion des utilisateurs</h1>
                <p>Liste des utilisateurs inscrits.</p>

                {/* Liste des utilisateurs */}
                <ul className="user-list">
                    {users.length > 0 ? (
                        users.map((user) => (
                            <li key={user._id} className="user-item">
                                <div className="user-info">
                                    <img
                                        src={`https://i.pravatar.cc/40?u=${user.email}`} // Avatar fictif
                                        alt={`${user.nomPrenom}'s avatar`}
                                    />
                                    <span>{user.nomPrenom || user.name}</span>
                                    <span>({user.email})</span>
                                </div>
                                <div className="user-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => console.log('Modifier', user._id)}
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteUser(user._id)}
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>Aucun utilisateur trouvé.</p>
                    )}
                </ul>
            </section>

            {/* Section des invitations en attente */}
            <section>
                <h2>Invitations en attente</h2>
                <p>Gérez les demandes d'inscription en attente.</p>

                {/* Liste des invitations */}
                <ul className="invitation-list">
                    {invitations.length > 0 ? (
                        invitations.map((invitation) => (
                            <li key={invitation._id} className="invitation-item">
                                <div className="invitation-info">
                                    <span>{invitation.userId.nomPrenom || invitation.userId.name}</span>
                                    <span>({invitation.userId.email})</span>
                                </div>
                                <div className="invitation-actions">
                                    <button
                                        className="accept-btn"
                                        onClick={() => handleAcceptInvitation(invitation._id)}
                                    >
                                        Accepter
                                    </button>
                                    <button
                                        className="reject-btn"
                                        onClick={() => handleRejectInvitation(invitation._id)}
                                    >
                                        Refuser
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>Aucune invitation en attente.</p>
                    )}
                </ul>
            </section>
        </div>
    );
};

export default Users;