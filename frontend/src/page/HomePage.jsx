import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Code2, Zap, Trophy, TrendingUp, Users, Target, Sparkles, Rocket, Shield, CheckCircle, Laptop, Mail } from "lucide-react";
import { useEffect, useState, useRef } from "react";

function HomePage() {
  const heroRef = useRef(null);
  
  // Parallax for hero section - simplified and smoother
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [typedText, setTypedText] = useState("");
  const fullText = "Master the art of problem-solving";

  // Typing animation - enhanced visibility
  useEffect(() => {
    const startDelay = setTimeout(() => {
      let currentIndex = 0;
      const timer = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setTypedText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(timer);
        }
      }, 100); // Slower pacing (100ms) for better readability
      
      return () => clearInterval(timer);
    }, 1500); // 1.5s delay to wait for entrance animations

    return () => clearTimeout(startDelay);
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-200 selection:bg-emerald-500/30">
      
      {/* Background - Clean, Performance-Optimized */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b9810a_1px,transparent_1px),linear-gradient(to_bottom,#10b9810a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        {/* Very subtle top gradient */}
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-emerald-900/10 via-slate-950/0 to-transparent" />
      </div>

      {/* Hero Section */}
      <header ref={heroRef} className="relative z-10 w-full min-h-[90vh] flex flex-col items-center justify-center text-center px-4 md:px-6 py-20 overflow-hidden">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto flex flex-col items-center"
        >
          {/* Logo */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="relative group">
              <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-500/30 transition-all duration-500" />
              <img
                src="/leetlab.svg"
                alt="CodeLoom Logo"
                className="relative z-10 w-24 h-24 md:w-28 md:h-28 mx-auto drop-shadow-2xl"
              />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-tight"
          >
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
              CodeLoom
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.div variants={itemVariants} className="h-8 mb-8">
             <p className="text-xl md:text-2xl text-emerald-300/90 font-medium">
              {typedText}<span className="animate-pulse text-emerald-500">_</span>
            </p>
          </motion.div>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed"
          >
            A premium coding platform designed for clarity and growth. 
            Curated problems, fair contests, and a community that cares.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link to="/dashboard"
            >
              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full cursor-pointer sm:w-auto  px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 group"
              >
                <Laptop className="w-6 h-6" />
                Start Coding Now
                
              </motion.button>
            </Link>
            
            <Link to="/dashboard/contest">
              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full cursor-pointer  sm:w-auto px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-white font-semibold rounded-xl border border-slate-700 hover:border-emerald-500/30 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <Trophy className="w-5 h-5 text-emerald-400" />
                Browse Contests
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Dashboard Preview - Clean Slide Up */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="relative w-full max-w-6xl mx-auto mt-20 px-4"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 group">
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 opacity-60" />
            <img
              src="/dashboard.png"
              alt="Dashboard Preview"
              className="w-full h-auto object-cover transform group-hover:scale-[1.01] transition-transform duration-700 ease-out"
            />
          </div>
        </motion.div>
      </header>

      {/* Feature Highlights Section - Authentic, No Fake Stats */}
      <section className="py-20 relative z-10 border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Makes Us Different</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Focus on what matters - clean interface, quality problems, fair competition</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Real-Time Execution",
                desc: "Judge0 API integration with live test results and instant feedback",
                color: "text-yellow-400",
                bgColor: "bg-yellow-500/10",
                hoverBorderColor: "hover:border-yellow-500/30"
              },
              {
                icon: Trophy,
                title: "Live Leaderboards",
                desc: "Real-time contest rankings with WebSocket updates - watch your rank change instantly",
                color: "text-emerald-400",
                bgColor: "bg-emerald-500/10",
                hoverBorderColor: "hover:border-emerald-500/30"
              },
              {
                icon: Shield,
                title: "Secure & Fast",
                desc: "Redis caching, rate limiting, and optimized database queries for smooth experience",
                color: "text-blue-400",
                bgColor: "bg-blue-500/10",
                hoverBorderColor: "hover:border-blue-500/30"
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className={`bg-slate-900/50 p-8 rounded-2xl border border-slate-800 ${feature.hoverBorderColor} transition-all group`}
              >
                <div className={`mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.bgColor} transition-colors`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-emerald-400 font-bold tracking-wider text-sm uppercase mb-3 block">Premium Experience</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Why CodeLoom?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Built by developers, for developers. We focus on what matters: clean code, clear metrics, and constant improvement.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Curated Problems",
                desc: "Handpicked challenges that build real-world skills. No filler.",
                link: "/dashboard",
                icon: Target,
              },
              {
                title: "Live Contests",
                desc: "Regular competitive events to test your limits against peers.",
                link: "/dashboard/contest",
                icon: Trophy,
              },
              {
                title: "Detailed Progress",
                desc: "Deep analytics to track your growth and identify weak spots.",
                link: "/profile",
                icon: TrendingUp,
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-emerald-500/30 transition-colors group"
              >
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-500/10 transition-colors">
                  <feature.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">{feature.desc}</p>
                <Link to={feature.link} className="inline-flex items-center text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                  Learn more <TrendingUp className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Note */}
      <section className="py-20 px-6 relative z-10 border-t border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-slate-900/50 border border-slate-800 p-10 md:p-14 rounded-3xl text-center relative overflow-hidden"
        >
           {/* Subtle wash */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
          
          <Shield className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">A Note from the Creator</h3>
          <p className="text-lg text-slate-300 leading-relaxed mb-8">
            "I built CodeLoom because I needed a place that respected my time. 
            Clean design, focused problems, and a community that lifts you up. 
            I hope it helps you on your journey."
          </p>
          <div className="flex items-center justify-center gap-3">
             <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-bold">T</div>
             <div className="text-left">
                <p className="text-white font-semibold">Tejas</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Founder & Developer</p>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-10 border-t border-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="text-white font-bold mb-3">CodeLoom</h3>
              <p className="text-slate-500 text-sm">
                A premium coding platform built for developers who value quality over quantity.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/dashboard" className="text-slate-500 hover:text-emerald-400 text-sm transition-colors">
                    Problems
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/contest" className="text-slate-500 hover:text-emerald-400 text-sm transition-colors">
                    Contests
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-slate-500 hover:text-emerald-400 text-sm transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-bold mb-3">Contact</h3>
              <div className="space-y-2">
                <a 
                  href="mailto:tejasdherange0099@gmail.com" 
                  className="text-slate-500 hover:text-emerald-400 text-sm transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  tejasdherange0099@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div className="text-center text-slate-500 text-sm pt-8 border-t border-slate-900">
            <p>&copy; 2025 CodeLoom. Crafted with <span className="text-emerald-500 animate-pulse">❤️</span> for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
