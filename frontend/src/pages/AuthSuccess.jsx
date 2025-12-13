import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
      navigate("/");
    })
    .catch(() => navigate("/login"));
}, []);


  return <p className="text-center mt-10">Please wait while we redirect you...</p>;
};

export default AuthSuccess;
