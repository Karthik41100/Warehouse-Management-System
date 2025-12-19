import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProductList from "./Components/Products/ProductList";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Services/Login";
import AddProduct from "./Components/Products/AddProduct";
import EditProduct from "./Components/Products/EditProduct";
import Register from "./Services/Register";
import Navbar from "./Components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />}></Route>
          <Route path="/products" element={<ProductList />}></Route>
          <Route path="/add" element={<AddProduct />}></Route>
          <Route path="/edit/:id" element={<EditProduct />}></Route>
          <Route path="*" element={<Navigate to="/" />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
