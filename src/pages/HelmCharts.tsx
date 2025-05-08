
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HelmChartList from "@/components/Helm/HelmChartList";
import ChartInstallForm from "@/components/Helm/ChartInstallForm";
import { useHelmCharts } from "@/hooks/useHelmCharts";
import LoadingSpinner from "@/components/Shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { CircleArrowDown } from "lucide-react";

export default function HelmCharts() {
  const helmData = useHelmCharts();

  if (helmData.isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading Helm data" />
      </div>
    );
  }

  if (helmData.error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-destructive">
          <p className="text-lg font-bold">Error loading Helm data</p>
          <p className="text-sm">{helmData.error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Helm Charts</h1>
        <Button variant="outline" size="sm" onClick={helmData.refreshReleases}>
          <CircleArrowDown className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="releases">
        <TabsList>
          <TabsTrigger value="releases">Releases</TabsTrigger>
          <TabsTrigger value="install">Install Chart</TabsTrigger>
        </TabsList>
        <TabsContent value="releases" className="pt-4">
          <HelmChartList />
        </TabsContent>
        <TabsContent value="install" className="pt-4">
          <ChartInstallForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
