import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to={user ? "/dashboard" : "/"} className="navbar-logo" onClick={closeMenu}>
          <svg
            className="navbar-logo-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <path d="m7.5 12.5 2.5 2.5 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          taskmangmt
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar-links ${menuOpen ? "navbar-links-open" : ""}`}>
          <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
            Home
          </NavLink>

          {user && (
            <>
              <NavLink to="/dashboard" className={navLinkClass} onClick={closeMenu}>
                Dashboard
              </NavLink>
              <NavLink to="/tasks" className={navLinkClass} onClick={closeMenu}>
                My Tasks
              </NavLink>
            </>
          )}

          {user ? (
            <div className="navbar-user">
              <span className="navbar-username">Hi, {user.name}</span>
              <button className="btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="navbar-auth-links">
              <Link to="/login" className="btn-link" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="btn-link btn-primary-link" onClick={closeMenu}>
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
