const API_BASE_URL = 'http://localhost:5000/api';

// Lodge API
export const lodgeAPI = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/lodges`);
        return response.json();
    },

    getBySlug: async (slug) => {
        const response = await fetch(`${API_BASE_URL}/lodges/${slug}`);
        return response.json();
    },

    create: async (lodgeData) => {
        const response = await fetch(`${API_BASE_URL}/lodges`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lodgeData)
        });
        return response.json();
    },

    update: async (id, lodgeData) => {
        const response = await fetch(`${API_BASE_URL}/lodges/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lodgeData)
        });
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/lodges/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    }
};

// Booking API
export const bookingAPI = {
    getAll: async (filters = {}) => {
        const params = new URLSearchParams(filters);
        const response = await fetch(`${API_BASE_URL}/bookings?${params}`);
        return response.json();
    },

    getById: async (bookingId) => {
        const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`);
        return response.json();
    },

    create: async (bookingData) => {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });
        return response.json();
    },

    updateStatus: async (bookingId, status) => {
        const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        return response.json();
    }
};

// Dashboard API
export const dashboardAPI = {
    getStats: async (lodgeId = null) => {
        const params = lodgeId ? `?lodgeId=${lodgeId}` : '';
        const response = await fetch(`${API_BASE_URL}/dashboard/stats${params}`);
        return response.json();
    }
};

// Auth API
export const authAPI = {
    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return response.json();
    }
};

// User API
export const userAPI = {
    getProfile: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/users/profile/${userId}`);
        return response.json();
    },

    updateProfile: async (userId, profileData) => {
        const response = await fetch(`${API_BASE_URL}/users/profile/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        });
        return response.json();
    },

    updatePassword: async (userId, passwordData) => {
        const response = await fetch(`${API_BASE_URL}/users/password/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(passwordData)
        });
        return response.json();
    }
};

export default { lodgeAPI, bookingAPI, dashboardAPI, authAPI, userAPI };

