import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";


export const toastSuccess = (msg) =>{
    toast.success(msg, {
        position: "top-center",
        autoClose: 5000,
        draggable: true,
        });
}

export const toastError = (msg) =>{
    toast.error(msg, {
        position: "top-center",
        autoClose: 5000,
        draggable: true,
        });
}