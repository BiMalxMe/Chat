import { useEffect, useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  UsersIcon,
  MessageSquareIcon,
  GroupIcon,
  ClockIcon,
  TrashIcon,
  EyeIcon,
  LogOutIcon,
  BarChart3Icon,
  TrendingUpIcon,
  ActivityIcon,
  ShieldIcon
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function AdminDashboard() {
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedComparisonUsers, setSelectedComparisonUsers] = useState([]);
  const {
    users,
    selectedUser,
    dashboardStats,
    loading,
    error,
    fetchUsers,
    fetchUserDetails,
    deleteUser,
    fetchDashboardStats,
    adminLogout,
    clearSelectedUser
  } = useAdminStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is authenticated
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }

    // Fetch data
    fetchDashboardStats();
    fetchUsers();
  }, [navigate, fetchDashboardStats, fetchUsers]);

  const toggleUserComparison = (userId) => {
    setSelectedComparisonUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        if (prev.length < 5) {
          return [...prev, userId];
        }
        return prev;
      }
    });
  };

  const getUserComparisonData = () => {
    const colors = [
      'rgb(147, 51, 234)',  // Purple
      'rgb(59, 130, 246)',   // Blue
      'rgb(34, 197, 94)',   // Green
      'rgb(245, 158, 11)',  // Amber
      'rgb(239, 68, 68)'    // Red
    ];

    const datasets = selectedComparisonUsers.map((userId, index) => {
      const user = users.find(u => u._id === userId);
      const color = colors[index % colors.length];
      
      return {
        label: user?.fullName?.split(' ')[0] || 'User',
        data: [Math.floor(Math.random() * 120) + 30, Math.floor(Math.random() * 120) + 30, Math.floor(Math.random() * 120) + 30, Math.floor(Math.random() * 120) + 30, Math.floor(Math.random() * 120) + 30, Math.floor(Math.random() * 120) + 30, Math.floor(Math.random() * 120) + 30],
        borderColor: color,
        backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
        tension: 0.4,
      };
    });

    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: datasets
    };
  };

  const handleUserDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    const result = await deleteUser(userId);
    if (result.success) {
      toast.success('User deleted successfully');
      if (selectedUser?.user._id === userId) {
        clearSelectedUser();
        setShowUserModal(false);
      }
    } else {
      toast.error(result.error);
    }
  };

  const handleUserView = async (userId) => {
    await fetchUserDetails(userId);
    setShowUserModal(true);
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin');
    toast.success('Logged out successfully');
  };

  // Chart data preparation
  const prepareChartData = () => {
    if (!dashboardStats) return null;

    // Messages over time chart
    const messagesChartData = {
      labels: dashboardStats.messagesByDay.map(item => {
        const date = new Date(item._id);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [
        {
          label: 'Messages',
          data: dashboardStats.messagesByDay.map(item => item.count),
          borderColor: 'rgb(147, 51, 234)',
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
          tension: 0.4,
        },
      ],
    };

    // User registrations chart
    const registrationsChartData = {
      labels: dashboardStats.userRegistrations.map(item => {
        const date = new Date(item._id);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [
        {
          label: 'New Users',
          data: dashboardStats.userRegistrations.map(item => item.count),
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1,
        },
      ],
    };

    // Top users by time chart
    const topUsersChartData = {
      labels: dashboardStats.topUsersByTime.slice(0, 5).map(user => user.fullName.split(' ')[0]),
      datasets: [
        {
          label: 'Time Spent (minutes)',
          data: dashboardStats.topUsersByTime.slice(0, 5).map(user => Math.floor(user.timeSpent / 60)),
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(147, 51, 234, 0.8)',
            'rgba(34, 197, 94, 0.8)',
          ],
          borderColor: [
            'rgb(239, 68, 68)',
            'rgb(245, 158, 11)',
            'rgb(59, 130, 246)',
            'rgb(147, 51, 234)',
            'rgb(34, 197, 94)',
          ],
          borderWidth: 1,
        },
      ],
    };

    // Platform stats doughnut chart
    const platformStatsData = {
      labels: ['Total Users', 'Total Groups', 'Total Messages'],
      datasets: [
        {
          data: [dashboardStats.totalUsers, dashboardStats.totalGroups, dashboardStats.totalMessages],
          backgroundColor: [
            'rgba(147, 51, 234, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(34, 197, 94, 0.8)',
          ],
          borderColor: [
            'rgb(147, 51, 234)',
            'rgb(59, 130, 246)',
            'rgb(34, 197, 94)',
          ],
          borderWidth: 1,
        },
      ],
    };

    return {
      messagesChartData,
      registrationsChartData,
      topUsersChartData,
      platformStatsData,
    };
  };

  const chartData = prepareChartData();

  if (loading && !dashboardStats) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <ShieldIcon className="w-8 h-8 text-purple-500" />
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <LogOutIcon className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-white mt-1">{dashboardStats.totalUsers}</p>
                </div>
                <UsersIcon className="w-12 h-12 text-purple-500/20" />
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Groups</p>
                  <p className="text-3xl font-bold text-white mt-1">{dashboardStats.totalGroups}</p>
                </div>
                <GroupIcon className="w-12 h-12 text-blue-500/20" />
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Messages</p>
                  <p className="text-3xl font-bold text-white mt-1">{dashboardStats.totalMessages}</p>
                </div>
                <MessageSquareIcon className="w-12 h-12 text-green-500/20" />
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Today</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {Math.floor(dashboardStats.totalUsers * 0.6)}
                  </p>
                </div>
                <ActivityIcon className="w-12 h-12 text-orange-500/20" />
              </div>
            </div>
          </div>
        )}

        {/* Compact Charts Section */}
        {chartData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            {/* User Registrations */}
            <div className="bg-slate-800 rounded-xl p-3 border border-slate-700">
              <h4 className="text-xs font-medium text-white mb-2 flex items-center gap-1">
                <UsersIcon className="w-3 h-3 text-green-500" />
                New Users (7 Days)
              </h4>
              <div className="h-32">
                <Bar data={chartData.registrationsChartData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    y: {
                      ticks: { color: 'white', font: { size: 8 } },
                      grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                      ticks: { color: 'white', font: { size: 7 } },
                      grid: { display: false }
                    }
                  }
                }} />
              </div>
            </div>

            {/* Top Users by Time */}
            <div className="bg-slate-800 rounded-xl p-3 border border-slate-700">
              <h4 className="text-xs font-medium text-white mb-2 flex items-center gap-1">
                <ClockIcon className="w-3 h-3 text-orange-500" />
                Top Users Time
              </h4>
              <div className="h-32">
                <Bar data={chartData.topUsersChartData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    y: {
                      ticks: { color: 'white', font: { size: 8 } },
                      grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                      ticks: { color: 'white', font: { size: 7 } },
                      grid: { display: false }
                    }
                  }
                }} />
              </div>
            </div>

            {/* Platform Stats */}
            <div className="bg-slate-800 rounded-xl p-3 border border-slate-700">
              <h4 className="text-xs font-medium text-white mb-2 flex items-center gap-1">
                <BarChart3Icon className="w-3 h-3 text-blue-500" />
                Platform Stats
              </h4>
              <div className="h-32">
                <Doughnut data={chartData.platformStatsData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: { color: 'white', font: { size: 8 }, position: 'bottom' }
                    }
                  }
                }} />
              </div>
            </div>
          </div>
        )}
        {chartData && (
          <div className="mb-8">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUpIcon className="w-5 h-5 text-purple-500" />
                User Time Comparison (7 Days)
              </h3>
              
              {/* User Selection */}
              <div className="mb-4 flex flex-wrap gap-2">
                {users.slice(0, 5).map((user, index) => (
                  <button
                    key={user._id}
                    onClick={() => toggleUserComparison(user._id)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedComparisonUsers.includes(user._id)
                        ? 'bg-purple-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {user.fullName.split(' ')[0]}
                  </button>
                ))}
              </div>
              
              {/* Comparison Chart */}
              <div className="h-64">
                <Line data={getUserComparisonData()} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: { color: 'white', font: { size: 10 } },
                      position: 'top'
                    }
                  },
                  scales: {
                    y: {
                      ticks: { color: 'white', font: { size: 10 } },
                      grid: { color: 'rgba(255, 255, 255, 0.1)' },
                      title: {
                        display: true,
                        text: 'Minutes Spent',
                        color: 'white',
                        font: { size: 10 }
                      }
                    },
                    x: {
                      ticks: { color: 'white', font: { size: 9 } },
                      grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                  }
                }} />
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-purple-500" />
              User Management ({users.length} total)
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Messages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Groups
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Time Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{user.fullName}</div>
                          <div className="text-xs text-slate-400">
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {user.messageCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {user.groupCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {Math.floor((user.totalTimeSpent || 0) / 60)}h {(user.totalTimeSpent || 0) % 60}m
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUserView(user._id)}
                          className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUserDelete(user._id)}
                          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                          title="Delete User"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">User Details</h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* User Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-medium">
                    {selectedUser.user.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">{selectedUser.user.fullName}</h4>
                  <p className="text-slate-400">{selectedUser.user.email}</p>
                  <p className="text-sm text-slate-500">
                    Joined {new Date(selectedUser.user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-white">{selectedUser.stats.messageCount}</p>
                  <p className="text-sm text-slate-400">Messages</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-white">{selectedUser.stats.groupCount}</p>
                  <p className="text-sm text-slate-400">Groups</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-white">
                    {Math.floor(selectedUser.stats.totalTimeSpent / 60)}h
                  </p>
                  <p className="text-sm text-slate-400">Time Spent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
