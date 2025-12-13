import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Google login successful, token is in cookie
    // Just show success message and redirect to home
    toast.success("Logged in with Google!");
    
    // Small delay to show the message, then redirect
    const timer = setTimeout(() => {
      navigate("/");
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return <p className="text-center mt-10">Logging you in...</p>;
};

export default AuthSuccess;
