import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
import SignUpPage from "./page/SignUpPage";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import Layout from "./layout/Layout";
import ProfilePage from "./page/ProfilePage";
import AddProblemPage from "./page/AddProblemPage";
import AdminRoute from "./components/AdminRoute";
import ProblemPage from "./page/ProblemPage";
import Dashboard from "./page/dashboard";
import ContestPage from "./page/ContestPage";
import RegisterContestPage from "./page/RegisterContestPage";
import CreateContestPage from "./page/CreateContestPage";
import ContestDetailPage from "./page/ContestDetailPage";
import ContestProblemExecPage from "./page/ContestProblemExecPage";
import { Analytics } from '@vercel/analytics/react';
import EditProfileForm from "./components/EditProfileForm";
import ServiceDownPopUp from "./components/ServiceDownPopUp";
import SheetsPage from "./page/SheetsPage";
import PricingPage from "./page/PricingPage";
import useSubscriptionStore from "./store/useSubscriptionStore";
import EditSheetPage from "./page/EditSheetPage";
import PatternsPage from "./page/PatternsPage";
import PatternDetailPage from "./page/PatternDetailPage";
import ManagePatternsPage from "./page/ManagePatternsPage";
import AdminMonitoringPage from "./page/AdminMonitoringPage";
import PrivacyPolicy from "./page/PrivacyPolicy";


const App = () => {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();
  // console.log("AdminRoute - authUser:", authUser);
  // console.log("AdminRoute - isCheckingAuth:", isCheckingAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      
      <Analytics />
      <Toaster />
         {/* <div className="fixed top-4 w-full z-150 left-1/2 transform -translate-x-1/2">
          <ServiceDownPopUp />
        </div> */}
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/dashboard"} />}
        />
        {/* <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/dashboard"} />}
        /> */}
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />

        {/* Protected routes with Layout */}
        <Route path="/dashboard" element={authUser ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="contest" element={<ContestPage />} />
          <Route path="contest/register/:id" element={<RegisterContestPage />} />
          <Route path="contest/detail/:id" element={<ContestDetailPage />} />
          <Route path="contest/create-contest" element={<CreateContestPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="edit-sheets" element={<EditSheetPage />} />
        </Route>

        {/* Protected routes without Layout */}
        <Route
          path="/contest-execution/:cid/:id"
          element={authUser ? <ContestProblemExecPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/sheets"
          element={authUser ? <SheetsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit-profile"
          element={authUser ? <EditProfileForm /> : <Navigate to="/login" />}
        />
        <Route 
          path="/profile" 
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />} 
        />
        <Route
          path="/problem/:id"
          element={authUser ? <ProblemPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/patterns"
          element={authUser ? <PatternsPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/patterns/:slug"
          element={authUser ? <PatternDetailPage /> : <Navigate to={"/login"} />}
        />

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route path="/add-problem" element={<AddProblemPage />} />
          <Route path="/admin/patterns" element={<ManagePatternsPage />} />
          <Route path="/admin/monitoring" element={<AdminMonitoringPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
