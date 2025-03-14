import axios from "axios";
import jwtDecode from "jwt-decode";

const apiClient = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
});

// Intercepteur de requête
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem("token");

    if (token) {
        try {
            const decoded = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem("token");
                window.location.href = "/login?expired=true";
                return Promise.reject(new Error("Token expiré"));
            }
            config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
            console.error("JWT invalide :", error);
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
    }
    return config;
}, error => Promise.reject(error));

// Intercepteur de réponse
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            console.warn("Accès refusé (401), redirection vers login...");
            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);
        }
        if (error.response?.status === 403) {
            console.warn("Accès interdit (403), redirection...");
            setTimeout(() => {
                window.location.href = "/access-denied";
            }, 1000);
        }
        return Promise.reject(error);
    }
);

// 🔹 Fonctions API
export const fetchPendingInvitations = async () => {
    try {
        const response = await apiClient.get('/invitations?status=pending');
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'accès aux invitations:", error);
        throw new Error('Accès aux invitations refusé');
    }
};

export const updateInvitationStatus = async (invitationId, action, rejectionReason = "") => {
    if (!invitationId || !action) {
        throw new Error("❌ Paramètres manquants");
    }

    try {
        if (!["accept", "reject"].includes(action)) {
            throw new Error("❌ Action invalide: doit être 'accept' ou 'reject'");
        }

        const payload = { action };

        // Si l'action est 'reject', ajouter rejectionReason au payload
        if (action === "reject" && !rejectionReason.trim()) {
            payload.rejectionReason = rejectionReason;
        }

        const response = await apiClient.patch(`/invitations/${invitationId}/status`, payload);
        return response.data;
    } catch (error) {
        console.error("❌ Erreur API:", error.response?.data || error.message);
        throw new Error("Erreur lors de l'appel API: " + (error.response?.data?.message || error.message));
    }
};

export default apiClient;
