
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { toast } from "@/hooks/use-toast";

export default function ChartInstallForm() {
  const [isInstalling, setIsInstalling] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    chart: "",
    namespace: "default",
    version: "latest",
    values: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const popularCharts = [
    "bitnami/wordpress",
    "bitnami/mysql",
    "bitnami/postgresql",
    "bitnami/nginx",
    "bitnami/redis",
    "prometheus-community/prometheus",
    "grafana/grafana",
    "bitnami/mongodb",
    "jetstack/cert-manager",
    "bitnami/rabbitmq",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.chart) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Please fill in all required fields"
      });
      return;
    }
    
    setIsInstalling(true);
    
    // Simulate installation process
    setTimeout(() => {
      setIsInstalling(false);
      toast({
        title: "Chart installed successfully",
        description: `${formData.chart} has been installed as ${formData.name}`
      });
      
      // Reset form
      setFormData({
        name: "",
        chart: "",
        namespace: "default",
        version: "latest",
        values: ""
      });
    }, 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Install Helm Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Release Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="my-release"
                value={formData.name}
                onChange={handleChange}
                disabled={isInstalling}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="chart">Chart *</Label>
              <Select
                value={formData.chart}
                onValueChange={(value) => handleSelectChange("chart", value)}
                disabled={isInstalling}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a chart" />
                </SelectTrigger>
                <SelectContent>
                  {popularCharts.map((chart) => (
                    <SelectItem key={chart} value={chart}>
                      {chart}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="namespace">Namespace</Label>
              <Input
                id="namespace"
                name="namespace"
                placeholder="default"
                value={formData.namespace}
                onChange={handleChange}
                disabled={isInstalling}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                name="version"
                placeholder="latest"
                value={formData.version}
                onChange={handleChange}
                disabled={isInstalling}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="values">Values (YAML)</Label>
            <Textarea
              id="values"
              name="values"
              placeholder="service:\n  type: ClusterIP"
              value={formData.values}
              onChange={handleChange}
              disabled={isInstalling}
              className="h-32 font-mono"
            />
          </div>
          
          <div className="flex justify-end">
            {isInstalling ? (
              <Button disabled>
                <LoadingSpinner size="sm" className="mr-2" />
                Installing...
              </Button>
            ) : (
              <Button type="submit">Install Chart</Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
