import API from "../../api/axios";
import { loaduser,removeuser } from "../reducers/userSlice";


//Register User
export const registerUser = (userData)=> async(dispatch,getState)=>{
    console.log("xyz",userData)
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
    console.log(res.data.user)
        dispatch(loaduser(res.data.user));
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
    dispatch(loaduser(res.data.user));
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
export const fetchUserProfile = ()=> async(dispatch,getState)=>{
    try {
        
        const res = await API.get('/auth/profile')
        dispatch(loaduser(res.data.user));  
        return {success:true};
    } catch (error) {
        console.log("Error in fetchUserProfile action:",error);
        return {success:false,message:error.response?.data?.message || error.message};
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

    // ✅ File (optional)
    if (file) {
      formData.append("file", file);
    }

    const res = await API.put("/auth/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    // ✅ Redux update
    dispatch(loaduser(res.data.user));

    return { success: true, message: res.data.message };
  } catch (error) {
    console.error("Error in updateUserProfile action:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};


