import axios from 'axios';

// Get simulated credentials from localStorage, defaulting to EMPLOYEE / John Doe (ID 2)
export const getSimulatedUser = () => {
  const role = localStorage.getItem('worksphere_role') || 'EMPLOYEE';
  const idStr = localStorage.getItem('worksphere_userId') || '2';
  return {
    role,
    id: parseInt(idStr, 10),
  };
};

export const setSimulatedUser = (role: string, id: number) => {
  localStorage.setItem('worksphere_role', role);
  localStorage.setItem('worksphere_userId', String(id));
  // Apply immediately to axios headers
  axios.defaults.headers.common['x-user-role'] = role;
  axios.defaults.headers.common['x-user-id'] = String(id);
};

// Set up default headers for all axios requests
const currentUser = getSimulatedUser();
axios.defaults.headers.common['x-user-role'] = currentUser.role;
axios.defaults.headers.common['x-user-id'] = String(currentUser.id);

export interface Employee {
  id: number;
  name: string;
  department: string;
  designation: string;
  phone: string;
  address: string;
  profilePicUrl: string;
  joiningDate: string;
  userId: number;
  salary: {
    basicSalary?: number;
    allowances?: number;
    deductions?: number;
    netSalary?: number;
  };
}

export interface CurrentUserState {
  user: {
    id: number;
    role: 'ADMIN' | 'EMPLOYEE';
  };
  profile: Employee;
}

export interface Attendance {
  id: number;
  employeeId: number;
  employeeName?: string;
  department?: string;
  date: string;
  status: string;
  checkIn: string | null;
  checkOut: string | null;
}

export const api = {
  // Fetch current simulated user profile
  getCurrentUser: async (): Promise<CurrentUserState> => {
    // Sync headers just in case
    const u = getSimulatedUser();
    axios.defaults.headers.common['x-user-role'] = u.role;
    axios.defaults.headers.common['x-user-id'] = String(u.id);
    
    const response = await axios.get<CurrentUserState>('/api/me');
    return response.data;
  },

  // Fetch list of employees (Admin only)
  getEmployeesList: async (search?: string): Promise<Employee[]> => {
    const params = search ? { search } : {};
    const response = await axios.get<Employee[]>('/api/employees', { params });
    return response.data;
  },

  // Fetch single employee
  getEmployee: async (id: number): Promise<Employee> => {
    const response = await axios.get<Employee>(`/api/employees/${id}`);
    return response.data;
  },

  // Update employee details
  updateEmployee: async (id: number, data: Partial<Employee>): Promise<{ message: string; employee?: Employee }> => {
    const response = await axios.put<{ message: string; employee?: Employee }>(`/api/employees/${id}`, data);
    return response.data;
  },

  // Attendance APIs
  checkIn: async (): Promise<Attendance> => {
    const response = await axios.post<Attendance>('/api/attendance/checkin');
    return response.data;
  },

  checkOut: async (): Promise<Attendance> => {
    const response = await axios.post<Attendance>('/api/attendance/checkout');
    return response.data;
  },

  getMyAttendance: async (): Promise<Attendance[]> => {
    const response = await axios.get<Attendance[]>('/api/attendance/me');
    return response.data;
  },

  getAllAttendance: async (filters?: { name?: string; employeeId?: string; date?: string }): Promise<Attendance[]> => {
    const response = await axios.get<Attendance[]>('/api/attendance', { params: filters });
    return response.data;
  },
};
