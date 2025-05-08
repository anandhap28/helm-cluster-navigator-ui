
import { Grid } from "@/components/ui/grid";
import StatusCard from "./StatusCard";
import MetricsChart from "./MetricsChart";
import { CircleArrowDown, CircleArrowUp, Circle, Navigation } from "lucide-react";

export default function ClusterOverview() {
  // Mock data for CPU usage over time
  const cpuData = Array.from({ length: 20 }, (_, i) => ({
    time: new Date(Date.now() - (19 - i) * 30000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    }),
    value: Math.random() * 50 + 20 // Random value between 20-70%
  }));

  // Mock data for Memory usage over time
  const memoryData = Array.from({ length: 20 }, (_, i) => ({
    time: new Date(Date.now() - (19 - i) * 30000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    }),
    value: Math.random() * 30 + 40 // Random value between 40-70%
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Cluster Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Nodes"
          value="3"
          status="healthy"
          icon={<Navigation size={18} />}
          subtitle="All nodes are healthy"
        />
        <StatusCard
          title="Pods"
          value="16"
          status="healthy" 
          icon={<Circle size={18} />}
          subtitle="16/16 pods running"
        />
        <StatusCard
          title="Helm Releases"
          value="5"
          status="healthy"
          icon={<CircleArrowUp size={18} />}
          subtitle="All releases are up to date"
        />
        <StatusCard
          title="Pending Updates"
          value="2" 
          status="pending"
          icon={<CircleArrowDown size={18} />}
          subtitle="2 charts have newer versions"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MetricsChart 
          title="CPU Usage" 
          data={cpuData} 
          dataKey="cpu" 
          stroke="#3B82F6" 
          yAxisLabel="% CPU" 
        />
        <MetricsChart 
          title="Memory Usage" 
          data={memoryData} 
          dataKey="memory" 
          stroke="#10B981" 
          yAxisLabel="% RAM" 
        />
      </div>
    </div>
  );
}
