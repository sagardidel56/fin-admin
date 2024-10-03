import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const ToasterContainer = () => <ToastContainer />;
let currentToast:any = 0
export const successToaster = (msg:String) => {
    if (currentToast) {
        toast.dismiss(currentToast)
    }
    currentToast = toast(msg, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        // theme: "colored",
        theme: "dark",
        type: "success",
    });
}

export const errorToaster = (msg:String) => {
    if (currentToast) {
        toast.dismiss(currentToast)
    }
    currentToast = toast(msg, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        // theme: "colored",
        theme: "dark",
        type: "error",
    });
}