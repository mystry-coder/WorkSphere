import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ProfileCard } from '../components/ProfileCard';
import { ArrowLeft, Edit3, Briefcase, Calendar, CreditCard, Download, FileText, User, MapPin, Phone, Mail } from 'lucide-react';

import { getSimulatedUser } from '../api';
import { mockEmployee } from '../data/mockEmployee';
import type { Employee } from '../api';

export function EmployeeProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentRole = getSimulatedUser().role;

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        setEmployee(mockEmployee);
      } catch (err: any) {
        console.error('Error loading employee profile:', err);
        setError(err.response?.data?.error || 'Failed to load employee profile.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleDownload = (docName: string) => {
    alert(`Downloading ${docName}...\nThis document is fetched securely from the Worksphere HR vaults.`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4" />
        <p className="text-sm font-medium">Retrieving Worksphere dossier...</p>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-8 max-w-xl mx-auto text-center mt-12">
        <h3 className="text-lg font-bold text-red-900 mb-2">Access Restrained</h3>
        <p className="text-sm text-red-700 leading-relaxed">
          {error || "The profile could not be located, or your current role lacks permission to inspect this dossier."}
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            to="/"
            className="px-4 py-2 bg-white border border-red-200 text-red-700 hover:bg-red-100 rounded-lg text-sm font-semibold transition-colors"
          >
            Back to Safety
          </Link>
        </div>
      </div>
    );
  }

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return '₹ 0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8">
      {/* Back Button and Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to list
        </button>
        <Link
          to={`/employees/${employee.id}/edit`}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-750 rounded-lg transition-colors shadow-sm"
        >
          <Edit3 className="w-4 h-4" />
          Modify Details
        </Link>
      </div>

      {/* Hero Profile Banner Component */}
      <ProfileCard
        employee={employee}
        showEditButton={false}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Employment and Personal Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Employment details Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2 pb-3 border-b border-gray-100">
              <Briefcase className="w-5 h-5 text-blue-600" />
              Corporate Assignment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Employee ID</span>
                <span className="block text-sm font-mono font-bold text-gray-800 mt-1">
                  EMP-{String(employee.id).padStart(4, '0')}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Date of Joining</span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-gray-800 mt-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {employee.joiningDate || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Group Department</span>
                <span className="block text-sm font-medium text-gray-800 mt-1">
                  {employee.department}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Role Title / Designation</span>
                <span className="block text-sm font-medium text-gray-800 mt-1">
                  {employee.designation}
                </span>
              </div>
            </div>
          </div>

          {/* Payroll / Compensation Information Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2 pb-3 border-b border-gray-100">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Corporate Compensation (Read-Only)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Basic Salary</span>
                <span className="block text-md font-bold text-gray-800 mt-1.5">
                  {formatCurrency(employee.salary?.basicSalary)}
                </span>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Allowances</span>
                <span className="block text-md font-bold text-emerald-600 mt-1.5">
                  + {formatCurrency(employee.salary?.allowances)}
                </span>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Deductions</span>
                <span className="block text-md font-bold text-red-600 mt-1.5">
                  - {formatCurrency(employee.salary?.deductions)}
                </span>
              </div>
              <div className="bg-blue-50/40 border border-blue-100 p-4 rounded-xl">
                <span className="text-xs font-semibold uppercase text-blue-600 tracking-wider">Net Salary</span>
                <span className="block text-lg font-extrabold text-blue-700 mt-1.5">
                  {formatCurrency(employee.salary?.netSalary)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Documents and Sidebar */}
        <div className="space-y-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2 pb-3 border-b border-gray-100">
              <FileText className="w-5 h-5 text-blue-600" />
              Employment Documents
            </h3>
            <p className="text-xs text-gray-400 mb-4">Official PDF letters and identity credentials.</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-lg border border-gray-200 group hover:border-blue-500 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 text-red-600 rounded-md">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-gray-800">Offer Letter</span>
                    <span className="block text-[10px] text-gray-400 uppercase font-bold mt-0.5">PDF • 2.4 MB</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload('Offer Letter.pdf')}
                  className="p-2 text-gray-450 hover:text-blue-600 hover:bg-white rounded-md border border-transparent hover:border-gray-200 transition-all cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-lg border border-gray-200 group hover:border-blue-500 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 text-red-600 rounded-md">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-gray-800">Joining Letter</span>
                    <span className="block text-[10px] text-gray-400 uppercase font-bold mt-0.5">PDF • 1.8 MB</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload('Joining Letter.pdf')}
                  className="p-2 text-gray-450 hover:text-blue-600 hover:bg-white rounded-md border border-transparent hover:border-gray-200 transition-all cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-lg border border-gray-200 group hover:border-blue-500 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-gray-800">Identity Proof</span>
                    <span className="block text-[10px] text-gray-400 uppercase font-bold mt-0.5">PDF • 1.1 MB</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload('Identity Proof.pdf')}
                  className="p-2 text-gray-450 hover:text-blue-600 hover:bg-white rounded-md border border-transparent hover:border-gray-200 transition-all cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
