
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PodData } from "./PodList";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { Badge } from "@/components/ui/badge";

interface LogViewerProps {
  pod?: PodData;
}

export default function LogViewer({ pod }: LogViewerProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [filter, setFilter] = useState("");
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  // Generate log entries for a pod
  useEffect(() => {
    if (!pod) return;
    
    setIsLoading(true);
    setLogs([]);
    
    // Simulate fetching initial logs
    setTimeout(() => {
      const initialLogs = generateMockLogs(pod, 50);
      setLogs(initialLogs);
      setIsLoading(false);
    }, 1000);
    
    // Simulate stream of logs
    const interval = setInterval(() => {
      if (!pod) return;
      
      setLogs(prevLogs => {
        const newLog = generateMockLogEntry(pod);
        return [...prevLogs, newLog];
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, [pod?.name]);
  
  // Auto-scroll logic
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);
  
  // Filter logs
  const filteredLogs = filter ? 
    logs.filter(log => log.toLowerCase().includes(filter.toLowerCase())) : 
    logs;
  
  if (!pod) {
    return (
      <Card className="h-full flex items-center justify-center bg-muted/10">
        <div className="text-center text-muted-foreground">
          <p>Select a pod to view logs</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="py-3 px-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-mono">
              {pod.name}
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {pod.namespace}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Input 
              className="h-8 text-xs w-[200px]"
              placeholder="Filter logs..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <Button 
              size="sm" 
              variant="outline"
              className="h-8 text-xs"
              onClick={() => setAutoScroll(!autoScroll)}
            >
              {autoScroll ? "Pause" : "Follow"} Logs
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-0 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner label="Loading logs" />
          </div>
        ) : (
          <div 
            ref={logContainerRef}
            className="h-full overflow-auto p-4 log-scrollbar terminal-text bg-black/20"
          >
            {filteredLogs.length === 0 ? (
              filter ? (
                <div className="text-muted-foreground text-center p-4">
                  No logs matching your filter
                </div>
              ) : (
                <div className="text-muted-foreground text-center p-4">
                  No logs available
                </div>
              )
            ) : (
              filteredLogs.map((log, index) => (
                <div 
                  key={index}
                  className={cn(
                    "py-0.5",
                    log.includes("ERROR") ? "text-red-400" : 
                    log.includes("WARN") ? "text-amber-400" : 
                    log.includes("INFO") ? "text-blue-400" : 
                    "text-foreground"
                  )}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

// Mock log generator functions
function generateMockLogs(pod: PodData, count: number): string[] {
  const logs = [];
  const now = new Date();
  
  for (let i = count; i > 0; i--) {
    const timestamp = new Date(now.getTime() - i * 1000);
    logs.push(generateMockLogEntry(pod, timestamp));
  }
  
  return logs;
}

function generateMockLogEntry(pod: PodData, timestamp = new Date()): string {
  const timeString = timestamp.toISOString();
  const logTypes = ["INFO", "DEBUG", "WARN", "ERROR"];
  const logType = logTypes[Math.floor(Math.random() * (logTypes.length - 0.2))]; // Make ERROR less common
  
  // Different log messages based on pod type
  let message = "";
  if (pod.name.includes("nginx")) {
    const methods = ["GET", "POST", "PUT", "DELETE"];
    const paths = ["/api/v1/users", "/api/v1/products", "/health", "/api/v1/orders"];
    const statusCodes = ["200", "201", "204", "400", "404", "500"];
    const method = methods[Math.floor(Math.random() * methods.length)];
    const path = paths[Math.floor(Math.random() * paths.length)];
    const statusCode = statusCodes[Math.floor(Math.random() * statusCodes.length)];
    const ipAddress = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    
    message = `${ipAddress} - "${method} ${path} HTTP/1.1" ${statusCode} ${Math.floor(Math.random() * 1000)} "${Math.random() > 0.5 ? "Mozilla/5.0" : "curl/7.68.0"}"`;
  } else if (pod.name.includes("postgres")) {
    const actions = ["SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "DROP"];
    const tables = ["users", "products", "orders", "payments"];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const table = tables[Math.floor(Math.random() * tables.length)];
    
    message = `db_${Math.floor(Math.random() * 5)} [${Math.floor(Math.random() * 10000)}]: ${action} on ${table} - duration: ${Math.floor(Math.random() * 100)}ms`;
  } else if (pod.name.includes("redis")) {
    const commands = ["GET", "SET", "DEL", "HSET", "LPUSH", "RPUSH"];
    const command = commands[Math.floor(Math.random() * commands.length)];
    
    message = `${command} key_${Math.floor(Math.random() * 1000)} ${Math.random() > 0.5 ? "OK" : "NIL"}`;
  } else if (pod.name.includes("mongo")) {
    const actions = ["find", "update", "insert", "delete", "aggregate"];
    const collections = ["users", "products", "orders", "payments"];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const collection = collections[Math.floor(Math.random() * collections.length)];
    
    message = `${action} ${collection} query=${JSON.stringify({id: Math.floor(Math.random() * 1000)})} - ${Math.floor(Math.random() * 50)}ms`;
  } else {
    // Generic application logs
    const messages = [
      "Processing request",
      "Request completed",
      "Connecting to database",
      "Connection pool status",
      "Performing health check",
      "Memory usage",
      "CPU load",
      "Received signal",
      "Starting worker",
      "Stopping worker"
    ];
    message = `${messages[Math.floor(Math.random() * messages.length)]} (id=${Math.floor(Math.random() * 10000)})`;
  }
  
  return `${timeString} ${logType} [${pod.name}] ${message}`;
}
