import { useEffect, useState } from "react";
import api from "../../Services/api";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(
          `/Products?pageNumber=${page}&pageSize=${pageSize}`
        );
        setProducts(response.data);
      } catch (error) {
        alert("Failed to Load Product!!. Are you Logged In?");
        console.error(error);
      }
    };
    fetchProducts();
  }, [page, pageSize]);

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

  const handleLogout = () => {
    if (!window.confirm("Are you surre want to logout?")) return;

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login");
  };
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Product Dasboard</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
      {userRole === "Admin" && (
        <button
          className="btn btn-primary mb-2"
          onClick={() => navigate("/add")}
        >
          + Add Product
        </button>
      )}
      <table className="table table-striped table-hover shadow">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            {userRole === "Admin" && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.quantity}</td>
                {userRole === "Admin" && (
                  <td>
                    <button
                      className="btn btn-warning btn-sm-2 me-2"
                      onClick={() => navigate(`/edit/${p.id}`)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={userRole === "Admin" ? "3" : "4"}
                className="text-center"
              >
                No Products Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
        <button
          className="btn btn-secondary"
          onClick={handlePrev}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleNext}
          disabled={products.length < pageSize}
        >
          Next
        </button>
      </div>
      <span className="fw-bold">Page {page}</span>
    </div>
  );
};

export default ProductList;
