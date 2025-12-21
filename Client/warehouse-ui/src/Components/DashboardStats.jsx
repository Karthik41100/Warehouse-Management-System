import { useEffect, useState } from "react";
import api from "../Services/api";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalInventoryValue: 0,
    lowStockCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/Products/stats");
        setStats(response.data);
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="row mb-4">
      <div className="col-md-4">
        <div className="card text-white bg-primary mb-3 shadow">
          <div className="card-header">Total Products</div>
          <div className="card-body">
            <h3 className="card-title">{stats.totalProducts}</h3>
            <p className="card-text">Items in Warehouse</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card text-white bg-primary mb-3 shadow">
          <div className="card-header">Total Value</div>
          <div className="card-body">
            <h3 className="card-title">
              {stats.totalInventoryValue.toLocaleString()}
            </h3>
            <p className="card-text">Total asset value</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div
          className={`card text-white mb-3 shadow ${
            stats.lowStockCount > 0 ? "bg-danger" : "bg-white"
          }`}
        >
          <div className="card-header">Low Stock Alerts</div>
          <div className="card-body">
            <h3 className="card-title">{stats.lowStockCount}</h3>
            <p className="card-text">Items below 10 quantity</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardStats;
