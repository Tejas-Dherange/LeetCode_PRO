import { loginSchema } from "../schema/loginSchema";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { Code, Eye, EyeOff, Loader2, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function LoginPage() {
  // Set default theme to black (dark) on mount
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isLogingIn , googleSignIn } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate("/dashboard");
    } catch (error) {
      console.error("error in log in");
    }
  };

  const handleGoogleLogin = () => {
    googleSignIn();
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden p-4">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-5xl h-[600px] bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
           {/* Inner wash */}
           <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          <motion.div variants={itemVariants} className="text-center mb-10">
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-20 h-20 p-2 mx-auto mb-6 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-xl shadow-emerald-500/5 cursor-pointer"
            >
               {/* User requested Custom Logo */}
               <img src="/codeloom.png" alt="codeloom logo" className="w-full h-full object-contain" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-slate-400">Log in to your account</p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6 max-w-sm mx-auto w-full">
            {/* Google Button */}
            <button 
              onClick={handleGoogleLogin}
              className="relative w-full cursor-pointer group overflow-hidden bg-white hover:bg-slate-50 text-slate-900 rounded-xl p-4 flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.02]"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="google logo" />
              <span className="font-bold text-lg relative z-10">Continue with Google</span>
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-slate-200/40 to-transparent" />
            </button>

             <div className="text-center">
               <p className="text-xs text-slate-500 mt-6">
                  By continuing, you agree to our <span className="text-emerald-500 cursor-pointer hover:underline">Terms of Service</span>.
               </p>
             </div>
          </motion.div>
        </div>

        {/* Right Side: Visual Panel */}
        <div className="hidden md:flex w-1/2 relative bg-slate-800/40 items-center justify-center overflow-hidden">
           {/* Decorative Background */}
           <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/10 opacity-50" />
           
           {/* Floating Image */}
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.4, duration: 0.8 }}
             className="relative z-10 p-8"
           >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                  {/* Glow behind image */}
                 <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-[60px] transform scale-75" />
                 
                 <img 
                  src="/developer-team.png" 
                  alt="Team Collaboration" 
                  className="relative z-10 w-full max-w-md drop-shadow-2xl"
                />
              </motion.div>
              
              <div className="mt-8 text-center relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2">Join the Elite</h3>
                <p className="text-slate-300 px-4">Master algorithms and build your career with the best community.</p>
              </div>
           </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
