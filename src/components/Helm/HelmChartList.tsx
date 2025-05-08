
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { StatusType } from "../Dashboard/StatusCard";

interface HelmChartProps {
  name: string;
  namespace: string;
  version: string;
  appVersion: string;
  status: StatusType;
  updated: string;
  chart: string;
  hasUpdate: boolean;
}

export default function HelmChartList() {
  const [charts, setCharts] = useState<HelmChartProps[]>([
    {
      name: "nginx-ingress",
      namespace: "ingress-system",
      version: "4.0.6",
      appVersion: "1.1.3",
      status: "healthy",
      updated: "2023-04-12 14:30",
      chart: "nginx-ingress",
      hasUpdate: true
    },
    {
      name: "cert-manager",
      namespace: "cert-manager",
      version: "1.5.4",
      appVersion: "1.5.4",
      status: "healthy",
      updated: "2023-03-22 09:15",
      chart: "cert-manager",
      hasUpdate: false
    },
    {
      name: "prometheus",
      namespace: "monitoring",
      version: "15.10.2",
      appVersion: "2.33.1",
      status: "healthy",
      updated: "2023-04-01 11:22",
      chart: "prometheus",
      hasUpdate: true
    },
    {
      name: "postgresql",
      namespace: "database",
      version: "11.0.0",
      appVersion: "14.2.0",
      status: "healthy",
      updated: "2023-02-15 16:40",
      chart: "bitnami/postgresql",
      hasUpdate: false
    },
    {
      name: "redis",
      namespace: "cache",
      version: "16.8.5",
      appVersion: "6.2.6",
      status: "healthy",
      updated: "2023-03-10 10:05",
      chart: "bitnami/redis",
      hasUpdate: false
    }
  ]);

  // Simulate a real-time update to a chart status
  useEffect(() => {
    const interval = setInterval(() => {
      setCharts(prevCharts => {
        const randomIndex = Math.floor(Math.random() * prevCharts.length);
        const newCharts = [...prevCharts];
        
        // Toggle status randomly for demo purposes
        const currentStatus = newCharts[randomIndex].status;
        if (Math.random() > 0.7) {
          newCharts[randomIndex] = {
            ...newCharts[randomIndex],
            status: currentStatus === "healthy" ? "pending" : "healthy"
          };
        }
        
        return newCharts;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusDot = (status: StatusType) => {
    return (
      <span className={cn(
        "status-dot",
        status === "healthy" && "status-healthy",
        status === "warning" && "status-warning",
        status === "error" && "status-error",
        status === "pending" && "status-pending",
        status === "unknown" && "status-unknown",
      )}></span>
    );
  };

  const handleUpgrade = (name: string) => {
    setCharts(prevCharts => 
      prevCharts.map(chart => 
        chart.name === name 
          ? { ...chart, status: "pending" as StatusType } 
          : chart
      )
    );

    // Simulate upgrade process
    setTimeout(() => {
      setCharts(prevCharts => 
        prevCharts.map(chart => 
          chart.name === name 
            ? { 
                ...chart, 
                status: "healthy" as StatusType,
                hasUpdate: false,
                version: (parseFloat(chart.version) + 0.1).toFixed(1),
                updated: new Date().toLocaleString('en-US', { 
                  year: 'numeric', 
                  month: '2-digit', 
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              } 
            : chart
        )
      );
    }, 3000);
  };

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Namespace</TableHead>
            <TableHead>Chart</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>App Version</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {charts.map((chart) => (
            <TableRow key={chart.name} className="transition-all">
              <TableCell className="font-medium">{chart.name}</TableCell>
              <TableCell>{chart.namespace}</TableCell>
              <TableCell>{chart.chart}</TableCell>
              <TableCell>{chart.version}</TableCell>
              <TableCell>{chart.appVersion}</TableCell>
              <TableCell className="text-muted-foreground">{chart.updated}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {getStatusDot(chart.status)}
                  <span className="capitalize">{chart.status}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {chart.hasUpdate && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => handleUpgrade(chart.name)}
                      disabled={chart.status === "pending"}
                    >
                      {chart.status === "pending" ? "Upgrading..." : "Upgrade"}
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-7 text-xs"
                  >
                    Details
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
