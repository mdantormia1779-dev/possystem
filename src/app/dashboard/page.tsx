import React from "react";
import DashboardStats from "../Components/Dashboard/Homepage/DashboardStats";
import DashboardBanner from "../Components/Dashboard/Homepage/DashboardBanner";
import SalesLast30DaysChart from "../Components/Dashboard/Homepage/SalesLast30DaysChart";
import SalesCurrentFinancialYearChart from "../Components/Dashboard/Homepage/SalesCurrentFinancialYearChart";
import ProductStockAlert from "../Components/Dashboard/Homepage/ProductStockAlert";
import SalesOrderTable from "../Components/Dashboard/Homepage/SalesOrderTable";
import PendingShipments from "../Components/Dashboard/Homepage/PendingShipments";

const Dashboard = () => {
  return (
    <div className="w-full space-y-6 max-w-7xl mx-auto pb-8">
      <DashboardBanner />
      <DashboardStats />
      <SalesLast30DaysChart />
      <SalesCurrentFinancialYearChart />
      <ProductStockAlert />
      <SalesOrderTable />
      <PendingShipments />
    </div>
  );
};

export default Dashboard;
