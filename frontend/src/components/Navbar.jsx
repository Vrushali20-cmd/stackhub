import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      {/* Logo */}
      <h2 className="logo">StackHub</h2>

      {/* Links */}
      <div className="links">
        <NavLink to="/" className="link">
          Home
        </NavLink>

        <NavLink to="/categories" className="link">
          Categories
        </NavLink>

        {!user ? (
          <>
            <NavLink to="/login" className="link">
              Login
            </NavLink>

            <NavLink to="/signup" className="link">
              Signup
            </NavLink>
          </>
        ) : (
          <>
            {/* Show Admin only if role is admin */}
            {user?.role === "admin" && (
              <NavLink to="/admin" className="link">
                Admin
              </NavLink>
            )}

            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
