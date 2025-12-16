import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "/Sabta_Logo.png";
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* TOP NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${isScrolled ? "bg-black/90 backdrop-blur-md" : "bg-transparent"}
      `}
      >
        <div className="flex items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <div className=" text-2xl font-bold">
            <img src={Logo} alt="logo" className="h-30 my-[-10px]" />
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-8 font-medium items-center">
            <li><Link to="/">HOME</Link></li>
            <li><Link to="/about">ABOUT US</Link></li>
            <li><Link to="/collections">COLLECTIONS</Link></li>
            <li><Link to="/blog">BLOG</Link></li>
            <li><Link to="/catalog">CATALOG</Link></li>
            <li><Link to="/contact">CONTACT US</Link></li>
            <li>
              <Link to="/new-arrival">
                <button className="p-2 bg-(--brand-bg) font-semibold rounded hover:scale-105 transition">
                  NEW ARRIVALS
                </button>
              </Link>
            </li>
          </ul>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* BACKDROP (click to close) */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* RIGHT SLIDING MOBILE MENU */}
      <div
        className={`
          fixed top-0 right-0 h-full w-3/4 max-w-xs
          bg-black/60 backdrop-blur-md
          text-white pt-6 pb-10 px-6
          transform transition-transform duration-300
          md:hidden z-50
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header row inside menu */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-lg font-semibold">Menu</span>
          <button
            className="text-2xl"
            onClick={() => setMenuOpen(false)}
          >
            ✖
          </button>
        </div>

        {/* Links stacked vertically */}
        <nav className="flex flex-col space-y-5 text-lg font-medium">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block">
            HOME
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="block">
            ABOUT US
          </Link>
          <Link to="/collections" onClick={() => setMenuOpen(false)} className="block">
            COLLECTIONS
          </Link>
          <Link to="/blog" onClick={() => setMenuOpen(false)} className="block">
            BLOG
          </Link>
          <Link to="/catalog" onClick={() => setMenuOpen(false)} className="block">
            CATALOG
          </Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="block">
            CONTACT US
          </Link>
          <Link to="/new-arrival" onClick={() => setMenuOpen(false)} className="block">
            <button>
              NEW ARRIVALS
            </button>
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
