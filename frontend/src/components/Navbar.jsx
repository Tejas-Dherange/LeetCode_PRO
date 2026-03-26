import { Link, useLocation } from "react-router-dom";
import {
  User, Code, LogOut, Trophy, Moon, Sun, Sheet,
  BookOpen, Activity, BarChart3, Menu, X,
} from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import LogoutButton from "./LogoutButton";
import { useEffect, useState } from "react";
import { useThemeStore } from "../store/useThemeStore";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <>
      {/* ── Original navbar — unchanged for md+ screens ── */}
      <nav className="sticky top-0 z-50 w-full py-5">
        <div className="flex w-full justify-between items-center mx-auto max-w-4xl bg-black/15 shadow-lg shadow-neutral-600/5 backdrop-blur-lg border border-gray-200/10 p-4 rounded-2xl">
          {/* Logo Section */}
          <Link to="/dashboard" className="flex items-center gap-3 cursor-pointer">
            <img
              src="/codeloom.png"
              className="h-18 w-18 bg-primary/20 text-primary border-none px-2 py-2 rounded-full"
            />
            <span className="text-lg md:text-2xl font-bold tracking-tight text-white hidden md:block">
              CodeLoom
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-8">
            {/* Desktop buttons — hidden on mobile */}
            <div className="hidden md:flex items-center gap-2 ml-4">
              <button
                onClick={toggleTheme}
                className="btn btn-sm btn-ghost text-xl"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun /> : <Moon />}
              </button>
              <Link to="/dashboard/contest">
                <button className="btn btn-warning btn-sm font-bold shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:brightness-110">
                  Contests
                </button>
              </Link>
              <Link to="/dashboard/pricing">
                <button className="btn btn-warning btn-sm font-bold shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:brightness-110">
                  Pricing
                </button>
              </Link>
              <Link to="/patterns">
                <button className="btn btn-accent btn-sm font-bold shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:brightness-110">
                  Patterns
                </button>
              </Link>
            </div>

            {/* Avatar dropdown — desktop only */}
            <div className="hidden md:block dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar flex flex-row">
                <div className="w-10 rounded-full">
                  <img
                    src={authUser?.image || "https://avatar.iran.liara.run/public/boy"}
                    alt="User Avatar"
                    className="object-cover border rounded-full w-10 h-10"
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 space-y-3"
              >
                <li>
                  <p className="text-base font-semibold">{authUser?.name}</p>
                  <hr className="border-gray-200/10" />
                </li>
                <li>
                  <Link to="/profile" className="hover:bg-primary hover:text-white text-base font-semibold">
                    <User className="w-4 h-4 mr-2" /> My Profile
                  </Link>
                </li>
                <li>
                  <Link to="/sheets" className="hover:bg-primary hover:text-white text-base font-semibold">
                    <Sheet className="w-4 h-4 mr-2" /> Sheets
                  </Link>
                </li>
                <li>
                  <Link to="/patterns" className="hover:bg-primary hover:text-white text-base font-semibold">
                    <BookOpen className="w-4 h-4 mr-2" /> Patterns
                  </Link>
                </li>
                {authUser?.role === "ADMIN" && (
                  <li>
                    <Link to="/admin/patterns" className="hover:bg-primary hover:text-white text-base font-semibold">
                      <BookOpen className="w-4 h-4 mr-1" /> Manage Patterns
                    </Link>
                  </li>
                )}
                {authUser?.role === "ADMIN" && (
                  <li>
                    <Link to="/add-problem" className="hover:bg-primary hover:text-white text-base font-semibold">
                      <Code className="w-4 h-4 mr-1" /> Add Problem
                    </Link>
                  </li>
                )}
                {authUser?.role === "ADMIN" && (
                  <li>
                    <Link to="/dashboard/contest/create-contest" className="hover:bg-primary hover:text-white text-base font-semibold">
                      <Trophy className="w-4 h-4 mr-1" /> Create Contest
                    </Link>
                  </li>
                )}
                {authUser?.role === "ADMIN" && (
                  <li>
                    <Link to="/dashboard/edit-sheets" className="hover:bg-primary hover:text-white text-base font-semibold">
                      <Sheet className="w-4 h-4 mr-1" /> Manage Sheets
                    </Link>
                  </li>
                )}
                {authUser?.role === "ADMIN" && (
                  <li>
                    <Link to="/admin/monitoring" className="hover:bg-success hover:text-white text-base font-semibold">
                      <Activity className="w-4 h-4 mr-1" /> Monitoring Dashboard
                    </Link>
                  </li>
                )}
                {authUser?.role === "ADMIN" && (
                  <li>
                    <Link to="/admin/analytics" className="hover:bg-info hover:text-white text-base font-semibold">
                      <BarChart3 className="w-4 h-4 mr-1" /> User Analytics
                    </Link>
                  </li>
                )}
                <li>
                  <LogoutButton className="hover:bg-primary hover:text-white">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </LogoutButton>
                </li>
              </ul>
            </div>

            {/* Mobile right side: theme toggle + hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleTheme}
                className="btn btn-sm btn-ghost text-xl"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun /> : <Moon />}
              </button>
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="btn btn-sm btn-ghost"
                aria-label="Open menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile slide-down drawer (md and below only) ── */}
      {mobileOpen && (
        <div className="md:hidden fixed top-[88px] left-0 right-0 z-40 mx-4">
          <div className="bg-base-100/95 backdrop-blur-lg border border-base-200 rounded-2xl shadow-2xl p-4 flex flex-col gap-3">
            {/* Nav links */}
            <div className="flex flex-col gap-2">
              <Link to="/dashboard/contest" onClick={() => setMobileOpen(false)}>
                <button className="btn btn-warning btn-sm font-bold w-full">Contests</button>
              </Link>
              <Link to="/dashboard/pricing" onClick={() => setMobileOpen(false)}>
                <button className="btn btn-warning btn-sm font-bold w-full">Pricing</button>
              </Link>
              <Link to="/patterns" onClick={() => setMobileOpen(false)}>
                <button className="btn btn-accent btn-sm font-bold w-full">Patterns</button>
              </Link>
            </div>

            <div className="divider my-0" />

            {/* User info */}
            <div className="flex items-center gap-3 px-1">
              <img
                src={authUser?.image || "https://avatar.iran.liara.run/public/boy"}
                alt="avatar"
                className="w-9 h-9 rounded-full border"
              />
              <div>
                <p className="font-semibold text-sm">{authUser?.name}</p>
                <p className="text-xs text-base-content/50">{authUser?.email}</p>
              </div>
            </div>

            {/* Menu links */}
            <ul className="menu menu-sm w-full">
              <li>
                <Link to="/profile" className="hover:bg-primary hover:text-white font-semibold" onClick={() => setMobileOpen(false)}>
                  <User className="w-4 h-4" /> My Profile
                </Link>
              </li>
              <li>
                <Link to="/sheets" className="hover:bg-primary hover:text-white font-semibold" onClick={() => setMobileOpen(false)}>
                  <Sheet className="w-4 h-4" /> Sheets
                </Link>
              </li>
              <li>
                <Link to="/patterns" className="hover:bg-primary hover:text-white font-semibold" onClick={() => setMobileOpen(false)}>
                  <BookOpen className="w-4 h-4" /> Patterns
                </Link>
              </li>

              {authUser?.role === "ADMIN" && (
                <>
                  <li className="menu-title text-xs opacity-50 uppercase pt-2">Admin</li>
                  <li>
                    <Link to="/admin/patterns" className="hover:bg-primary hover:text-white font-semibold" onClick={() => setMobileOpen(false)}>
                      <BookOpen className="w-4 h-4" /> Manage Patterns
                    </Link>
                  </li>
                  <li>
                    <Link to="/add-problem" className="hover:bg-primary hover:text-white font-semibold" onClick={() => setMobileOpen(false)}>
                      <Code className="w-4 h-4" /> Add Problem
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/contest/create-contest" className="hover:bg-primary hover:text-white font-semibold" onClick={() => setMobileOpen(false)}>
                      <Trophy className="w-4 h-4" /> Create Contest
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/edit-sheets" className="hover:bg-primary hover:text-white font-semibold" onClick={() => setMobileOpen(false)}>
                      <Sheet className="w-4 h-4" /> Manage Sheets
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/monitoring" className="hover:bg-success hover:text-white font-semibold" onClick={() => setMobileOpen(false)}>
                      <Activity className="w-4 h-4" /> Monitoring Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/analytics" className="hover:bg-info hover:text-white font-semibold" onClick={() => setMobileOpen(false)}>
                      <BarChart3 className="w-4 h-4" /> User Analytics
                    </Link>
                  </li>
                </>
              )}

              <li>
                <LogoutButton className="hover:bg-error hover:text-white font-semibold w-full">
                  <LogOut className="w-4 h-4" /> Logout
                </LogoutButton>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
