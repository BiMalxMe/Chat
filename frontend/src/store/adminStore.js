import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

const useAdminStore = create((set) => ({
  isAdmin: false,
  adminToken: null,
  users: [],
  selectedUser: null,
  dashboardStats: null,
  reports: [],
  reportsPagination: null,
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
      reports: [],
      reportsPagination: null,
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

  fetchReports: async (page = 1, status = '') => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) return;

    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams({ page: page.toString() });
      if (status) params.append('status', status);
      
      const response = await axiosInstance.get(`/admin/reports?${params}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      set({ 
        reports: response.data.reports, 
        reportsPagination: response.data.pagination,
        loading: false 
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch reports';
      set({ 
        error: message, 
        loading: false 
      });
    }
  },

  updateReportStatus: async (reportId, status) => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) return { success: false, error: 'Not authenticated' };

    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/admin/reports/${reportId}`, 
        { status },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      
      set(state => ({
        reports: state.reports.map(report => 
          report._id === reportId ? response.data.report : report
        ),
        loading: false
      }));
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update report status';
      set({ 
        error: message, 
        loading: false 
      });
      return { success: false, error: message };
    }
  },

  deleteReport: async (reportId) => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) return { success: false, error: 'Not authenticated' };

    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      set(state => ({
        reports: state.reports.filter(report => report._id !== reportId),
        loading: false
      }));
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete report';
      set({ 
        error: message, 
        loading: false 
      });
      return { success: false, error: message };
    }
  },

  clearError: () => set({ error: null }),
  clearSelectedUser: () => set({ selectedUser: null })
}));

export { useAdminStore };
export default useAdminStore;
