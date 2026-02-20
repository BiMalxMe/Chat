import { useState } from 'react';
import { FlagIcon, XIcon } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

function ReportButton() {
  const { selectedUser } = useChatStore();
  const { authUser } = useAuthStore();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({
    title: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedUser) return null;

  const handleSubmitReport = async () => {
    if (!reportData.title.trim() || !reportData.description.trim()) {
      toast.error('Please fill in both title and description');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/reports', {
        reportedUserId: selectedUser._id,
        title: reportData.title.trim(),
        description: reportData.description.trim(),
      });

      toast.success('Report submitted successfully');
      setShowReportModal(false);
      setReportData({ title: '', description: '' });
    } catch (error) {
      console.error('Report submission error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to submit report';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowReportModal(true)}
        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
        title="Report User"
      >
        <FlagIcon className="w-5 h-5" />
      </button>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-md w-full">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Report User</h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-400 mt-2">
                Report <span className="font-medium text-red-400">{selectedUser.fullName}</span> for inappropriate behavior
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Report Title *
                </label>
                <input
                  type="text"
                  value={reportData.title}
                  onChange={(e) => setReportData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of the issue"
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  maxLength={100}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Detailed Description *
                </label>
                <textarea
                  value={reportData.description}
                  onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide detailed information about the incident..."
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
                  rows={4}
                  maxLength={500}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReport}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReportButton;
