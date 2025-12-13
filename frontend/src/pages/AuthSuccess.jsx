import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isNewUser = params.get("new") === "true";

    axios
      .get("https://translator-lo1e.onrender.com/api/auth/profile", {
        withCredentials: true,
      })
      .then(() => {
        if (isNewUser) {
          toast.success("Registered successfully with Google 🎉");
        } else {
          toast.success("Login successful 👍");
        }

        // 👇 HOME REDIRECT (IMPORTANT)
        navigate("/", { replace: true });
      })
      .catch(() => {
        navigate("/login", { replace: true });
      });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Please wait while we redirect you...</p>
      <p>This page will automatically redirect in a few seconds</p>
    </div>
  );
};

export default AuthSuccess;
