import type { Employee } from "../api";

export const mockEmployee: Employee = {
  id: 2,
  name: "John Doe",
  department: "Engineering",
  designation: "Software Engineer",
  phone: "9876543210",
  address: "Kolkata, New Town",
  profilePicUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
  joiningDate: "2024-01-15",
  userId: 2,
  salary: {
    basicSalary: 60000,
    allowances: 15000,
    deductions: 5000,
    netSalary: 70000,
  },
};