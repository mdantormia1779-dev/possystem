import DashboardLayout from "./DashboardLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Rangpur Bike Parlour - POS",
  description: "POS Software Dashboard for Rangpur Bike Parlour",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
