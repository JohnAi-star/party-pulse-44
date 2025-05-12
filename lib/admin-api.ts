import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

// Add auth token to requests if available
apiClient.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const { getToken }: any = await import('@clerk/nextjs');
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error - Backend server may be offline:', error.message);
      error.message = 'Unable to connect to the server. Please ensure the backend server is running.';
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error.message);
      error.message = 'Request timed out. Please try again.';
    }
    return Promise.reject(error);
  }
);

// ADMIN ENDPOINTS
export const activities = {
  getAll: async () => {
    const response = await apiClient.get('/admin/activities');
    return response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post('/admin/activities', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await apiClient.patch(`/admin/activities/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/admin/activities/${id}`);
    return response.data;
  }
};

export const reviews = {
  getAll: async () => {
    const response = await apiClient.get('/admin/reviews');
    return response.data;
  },
  approve: async (id: string) => {
    const response = await apiClient.patch(`/admin/reviews/${id}/approve`);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/admin/reviews/${id}`);
    return response.data;
  }
};

export const users = {
  getAll: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },
  updateRole: async (userId: string, role: string) => {
    const response = await apiClient.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },
  deactivate: async (userId: string) => {
    const response = await apiClient.patch(`/admin/users/${userId}/deactivate`);
    return response.data;
  }
};

export const analytics = {
  getStats: async () => {
    const response = await apiClient.get('/admin/analytics');
    return response.data;
  },
  getRecentActivity: async () => {
    const response = await apiClient.get('/admin/analytics/recent-activity');
    return response.data;
  }
};

// EXISTING BOOKINGS AND PAYMENTS EXPORTS
export const bookings = {
  create: async (data: { activityId: string; date: string; groupSize: number }) => {
    const response = await apiClient.post('/bookings', data);
    return response.data;
  },
  getUserBookings: async () => {
    const response = await apiClient.get('/bookings');
    return response.data;
  },
  getBooking: async (id: string) => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },
};

export const payments = {
  createCheckoutSession: async (bookingId: string) => {
    const response = await apiClient.post('/stripe/create-checkout-session', { bookingId });
    return response.data;
  },
};

export default apiClient;