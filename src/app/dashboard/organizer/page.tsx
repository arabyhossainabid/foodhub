import { StandardRoleDashboard } from "@/components/dashboard/StandardRoleDashboard";
import { LayoutDashboard, Megaphone, BadgePercent, Newspaper, MailQuestion, CalendarCheck, Users, Activity } from "lucide-react";

export default function OrganizerDashboardPage() {
  return (
    <StandardRoleDashboard
      roles={["ORGANIZER"]}
      title="Organizer Dashboard"
      description="Coordinate campaigns, events, and promotion activities."
      statItems={[
        { title: "Campaign Reach", value: "128K", trend: "+18%", color: "bg-green-50 text-green-600", icon: <Megaphone size={20} /> },
        { title: "Active Campaigns", value: "9", trend: "running", color: "bg-orange-50 text-orange-600", icon: <CalendarCheck size={20} /> },
        { title: "Subscribers", value: "6,420", trend: "+312", color: "bg-blue-50 text-blue-600", icon: <Users size={20} /> },
        { title: "Engagement", value: "72%", trend: "good", color: "bg-purple-50 text-purple-600", icon: <Activity size={20} /> },
      ]}
      quickLinks={[
        { title: "Offers Page", href: "/offers", cta: "Open" },
        { title: "Blog Manager", href: "/blog", cta: "View" },
        { title: "Support Inbox", href: "/contact", cta: "Reply" },
        { title: "FAQ Review", href: "/faq", cta: "Check" },
      ]}
    />
  );
}
