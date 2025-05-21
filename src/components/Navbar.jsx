import React, { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("profileName");
    setIsLoggedIn(false);
    navigate("/login");
  }

  return (
    <nav className="bg-green max-[1053px]:bg-transparent w-full py-4 px-4 flex items-center relative z-50 font-sans">
      <div className="flex flex-1 min-w-0 flex-row max-[1053px]:flex-row-reverse items-center justify-between">
        {/* Hamburger */}
        <button
          className="hidden max-[1053px]:block ml-4 max-[1053px]:ml-0 max-[1053px]:mr-4"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg width="32" height="32" fill="currentColor">
            <rect y="7" width="28" height="4" rx="1.5" />
            <rect y="14" width="28" height="4" rx="1.5" />
            <rect y="21" width="28" height="4" rx="1.5" />
          </svg>
        </button>

        {/* Logo */}
        <Link to="/">
          <img
            src={logo}
            alt="Holidaze logo"
            className="h-8 w-auto flex-shrink-0"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="flex-1 flex justify-center gap-20 max-[1053px]:hidden">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `text-base sm:text-lg md:text-xl hover:underline ${
              isActive ? "font-bold text-black underline" : ""
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/venues"
          className={({ isActive }) =>
            `text-base sm:text-lg md:text-xl hover:underline ${
              (isActive && window.location.pathname === "/venues") ||
              window.location.pathname.match(/^\/venues\/[^/]+$/)
                ? "font-bold text-black underline"
                : ""
            }`
          }
        >
          Venues
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `text-base sm:text-lg md:text-xl hover:underline ${
              isActive || 
              window.location.pathname.includes("/create") || 
              window.location.pathname.includes("/edit")
                ? "font-bold text-black underline"
                : ""
            }`
          }
        >
          Profile
        </NavLink>
      </div>

      <div className="flex-1 flex justify-end max-[1053px]:hidden">
        {!isLoggedIn ? (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `text-base sm:text-lg md:text-xl hover:underline ${
                isActive || window.location.pathname.includes("/register")
                  ? "font-bold text-black underline"
                  : ""
              }`
            }
          >
            Login
          </NavLink>
        ) : (
          <button
            onClick={handleLogout}
            className="text-base sm:text-lg md:text-xl hover:underline bg-transparent border-none cursor-pointer"
          >
            Log out
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <>
          {/* overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/10"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu overlay"
          />

          {/* Dropdown */}
          <div className="absolute left-1/2 top-full -translate-x-1/2 mt-4 bg-white shadow-xl rounded-xl p-8 flex flex-col gap-6 min-w-[80vw] max-w-md z-50">
            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-2xl ${isActive ? "font-bold text-black underline" : ""}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/venues"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-2xl ${
                  (isActive && window.location.pathname === "/venues") ||
                  window.location.pathname.match(/^\/venues\/[^/]+$/)
                    ? "font-bold text-black underline"
                    : ""
                }`
              }
            >
              Venues
            </NavLink>
            <NavLink
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-2xl ${
                  isActive || 
                  window.location.pathname.includes("/create") || 
                  window.location.pathname.includes("/edit")
                    ? "font-bold text-black underline"
                    : ""
                }`
              }
            >
              Profile
            </NavLink>
            {!isLoggedIn ? (
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `text-2xl ${
                    isActive || window.location.pathname.includes("/register")
                      ? "font-bold text-black underline"
                      : ""
                  }`
                }
              >
                Log in
              </NavLink>
            ) : (
              <button
                onClick={handleLogout}
                className="text-2xl text-left hover:underline bg-transparent border-none cursor-pointer"
              >
                Log out
              </button>
            )}
          </div>
        </>
      )}
    </nav>
  );
}
