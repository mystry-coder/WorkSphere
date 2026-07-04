import React, { useState } from 'react';
import { Search, Eye, Edit3, User, Briefcase, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Employee } from '../api';

interface EmployeeTableProps {
  employees: Employee[];
  onSearch: (term: string) => void;
  isLoading: boolean;
}

export function EmployeeTable({ employees, onSearch, isLoading }: EmployeeTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearch(val); // Real-time search filter
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header and Search */}
      <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Worksphere Directory</h3>
          <p className="text-sm text-gray-500 mt-1">Manage and view all employee profiles.</p>
        </div>
        <form onSubmit={handleSearchSubmit} className="relative max-w-sm w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by ID or name..."
            value={searchTerm}
            onChange={handleInputChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-800"
          />
        </form>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4" />
            <p className="text-sm">Fetching employee records...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500 text-center">
            <User className="h-12 w-12 text-gray-300 mb-3" />
            <h4 className="text-md font-semibold text-gray-700">No employees found</h4>
            <p className="text-sm text-gray-400 max-w-xs mt-1">Try refining your search by typing a name or numerical Employee ID.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                  ID / User
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                  Designation
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                  Email & Phone
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50/75 transition-colors duration-150 group">
                  {/* ID & Avatar / Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {emp.profilePicUrl ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover border border-gray-200"
                            src={emp.profilePicUrl}
                            alt={emp.name}
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100">
                            {emp.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-blue-600 underline underline-offset-4 decoration-transparent group-hover:decoration-blue-200 transition-all">
                          {emp.name}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          EMP-{String(emp.id).padStart(4, '0')}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      {emp.department}
                    </span>
                  </td>

                  {/* Designation */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span>{emp.designation}</span>
                    </div>
                  </td>

                  {/* Email & Phone */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span className="flex items-center gap-1 text-gray-600">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {emp.id === 2 ? 'john@worksphere.com' : `${emp.name.toLowerCase().replace(/\s+/g, '.')}@worksphere.com`}
                      </span>
                      <span className="text-xs text-gray-400 mt-0.5">{emp.phone}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/employees/${emp.id}`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-650 bg-blue-50 hover:bg-blue-100 rounded-md cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Profile
                      </button>
                      <button
                        onClick={() => navigate(`/employees/${emp.id}/edit`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {!isLoading && employees.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 flex items-center justify-between border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Showing 1-{employees.length} of {employees.length} employees
          </p>
          <div className="flex gap-2">
            <button 
              className="px-3 py-1 bg-white border border-gray-200 rounded-md text-xs font-bold text-gray-400 cursor-not-allowed disabled:opacity-50" 
              disabled
            >
              Prev
            </button>
            <button 
              className="px-3 py-1 bg-white border border-gray-200 rounded-md text-xs font-bold text-gray-400 cursor-not-allowed disabled:opacity-50" 
              disabled
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
