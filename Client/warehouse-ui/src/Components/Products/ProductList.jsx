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

  // 1. Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(
          `/Products?pageNumber=${page}&pageSize=${pageSize}&searchTerm=${searchTerm}`
        );
        setProducts(response.data);
      } catch (error) {
        // Only alert if it's a real error (not just a cancellation)
        console.error("Fetch error:", error);
      }
    };

    // Debounce search to prevent too many API calls
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timer);
  }, [page, pageSize, searchTerm]);

  // 2. Delete Handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await api.delete(`/Products/${id}`);
      // Remove from UI immediately
      setProducts(
        products.filter((product) => (product.id || product.Id) !== id)
      );
      alert("Product Deleted Successfully");
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete. Do you have Administrative permission?");
    }
  };

  // 3. Pagination Handlers
  const handleNext = () => setPage(page + 1);
  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Product Dashboard</h2>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Search & Add Button */}
      <div className="row mb-3">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control shadow-sm"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset to page 1 on search
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

      {/* Product Table */}
      <div className="card shadow-sm border-0 rounded overflow-hidden">
        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light text-secondary">
              <tr>
                <th className="py-3 ps-4">Product Name</th>
                <th className="py-3">Category</th>
                <th className="py-3">Price</th>
                <th className="py-3">Stock Status</th>
                {userRole === "Admin" && (
                  <th className="py-3 text-end pe-4">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((p) => {
                  // --- 🛡️ SAFETY CHECK: Handle Case Sensitivity ---
                  const productId = p.id || p.Id;
                  const stock = p.quantity;
                  const price = p.price || p.Price || 0;
                  const name = p.name || p.Name || "Unknown";
                  const category =
                    p.categoryName || p.CategoryName || "Uncategorized";
                  return (
                    <tr key={productId} style={{ cursor: "pointer" }}>
                      {/* Name */}
                      <td className="ps-4 fw-bold text-dark">
                        <FaBoxOpen className="text-secondary me-2" />
                        {name}
                      </td>

                      {/* Category Badge */}
                      <td>
                        <span className="badge bg-light text-dark border">
                          {category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="text-muted">
                        $
                        {price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>

                      {/* Stock Status */}
                      <td>
                        {stock < 10 ? (
                          <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill">
                            ⚠️ Low Stock ({stock})
                          </span>
                        ) : (
                          <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                            In Stock ({stock})
                          </span>
                        )}
                      </td>

                      {/* Actions (Admin Only) */}
                      {userRole === "Admin" && (
                        <td className="text-end pe-4">
                          <button
                            className="btn btn-light btn-sm me-2 text-primary"
                            onClick={() => navigate(`/edit/${productId}`)} // Using the safe ID
                            title="Edit"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            className="btn btn-light btn-sm text-danger"
                            onClick={() => handleDelete(productId)} // Using the safe ID
                            title="Delete"
                          >
                            <FaTrash size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                // Empty State
                <tr>
                  <td
                    colSpan={userRole === "Admin" ? 5 : 4}
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

        {/* Pagination Footer */}
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
            // Disable if we have fewer items than the page size (means we are at the end)
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
