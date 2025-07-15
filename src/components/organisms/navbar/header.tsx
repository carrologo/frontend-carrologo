
import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { logout } from "../../../services/auth.service";
import "./header.css";

const Navbar = () => {
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

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header>
        <nav ref={navRef}>
          <div className="logo-container">
            <NavLink to ="/home" onClick={() => setMenuOpen(false)}>
              <img
                src="/svg/logos/logoHeader.webp"
                alt="Logo"
                className="logo"
              />
            </NavLink>
          </div>

          <div className="nav-links-container">
            <div className={menuOpen ? "nav-links open" : "nav-links"}>
              <NavLink to="/home" onClick={() => setMenuOpen(false)}>
                Inicio
              </NavLink>
              <NavLink to="/clientes" onClick={() => setMenuOpen(false)}>
                Clientes
              </NavLink>
              <NavLink to="/vehiculos" onClick={() => setMenuOpen(false)}>
                Vehiculos
              </NavLink>
              <NavLink to="/transacciones" onClick={() => setMenuOpen(false)}>
                Transacciones
              </NavLink>
            </div>
          </div>

           <div className="nav-right">
            <button
              className="logout-btn"
              onClick={handleLogout}
              aria-label="Cerrar sesión"
            >
                <LogOut size={20} />

              <span className="logout-text">Cerrar sesión</span>
            </button>
            
            <button
              className="burger-btn"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <Menu className={menuOpen ? "menu-icon open" : "menu-icon"} />
            </button>
          </div>
        </nav>
      </header>
      <div className="main-content">
        <Outlet />
      </div>
    </>
  );
};

export default Navbar;