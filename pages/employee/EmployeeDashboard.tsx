
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { LeaveType, LeaveStatus, LeaveRequest } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { generateLeaveRequestReason } from '../../services/geminiService';
import ClockIcon from '../../components/icons/ClockIcon';
import CalendarIcon from '../../components/icons/CalendarIcon';

const StatusBadge: React.FC<{ status: LeaveStatus }> = ({ status }) => {
    const colorClasses = {
      [LeaveStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      [LeaveStatus.APPROVED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      [LeaveStatus.REJECTED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[status]}`}>{status}</span>;
};


const EmployeeDashboard: React.FC = () => {
  const { currentUser, leaveRequests, addLeaveRequest } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveType>(LeaveType.ANNUAL);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [aiContext, setAiContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const userRequests = useMemo(() => 
    leaveRequests.filter(req => req.userId === currentUser?.id), 
  [leaveRequests, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
        addLeaveRequest({
            userId: currentUser.id,
            leaveType,
            startDate,
            endDate,
            reason
        });
        setIsModalOpen(false);
        setLeaveType(LeaveType.ANNUAL);
        setStartDate('');
        setEndDate('');
        setReason('');
        setAiContext('');
    }
  };
  
  const handleGenerateReason = async () => {
    setIsGenerating(true);
    const generatedReason = await generateLeaveRequestReason(leaveType, aiContext);
    setReason(generatedReason);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Dashboard</h1>

      {/* Leave Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentUser && Object.entries(currentUser.leaveBalances).map(([type, balance]) => (
          <Card key={type}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{type} Leave</p>
                <p className="text-3xl font-bold">{balance} <span className="text-lg font-medium">days</span></p>
              </div>
              <CalendarIcon className="h-10 w-10 text-blue-500"/>
            </div>
          </Card>
        ))}
      </div>

      {/* Leave Requests History */}
      <Card title="My Leave History">
          <div className="flex justify-end mb-4">
              <Button onClick={() => setIsModalOpen(true)}>Apply for Leave</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {userRequests.map((req: LeaveRequest) => (
                  <tr key={req.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{req.leaveType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{req.startDate} to {req.endDate}</td>
                    <td className="px-6 py-4 text-sm max-w-xs truncate">{req.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={req.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </Card>
      
      {/* Apply Leave Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Apply for Leave">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Leave Type</label>
            <select id="leaveType" value={leaveType} onChange={(e) => setLeaveType(e.target.value as LeaveType)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700">
              {Object.values(LeaveType).map(lt => <option key={lt} value={lt}>{lt}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Input label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
             <Input label="End Date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
          </div>
          <div>
             <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reason</label>
             <textarea id="reason" value={reason} onChange={e => setReason(e.target.value)} rows={3} className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700" required></textarea>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-gray-700/50 rounded-lg space-y-2">
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">✨ AI Assistant</p>
            <Input label="What is this leave for? (e.g., family trip, medical appointment)" value={aiContext} onChange={e => setAiContext(e.target.value)} placeholder="Provide some context..."/>
            <Button type="button" variant="secondary" onClick={handleGenerateReason} isLoading={isGenerating} disabled={!aiContext}>Generate Reason</Button>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default EmployeeDashboard;
