
import { useState } from "react";
import PodList, { PodData } from "@/components/Pods/PodList";
import LogViewer from "@/components/Pods/LogViewer";

export default function Pods() {
  const [selectedPod, setSelectedPod] = useState<PodData | undefined>(undefined);

  const handleSelectPod = (pod: PodData) => {
    setSelectedPod(pod);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pods</h1>
      </div>

      <div className="flex-1 grid grid-rows-2 gap-6 h-full">
        <div className="row-span-1">
          <PodList onSelectPod={handleSelectPod} selectedPod={selectedPod?.name} />
        </div>
        <div className="row-span-1">
          <LogViewer pod={selectedPod} />
        </div>
      </div>
    </div>
  );
}
