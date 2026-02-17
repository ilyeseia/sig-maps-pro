"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Circle,
  Combine,
  Subtract,
  Crosshair,
  Minimize2,
  Layers,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface GeoProcessingProps {
  layers: { id: string; name: string; geometryType?: string }[];
  onProcess: (type: string, params: Record<string, unknown>) => void;
  className?: string;
}

type ProcessType = 'buffer' | 'intersect' | 'union' | 'difference' | 'centroid' | 'simplify';

interface ProcessConfig {
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  requiresSecondLayer: boolean;
  requiresDistance: boolean;
}

const processTypes: Record<ProcessType, ProcessConfig> = {
  buffer: {
    name: 'منطقة عازلة',
    description: 'إنشاء منطقة عازلة حول العناصر',
    icon: Circle,
    color: 'text-blue-500',
    requiresSecondLayer: false,
    requiresDistance: true,
  },
  intersect: {
    name: 'تقاطع',
    description: 'حساب تقاطع طبقتين',
    icon: Combine,
    color: 'text-green-500',
    requiresSecondLayer: true,
    requiresDistance: false,
  },
  union: {
    name: 'اتحاد',
    description: 'دمج طبقتين معاً',
    icon: Layers,
    color: 'text-purple-500',
    requiresSecondLayer: true,
    requiresDistance: false,
  },
  difference: {
    name: 'فرق',
    description: 'حساب الفرق بين طبقتين',
    icon: Subtract,
    color: 'text-orange-500',
    requiresSecondLayer: true,
    requiresDistance: false,
  },
  centroid: {
    name: 'مركز ثقل',
    description: 'حساب مركز ثقل العناصر',
    icon: Crosshair,
    color: 'text-cyan-500',
    requiresSecondLayer: false,
    requiresDistance: false,
  },
  simplify: {
    name: 'تبسيط',
    description: 'تبسيط الأشكال الهندسية',
    icon: Minimize2,
    color: 'text-pink-500',
    requiresSecondLayer: false,
    requiresDistance: true,
  },
};

interface Job {
  id: string;
  type: ProcessType;
  status: 'pending' | 'running' | 'completed' | 'failed';
  params: Record<string, unknown>;
  result?: unknown;
  error?: string;
  createdAt: Date;
}

export default function GeoProcessing({ layers, onProcess, className }: GeoProcessingProps) {
  const [selectedProcess, setSelectedProcess] = useState<ProcessType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [primaryLayer, setPrimaryLayer] = useState<string>('');
  const [secondaryLayer, setSecondaryLayer] = useState<string>('');
  const [distance, setDistance] = useState<string>('100');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOpenProcess = (type: ProcessType) => {
    setSelectedProcess(type);
    setPrimaryLayer('');
    setSecondaryLayer('');
    setDistance('100');
    setIsDialogOpen(true);
  };

  const handleRunProcess = async () => {
    if (!selectedProcess || !primaryLayer) return;

    const config = processTypes[selectedProcess];
    
    if (config.requiresSecondLayer && !secondaryLayer) return;

    setIsProcessing(true);

    const newJob: Job = {
      id: `job-${Date.now()}`,
      type: selectedProcess,
      status: 'running',
      params: {
        primaryLayer,
        secondaryLayer: config.requiresSecondLayer ? secondaryLayer : undefined,
        distance: config.requiresDistance ? parseFloat(distance) : undefined,
      },
      createdAt: new Date(),
    };

    setJobs(prev => [newJob, ...prev]);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate result
    const success = Math.random() > 0.2;

    setJobs(prev =>
      prev.map(job =>
        job.id === newJob.id
          ? {
              ...job,
              status: success ? 'completed' : 'failed',
              result: success ? { featureCount: Math.floor(Math.random() * 100) } : undefined,
              error: success ? undefined : 'فشل في المعالجة',
            }
          : job
      )
    );

    setIsProcessing(false);
    setIsDialogOpen(false);

    if (onProcess) {
      onProcess(selectedProcess, newJob.params);
    }
  };

  const getStatusIcon = (status: Job['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const config = selectedProcess ? processTypes[selectedProcess] : null;

  return (
    <div className={className}>
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            المعالجة الجغرافية
          </CardTitle>
          <CardDescription>
            أدوات تحليل ومعالجة البيانات الجغرافية
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Process Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(processTypes) as [ProcessType, ProcessConfig][]).map(([type, cfg]) => (
              <Button
                key={type}
                variant="outline"
                className="h-auto py-3 flex flex-col items-center gap-2"
                onClick={() => handleOpenProcess(type)}
              >
                <cfg.icon className={`h-6 w-6 ${cfg.color}`} />
                <span className="text-xs">{cfg.name}</span>
              </Button>
            ))}
          </div>

          {/* Recent Jobs */}
          {jobs.length > 0 && (
            <div className="mt-4">
              <Label className="text-sm text-muted-foreground mb-2 block">
                العمليات الأخيرة
              </Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {jobs.slice(0, 5).map(job => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      {getStatusIcon(job.status)}
                      <span className="text-sm">
                        {processTypes[job.type]?.name}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {job.status === 'completed'
                        ? `${job.result?.featureCount} عنصر`
                        : job.status === 'failed'
                        ? 'فشل'
                        : job.status === 'running'
                        ? 'جاري...'
                        : 'في الانتظار'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Process Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {config && (
                <>
                  <config.icon className={`h-5 w-5 ${config.color}`} />
                  {config.name}
                </>
              )}
            </DialogTitle>
            <DialogDescription>{config?.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Primary Layer */}
            <div className="space-y-2">
              <Label>الطبقة الأساسية</Label>
              <Select value={primaryLayer} onValueChange={setPrimaryLayer}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الطبقة" />
                </SelectTrigger>
                <SelectContent>
                  {layers.map(layer => (
                    <SelectItem key={layer.id} value={layer.id}>
                      {layer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Secondary Layer (if required) */}
            {config?.requiresSecondLayer && (
              <div className="space-y-2">
                <Label>الطبقة الثانوية</Label>
                <Select value={secondaryLayer} onValueChange={setSecondaryLayer}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الطبقة" />
                  </SelectTrigger>
                  <SelectContent>
                    {layers
                      .filter(l => l.id !== primaryLayer)
                      .map(layer => (
                        <SelectItem key={layer.id} value={layer.id}>
                          {layer.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Distance (if required) */}
            {config?.requiresDistance && (
              <div className="space-y-2">
                <Label>
                  {selectedProcess === 'buffer' ? 'المسافة (بالأمتار)' : 'التبسيط'}
                </Label>
                <Input
                  type="number"
                  value={distance}
                  onChange={e => setDistance(e.target.value)}
                  placeholder="100"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              onClick={handleRunProcess}
              disabled={!primaryLayer || (config?.requiresSecondLayer && !secondaryLayer) || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                'تنفيذ'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
