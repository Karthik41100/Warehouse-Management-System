import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Services/api";

const AddProduct = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || price < 0) {
      setError("Please enter the valid name and positive price");
      return;
    }

    try {
      await api.post("/Products", {
        name: name,
        price: parseFloat(price),
        stockQuantity: parseFloat(stock),
      });

      alert("product added");
      navigate("/products");
    } catch (err) {
      console.error(err);
      setError("Failed to add product. Do you have Admin access");
    }
  };

  return (
    <div className="container mt-5">
      <div
        className="card-shadow p-4 mx-auto"
        style={{ maxWidth: "500px" }}
      ></div>
      <h3 className="text-center">Add new Product</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          ></input>
        </div>
        <div className="mb-3">
          <label className="form-label">Stock Quantity</label>
          <input
            type="number"
            className="form-control"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          ></input>
        </div>

        <button type="submit" className="btn btn-success w-100">
          save
        </button>
        <button
          type="button"
          className="btn btn-secondary w-100 mt-2"
          onClick={() => navigate("/products")}
        >
          cancel
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
