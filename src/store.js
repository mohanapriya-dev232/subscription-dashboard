import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import plansReducer from "./slices/plansSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    plans: plansReducer,
  },
});
