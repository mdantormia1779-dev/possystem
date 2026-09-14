import React from "react";
import DashboardStats from "../Components/Dashboard/Homepage/DashboardStats";
import DashboardBanner from "../Components/Dashboard/Homepage/DashboardBanner";
import SalesLast30DaysChart from "../Components/Dashboard/Homepage/SalesLast30DaysChart";

const Dashboard = () => {
  return (
    <div className="w-full space-y-6 max-w-7xl mx-auto pb-8">
      <DashboardBanner />
      <DashboardStats />
      <SalesLast30DaysChart />
    </div>
  );
};

export default Dashboard;
