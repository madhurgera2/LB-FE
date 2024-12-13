import React, { Fragment, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import Toggle from "../util/Toggle/Toggle";
import "./navbar.css";
import { useToast } from "../../services/toastService";
import { SimpleToast } from "../util/Toast/Toast";

export const Navbar = (props) => {
  const dark = props.theme;
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [Role, setRole] = useState("");

  const { toast, showToast, hideToast } = useToast();
  const user = JSON.parse(localStorage.getItem("user_data"));

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const closeMobileMenu = () => setIsNavOpen(false);

  const checkAuthentication = () => {
    const role = localStorage.getItem("Role");
    const isAuthenticated = user ? true : false;

    setLoggedIn(isAuthenticated);
    setRole(role);
    setUsername(localStorage.getItem("Username"));
  };

  const handleLogout = () => {
    localStorage.clear();
    showToast("You have successfully logged out.", "success");
    window.location.href = "/login";
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <Fragment>
      <nav className={`${"navbar-div"} ${dark ? "navbar-div-dark" : ""}`}>
        {/* Logo */}
        <NavLink to="/" className={"navbar-logo"}>
          <img src="logo2.png" alt="logo" height="25px" />
        </NavLink>

        {/* Mobile Menu Icon */}
        <div className={"menu-icon"} onClick={toggleNav}>
          <i className={isNavOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </div>

        {/* Navbar Links */}
        <ul
          className={
            isNavOpen
              ? `${"nav-menu"} ${"active"} ${dark ? "nav-menu-dark" : ""}`
              : `${"nav-menu"} ${dark ? "nav-menu-dark" : ""}`
          }
        >
          <li className={dark ? "nav-item-dark" : "nav-item"}>
            <NavLink
              activeClassName={"active-link"}
              to="/"
              className={({ isActive }) =>
                `${
                  isActive ? (dark ? "active-link-dark" : "active-link") : ""
                } ${dark ? "nav-links-dark" : "nav-links"}`
              }
              onClick={closeMobileMenu}
            >
              Home
            </NavLink>
          </li>

          <li className={dark ? "nav-item-dark" : "nav-item"}>
            <NavLink
              activeClassName={"active-link"}
              to="/about-us"
              className={({ isActive }) =>
                `${
                  isActive ? (dark ? "active-link-dark" : "active-link") : ""
                } ${dark ? "nav-links-dark" : "nav-links"}`
              }
              onClick={closeMobileMenu}
            >
              About Us
            </NavLink>
          </li>

          <li className={dark ? "nav-item-dark" : "nav-item"}>
            <NavLink
              activeClassName={"active-link"}
              to="/contact-us"
              className={({ isActive }) =>
                `${
                  isActive ? (dark ? "active-link-dark" : "active-link") : ""
                } ${dark ? "nav-links-dark" : "nav-links"}`
              }
              onClick={closeMobileMenu}
            >
              Contact Us
            </NavLink>
          </li>
          {user?.role === "admin" && (
            <li className={dark ? "nav-item-dark" : "nav-item"}>
              <NavLink
                activeClassName={"active-link"}
                to="/admin-dashboard"
                className={({ isActive }) =>
                  `${
                    isActive ? (dark ? "active-link-dark" : "active-link") : ""
                  } ${dark ? "nav-links-dark" : "nav-links"}`
                }
                onClick={closeMobileMenu}
              >
                Admin Dashboard
              </NavLink>
            </li>
          )}

          {Role === "user" && (
            <li className={dark ? "nav-item-dark" : "nav-item"}>
              <NavLink
                activeClassName={"active-link"}
                to="/user-dashboard"
                className={({ isActive }) =>
                  `${
                    isActive ? (dark ? "active-link-dark" : "active-link") : ""
                  } ${dark ? "nav-links-dark" : "nav-links"}`
                }
                onClick={closeMobileMenu}
              >
                User Dashboard
              </NavLink>
            </li>
          )}

          {loggedIn ? (
            <li className={dark ? "nav-item-dark" : "nav-item"}>
              <Link
                to="/login"
                className={dark ? "nav-links-mobile-dark" : "nav-links-mobile"}
                onClick={handleLogout}
              >
                Logout
              </Link>
            </li>
          ) : (
            <>
              <li className={dark ? "nav-item-dark" : "nav-item"}>
                <Link
                  to="/register"
                  className={
                    dark ? "nav-links-mobile-dark" : "nav-links-mobile"
                  }
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Link>
              </li>
              <li className={dark ? "nav-item-dark" : "nav-item"}>
                <Link
                  to="/login"
                  className={
                    dark ? "nav-links-mobile-dark" : "nav-links-mobile"
                  }
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
              </li>
            </>
          )}
          <div onClick={closeMobileMenu} className={"nav-links-toggle"}>
            <Toggle handleClick={props.handleClick} theme={props.theme} />
          </div>
        </ul>

        {loggedIn ? (
          <NavLink
            to="/login"
            activeClassName={"button-div"}
            className={({ isActive }) =>
              `${isActive ? (dark ? "button-div-dark" : "button-div") : ""} ${
                isActive ? "" : ""
              } ${dark ? "nav-admin-button-dark" : "nav-admin-button"}`
            }
            onClick={handleLogout}
          >
            Logout
          </NavLink>
        ) : (
          <>
            <NavLink
              to="/login"
              activeClassName={"button-div"}
              className={({ isActive }) =>
                `${isActive ? (dark ? "button-div-dark" : "button-div") : ""} ${
                  isActive ? "" : ""
                } ${dark ? "nav-admin-button-dark" : "nav-admin-button"}`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              activeClassName={"button-div"}
              className={({ isActive }) =>
                `${isActive ? (dark ? "button-div-dark" : "button-div") : ""} ${
                  isActive ? "" : ""
                } ${dark ? "nav-admin-button-dark" : "nav-admin-button"}`
              }
            >
              Sign Up
            </NavLink>
          </>
        )}

        <div className={"nav-toggle"}>
          <Toggle handleClick={props.handleClick} theme={props.theme} />
        </div>
      </nav>
      <SimpleToast
        open={toast.open}
        severity={toast.severity}
        message={toast.message}
        handleCloseToast={hideToast}
      />
    </Fragment>
  );
};
