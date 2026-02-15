import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

const useAdminStore = create((set) => ({
  isAdmin: false,
  adminToken: null,
  users: [],
  selectedUser: null,
  dashboardStats: null,
  loading: false,
  error: null,

  adminLogin: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/admin/login', { email, password });
      const { token } = response.data;
      
      localStorage.setItem('adminToken', token);
      set({ 
        isAdmin: true, 
        adminToken: token,
        loading: false 
      });
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ 
        error: message, 
        loading: false 
      });
      return { success: false, error: message };
    }
  },

  adminLogout: () => {
    localStorage.removeItem('adminToken');
    set({
      isAdmin: false,
      adminToken: null,
      users: [],
      selectedUser: null,
      dashboardStats: null,
      error: null
    });
  },

  checkAdminAuth: () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      set({ isAdmin: true, adminToken: token });
    }
  },

  fetchUsers: async () => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) return;

    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/admin/users', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      set({ 
        users: response.data, 
        loading: false 
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch users';
      set({ 
        error: message, 
        loading: false 
      });
    }
  },

  fetchUserDetails: async (userId) => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) return;

    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      set({ 
        selectedUser: response.data, 
        loading: false 
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch user details';
      set({ 
        error: message, 
        loading: false 
      });
    }
  },

  deleteUser: async (userId) => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) return;

    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      set(state => ({
        users: state.users.filter(user => user._id !== userId),
        loading: false
      }));
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete user';
      set({ 
        error: message, 
        loading: false 
      });
      return { success: false, error: message };
    }
  },

  fetchDashboardStats: async () => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) return;

    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/admin/dashboard/stats', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      set({ 
        dashboardStats: response.data, 
        loading: false 
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch dashboard stats';
      set({ 
        error: message, 
        loading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
  clearSelectedUser: () => set({ selectedUser: null })
}));

export { useAdminStore };
export default useAdminStore;
