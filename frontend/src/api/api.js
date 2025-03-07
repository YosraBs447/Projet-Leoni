import axios from "axios";

// Créez une instance Axios avec l'URL de base du backend
const apiClient = axios.create({
    baseURL: "http://localhost:3000/api", // URL de votre backend
    headers: {
        "Content-Type": "application/json",
    },
});

// Ajoutez un token JWT aux requêtes (si nécessaire)
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // Récupérez le token depuis le stockage local
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Récupérer tous les utilisateurs
export const getAllUsers = async () => {
    try {
        const response = await apiClient.get('/admin/users'); // Appel GET vers /api/admin/users
        return response.data; // Renvoie les données JSON
    } catch (error) {
        throw new Error('Erreur lors de la récupération des utilisateurs.');
    }
};

// Supprimer un utilisateur
export const deleteUser = async (userId) => {
    try {
        await apiClient.delete(`/admin/users/${userId}`); // Appel DELETE vers /api/admin/users/:userId
    } catch (error) {
        throw new Error('Erreur lors de la suppression de l\'utilisateur.');
    }
};

// Récupérer les invitations en attente
export const fetchPendingInvitations = async () => {
    try {
        const response = await apiClient.get('/admin/invitations');
        return response.data;
    } catch (error) {
        throw new Error('Erreur lors de la récupération des invitations.');
    }
};

// Mettre à jour le statut d'une invitation (accepter ou refuser)
export const updateInvitationStatus = async (invitationId, action) => {
    try {
        await apiClient.put(`/admin/invitations/${invitationId}`, { action });
    } catch (error) {
        throw new Error('Erreur lors de la mise à jour du statut de l\'invitation.');
    }
};