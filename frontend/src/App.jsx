import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "./features/actions/userAction";
import Mainroutes from "./routes/Mainroutes";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // 🧠 When app starts, restore logged-in user from backend (via cookie)
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return <Mainroutes />;
};

export default App;  
 