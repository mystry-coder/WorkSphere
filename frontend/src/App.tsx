import { BrowserRouter, Routes, Route } from "react-router-dom";

import { RoleSelector } from "./pages/RoleSelector";
import { AdminDashboard } from "./pages/AdminDashboard";
import { EmployeeDashboard } from "./pages/EmployeeDashboard";
import { EmployeeProfile } from "./pages/EmployeeProfile";
import { EditProfile } from "./pages/EditProfile";

import { mockEmployee } from "./data/mockEmployee";
import { getSimulatedUser } from "./api";

function App() {
  const user = getSimulatedUser();

  return (
    <BrowserRouter>
      <Routes>
        {/* Role Selection Screen */}
        <Route path="/select-role" element={<RoleSelector />} />

        {/* Dashboard */}
        <Route
          path="/"
          element={
            user.role === "ADMIN" ? (
              <AdminDashboard />
            ) : (
              <EmployeeDashboard
                employee={mockEmployee}
                onRefreshUser={() => {}}
              />
            )
          }
        />

        {/* Profile */}
        <Route path="/employees/:id" element={<EmployeeProfile />} />

        {/* Edit Profile */}
        <Route path="/employees/:id/edit" element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;