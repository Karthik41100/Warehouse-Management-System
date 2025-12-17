import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProductList from "./Components/Products/ProductList";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Services/Login";
import AddProduct from "./Components/Products/AddProduct";
import EditProduct from "./Components/Products/EditProduct";
import Register from "./Services/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />}></Route>
        <Route path="/products" element={<ProductList />}></Route>
        <Route path="/add" element={<AddProduct />}></Route>
        <Route path="/edit/:id" element={<EditProduct />}></Route>
        <Route path="*" element={<Navigate to="/" />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
