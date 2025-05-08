
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type StatusType = "healthy" | "warning" | "error" | "pending" | "unknown";

interface StatusCardProps {
  title: string;
  value: string | number;
  status: StatusType;
  icon?: React.ReactNode;
  subtitle?: string;
}

export default function StatusCard({ 
  title, 
  value, 
  status, 
  icon, 
  subtitle 
}: StatusCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className={cn(
        "h-1", 
        status === "healthy" && "bg-k8s-healthy",
        status === "warning" && "bg-k8s-warning",
        status === "error" && "bg-k8s-error",
        status === "pending" && "bg-k8s-pending",
        status === "unknown" && "bg-k8s-unknown",
      )} />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
