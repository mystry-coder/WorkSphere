import React from 'react';
import { Mail, Phone, MapPin, Briefcase, Calendar } from 'lucide-react';
import type { Employee } from '../api';

interface ProfileCardProps {
  employee: Employee;
  onEditClick?: () => void;
  showEditButton?: boolean;
}

export function ProfileCard({ employee, onEditClick, showEditButton = true }: ProfileCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Visual cover block */}
      <div className="h-32 bg-slate-800 relative" />

      {/* Avatar & Basic details row */}
      <div className="px-6 pb-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <div className="h-28 w-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
              {employee.profilePicUrl ? (
                <img
                  src={employee.profilePicUrl}
                  alt={employee.name}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-full w-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-3xl">
                  {employee.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="sm:pb-2">
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">{employee.name}</h2>
              <p className="text-sm font-medium text-gray-550 flex items-center gap-1.5 justify-center sm:justify-start mt-1">
                <Briefcase className="w-4 h-4 text-gray-400" />
                {employee.designation} | {employee.department}
              </p>
            </div>
          </div>

          {showEditButton && onEditClick && (
            <button
              onClick={onEditClick}
              className="mt-4 sm:mt-0 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-750 rounded-lg cursor-pointer transition-colors shadow-xs"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200 text-sm">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="block text-xs text-gray-400 uppercase tracking-wider font-semibold">Email</span>
              <span className="text-gray-700 mt-0.5 block">
                {employee.id === 2 ? 'john@worksphere.com' : `${employee.name.toLowerCase().replace(/\s+/g, '.')}@worksphere.com`}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="block text-xs text-gray-400 uppercase tracking-wider font-semibold">Phone</span>
              <span className="text-gray-700 mt-0.5 block">{employee.phone || 'N/A'}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="block text-xs text-gray-400 uppercase tracking-wider font-semibold">Address</span>
              <span className="text-gray-700 mt-0.5 block">{employee.address || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
