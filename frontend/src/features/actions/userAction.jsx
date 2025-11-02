import API from "../../api/axios";
import { loaduser, removeuser, setInitialized } from "../reducers/userSlice";

 
//Register User
export const registerUser = (userData)=> async(dispatch,getState)=>{
    try {
        const res = await API.post('/auth/register',{ 
            fullName:{
                firstName:userData.firstName,
                lastName:userData.lastName
            },
            email:userData.email,
            password:userData.password,
            language:userData.language

        },
    {
        withCredentials:true
    });
    // normalize user: backend might return user at res.data.user or at res.data
    const userFromRes = res.data?.user ?? res.data
    dispatch(loaduser(userFromRes));
        return {success:true};
    } catch (error) {
        console.log("Error in registerUser action:",error);
        return {success:false,message:error.response?.data?.message || error.message};
    }
};


//Login User
export const loginUser = (userData)=> async(dispatch,getState)=>{

try {
    const res = await API.post('/auth/login',{
        email:userData.email,
        password:userData.password
    },{
        withCredentials:true
    })
  // normalize user
  const userFromLogin = res.data?.user ?? res.data
  dispatch(loaduser(userFromLogin));
    return {success:true};
} catch (error) {
    console.log("Error in loginUser action:",error);
    return {success:false,message:error.response?.data?.message || error.message};
}

}

//Logout User
export const logoutUser = ()=> async(dispatch,getState)=>{
 try {
    const  res = await API.post('/auth/logout',{

    },{
        withCredentials:true
    })
    dispatch(removeuser());
    return {success:true};
 } catch (error) {
    console.log("Error in logoutUser action:",error);
    return {success:false,message:error.response?.data?.message || error.message}
 }

}

//Delete User
export const deleteAcccount = ()=> async(dispatch,getState)=>{
 if (window.confirm("Are you sure you want to delete your account?")) {
    API.delete("/auth/profile", {
        withCredentials: true,
    }).then(() => {
          alert("User deleted successfully!");
            dispatch(removeuser());
            return { success: true };
        })
        .catch( 
            err =>{
                console.log(err);
                return { success: false, message: err.response?.data?.message || err.message };
            } );
    
 
 }
}

//Fetch User Profile
export const fetchUserProfile = () => async (dispatch) => {
  try {
    const res = await API.get('/auth/profile', { withCredentials: true });
    // If backend returns a user (either at res.data.user or at res.data) load it. 
    const fetchedUser = res?.data?.user ?? res?.data
    if (fetchedUser) { 
      dispatch(loaduser(fetchedUser));
            dispatch(setInitialized(true));
            return { success: true };
    } else {
      dispatch(removeuser());
            dispatch(setInitialized(true));
            return { success: false, message: 'No user in response' };
    }
  } catch (error) {
    // optional: dispatch(removeuser()) to ensure state is cleared
    dispatch(removeuser());
    console.error('fetchUserProfile: error=', error?.response ?? error);
    dispatch(setInitialized(true));
    console.log("Error in fetchUserProfile action:", error);
    return { success: false, message: error.response?.data?.message || error.message };
  }
}

// Update User Profile
export const updateUserProfile = (userData, file) => async (dispatch, getState) => {
  try {
    const formData = new FormData();

    // ✅ Text fields
    if (userData.firstName) formData.append("firstName", userData.firstName);
    if (userData.lastName) formData.append("lastName", userData.lastName);
    if (userData.oldpassword) formData.append("oldpassword", userData.oldpassword);
    if (userData.newpassword) formData.append("newpassword", userData.newpassword);

    // ✅ File (optional) - backend expects field name 'image'
    if (file) {
      formData.append("image", file);
    }

    // backend route: PATCH /api/auth/profile/update
    const res = await API.patch("/auth/profile/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

  // ✅ Redux update - normalize response
  const userFromUpdate = res.data?.user ?? res.data
  dispatch(loaduser(userFromUpdate));

    return { success: true, message: res.data.message };
  } catch (error) {
    console.error("Error in updateUserProfile action:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};


