import React, { useEffect, useState } from 'react';
import { Users, FileClock, ShieldCheck, Layers, PlusCircle, ArrowUpDown } from 'lucide-react';
import { EmployeeTable } from '../components/EmployeeTable';
import type { Employee, api } from '../api.js';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

function StatCard({ icon, label, value, change, changeType = 'neutral' }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs flex items-center justify-between">
      <div className="space-y-2">
        <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider block">{label}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">{value}</span>
          {change && (
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
              changeType === 'positive' ? 'bg-emerald-50 text-emerald-700' :
              changeType === 'negative' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {change}
            </span>
          )}
        </div>
      </div>
      <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
        {icon}
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEmployees = async (search?: string) => {
    setIsLoading(true);
    try {
      const data = await api.getEmployeesList(search);
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employee directory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchEmployees(term);
  };

  // Determine unique departments from employees list (or default 6)
  const departmentsCount = new Set(employees.map(e => e.department)).size || 6;

  return (
    <div className="space-y-8">
      {/* Welcome & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-950">HR Admin Console</h1>
          <p className="text-gray-500 text-sm mt-1">Review operational metrics and employee dossiers.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users className="w-6 h-6 text-blue-600" />}
          label="Employees"
          value="52"
          change={`+${employees.length} Active`}
          changeType="positive"
        />
        <StatCard
          icon={<FileClock className="w-6 h-6 text-indigo-650" />}
          label="Pending Leaves"
          value="4"
          change="Requires Review"
          changeType="neutral"
        />
        <StatCard
          icon={<ShieldCheck className="w-6 h-6 text-emerald-650" />}
          label="Present Today"
          value="48"
          change="92.3% Attendance"
          changeType="positive"
        />
        <StatCard
          icon={<Layers className="w-6 h-6 text-purple-650" />}
          label="Departments"
          value={departmentsCount}
          change="6 core groups"
          changeType="neutral"
        />
      </div>

      {/* Directory Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Directory and Control Table</h2>
        </div>
        <EmployeeTable
          employees={employees}
          onSearch={handleSearch}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
