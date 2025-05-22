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
  }
};

export const payments = {
  createCheckoutSession: async (bookingId: string) => {
    const response = await apiClient.post('/stripe/create-checkout-session', { bookingId });
    return response.data;
  },
};

export const favorites = {
  add: async (activityId: string) => {
    const response = await apiClient.post('/favorites', { activityId });
    return response.data;
  },
  remove: async (activityId: string) => {
    const response = await apiClient.delete(`/favorites/${activityId}`);
    return response.data;
  },
  getAll: async () => {
    const response = await apiClient.get('/favorites');
    return response.data;
  },
  check: async (activityId: string) => {
    const response = await apiClient.get(`/favorites/${activityId}`);
    return response.data;
  }
};

export const reviews = {
  create: async (data: { 
    activityId: string; 
    rating: number; 
    title: string;
    content: string;
    photos?: string[];
  }) => {
    const response = await apiClient.post('/reviews', data);
    return response.data;
  },
  vote: async (reviewId: string, isHelpful: boolean) => {
    const response = await apiClient.post(`/reviews/${reviewId}/vote`, { isHelpful });
    return response.data;
  },
  getForActivity: async (activityId: string) => {
    const response = await apiClient.get(`/reviews/activity/${activityId}`);
    return response.data;
  }
};

export const giftCards = {
  purchase: async (data: {
    amount: number;
    recipientName: string;
    recipientEmail: string;
    message?: string;
  }) => {
    const response = await apiClient.post('/gift-cards', data);
    return response.data;
  },
  redeem: async (code: string) => {
    const response = await apiClient.post(`/gift-cards/${code}/redeem`);
    return response.data;
  },
  getBalance: async (code: string) => {
    const response = await apiClient.get(`/gift-cards/${code}`);
    return response.data;
  }
};

export const groupBookings = {
  create: async (data: {
    activityId: string;
    organizerDetails: {
      name: string;
      email: string;
      phone: string;
    };
    bookingDetails: {
      groupSize: number;
      date: string;
      paymentType: string;
      specialRequirements?: string;
    };
    participantDetails?: Array<{
      name: string;
      email: string;
    }>;
  }) => {
    const response = await apiClient.post('/api/group-bookings', data);
    return response.data;
  },

  getByOrganizer: async () => {
    const response = await apiClient.get('/api/group-bookings/organizer');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/api/group-bookings/${id}`);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.patch(`/api/group-bookings/${id}`, data);
    return response.data;
  },

  cancel: async (id: string) => {
    const response = await apiClient.post(`/api/group-bookings/${id}/cancel`);
    return response.data;
  },

  addParticipant: async (id: string, participantData: { name: string; email: string }) => {
    const response = await apiClient.post(`/api/group-bookings/${id}/participants`, participantData);
    return response.data;
  },

  removeParticipant: async (id: string, participantId: string) => {
    const response = await apiClient.delete(`/api/group-bookings/${id}/participants/${participantId}`);
    return response.data;
  }
};

export const venues = {
  getAll: async () => {
    const response = await apiClient.get('/api/venues');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/api/venues/${id}`);
    return response.data;
  },

  getAvailability: async (id: string, month: string) => {
    const response = await apiClient.get(`/api/venues/${id}/availability`, {
      params: { month }
    });
    return response.data;
  },

  getFacilities: async (id: string) => {
    const response = await apiClient.get(`/api/venues/${id}/facilities`);
    return response.data;
  },

  getVirtualTour: async (id: string) => {
    const response = await apiClient.get(`/api/venues/${id}/virtual-tour`);
    return response.data;
  }
};

export const suppliers = {
  getAll: async () => {
    const response = await apiClient.get('/api/suppliers');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/api/suppliers/${id}`);
    return response.data;
  },
  getServices: async (id: string) => {
    const response = await apiClient.get(`/api/suppliers/${id}/services`);
    return response.data;
  },
  bookService: async (serviceId: string, data: {
    date: string;
    partyPlanId: string;
    requirements?: string;
  }) => {
    const response = await apiClient.post(`/api/suppliers/services/${serviceId}/book`, data);
    return response.data;
  }
};

export const partyPlanning = {
  createTimeline: async (data: {
    partyPlanId: string;
    title: string;
    description?: string;
    startTime: string;
    endTime?: string;
  }) => {
    const response = await apiClient.post('/api/party-timelines', data);
    return response.data;
  },
  getTimeline: async (partyPlanId: string) => {
    const response = await apiClient.get(`/api/party-timelines?partyPlanId=${partyPlanId}`);
    return response.data;
  },
  updateTimelineItem: async (id: string, data: {
    title?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    status?: string;
  }) => {
    const response = await apiClient.patch(`/api/party-timelines/${id}`, data);
    return response.data;
  },
  deleteTimelineItem: async (id: string) => {
    const response = await apiClient.delete(`/api/party-timelines/${id}`);
    return response.data;
  }
};

export default apiClient;