import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          Student Task Manager
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
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          {user && (
            <>
              <Link to="/dashboard" onClick={closeMenu}>
                Dashboard
              </Link>
              <Link to="/tasks" onClick={closeMenu}>
                My Tasks
              </Link>
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
