import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, CheckCircle, Info, Calendar } from 'lucide-react';
import { api, getSimulatedUser } from '../api';
import type { Employee } from '../api';

export function EditProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Fields State
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [joiningDate, setJoiningDate] = useState('');

  // Salary Sub-fields (Admin Only)
  const [basicSalary, setBasicSalary] = useState<number>(0);
  const [allowances, setAllowances] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);

  const currentUser = getSimulatedUser();
  const isAdmin = currentUser.role === 'ADMIN';

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        if (!id) return;
        const data = await api.getEmployee(parseInt(id, 10));
        setEmployee(data);

        // Populate fields
        setName(data.name || '');
        setDepartment(data.department || '');
        setDesignation(data.designation || '');
        setPhone(data.phone || '');
        setAddress(data.address || '');
        setProfilePicUrl(data.profilePicUrl || '');
        setJoiningDate(data.joiningDate || '');

        if (data.salary) {
          setBasicSalary(data.salary.basicSalary || 0);
          setAllowances(data.salary.allowances || 0);
          setDeductions(data.salary.deductions || 0);
        }
      } catch (err: any) {
        console.error('Error fetching employee for editing:', err);
        setErrorMessage(err.response?.data?.error || 'Failed to load employee details for edit.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !employee) return;

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      let payload: Partial<Employee> = {};

      if (isAdmin) {
        // Admin updates everything
        payload = {
          name,
          department,
          designation,
          phone,
          address,
          profilePicUrl,
          joiningDate,
          salary: {
            basicSalary: Number(basicSalary),
            allowances: Number(allowances),
            deductions: Number(deductions),
          },
        };
      } else {
        // Employee updates only phone, address, profilePicUrl
        payload = {
          phone,
          address,
          profilePicUrl,
        };
      }

      await api.updateEmployee(parseInt(id, 10), payload);
      setSuccessMessage('Profile saved successfully! Redirecting...');
      setTimeout(() => {
        navigate(`/employees/${id}`);
      }, 1500);
    } catch (err: any) {
      console.error('Error saving profile changes:', err);
      setErrorMessage(err.response?.data?.error || 'Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4" />
        <p className="text-sm font-medium">Opening worksphere form editor...</p>
      </div>
    );
  }

  if (errorMessage && !employee) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-8 max-w-xl mx-auto text-center mt-12">
        <h3 className="text-lg font-bold text-red-900 mb-2">Access Denied</h3>
        <p className="text-sm text-red-700 leading-relaxed">{errorMessage}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-4 py-2 bg-white border border-red-200 text-red-700 hover:bg-red-100 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header and Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Cancel and go back
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="bg-slate-800 p-6 text-white">
          <h2 className="text-xl font-bold">Edit Worksphere Profile</h2>
          <p className="text-blue-100 text-sm mt-1">
            {isAdmin 
              ? 'Administrator Mode: Fully authorized to update employment and compensation files.' 
              : 'Employee Mode: You may update your contact credentials and profile avatar only.'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* System Messages */}
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 text-emerald-800 text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-800 text-sm">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* SECTION 1: Personal Coordinates */}
          <div className="space-y-4">
            <h3 className="text-md font-bold text-gray-800 uppercase tracking-wider border-b border-gray-200 pb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isAdmin}
                  className="mt-1 block w-full px-3.5 py-2 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-800 focus:outline-hidden focus:border-blue-500 focus:bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
                />
                {!isAdmin && (
                  <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                    <Info className="w-3 h-3" /> Locked for employee accounts.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Contact Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 block w-full px-3.5 py-2 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700">Profile Picture URL</label>
                <input
                  type="url"
                  value={profilePicUrl}
                  onChange={(e) => setProfilePicUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="mt-1 block w-full px-3.5 py-2 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-mono text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700">Residential Address</label>
                <textarea
                  rows={3}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 block w-full px-3.5 py-2 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Corporate Assignment (Admin Only editable) */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-md font-bold text-gray-800 uppercase tracking-wider border-b border-gray-200 pb-2">
              Employment Records
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Department</label>
                {isAdmin ? (
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="mt-1 block w-full px-3.5 py-2 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Design">Design</option>
                    <option value="Finance">Finance</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    disabled
                    value={department}
                    className="mt-1 block w-full px-3.5 py-2 border border-gray-200 rounded-md text-sm bg-gray-100 text-gray-400 focus:outline-hidden"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Designation / Job Title</label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  disabled={!isAdmin}
                  className="mt-1 block w-full px-3.5 py-2 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-800 focus:outline-hidden focus:border-blue-500 focus:bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Date of Joining</label>
                <input
                  type="date"
                  required
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  disabled={!isAdmin}
                  className="mt-1 block w-full px-3.5 py-2 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-800 focus:outline-hidden focus:border-blue-500 focus:bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Compensation (Admin Only editable) */}
          {isAdmin && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-md font-bold text-gray-800 uppercase tracking-wider border-b border-gray-200 pb-2 flex items-center gap-2">
                Payroll Structure (Admin Only)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Basic Monthly Salary (INR)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(Number(e.target.value))}
                    className="mt-1 block w-full px-3.5 py-2 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">Allowances (INR)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={allowances}
                    onChange={(e) => setAllowances(Number(e.target.value))}
                    className="mt-1 block w-full px-3.5 py-2 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">Deductions (INR)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={deductions}
                    onChange={(e) => setDeductions(Number(e.target.value))}
                    className="mt-1 block w-full px-3.5 py-2 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Dynamic Live Calculation preview */}
              <div className="bg-blue-50 border border-blue-150 p-4 rounded-xl flex items-center justify-between text-sm mt-4">
                <span className="font-semibold text-blue-800">Dynamic Net Salary Estimation:</span>
                <span className="font-mono font-extrabold text-blue-700 text-lg">
                  ₹ {new Intl.NumberFormat('en-IN').format(basicSalary + allowances - deductions)}
                </span>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-6 border-t border-gray-200 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold rounded-md cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-750 text-white text-sm font-semibold rounded-md cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
