import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { Loader } from "lucide-react";
const AdminRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore();

  // console.log("AdminRoute authUser:", authUser, "isCheckingAuth:", isCheckingAuth);
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  if (!authUser) {
    console.log("[AdminRoute] No authUser, redirecting to login");
    return <Navigate to={"/login"} />;
  }

  console.log("[AdminRoute] authUser:", authUser);
  console.log("[AdminRoute] role:", authUser.role);

  if (authUser.role !== "ADMIN") {
    console.log("[AdminRoute] Not admin, redirecting to /");
    return <Navigate to="/" />;
  }

  console.log("[AdminRoute] Admin verified, rendering outlet");
  return <Outlet />;
};

export default AdminRoute;
