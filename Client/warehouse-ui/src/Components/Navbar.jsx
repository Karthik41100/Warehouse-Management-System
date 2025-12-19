import { Link, useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();

  const userRole = localStorage.getItem("role");
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    if (!window.confirm("Are you surre want to logout?")) return;

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark  bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/products">
          WareHouse App
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbar">
          <ul className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/products">
                    Dashboard
                  </Link>
                </li>

                {userRole === "Admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/add">
                      Add Product
                    </Link>
                  </li>
                )}
                <li className="nav-item ms-2">
                  <button
                    className="btn btn-outline-danger btn-sm mt-1"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
