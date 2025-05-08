
import { useState, useEffect } from "react";

export interface HelmChartRepo {
  name: string;
  url: string;
}

export interface HelmChart {
  name: string;
  version: string;
  appVersion: string;
  description: string;
  repo: string;
}

export interface HelmRelease {
  name: string;
  namespace: string;
  chart: string;
  version: string;
  appVersion: string;
  status: string;
  updated: string;
  hasUpdate: boolean;
}

interface HelmData {
  repositories: HelmChartRepo[];
  charts: HelmChart[];
  releases: HelmRelease[];
  isLoading: boolean;
  error: Error | null;
  refreshReleases: () => Promise<void>;
  installChart: (name: string, chart: string, namespace: string, values?: string) => Promise<void>;
  upgradeRelease: (name: string) => Promise<void>;
}

export const useHelmCharts = (): HelmData => {
  const [data, setData] = useState<HelmData>({
    repositories: [],
    charts: [],
    releases: [],
    isLoading: true,
    error: null,
    refreshReleases: async () => {}, // Will be replaced
    installChart: async () => {},     // Will be replaced
    upgradeRelease: async () => {}    // Will be replaced
  });

  // Define functions that will be returned as part of the hook's API
  const refreshReleases = async (): Promise<void> => {
    setData(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would re-fetch the data from the API
      setData(prev => {
        // Simulate some changes to show refresh
        const updatedReleases = prev.releases.map(release => ({
          ...release,
          status: Math.random() > 0.8 ? 
            (release.status === "deployed" ? "pending-upgrade" : "deployed") : 
            release.status
        }));
        
        return {
          ...prev,
          releases: updatedReleases,
          isLoading: false,
          error: null
        };
      });
    } catch (err) {
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error("Unknown error")
      }));
    }
  };
  
  const installChart = async (
    name: string, 
    chart: string, 
    namespace: string, 
    values?: string
  ): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a new release
      const chartName = chart.split("/").pop() || chart;
      const newRelease: HelmRelease = {
        name,
        namespace,
        chart,
        version: "1.0.0", // Default for new installation
        appVersion: "latest",
        status: "deployed",
        updated: new Date().toISOString(),
        hasUpdate: false
      };
      
      setData(prev => ({
        ...prev,
        releases: [...prev.releases, newRelease]
      }));
      
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  };
  
  const upgradeRelease = async (name: string): Promise<void> => {
    try {
      // Set status to upgrading
      setData(prev => ({
        ...prev,
        releases: prev.releases.map(release => 
          release.name === name 
            ? { ...release, status: "pending-upgrade" }
            : release
        )
      }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the release version and status
      setData(prev => ({
        ...prev,
        releases: prev.releases.map(release => {
          if (release.name === name) {
            const versionParts = release.version.split('.');
            const lastPart = parseInt(versionParts[versionParts.length - 1]) + 1;
            versionParts[versionParts.length - 1] = lastPart.toString();
            const newVersion = versionParts.join('.');
            
            return {
              ...release,
              version: newVersion,
              status: "deployed",
              updated: new Date().toISOString(),
              hasUpdate: false
            };
          }
          return release;
        })
      }));
      
      return Promise.resolve();
    } catch (err) {
      // Set status back to deployed
      setData(prev => ({
        ...prev,
        releases: prev.releases.map(release => 
          release.name === name 
            ? { ...release, status: "deployed" }
            : release
        )
      }));
      
      return Promise.reject(err);
    }
  };

  useEffect(() => {
    // Simulate API call to fetch helm data
    const fetchHelmData = async () => {
      try {
        // In a real app, this would be API calls
        // Simulating network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock repositories
        const mockRepositories: HelmChartRepo[] = [
          { name: "bitnami", url: "https://charts.bitnami.com/bitnami" },
          { name: "stable", url: "https://charts.helm.sh/stable" },
          { name: "prometheus-community", url: "https://prometheus-community.github.io/helm-charts" },
          { name: "jetstack", url: "https://charts.jetstack.io" },
          { name: "ingress-nginx", url: "https://kubernetes.github.io/ingress-nginx" }
        ];

        // Mock charts
        const mockCharts: HelmChart[] = [
          { name: "nginx", version: "13.2.14", appVersion: "1.23.1", description: "NGINX Open Source is a web server that can be also used as a reverse proxy, load balancer, and HTTP cache.", repo: "bitnami" },
          { name: "postgresql", version: "11.9.1", appVersion: "14.5.0", description: "PostgreSQL is an open source object-relational database known for reliability and data integrity.", repo: "bitnami" },
          { name: "mysql", version: "9.2.0", appVersion: "8.0.30", description: "MySQL is a fast, reliable, scalable, and easy to use open source relational database.", repo: "bitnami" },
          { name: "redis", version: "17.3.7", appVersion: "7.0.4", description: "Redis is an open source, advanced key-value store.", repo: "bitnami" },
          { name: "mongodb", version: "13.1.2", appVersion: "6.0.1", description: "MongoDB is a general purpose, document-based, distributed database.", repo: "bitnami" },
          { name: "prometheus", version: "15.10.1", appVersion: "2.38.0", description: "Prometheus is an open source monitoring system and time series database.", repo: "prometheus-community" },
          { name: "cert-manager", version: "1.9.1", appVersion: "1.9.1", description: "cert-manager is a Kubernetes addon to automate the management and issuance of TLS certificates.", repo: "jetstack" },
          { name: "ingress-nginx", version: "4.2.5", appVersion: "1.3.1", description: "Ingress controller for Kubernetes using NGINX as a reverse proxy and load balancer.", repo: "ingress-nginx" }
        ];

        // Mock releases
        const mockReleases: HelmRelease[] = [
          { name: "nginx-ingress", namespace: "ingress-system", chart: "ingress-nginx/ingress-nginx", version: "4.0.6", appVersion: "1.1.3", status: "deployed", updated: "2023-04-12T14:30:00Z", hasUpdate: true },
          { name: "cert-manager", namespace: "cert-manager", chart: "jetstack/cert-manager", version: "1.5.4", appVersion: "1.5.4", status: "deployed", updated: "2023-03-22T09:15:00Z", hasUpdate: false },
          { name: "prometheus", namespace: "monitoring", chart: "prometheus-community/prometheus", version: "15.10.2", appVersion: "2.33.1", status: "deployed", updated: "2023-04-01T11:22:00Z", hasUpdate: true },
          { name: "postgresql", namespace: "database", chart: "bitnami/postgresql", version: "11.0.0", appVersion: "14.2.0", status: "deployed", updated: "2023-02-15T16:40:00Z", hasUpdate: false },
          { name: "redis", namespace: "cache", chart: "bitnami/redis", version: "16.8.5", appVersion: "6.2.6", status: "deployed", updated: "2023-03-10T10:05:00Z", hasUpdate: false }
        ];

        setData({
          repositories: mockRepositories,
          charts: mockCharts,
          releases: mockReleases,
          isLoading: false,
          error: null,
          refreshReleases,
          installChart,
          upgradeRelease
        });
      } catch (err) {
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err : new Error("Unknown error"),
          refreshReleases,
          installChart,
          upgradeRelease
        }));
      }
    };

    fetchHelmData();
  }, []);

  return data;
};
