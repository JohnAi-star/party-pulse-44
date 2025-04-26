import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

export const bookings = {
  create: async (data: { activityId: string; date: string; groupSize: number }) => {
    const response = await apiClient.post('/bookings', data);
    return response.data;
  },
  getUserBookings: async () => {
    const response = await apiClient.get('/bookings');
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