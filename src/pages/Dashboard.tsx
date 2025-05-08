
import ClusterOverview from "@/components/Dashboard/ClusterOverview";
import { useClusterData } from "@/hooks/useClusterData";
import LoadingSpinner from "@/components/Shared/LoadingSpinner";

export default function Dashboard() {
  const clusterData = useClusterData();

  if (clusterData.isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading cluster data" />
      </div>
    );
  }

  if (clusterData.error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-destructive">
          <p className="text-lg font-bold">Error loading cluster data</p>
          <p className="text-sm">{clusterData.error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Kubernetes Dashboard
        </h1>
        <div className="text-sm text-muted-foreground">
          Cluster: <span className="font-medium">{clusterData.name}</span>
        </div>
      </div>

      <ClusterOverview />
    </div>
  );
}
