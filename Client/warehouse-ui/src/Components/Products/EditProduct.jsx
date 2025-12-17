import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import api from "../../Services/api";
const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/Products/${id}`);
        const p = response.data;
        console.log(p);
        setName(p.name);
        setPrice(p.price);
        setStock(p.StockQuantity);
      } catch (err) {
        alert("Error loading product");
        navigate("/products");
        console.error(err);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/Products/${id}`, {
        name: name,
        price: parseFloat(price),
        StockQuantity: parseInt(stock),
      });
      alert("Product Updated");
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("update failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "500px" }}>
        <h3 className="text-center">Edit Product</h3>
        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Price</label>
            <input
              type="number"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Quantity</label>
            <input
              type="number"
              className="form-control"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            ></input>
          </div>

          <button type="submit" className="btn btn-warning w-100">
            Update
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
    </div>
  );
};

export default EditProduct;
