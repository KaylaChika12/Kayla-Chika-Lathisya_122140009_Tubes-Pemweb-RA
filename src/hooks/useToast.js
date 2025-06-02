import { useDispatch } from "react-redux";
import { showToast, hideToast } from "../redux/toastSlice";

// Custom hook to easily show toast notifications
export const useToast = () => {
  const dispatch = useDispatch();

  // Shows a toast message
  const displayToast = (message, type = "info") => {
    dispatch(showToast({ message, type }));
  };

  // Hides the current toast message
  const hideCurrentToast = () => {
    dispatch(hideToast());
  };

  return { displayToast, hideCurrentToast };
};
