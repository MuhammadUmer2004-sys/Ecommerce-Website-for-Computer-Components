import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Badge, Tooltip, CircularProgress, Fade } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HistoryIcon from "@mui/icons-material/History";
import StarsIcon from "@mui/icons-material/Stars";
import LogoutIcon from "@mui/icons-material/Logout";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "./../components-css/Navbar.css";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { productService } from "../services/productService";

const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { isLoggedIn, user, setIsLoggedIn, setUser } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 500));

      setShowDropdown(false);

      setIsLoggedIn(false);
      setUser(null);

      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) return;

    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm("");
  };

  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string?.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  const AuthSection = () => {
    if (isLoggedIn) {
      return (
        <div className="d-flex align-items-center">
          <Badge
            badgeContent={cartCount}
            color="error"
            sx={{
              marginRight: "2rem",
              "& .MuiBadge-badge": {
                backgroundColor: "#dc3545",
                color: "white",
                fontSize: "0.75rem",
                minWidth: "18px",
                height: "18px",
              },
            }}
          >
            <Link to="/cart" style={{ color: "inherit" }}>
              <ShoppingCartIcon />
            </Link>
          </Badge>

          <div className="user-section" ref={dropdownRef}>
            <div className="d-flex align-items-center">
              <span className="username me-3">{user?.firstName || "User"}</span>
              <Avatar
                onClick={() => setShowDropdown(!showDropdown)}
                className="avatar-button"
                sx={{
                  bgcolor: stringToColor(user?.firstName),
                  cursor: "pointer",
                }}
              >
                {user?.firstName?.[0]?.toUpperCase() || "U"}
              </Avatar>
            </div>
            {showDropdown && (
              <div className="user-dropdown">
                <Link to="/orders" className="user-dropdown-item">
                  <HistoryIcon className="me-2" />
                  Orders
                </Link>
                <Link to="/wishlist" className="user-dropdown-item">
                  <FavoriteIcon className="me-2" />
                  Wishlist
                </Link>
                <Link to="/rewards" className="user-dropdown-item">
                  <StarsIcon className="me-2" />
                  Rewards
                </Link>
                <button
                  className="user-dropdown-item logout-button"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  <LogoutIcon className="me-2" />
                  {isLoading ? <CircularProgress size={16} /> : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="nav-buttons d-flex">
        <Link to="/login" className="btn btn-dark me-3">
          Login
        </Link>
        <Link to="/register" className="btn btn-dark me-3">
          Register
        </Link>
      </div>
    );
  };

  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary rounded"
      aria-label="Eleventh navbar example"
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          WishTech
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarsExample09"
          aria-controls="navbarsExample09"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarsExample09">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Products
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/products/laptops">
                    Laptops
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/products/storage">
                    SSD and HDD
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/products/monitors">
                    Monitors
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/products/processors">
                    Processors
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/products/cases">
                    PC Case
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/products/ram">
                    Memory
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/products/gpus">
                    Graphics Cards
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/products/motherboards">
                    Motherboards
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/products/desktops">
                    Desktops
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/products/keyboards">
                    Keyboards
                  </Link>
                </li>
                {}
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact Us
              </Link>
            </li>
          </ul>
          <form className="d-flex me-3 ms-auto" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-dark me-5" type="submit">
              <i className="fas fa-search"></i>
            </button>
          </form>
          <AuthSection />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
