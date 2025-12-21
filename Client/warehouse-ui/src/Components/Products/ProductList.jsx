import { useEffect, useState } from "react";
import api from "../../Services/api";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaBoxOpen } from "react-icons/fa";
import DashboardStats from "../DashboardStats";

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(
          `/Products?pageNumber=${page}&pageSize=${pageSize}&searchTerm=${searchTerm}`
        );
        setProducts(response.data);
      } catch (error) {
        alert("Failed to Load Product!!. Are you Logged In?");
        console.error(error);
      }
    };
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timer);
  }, [page, pageSize, searchTerm]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you confirm want to delete this product?")) {
      return;
    }

    try {
      await api.delete(`/Products/${id}`);

      setProducts(products.filter((product) => product.id !== id));

      alert("Product Delete Successfully");
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete. Do you have Administrative permission?");
    }
  };

  const handleNext = () => setPage(page + 1);
  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };
  return (
    <div className="container mt-4">
      {/* 1. Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Product Dashboard</h2>
        {/* We moved Logout to Navbar, so no button here */}
      </div>

      {/* 2. Stats Cards */}
      <DashboardStats />

      {/* 3. Search & Add Button */}
      <div className="row mb-3">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control shadow-sm"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="col-md-4 text-end">
          {userRole === "Admin" && (
            <button
              className="btn btn-primary shadow-sm"
              onClick={() => navigate("/add")}
            >
              + Add Product
            </button>
          )}
        </div>
      </div>

      {/* 4. The Pro Table Card */}
      <div className="card shadow-sm border-0 rounded overflow-hidden">
        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light text-secondary">
              <tr>
                <th className="py-3 ps-4">Product Name</th>
                <th className="py-3">Price</th>
                <th className="py-3">Stock Status</th>
                {userRole === "Admin" && (
                  <th className="py-3 text-end pe-4">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((p) => (
                  <tr key={p.id} style={{ cursor: "pointer" }}>
                    {/* Name */}
                    <td className="ps-4 fw-bold text-dark">
                      <FaBoxOpen className="text-secondary me-2" />
                      {p.name}
                    </td>

                    {/* Price */}
                    <td className="text-muted">
                      $
                      {p.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>

                    {/* Status Badge */}
                    <td>
                      {p.quantity < 10 ? (
                        <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill">
                          ⚠️ Low Stock ({p.quantity})
                        </span>
                      ) : (
                        <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                          In Stock ({p.quantity})
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    {userRole === "Admin" && (
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-light btn-sm me-2 text-primary"
                          onClick={() => navigate(`/edit/${p.id}`)}
                          title="Edit"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          className="btn btn-light btn-sm text-danger"
                          onClick={() => handleDelete(p.id)}
                          title="Delete"
                        >
                          <FaTrash size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={userRole === "Admin" ? 4 : 3}
                    className="text-center py-5"
                  >
                    <div className="text-muted">
                      <FaBoxOpen size={40} className="mb-3 opacity-25" />
                      <p>No products found matching your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 5. NEW: Card Footer with Pagination */}
        <div className="card-footer bg-white py-3 d-flex justify-content-between align-items-center border-0">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={handlePrev}
            disabled={page === 1}
          >
            &larr; Previous
          </button>

          <span className="text-muted fw-bold small">Page {page}</span>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={handleNext}
            disabled={products.length < pageSize}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
