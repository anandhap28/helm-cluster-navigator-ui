
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusType } from "../Dashboard/StatusCard";
import { cn } from "@/lib/utils";

export interface PodData {
  name: string;
  namespace: string;
  status: StatusType;
  ready: string;
  restarts: number;
  age: string;
  cpu: string;
  memory: string;
  ip: string;
  node: string;
  selected?: boolean;
}

interface PodListProps {
  onSelectPod: (pod: PodData) => void;
  selectedPod?: string;
}

export default function PodList({ onSelectPod, selectedPod }: PodListProps) {
  const [pods, setPods] = useState<PodData[]>([
    {
      name: "nginx-ingress-controller-78d47cfc9c-xj5dw",
      namespace: "ingress-system",
      status: "healthy",
      ready: "1/1",
      restarts: 0,
      age: "10d",
      cpu: "2m",
      memory: "64Mi",
      ip: "10.42.0.18",
      node: "node-1"
    },
    {
      name: "cert-manager-547bdc6584-g95x8",
      namespace: "cert-manager",
      status: "healthy",
      ready: "1/1",
      restarts: 0,
      age: "10d",
      cpu: "1m",
      memory: "32Mi",
      ip: "10.42.0.19",
      node: "node-2"
    },
    {
      name: "prometheus-server-59d68f5f6-f9js4",
      namespace: "monitoring",
      status: "healthy",
      ready: "2/2",
      restarts: 1,
      age: "7d",
      cpu: "14m",
      memory: "256Mi",
      ip: "10.42.0.20",
      node: "node-3"
    },
    {
      name: "postgresql-primary-0",
      namespace: "database",
      status: "healthy",
      ready: "1/1",
      restarts: 0,
      age: "5d",
      cpu: "8m",
      memory: "128Mi",
      ip: "10.42.0.21",
      node: "node-1"
    },
    {
      name: "redis-master-0",
      namespace: "cache",
      status: "healthy",
      ready: "1/1",
      restarts: 0,
      age: "5d",
      cpu: "3m",
      memory: "64Mi",
      ip: "10.42.0.22",
      node: "node-2"
    },
    {
      name: "mongodb-0",
      namespace: "database",
      status: "pending",
      ready: "0/1",
      restarts: 0,
      age: "5m",
      cpu: "0m",
      memory: "0Mi",
      ip: "10.42.0.23",
      node: "node-3"
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    // Update CPU and memory usage randomly every 3 seconds
    const interval = setInterval(() => {
      setPods(prevPods => 
        prevPods.map(pod => {
          // Only update metrics for healthy pods
          if (pod.status === "healthy") {
            // Random CPU update (1-20m)
            const cpuValue = Math.floor(Math.random() * 20) + 1;
            // Random memory update (32-256Mi)
            const memValues = [32, 64, 96, 128, 192, 256];
            const memValue = memValues[Math.floor(Math.random() * memValues.length)];
            
            return {
              ...pod,
              cpu: `${cpuValue}m`,
              memory: `${memValue}Mi`
            };
          }
          
          // For pending pod, simulate it becoming ready
          if (pod.name === "mongodb-0" && pod.status === "pending") {
            if (Math.random() > 0.8) {
              return {
                ...pod,
                status: "healthy",
                ready: "1/1",
                cpu: "5m",
                memory: "96Mi"
              };
            }
          }
          
          return pod;
        })
      );
    }, 3000);

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

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Namespace</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ready</TableHead>
            <TableHead>Restarts</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>CPU</TableHead>
            <TableHead>Memory</TableHead>
            <TableHead>Node</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pods.map((pod) => (
            <TableRow key={pod.name} className={cn(
              "transition-colors",
              selectedPod === pod.name && "bg-secondary"
            )}>
              <TableCell className="font-medium">{pod.name}</TableCell>
              <TableCell>{pod.namespace}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {getStatusDot(pod.status)}
                  <span className="capitalize">{pod.status}</span>
                </div>
              </TableCell>
              <TableCell>{pod.ready}</TableCell>
              <TableCell>{pod.restarts}</TableCell>
              <TableCell>{pod.age}</TableCell>
              <TableCell>{pod.cpu}</TableCell>
              <TableCell>{pod.memory}</TableCell>
              <TableCell>{pod.node}</TableCell>
              <TableCell>
                <Button 
                  size="sm" 
                  variant={selectedPod === pod.name ? "secondary" : "ghost"}
                  className="h-7 text-xs"
                  onClick={() => onSelectPod(pod)}
                >
                  View Logs
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
