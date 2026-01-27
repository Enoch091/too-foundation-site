import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "../components/AdminDashboard";

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) {
        navigate("/auth");
        return;
      }
      const user = JSON.parse(raw);
      if (!user || user.role !== "admin") {
        navigate("/");
        return;
      }
      setUserEmail(user.email);
    } catch (e) {
      navigate("/auth");
    }
  }, [navigate]);

  if (!userEmail) return null;

  return <AdminDashboard userEmail={userEmail} />;
};

export default AdminPage;
