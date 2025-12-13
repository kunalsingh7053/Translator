import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { fetchUserProfile } from "../features/actions/userAction";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        const result = await dispatch(fetchUserProfile());
        if (result?.id) {
          toast.success("Logged in with Google!");
          navigate("/");
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Profile fetch failed:", err);
        navigate("/login");
      }
    };

    verifyLogin();
  }, [navigate, dispatch]);

  return <p className="text-center mt-10">Logging you in...</p>;
};

export default AuthSuccess;
