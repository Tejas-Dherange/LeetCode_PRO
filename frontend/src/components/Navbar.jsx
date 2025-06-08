import { Link } from "react-router-dom";
import { User, Code, LogOut, Trophy, Moon, Sun } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import LogoutButton from "./LogoutButton";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { authUser } = useAuthStore();
  // Set default theme to dark on mount
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);
  const [theme, setTheme] = useState(() =>
    document.documentElement.getAttribute("data-theme") || "dark"
  );

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <nav className="sticky top-0 z-50 w-full py-5">
      <div className="flex w-full justify-between items-center mx-auto max-w-4xl bg-black/15 shadow-lg shadow-neutral-600/5 backdrop-blur-lg border border-gray-200/10 p-4 rounded-2xl">
        {/* Logo Section */}
        <Link to="/dashboard" className="flex items-center gap-3 cursor-pointer">
          <img
            src="/leetlab.svg"
            className="h-18 w-18 bg-primary/20 text-primary border-none px-2 py-2 rounded-full"
          />
          <span className="text-lg md:text-2xl font-bold tracking-tight text-white hidden md:block">
            CodeLoom
          </span>
        </Link>
        {/* Theme Toggle Button and Contests Button */}
        
        {/* User Profile and Dropdown */}
        <div className="flex items-center gap-8">
          <div className="flex items-center  gap-2 ml-4">
          <button
            onClick={toggleTheme}
            className="btn btn-sm btn-ghost text-xl"
            aria-label="Toggle theme"
          >
            {theme === "dark" ?  <Sun />: <Moon/>}
          </button>
          <Link to="/dashboard/contest">
  <button className="btn btn-warning btn-sm font-bold  shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:brightness-110">
    Contests
  </button>
</Link>
        </div>
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar flex flex-row "
            >
              <div className="w-10 rounded-full ">
                <img
                  src={
                    authUser?.image ||
                    "https://avatar.iran.liara.run/public/boy"
                  }
                  alt="User Avatar"
                  className="object-cover border rounded-full w-10 h-10"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 space-y-3"
            >
              {/* Admin Option */}

              {/* Common Options */}
              <li>
                <p className="text-base font-semibold">{authUser?.name}</p>
                <hr className="border-gray-200/10" />
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:bg-primary hover:text-white text-base font-semibold"
                >
                  <User className="w-4 h-4 mr-2" />
                  My Profile
                </Link>
              </li>
              {authUser?.role === "ADMIN" && (
                <li>
                  <Link
                    to="/add-problem"
                    className="hover:bg-primary hover:text-white text-base font-semibold"
                  >
                    <Code className="w-4 h-4 mr-1" />
                    Add Problem
                  </Link>
                </li>
              )}
              {authUser?.role === "ADMIN" && (
                <li>
                  <Link
                    to="/dashboard/contest/create-contest"
                    className="hover:bg-primary hover:text-white text-base font-semibold"
                  >
                    <Trophy className="w-4 h-4 mr-1" />
                   Create Contest
                  </Link>
                </li>
              )}
              <li>
                <LogoutButton className="hover:bg-primary hover:text-white">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </LogoutButton>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
