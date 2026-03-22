import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import logo from "../assets/—Pngtree—writing icon_7963293.png";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="sticky top-0 z-30 border-b border-[#eadfd1] bg-[#fff8ef]/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/dashboard" className="group flex items-center gap-3 text-xl font-semibold text-terracotta">
          <img
            src={logo}
            alt="My Diary logo"
            className="h-11 w-11 rounded-xl border border-[#ddc8b3] bg-white/90 object-cover p-1 shadow-sm transition group-hover:rotate-3 group-hover:scale-105"
          />
          <span className="tracking-wide">My Diary</span>
        </Link>
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <Link
              to="/admin"
              className="rounded-lg border border-[#d7b99c] bg-white/80 px-3 py-2 text-sm text-cocoa transition hover:-translate-y-0.5"
            >
              Admin
            </Link>
          ) : null}
          <span className="hidden text-sm text-cocoa/80 sm:inline">Hi, {user?.name || "Writer"}</span>
          <button
            onClick={logout}
            className="rounded-lg bg-terracotta px-3 py-2 text-sm text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-95"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
