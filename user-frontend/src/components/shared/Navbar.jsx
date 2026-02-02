import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/thunks/authThunks/AuthThunk.js";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((s) => s.auth);

  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await dispatch(logoutUser());
      if (logoutUser.fulfilled.match(res)) {
        toast.success("Logged out successfully.");
        navigate("/login");
      } else {
        const msg = res?.payload || "Failed to logout";
        toast.error(typeof msg === "string" ? msg : "Failed to logout");
      }
    } catch {
      toast.error("Network error while logging out");
    } finally {
      setOpen(false);
    }
  };

  const baseLink =
    "text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200";
  const activeLink = "bg-blue-600 text-white shadow-md hover:bg-blue-700";
  const inactiveLink = "text-gray-700 hover:text-blue-700 hover:bg-blue-50";

  return (
    <nav className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Brand + Desktop Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-90 transition"
              onClick={() => setOpen(false)}
            >
              MyApp
            </Link>

            {/* Desktop center links */}
            <div className="hidden md:flex items-center gap-2">
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `${baseLink} ${isActive ? activeLink : inactiveLink}`
                }
                onClick={() => setOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `${baseLink} ${isActive ? activeLink : inactiveLink}`
                }
                onClick={() => setOpen(false)}
              >
                About Us
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `${baseLink} ${isActive ? activeLink : inactiveLink}`
                }
                onClick={() => setOpen(false)}
              >
                Contact Us
              </NavLink>
              <NavLink to="/inventory" className="...">
                Inventory
              </NavLink>

              {/* ✅ Add Inventory */}
              <NavLink
                to="/inventory/add"
                className={({ isActive }) =>
                  `${baseLink} ${isActive ? activeLink : inactiveLink}`
                }
                onClick={() => setOpen(false)}
              >
                Add Inventory
              </NavLink>
            </div>
          </div>

          {/* Right: Auth + Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user?.name ? (
              <span className="text-sm text-gray-600">
                Hi,{" "}
                <span className="font-semibold text-gray-900">{user.name}</span>
              </span>
            ) : null}

            {!isAuthenticated ? (
              <>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `${baseLink} ${isActive ? activeLink : inactiveLink}`
                  }
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `${baseLink} ${isActive ? activeLink : inactiveLink}`
                  }
                >
                  Login
                </NavLink>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className={`ml-3 flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all
    ${
      loading
        ? "text-gray-400 cursor-not-allowed"
        : "text-red-600 hover:bg-red-50 hover:text-red-700"
    }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7"
                  />
                </svg>

                {loading ? "Logging out..." : "Logout"}
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            <svg
              className={`h-6 w-6 ${open ? "hidden" : "block"}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              className={`h-6 w-6 ${open ? "block" : "hidden"}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t bg-white/90 backdrop-blur transition-all">
          <div className="mx-auto max-w-7xl px-4 py-4 space-y-3">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `block ${baseLink} ${isActive ? activeLink : inactiveLink}`
              }
              onClick={() => setOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `block ${baseLink} ${isActive ? activeLink : inactiveLink}`
              }
              onClick={() => setOpen(false)}
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `block ${baseLink} ${isActive ? activeLink : inactiveLink}`
              }
              onClick={() => setOpen(false)}
            >
              Contact Us
            </NavLink>

            <div className="pt-3 border-t">
              {isAuthenticated ? (
                <>
                  <span className="block text-sm text-gray-700 mb-2">
                    Logged in as{" "}
                    <span className="font-semibold text-gray-900">
                      {user?.name || "User"}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loading}
                    className={`w-full px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                      loading
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-gray-900 to-black text-white hover:opacity-90 shadow-sm"
                    }`}
                  >
                    {loading ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `block ${baseLink} ${
                        isActive ? activeLink : inactiveLink
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    Register
                  </NavLink>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `block ${baseLink} ${
                        isActive ? activeLink : inactiveLink
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
