import { StandardRoleDashboard } from "@/components/dashboard/StandardRoleDashboard";
import { LayoutDashboard, ShieldCheck, ShoppingBag, Users, DollarSign, Activity, BarChart3, ClipboardList } from "lucide-react";

export default function ManagerDashboardPage() {
  return (
    <StandardRoleDashboard
      roles={["MANAGER"]}
      title="Manager Dashboard"
      description="Monitor operations, team workload, and business performance."
      statItems={[
        { title: "Managed Revenue", value: "$84,200", trend: "+9.2%", color: "bg-green-50 text-green-600", icon: <DollarSign size={20} /> },
        { title: "Open Tasks", value: "38", trend: "live", color: "bg-orange-50 text-orange-600", icon: <ClipboardList size={20} /> },
        { title: "Team Members", value: "24", trend: "+2", color: "bg-blue-50 text-blue-600", icon: <Users size={20} /> },
        { title: "Ops Score", value: "96%", trend: "stable", color: "bg-purple-50 text-purple-600", icon: <Activity size={20} /> },
      ]}
      quickLinks={[
        { title: "Admin Overview", href: "/admin/dashboard", cta: "Open" },
        { title: "Orders Queue", href: "/admin/orders", cta: "Manage" },
        { title: "Performance Reports", href: "/admin/dashboard", cta: "View" },
        { title: "User Management", href: "/admin/users", cta: "Manage" },
      ]}
    />
  );
}
