
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  CircleArrowUp,
  CircleArrowDown,
  Navigation,
  Circle
} from "lucide-react";
import { useState } from "react";

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
};

const NavItem = ({ to, icon, label, isCollapsed, isActive }: NavItemProps) => {
  return (
    <Link to={to} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start py-2 px-3 h-auto",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <span className="mr-2">{icon}</span>
        {!isCollapsed && <span>{label}</span>}
      </Button>
    </Link>
  );
};

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  
  const navItems = [
    {
      to: "/",
      icon: <Navigation size={18} />,
      label: "Dashboard",
    },
    {
      to: "/helm-charts",
      icon: <CircleArrowUp size={18} />,
      label: "Helm Charts",
    },
    {
      to: "/pods",
      icon: <Circle size={18} />,
      label: "Pods",
    },
  ];

  return (
    <div
      className={cn(
        "h-screen bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="font-mono font-semibold text-lg text-primary">helm-k8s</div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto", isCollapsed && "mx-auto")}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      <div className="flex flex-col gap-1 p-2 flex-grow">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isCollapsed={isCollapsed}
            isActive={location.pathname === item.to}
          />
        ))}
      </div>
      
      <div className="p-2 border-t border-sidebar-border">
        <div className={cn("text-xs text-muted-foreground px-3 py-2", isCollapsed && "hidden")}>
          <div>Cluster: development</div>
          <div>Context: docker-desktop</div>
        </div>
      </div>
    </div>
  );
}
