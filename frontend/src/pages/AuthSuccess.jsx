import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://translator-lo1e.onrender.com/api/auth/profile", {
        withCredentials: true,
      })
      .then(() => {
        toast.success("Logged in with Google!");
        navigate("/");
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  return <p className="text-center mt-10">Logging you in...</p>;
};

export default AuthSuccess;
