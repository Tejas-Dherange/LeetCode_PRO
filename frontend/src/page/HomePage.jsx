import { Link } from "react-router-dom";
import ServiceDownPopUp from "../components/ServiceDownPopUp";

function HomePage() {
  return (
    <>
  
      <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-x-hidden bg-slate-950">
        {/* Hero Section */}

        <header className="relative w-full min-h-[70vh] flex flex-col items-center justify-center text-center px-4 md:px-6 lg:px-12 py-16 md:py-20 overflow-hidden">
          {/* Subtle background accents */}
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <div className="absolute top-20 left-16 w-96 h-96 bg-emerald-600/10 blur-[120px] rounded-full animate-pulse" style={{animationDuration: '8s'}} />
            <div className="absolute bottom-32 right-20 w-80 h-80 bg-lime-500/10 blur-[100px] rounded-full animate-pulse" style={{animationDuration: '10s', animationDelay: '2s'}} />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto">
            <img
              src="/leetlab.svg"
              alt="CodeLoom Logo"
              className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 drop-shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-all duration-500 hover:drop-shadow-[0_0_35px_rgba(34,197,94,0.6)] hover:scale-105"
            />

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-5 md:mb-6 tracking-tight leading-tight font-extrabold text-white text-center px-2 md:px-4">
              Welcome to{" "}
              <span className="text-emerald-400 inline-block transition-all duration-300 hover:text-emerald-300 hover:scale-105">
                CodeLoom
              </span>
            </h1>

            <div className="space-y-5 md:space-y-6 mb-8 max-w-3xl mx-auto">
              <p className="text-base md:text-lg text-slate-300 font-medium leading-relaxed">
                Hi, I'm{" "}
                <span className="text-emerald-400 font-semibold">Tejas</span> — a
                coder who wanted a better place to practice. CodeLoom is that
                place: good problems, real contests, and a community that
                actually helps.
              </p>
              <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                Practice with purpose. Compete fairly. Track your progress
                clearly. That's CodeLoom.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 md:h-16 justify-center items-center">
              <Link to="/dashboard" className="text-white">
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer font-semibold px-7 md:px-8 py-3 md:py-3.5 rounded-lg text-base md:text-lg shadow-lg hover:shadow-emerald-500/25 transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 active:scale-95">
                  Go to Dashboard
                </button>
              </Link>
              <Link to="/dashboard/contest" className="text-white">
                <button className="bg-slate-800 hover:bg-slate-700 cursor-pointer text-white font-semibold px-7 md:px-8 py-3 md:py-3.5 rounded-lg text-base md:text-lg border border-emerald-500/30 hover:border-emerald-400/60 shadow-lg transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 active:scale-95">
                  Browse Contests
                </button>
              </Link>
              <Link to="/login" className="text-gray-300 hover:text-white">
                <button className="bg-transparent hover:bg-slate-800/50 cursor-pointer text-slate-300 hover:text-white font-medium px-6 md:px-7 py-3 rounded-lg text-sm md:text-base border border-slate-600 hover:border-emerald-500/50 shadow-md transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 active:scale-95">
                  Login
                </button>
              </Link>
            </div>
          </div>
          <div className="mt-10 md:mt-12 rounded-2xl overflow-hidden py-2 px-4 md:px-8 max-w-6xl mx-auto">
            <img
              src="/dashboard.png"
              alt="Dashboard UI preview"
              loading="lazy"
              className="w-full h-auto max-w-[100%] md:max-w-[90vw] lg:max-w-[70vw] mx-auto rounded-xl object-contain border border-emerald-500/30 bg-slate-900/60 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-emerald-500/20 hover:border-emerald-400/50 cursor-pointer"
            />
          </div>

          {/* Subtle floating particles */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="absolute top-16 left-12 w-2 h-2 bg-emerald-400/60 rounded-full animate-pulse" style={{animationDuration: '3s'}} />
            <div className="absolute top-32 right-20 w-1.5 h-1.5 bg-lime-400/50 rounded-full animate-pulse" style={{animationDuration: '4s', animationDelay: '1s'}} />
            <div className="absolute bottom-24 left-28 w-2 h-2 bg-emerald-300/40 rounded-full animate-pulse" style={{animationDuration: '5s', animationDelay: '2s'}} />
            <div className="absolute top-1/2 right-12 w-1 h-1 bg-lime-300/50 rounded-full animate-pulse" style={{animationDuration: '3.5s', animationDelay: '0.5s'}} />
          </div>
        </header>
        
        {/* Features Section */}
        <section className="mx-auto py-14 md:py-16 px-6 md:px-10 lg:px-24 relative w-full bg-slate-900 flex flex-col items-center justify-center text-center overflow-hidden border-t border-slate-800">
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute top-0 right-16 w-72 h-72 bg-emerald-500/20 blur-[120px] rounded-full animate-pulse" style={{animationDuration: '12s'}} />
            <div className="absolute bottom-0 left-12 w-96 h-96 bg-lime-500/15 blur-[140px] rounded-full animate-pulse" style={{animationDuration: '15s', animationDelay: '3s'}} />
          </div>

          <div className="relative z-10 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-emerald-400 tracking-tight">
              Why CodeLoom?
            </h3>
            <p className="mt-3 md:mt-4 text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
              Because you deserve a coding platform that feels like it was made
              for you.
            </p>
          </div>
          <div className="relative z-10 grid md:grid-cols-3 gap-6 md:gap-8 mt-10 w-full max-w-6xl">
            <div className="bg-slate-800/60 backdrop-blur-sm w-[90vw] md:w-full p-7 md:p-8 rounded-xl shadow-lg text-left border border-slate-700 hover:border-emerald-500/60 hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1 group">
              <h4 className="text-lg md:text-xl font-semibold text-emerald-400 flex items-center gap-2 group-hover:text-emerald-300 transition-colors duration-300">
                Practice Problems
              </h4>
              <p className="text-slate-400 mt-2 text-sm md:text-base leading-relaxed">
                No filler. No nonsense. Just handpicked problems that actually
                help you grow.
              </p>
              <div className="mt-5 flex justify-start items-center">
                <Link to="/dashboard" className="text-primary mt-3">
                  <button className="bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer font-medium px-4 py-2 rounded-lg text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 active:scale-95">
                    Explore Problems
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm p-7 md:p-8 w-[90vw] md:w-full rounded-xl shadow-lg text-left border border-slate-700 hover:border-emerald-500/60 hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1 group">
              <h4 className="text-lg md:text-xl font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300">Contests</h4>
              <p className="text-slate-400 mt-2 text-sm md:text-base leading-relaxed">
                Compete, learn, and maybe even win. Our contests are tough,
                fair, and fun (yes, really!).
              </p>
              <div className="mt-5 flex justify-start items-center">
                <Link to="/dashboard/contest" className="text-primary mt-3">
                  <button className="bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer font-medium px-4 py-2 rounded-lg text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 active:scale-95">
                    Explore Contests
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm p-7 md:p-8 w-[90vw] md:w-full rounded-xl shadow-lg text-left border border-slate-700 hover:border-emerald-500/60 hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1 group">
              <h4 className="text-lg md:text-xl font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300">
                Personalized Profile
              </h4>
              <p className="text-slate-400 mt-2 text-sm md:text-base leading-relaxed">
                See your real progress. Track your rating, contest history, and
                celebrate your wins—big or small.
              </p>
              <div className="mt-5 flex justify-start items-center">
                <Link to="/profile" className="text-primary mt-3">
                  <button className="bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer font-medium px-4 py-2 rounded-lg text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 active:scale-95">
                    View profile
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="relative z-10 mt-14 md:mt-16 text-center w-[90vw] md:w-full md:max-w-2xl md:mx-auto bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-xl p-7 md:p-8 border border-emerald-500/40 hover:border-emerald-400/70 transition-all duration-300 hover:-translate-y-1">
            <h4 className="text-2xl font-bold text-emerald-400 mb-2">
              A Note from the Creator
            </h4>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              I started CodeLoom because I wanted a place where coders could
              feel at home—where every feature, every contest, and every problem
              is designed with care. If you ever feel stuck, lost, or just want
              to say hi, my inbox is always open. Happy coding!
            </p>
            <p className="mt-4 text-slate-400 italic text-sm">
              — Tejas, Fellow Coder
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-950 text-slate-500 text-center py-5 w-full border-t border-slate-800 text-xs md:text-sm">
          <p>&copy; 2025 CodeLoom. Built with care for coders.</p>
        </footer>
      </div>
     
    </>
  );
}

export default HomePage;
