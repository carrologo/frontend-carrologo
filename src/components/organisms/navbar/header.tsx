import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header>
        <nav ref={navRef}>
          <div className="logo-container">
            <img
              src="/public/svg/logos/logoHeader.webp"
              alt="Logo"
              className="logo"
            />
            <span>ElCarrologo</span>
          </div>

          <div className={menuOpen ? "nav-links open" : "nav-links"}>
            <NavLink to="/clientes" onClick={() => setMenuOpen(false)}>
              Clientes
            </NavLink>
          </div>

          <button
            className="burger-btn"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={menuOpen ? "burger open" : "burger"} />
          </button>
        </nav>
      </header>
      <Outlet />
    </>
  );
};

export default Header;
