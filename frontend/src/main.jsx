import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from "./app/Store.jsx";
import { Provider } from "react-redux";
import { ToastContainer, Bounce } from 'react-toastify';
createRoot(document.getElementById('root')).render(

<Provider store={store}>
    <App />
    <ToastContainer
position="top-center"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="colored"
transition={Bounce}
/>
</Provider>

  
)
