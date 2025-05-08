
import { useState, useEffect } from "react";

export interface ClusterNode {
  name: string;
  status: "Ready" | "NotReady";
  role: string;
  age: string;
  version: string;
  cpu: string;
  memory: string;
  pods: number;
}

export interface ClusterMetrics {
  cpu: { used: number; total: number };
  memory: { used: number; total: number };
  pods: { used: number; total: number };
  storage: { used: number; total: number };
}

export interface ClusterData {
  name: string;
  nodes: ClusterNode[];
  metrics: ClusterMetrics;
  isLoading: boolean;
  error: Error | null;
}

export const useClusterData = (): ClusterData => {
  const [data, setData] = useState<ClusterData>({
    name: "docker-desktop",
    nodes: [],
    metrics: {
      cpu: { used: 0, total: 0 },
      memory: { used: 0, total: 0 },
      pods: { used: 0, total: 0 },
      storage: { used: 0, total: 0 }
    },
    isLoading: true,
    error: null
  });

  useEffect(() => {
    // Simulate API call to fetch cluster data
    const fetchClusterData = async () => {
      try {
        // In a real app, this would be an API call
        // Simulating network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data
        const mockNodes: ClusterNode[] = [
          {
            name: "node-1",
            status: "Ready",
            role: "control-plane,worker",
            age: "10d",
            version: "v1.25.4",
            cpu: "2/4",
            memory: "4.2Gi/8Gi",
            pods: 12
          },
          {
            name: "node-2",
            status: "Ready",
            role: "worker",
            age: "10d",
            version: "v1.25.4",
            cpu: "1.5/4",
            memory: "3.8Gi/8Gi",
            pods: 8
          },
          {
            name: "node-3",
            status: "Ready",
            role: "worker",
            age: "10d",
            version: "v1.25.4",
            cpu: "1.2/4",
            memory: "2.5Gi/8Gi",
            pods: 6
          }
        ];

        const mockMetrics: ClusterMetrics = {
          cpu: { used: 4.7, total: 12 },
          memory: { used: 10.5, total: 24 },
          pods: { used: 26, total: 90 },
          storage: { used: 45, total: 200 }
        };

        setData({
          name: "docker-desktop",
          nodes: mockNodes,
          metrics: mockMetrics,
          isLoading: false,
          error: null
        });
      } catch (err) {
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err : new Error("Unknown error")
        }));
      }
    };

    fetchClusterData();

    // Simulated data updates for real-time feel
    const interval = setInterval(() => {
      setData(prev => {
        if (prev.isLoading) return prev;

        // Update CPU and memory metrics slightly
        const updatedMetrics = { ...prev.metrics };
        
        // Random CPU fluctuation (-0.2 to +0.2)
        updatedMetrics.cpu.used = +(Math.max(0, Math.min(updatedMetrics.cpu.total, 
          updatedMetrics.cpu.used + (Math.random() * 0.4 - 0.2)
        ))).toFixed(1);
        
        // Random memory fluctuation (-0.1 to +0.1)
        updatedMetrics.memory.used = +(Math.max(0, Math.min(updatedMetrics.memory.total, 
          updatedMetrics.memory.used + (Math.random() * 0.2 - 0.1)
        ))).toFixed(1);

        return {
          ...prev,
          metrics: updatedMetrics
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return data;
};
