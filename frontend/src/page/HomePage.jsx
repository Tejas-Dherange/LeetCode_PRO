import { Link } from "react-router-dom";
import ServiceDownPopUp from "../components/ServiceDownPopUp";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Code2, Zap, Trophy, TrendingUp, Users, Target, Sparkles, Rocket, Shield } from "lucide-react";
import { useEffect, useState, useRef } from "react";

function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const y1 = useTransform(smoothProgress, [0, 1], ["0%", "30%"]);
  const y2 = useTransform(smoothProgress, [0, 1], ["0%", "-15%"]);
  const opacity = useTransform(smoothProgress, [0, 0.5, 1], [1, 0.9, 0.7]);
  
  const [stats, setStats] = useState({ problems: 0, users: 0, contests: 0 });
  const [typedText, setTypedText] = useState("");
  const fullText = "Master the art of problem-solving";

  // Typing animation
  useEffect(() => {
    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Animate stats counter
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setStats({
        problems: Math.floor((500 * step) / steps),
        users: Math.floor((1200 * step) / steps),
        contests: Math.floor((50 * step) / steps),
      });
      
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <>
  
      <div ref={heroRef} className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-x-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98133_1px,transparent_1px),linear-gradient(to_bottom,#10b98133_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950/50 to-slate-950" />
        
        {/* Hero Section */}
        <header className="relative w-full min-h-[90vh] flex flex-col items-center justify-center text-center px-4 md:px-6 lg:px-12 py-16 md:py-20 overflow-hidden">
          {/* Enhanced background accents with movement */}
          <div className="pointer-events-none absolute inset-0">
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.15, 0.25, 0.15],
                rotate: [0, 90, 0],
              }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute top-20 left-16 w-[500px] h-[500px] bg-emerald-600/20 blur-[150px] rounded-full"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.15, 0.3, 0.15],
                rotate: [0, -90, 0],
              }}
              transition={{ duration: 15, delay: 2, repeat: Infinity }}
              className="absolute bottom-32 right-20 w-[600px] h-[600px] bg-lime-500/20 blur-[150px] rounded-full"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{ duration: 25, delay: 5, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-500/10 blur-[180px] rounded-full"
            />
          </div>

          {/* Floating Code Snippets */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-emerald-500/10 font-mono"
                initial={{ y: "120vh", x: `${Math.random() * 100}vw`, rotate: 0 }}
                animate={{
                  y: "-20vh",
                  rotate: 360,
                }}
                transition={{
                  duration: 20 + Math.random() * 15,
                  repeat: Infinity,
                  delay: i * 2.5,
                  ease: "linear",
                }}
              >
                <Code2 size={30 + Math.random() * 40} />
              </motion.div>
            ))}
          </div>

          <motion.div 
            style={{ y: y2, opacity }}
            className="relative z-10 max-w-6xl mx-auto"
          >
            {/* Logo - Static */}
            <div className="relative inline-block mb-8">
              <img
                src="/leetlab.svg"
                alt="CodeLoom Logo"
                className="relative z-10 w-28 h-28 md:w-32 md:h-32 mx-auto"
              />
            </div>

            {/* Main heading with enhanced styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-8"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 tracking-tight leading-tight font-black text-white px-2 md:px-4">
                Welcome to{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                    CodeLoom
                  </span>
                  <motion.span
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -inset-2 blur-2xl bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 opacity-30"
                  />
                </span>
              </h1>
              
              {/* Typing effect subtitle */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xl md:text-2xl text-emerald-300 font-medium h-8"
              >
                {typedText}<span className="animate-pulse">|</span>
              </motion.p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="space-y-6 mb-10 max-w-3xl mx-auto"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-slate-800/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 shadow-2xl"
              >
                <p className="text-lg md:text-xl text-slate-200 font-medium leading-relaxed">
                  Hi, I'm{" "}
                  <span className="text-emerald-400 font-bold">Tejas</span> — a
                  coder who wanted a better place to practice. CodeLoom is that
                  place: <span className="text-emerald-300">curated problems</span>, <span className="text-emerald-300">fair contests</span>, and a <span className="text-emerald-300">thriving community</span>.
                </p>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-base md:text-lg text-slate-400 leading-relaxed flex items-center justify-center gap-2"
              >
                Practice with purpose. Compete fairly. Track clearly.
              </motion.p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link to="/dashboard">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 bg-[length:200%_auto] hover:bg-right text-white font-bold px-8 md:px-10 py-4 rounded-xl text-base md:text-lg shadow-2xl shadow-emerald-500/30 transition-all duration-500 cursor-pointer"
                >
                  <span className="relative z-10 flex items-center gap-2">
                  
                    Start Coding Now
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.button>
              </Link>
              
              <Link to="/dashboard/contest">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-slate-800/60 backdrop-blur-xl hover:bg-slate-700/60 text-white font-semibold px-8 md:px-10 py-4 rounded-xl text-base md:text-lg border-2 border-emerald-500/30 hover:border-emerald-400/60 shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Browse Contests
                  </span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="relative w-full max-w-6xl mx-auto px-4 md:px-8 z-20 mb-20"
          >
            <div className="relative group">
              {/* Glow effect behind image */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 via-green-500/30 to-emerald-500/30 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <motion.img
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                src="/dashboard.png"
                alt="Dashboard UI preview"
                loading="lazy"
                className="relative w-full h-auto rounded-2xl object-contain border-2 border-emerald-500/30 bg-slate-900/80 backdrop-blur-sm shadow-[0_20px_80px_rgba(34,197,94,0.3)] hover:shadow-[0_30px_100px_rgba(34,197,94,0.5)] hover:border-emerald-400/50 cursor-pointer transition-all duration-500"
                style={{ willChange: "transform" }}
              />
              
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-emerald-400/50 rounded-tl-2xl" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-emerald-400/50 rounded-br-2xl" />
            </div>
          </motion.div>

          {/* Enhanced floating particles */}
          <div className="pointer-events-none absolute inset-0 z-0">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-emerald-400"
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -40, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>
        </header>
        
        {/* Stats Section with enhanced styling */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full py-16 px-6 relative z-30 bg-slate-950"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Code2, label: "Problems", value: stats.problems, gradient: "from-emerald-500 to-green-500" },
              { icon: Users, label: "Active Users", value: stats.users, gradient: "from-blue-500 to-cyan-500" },
              { icon: Trophy, label: "Contests", value: stats.contests, gradient: "from-yellow-500 to-orange-500" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative bg-slate-800/60 backdrop-blur-xl p-8 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 text-center overflow-hidden group"
              >
                <motion.div
                  animate={{
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10`}
                />
                
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.gradient} p-0.5`}
                >
                  <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
                
                <motion.div 
                  className="text-5xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2"
                  key={stat.value}
                >
                  {stat.value}+
                </motion.div>
                <div className="text-slate-400 font-semibold text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features Section with enhanced cards */}
        <section className="mx-auto py-20 px-6 md:px-10 lg:px-24 relative w-full bg-slate-900/50 flex flex-col items-center justify-center text-center overflow-hidden border-t border-slate-800">
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute top-0 right-16 w-[400px] h-[400px] bg-emerald-500/20 blur-[150px] rounded-full"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                x: [0, -30, 0],
                rotate: [360, 180, 0],
              }}
              transition={{ duration: 25, delay: 5, repeat: Infinity }}
              className="absolute bottom-0 left-12 w-[500px] h-[500px] bg-lime-500/15 blur-[180px] rounded-full"
            />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-4 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full"
            >
              <span className="text-emerald-400 font-bold text-sm uppercase tracking-wider">Why Choose Us</span>
            </motion.div>
            <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent mb-4">
              Why CodeLoom?
            </h3>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Because you deserve a platform built with <span className="text-emerald-400 font-semibold">passion</span> and <span className="text-emerald-400 font-semibold">precision</span>
            </p>
          </motion.div>

          <div className="relative z-10 grid md:grid-cols-3 gap-8 mt-10 w-full max-w-6xl">
            {[
              {
                title: "Curated Problems",
                desc: "No filler. No nonsense. Just handpicked problems that actually help you grow and land your dream job.",
                link: "/dashboard",
                linkText: "Explore Problems",
                icon: Target,
                gradient: "from-emerald-500 to-green-500",
              },
              {
                title: "Live Contests",
                desc: "Compete, learn, and maybe even win. Our contests are tough, fair, and designed to push your limits.",
                link: "/dashboard/contest",
                linkText: "Join Contest",
                icon: Trophy,
                gradient: "from-yellow-500 to-orange-500",
              },
              {
                title: "Track Progress",
                desc: "See your real progress. Advanced analytics, rating system, and detailed insights to celebrate every win.",
                link: "/profile",
                linkText: "View Profile",
                icon: TrendingUp,
                gradient: "from-blue-500 to-cyan-500",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.7 }}
                whileHover={{ 
                  y: -12,
                  rotateY: 5,
                  scale: 1.03,
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="bg-slate-800/60 backdrop-blur-xl w-full p-8 rounded-2xl shadow-2xl text-left border border-slate-700 hover:border-emerald-500/60 hover:shadow-emerald-500/20 transition-all duration-500 group relative overflow-hidden"
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.15 }}
                  transition={{ duration: 0.6 }}
                  className={`w-14 h-14 mb-6 rounded-xl bg-gradient-to-br ${feature.gradient} p-0.5`}
                >
                  <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                </motion.div>
                
                <h4 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors duration-300">
                  {feature.title}
                </h4>
                <p className="text-slate-400 text-base leading-relaxed mb-6">
                  {feature.desc}
                </p>
                <Link to={feature.link}>
                  <motion.button 
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 rounded-lg text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group/btn cursor-pointer"
                  >
                    {feature.linkText}
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Creator Note with enhanced styling */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            whileHover={{ scale: 1.02, y: -6 }}
            className="relative z-10 mt-20 text-center w-full max-w-3xl mx-auto bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border-2 border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-500 overflow-hidden"
          >
            <motion.div
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"
            />
            
            <Shield className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
            <h4 className="text-3xl font-black text-emerald-400 mb-4 relative z-10">
              A Note from the Creator
            </h4>
            <p className="text-slate-300 text-lg leading-relaxed relative z-10 mb-4">
              I started CodeLoom because I wanted a place where coders could
              feel at home—where every feature, every contest, and every problem
              is designed with care. If you ever feel stuck, lost, or just want
              to say hi, my inbox is always open. <span className="text-emerald-400 font-semibold">Happy coding!</span>
            </p>
            <p className="text-slate-400 italic text-base relative z-10 flex items-center justify-center gap-2">
              — Tejas, Fellow Coder & Founder
            </p>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-950 text-slate-500 text-center py-6 w-full border-t border-slate-800">
          <p className="text-sm md:text-base">&copy; 2025 CodeLoom. Crafted with <span className="text-emerald-400">❤️</span> for coders worldwide.</p>
        </footer>
      </div>
     
    </>
  );
}

export default HomePage;
