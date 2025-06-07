import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] flex flex-col items-center justify-center relative overflow-x-hidden animate-fade-in">
      {/* Hero Section */}
      <header className="relative w-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-[65vh] flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <img
            src="/leetlab.svg"
            alt="CodeLoom Logo"
            className="w-24 h-24 mx-auto mb-6 drop-shadow-2xl transition-transform duration-300 hover:scale-110"
          />

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              CodeLoom
            </span>
          </h1>

          <div className="space-y-4 mb-8 max-w-3xl mx-auto">
            <p className="text-lg md:text-xl text-gray-200 font-medium leading-relaxed">
              Hi, I'm <span className="text-blue-400 font-semibold">Tejas</span>{" "}
              — a coder who wanted a better place to practice. CodeLoom is that
              place: good problems, real contests, and a community that actually
              helps.
            </p>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
              Practice with purpose. Compete fairly. Track your progress
              clearly. That's CodeLoom.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/dashboard" className="text-white">
              <button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-semibold px-8 py-4 rounded-lg text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50">
                Go to Dashboard
              </button>
            </Link>
            <Link to="/dashboard/contest" className="text-white">
              <button className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer text-white font-semibold px-8 py-4 rounded-lg text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/50">
                Browse Contests
              </button>
            </Link>
            <Link to="/login" className="text-gray-300 hover:text-white">
              <button className="border-2 border-gray-300 hover:border-white cursor-pointer text-gray-300 hover:text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-lg text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/50">
                Login
              </button>
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-16 w-1 h-1 bg-emerald-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-16 left-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-2000"></div>
      </header>
      {/* Features Section */}
      <section className="container mx-auto py-14 px-6 ">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-primary">Why CodeLoom?</h3>
          <p className="mt-4 text-base-content/70">
            Because you deserve a coding platform that feels like it was made
            for you.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          <div className="bg-base-100 p-8 rounded-2xl shadow-xl text-center border border-primary/10">
            <h4 className="text-xl font-semibold text-primary">
              Practice Problems
            </h4>
            <p className="text-base-content/70 mt-2">
              No filler. No nonsense. Just handpicked problems that actually
              help you grow.
            </p>
            <div className="mt-6 flex justify-center items-center ">
              <Link to="/dashboard" className="btn  text-primary mt-3">
                <button className="bg-blue-600 h-12 hover:bg-blue-700 text-white cursor-pointer font-semibold px-2 py-2 rounded-lg text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50">
                  Explore Problems
                </button>
              </Link>
            </div>
          </div>
          <div className="bg-base-100 p-8 rounded-2xl shadow-xl text-center border border-success/10">
            <h4 className="text-xl font-semibold text-success">Contests</h4>
            <p className="text-base-content/70 mt-2">
              Compete, learn, and maybe even win. Our contests are tough, fair,
              and fun (yes, really!).
            </p>
            <div className="mt-6 flex justify-center items-center ">
              <Link to="/dashboard/contest" className="btn  text-primary mt-3">
                <button className="bg-blue-600 h-12 hover:bg-blue-700 text-white cursor-pointer font-semibold px-2 py-2 rounded-lg text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50">
                  Explore Contests
                </button>
              </Link>
            </div>
          </div>
          <div className="bg-base-100 p-8 rounded-2xl shadow-xl text-center border border-blue-500/10">
            <h4 className="text-xl font-semibold text-blue-500">
              Personalized Profile
            </h4>
            <p className="text-base-content/70 mt-2">
              See your real progress. Track your rating, contest history, and
              celebrate your wins—big or small.
            </p>
            <div className="mt-6 flex justify-center items-center ">
              <Link to="/profile" className="btn  text-primary mt-3">
                <button className="bg-blue-600 h-12 hover:bg-blue-700 text-white cursor-pointer font-semibold px-2  rounded-lg text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50">
                  View profile
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-16 text-center max-w-2xl mx-auto bg-base-100/80 rounded-2xl shadow-lg p-8 border border-primary/10">
          <h4 className="text-2xl font-bold text-primary mb-2">
            A Note from the Creator
          </h4>
          <p className="text-base-content/80 text-lg">
            I started CodeLoom because I wanted a place where coders could feel
            at home—where every feature, every contest, and every problem is
            designed with care. If you ever feel stuck, lost, or just want to
            say hi, my inbox is always open. Happy coding!
          </p>
          <p className="mt-4 text-base-content/60 italic">
            — Tejas, Fellow Coder
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-200 text-base-content/70 text-center py-6 w-full mt-10 border-t border-base-300">
        <p>&copy; 2025 CodeLoom. Made with ❤️ for coders, by a coder.</p>
      </footer>
    </div>
  );
}

export default HomePage;
