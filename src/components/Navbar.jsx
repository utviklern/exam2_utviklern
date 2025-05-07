import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-green max-[1053px]:bg-transparent w-full py-4 px-4 flex items-center relative z-50">
      {/* Logo + Hamburger */}
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
          />
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="flex-1 flex justify-center gap-20 max-[1053px]:hidden">
        <NavLink
          to="/"
          className="font-bold text-base sm:text-lg md:text-xl hover:underline"
        >
          Home
        </NavLink>
        <NavLink
          to="/venues"
          className="text-base sm:text-lg md:text-xl hover:underline"
        >
          Venues
        </NavLink>
        <NavLink
          to="/profile"
          className="text-base sm:text-lg md:text-xl hover:underline"
        >
          Profile
        </NavLink>
      </div>

      <div className="flex-1 flex justify-end max-[1053px]:hidden">
        <NavLink
          to="/login"
          className="text-base sm:text-lg md:text-xl hover:underline"
        >
          Login
        </NavLink>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/10"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu overlay"
          />

          {/* Dropdown menu */}
          <div className="absolute left-1/2 top-full -translate-x-1/2 mt-4 bg-white shadow-xl rounded-xl p-8 flex flex-col gap-6 min-w-[80vw] max-w-md z-50">
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className="font-bold text-2xl"
            >
              Home
            </NavLink>
            <NavLink
              to="/venues"
              onClick={() => setMenuOpen(false)}
              className="text-2xl"
            >
              Venues
            </NavLink>
            <NavLink
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="text-2xl"
            >
              Profile
            </NavLink>
            <NavLink
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="text-2xl"
            >
              Log in
            </NavLink>
          </div>
        </>
      )}
    </nav>
  );
}
