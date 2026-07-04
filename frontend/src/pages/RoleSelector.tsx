import { useNavigate } from "react-router-dom";
import { Shield, User } from "lucide-react";
import { setSimulatedUser } from "../api";

export function RoleSelector() {
  const navigate = useNavigate();

  const loginAsAdmin = () => {
    setSimulatedUser("ADMIN", 1);
    navigate("/");
    window.location.reload();
  };

  const loginAsEmployee = () => {
    setSimulatedUser("EMPLOYEE", 2);
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-100">
      <div className="bg-white shadow-xl rounded-3xl p-10 w-[450px] text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Worksphere HRMS
        </h1>

        <p className="text-gray-500 mb-8">
          Select a profile to continue
        </p>

        <div className="space-y-4">
          <button
            onClick={loginAsAdmin}
            className="w-full p-5 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-4 justify-center text-lg font-semibold"
          >
            <Shield size={28} />
            HR Admin
          </button>

          <button
            onClick={loginAsEmployee}
            className="w-full p-5 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center gap-4 justify-center text-lg font-semibold"
          >
            <User size={28} />
            John Doe (Employee)
          </button>
        </div>
      </div>
    </div>
  );
}