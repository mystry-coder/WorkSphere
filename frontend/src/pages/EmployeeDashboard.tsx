import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Calendar, FileText, CheckCircle, Clock, X, Info } from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';
import { RecentActivity } from '../components/RecentActivity';
import type { Employee } from '../api';
import { setSimulatedUser } from '../api';

interface EmployeeDashboardProps {
  employee: Employee;
  onRefreshUser: () => void;
}

export function EmployeeDashboard({ employee, onRefreshUser }: EmployeeDashboardProps) {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<'attendance' | 'leave' | null>(null);

  const handleLogout = () => {
    // Standard sign out workflow simulation
    if (window.confirm('Are you sure you want to log out from Worksphere?')) {
      // For demo, logging out resets simulator to default Employee view
      setSimulatedUser('EMPLOYEE', 2);
      onRefreshUser();
      navigate('/');
      alert('You have successfully logged out from this session.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12">
          <FileText className="w-96 h-96" />
        </div>
        <div className="relative z-10">
          <span className="text-blue-100 text-xs font-semibold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
            Employee Workspace
          </span>
          <h1 className="text-3xl font-bold mt-4">Welcome Back, {employee.name}</h1>
          <p className="text-blue-150 mt-2 font-medium flex items-center gap-1.5 text-sm sm:text-base">
            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{String(employee.id).padStart(4, '0')}</span>
            <span>{employee.designation}</span>
            <span className="text-blue-200">•</span>
            <span>{employee.department}</span>
          </p>
        </div>
      </div>

      {/* Grid of Action Cards */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            iconName="User"
            title="My Profile"
            description="View salary details, download documents, and modify your contact information."
            onClick={() => navigate(`/employees/${employee.id}`)}
          />
          <DashboardCard
            iconName="Clock"
            title="Attendance"
            description="View your clock-in status, history, work hours, and attendance logs."
            onClick={() => setActiveModal('attendance')}
            badge="Present"
            badgeColor="bg-emerald-50 text-emerald-700 border border-emerald-100"
          />
          <DashboardCard
            iconName="Calendar"
            title="Leave Requests"
            description="Submit or monitor your annual leaves, sick days, and request logs."
            onClick={() => setActiveModal('leave')}
            badge="1 Approved"
            badgeColor="bg-blue-50 text-blue-700 border border-blue-100"
          />
          <DashboardCard
            iconName="LogOut"
            title="Logout"
            description="Safely end your Worksphere session and lock access to this profile."
            onClick={handleLogout}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-800 font-semibold mb-3">
              <Info className="w-5 h-5 text-blue-600" />
              <h3>Need Assistance?</h3>
            </div>
            <p className="text-sm text-blue-700 leading-relaxed">
              If any employment information (such as basic salary, allowances, or joining date) is incorrect, please contact your HR representative to request an update. Employees have read-only access to corporate details.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-blue-100 flex items-center justify-between text-xs text-blue-600 font-medium">
            <span>HR Hotline: +91 33 2412 8080</span>
            <span>hr@worksphere.com</span>
          </div>
        </div>
      </div>

      {/* Modals for Attendance/Leave Module notification */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    {activeModal === 'attendance' ? <Clock className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {activeModal === 'attendance' ? 'Attendance Logs' : 'Leave Records'}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {activeModal === 'attendance' ? (
                  <>
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-emerald-900 text-sm">Status: Clocked In</h4>
                        <p className="text-xs text-emerald-700 mt-0.5">You checked in today at 09:15 AM from Kolkata (New Town Office IP).</p>
                      </div>
                    </div>
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Weekly Summary</h4>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <span className="block text-xl font-bold text-gray-800">38.5 hrs</span>
                          <span className="text-[10px] text-gray-400 font-semibold uppercase">Total Hours</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <span className="block text-xl font-bold text-emerald-600">100%</span>
                          <span className="text-[10px] text-gray-400 font-semibold uppercase">On-time rate</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                      <div className="flex justify-between items-center text-sm font-semibold text-blue-900">
                        <span>Casual Leave</span>
                        <span className="text-xs bg-blue-100 px-2 py-0.5 rounded text-blue-700">6 Days Left</span>
                      </div>
                      <div className="w-full bg-blue-150 h-2 rounded-full mt-2 overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: '40%' }} />
                      </div>
                    </div>
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Pending Requests</h4>
                      <p className="text-sm text-gray-500 italic">No pending leave requests. Last request was approved on June 28th.</p>
                    </div>
                  </>
                )}
                <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-lg text-xs text-amber-800 leading-relaxed mt-4">
                  Note: Attendance and leave management actions are handled in separate dedicated modules. This page provides a read-only integration dashboard.
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 text-right">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-white border border-gray-250 text-gray-700 hover:bg-gray-50 text-sm font-medium rounded-lg cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
