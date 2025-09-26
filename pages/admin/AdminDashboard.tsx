import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { LeaveRequest, LeaveStatus } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { generateLeaveRejectionReason } from '../../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ClockIcon from '../../components/icons/ClockIcon';
import UsersIcon from '../../components/icons/UsersIcon';
// FIX: Import the missing `Input` component.
import Input from '../../components/common/Input';

const StatusBadge: React.FC<{ status: LeaveStatus }> = ({ status }) => {
    const colorClasses = {
      [LeaveStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      [LeaveStatus.APPROVED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      [LeaveStatus.REJECTED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[status]}`}>{status}</span>;
};

const AdminDashboard: React.FC = () => {
  const { users, leaveRequests, updateLeaveRequestStatus } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [aiRejectionContext, setAiRejectionContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const pendingRequests = useMemo(() => 
    leaveRequests.filter(req => req.status === LeaveStatus.PENDING),
  [leaveRequests]);
  
  const allOtherRequests = useMemo(() =>
    leaveRequests.filter(req => req.status !== LeaveStatus.PENDING).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()),
  [leaveRequests]);
  
  const chartData = useMemo(() => {
    const months: { [key: string]: number } = { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 };
    leaveRequests.forEach(req => {
        if (req.status === LeaveStatus.APPROVED) {
            const month = new Date(req.startDate).toLocaleString('default', { month: 'short' });
            months[month] += 1;
        }
    });
    return Object.entries(months).map(([name, leaves]) => ({ name, leaves }));
  }, [leaveRequests]);

  const handleApprove = (id: string) => {
    updateLeaveRequestStatus(id, LeaveStatus.APPROVED);
  };
  
  const handleRejectClick = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (selectedRequest) {
      updateLeaveRequestStatus(selectedRequest.id, LeaveStatus.REJECTED, rejectionReason);
      setIsModalOpen(false);
      setSelectedRequest(null);
      setRejectionReason('');
      setAiRejectionContext('');
    }
  };

  const handleGenerateReason = async () => {
    if (!selectedRequest) return;
    setIsGenerating(true);
    const generatedReason = await generateLeaveRejectionReason(
      selectedRequest.userName,
      selectedRequest.leaveType,
      selectedRequest.startDate,
      selectedRequest.endDate,
      aiRejectionContext
    );
    setRejectionReason(generatedReason);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Employees</p>
                <p className="text-3xl font-bold">{users.length -1}</p>
              </div>
              <UsersIcon className="h-10 w-10 text-green-500"/>
            </div>
        </Card>
        <Card>
           <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Requests</p>
                <p className="text-3xl font-bold">{pendingRequests.length}</p>
              </div>
              <ClockIcon className="h-10 w-10 text-yellow-500"/>
            </div>
        </Card>
      </div>
      
      {/* Pending Requests Table */}
      <Card title="Pending Leave Requests">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {pendingRequests.map(req => (
                <tr key={req.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{req.userName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{req.leaveType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{req.startDate} to {req.endDate}</td>
                  <td className="px-6 py-4 text-sm max-w-xs truncate">{req.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center space-x-2">
                    <Button variant="success" size="sm" onClick={() => handleApprove(req.id)}>Approve</Button>
                    <Button variant="danger" size="sm" onClick={() => handleRejectClick(req)}>Reject</Button>
                  </td>
                </tr>
              ))}
               {pendingRequests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500 dark:text-gray-400">No pending requests.</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Analytics and History */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Approved Leaves per Month">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="name" className="text-xs fill-current text-gray-600 dark:text-gray-400" />
                    <YAxis className="text-xs fill-current text-gray-600 dark:text-gray-400" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', color: '#fff' }}/>
                    <Legend />
                    <Bar dataKey="leaves" fill="#3b82f6" />
                </BarChart>
            </ResponsiveContainer>
        </Card>
         <Card title="All Requests History">
            <div className="overflow-y-auto h-80">
                 <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                         <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Employee</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                         </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {allOtherRequests.map(req => (
                             <tr key={req.id}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">{req.userName}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">{req.startDate}</td>
                                <td className="px-4 py-2 whitespace-nowrap"><StatusBadge status={req.status} /></td>
                             </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
         </Card>
      </div>

      {/* Rejection Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Reject Leave Request">
        <div className="space-y-4">
          <p>You are about to reject the leave request for <span className="font-semibold">{selectedRequest?.userName}</span> from <span className="font-semibold">{selectedRequest?.startDate}</span> to <span className="font-semibold">{selectedRequest?.endDate}</span>.</p>
          <div>
            <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reason for Rejection</label>
            <textarea id="rejectionReason" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} rows={3} className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700" required></textarea>
          </div>
          
           <div className="p-4 bg-blue-50 dark:bg-gray-700/50 rounded-lg space-y-2">
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">✨ AI Assistant</p>
            <Input label="Why is this being rejected? (e.g., project deadlines, team availability)" value={aiRejectionContext} onChange={e => setAiRejectionContext(e.target.value)} placeholder="Provide context..."/>
            <Button type="button" variant="secondary" onClick={handleGenerateReason} isLoading={isGenerating} disabled={!aiRejectionContext}>Generate Reason</Button>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="button" variant="danger" onClick={handleConfirmReject} disabled={!rejectionReason}>Confirm Rejection</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;