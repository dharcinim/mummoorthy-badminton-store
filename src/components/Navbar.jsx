import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home",         path: "/"            },
  { label: "Categories",   path: "/categories"  },
  { label: "New Arrivals", path: "/new-arrivals" },
  { label: "Best Sellers", path: "/best-sellers" },
  { label: "Collections",  path: "/collections"  },
  { label: "Brands",       path: "/brands"       },
  { label: "Services",     path: "/services"     },
];

function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();

  return (
    <div className="navbar">
      {navItems.map((item) => (
        <span
          key={item.path}
          className="nav-item"
          onClick={() => navigate(item.path)}
          style={{
            color: location.pathname === item.path ? "#00CC7A" : "",
            borderBottom: location.pathname === item.path ? "2px solid #00CC7A" : "",
            paddingBottom: "4px",
          }}
        >
          {item.label}
        </span>
      ))}
    </div>
  );
}

export default Navbar;