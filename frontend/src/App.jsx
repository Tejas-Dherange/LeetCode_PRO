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
import ContestProblemExecPage from "./page/ContestProblemExecPage";
import { Analytics } from '@vercel/analytics/react';


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
    <div className="flex flex-col items-center justify-start">
      
      <Analytics />
      <Toaster />
      <Routes>
        <Route path="/dashboard" element={<Layout />}>
          <Route
            index
            element={authUser ? <Dashboard /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/dashboard/contest"
            element={
              authUser ? <ContestPage /> : <Navigate to={"/dashboard"} />
            }
          />
          <Route
            path="/dashboard/contest/register/:id"
            element={
              authUser ? (
                <RegisterContestPage />
              ) : (
                <Navigate to={"/"} />
              )
            }
          />
        </Route>
        <Route
          path="profile"
          element={authUser ? <ProfilePage /> : <Navigate to={"/dashboard"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/dashboard"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/dashboard"} />}
        />

        <Route element={<AdminRoute />}>
          <Route path="/add-problem" element={<AddProblemPage />} />
        </Route>

        <Route
          path="/problem/:id"
          element={authUser ? <ProblemPage /> : <Navigate to={"/dashboard"} />}
        />
        <Route
          path="/dashboard/contest-execution/:cid/:id"
          element={
            authUser ? <ContestProblemExecPage /> : <Navigate to={"/dashboard"} />
          }
        />
        <Route
          path="/dashboard/contest/create-contest"
          element={
            authUser ? <CreateContestPage /> : <Navigate to={"/dashboard"} />
          }
        />
        <Route
          path="/"
          element={ <HomePage />}
        />
      </Routes>
    </div>
  );
};

export default App;
