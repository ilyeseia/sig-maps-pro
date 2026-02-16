"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Moon,
  Sun,
  Save,
  Download,
  Home,
} from "lucide-react";
import type { Layer, DrawMode, LayerStyle, Feature, GeoJSONGeometry } from "@/lib/types";

const MapViewer = dynamic(() => import("@/components/map/MapViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
    </div>
  ),
});

const LayerControl = dynamic(() => import("@/components/map/LayerControl"), {
  ssr: false,
});

const DrawingTools = dynamic(() => import("@/components/map/DrawingTools"), {
  ssr: false,
});

const sampleLayers: Layer[] = [
  {
    id: "layer-1",
    name: "المدن الرئيسية",
    description: "أهم المدن في المنطقة",
    type: "VECTOR",
    geometryType: "POINT",
    visible: true,
    opacity: 1,
    style: {
      color: "#ef4444",
      pointRadius: 10,
    },
    order: 0,
    userId: "user-1",
    features: [
      {
        id: "f1",
        geometry: { type: "Point", coordinates: [3.05, 36.75] },
        properties: { name: "الجزائر العاصمة", population: 3000000 },
        layerId: "layer-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "f2",
        geometry: { type: "Point", coordinates: [-0.63, 35.70] },
        properties: { name: "وهران", population: 800000 },
        layerId: "layer-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "f3",
        geometry: { type: "Point", coordinates: [7.75, 36.04] },
        properties: { name: "قسنطينة", population: 450000 },
        layerId: "layer-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "layer-2",
    name: "الحدود الإدارية",
    description: "الحدود الإدارية للولايات",
    type: "VECTOR",
    geometryType: "POLYGON",
    visible: true,
    opacity: 0.6,
    style: {
      fillColor: "#3b82f6",
      fillOpacity: 0.3,
      lineColor: "#1e40af",
      lineWidth: 2,
    },
    order: 1,
    userId: "user-1",
    features: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function MapViewerPage() {
  const params = useParams();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [layers, setLayers] = useState<Layer[]>(sampleLayers);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [drawMode, setDrawMode] = useState<DrawMode>("none");
  const [drawStyle, setDrawStyle] = useState<LayerStyle>({
    color: "#3b82f6",
    fillColor: "#3b82f6",
    fillOpacity: 0.5,
    lineWidth: 2,
    pointRadius: 8,
  });
  const [history, setHistory] = useState<Layer[][]>([layers]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [mapName, setMapName] = useState("خريطة جديدة");

  const mounted = useSyncExternalStore(
    useCallback(() => () => {}, []),
    () => true,
    () => false
  );

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const pushToHistory = useCallback((newLayers: Layer[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newLayers);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleUndo = () => {
    if (canUndo) {
      setHistoryIndex(historyIndex - 1);
      setLayers(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      setHistoryIndex(historyIndex + 1);
      setLayers(history[historyIndex + 1]);
    }
  };

  const handleAddLayer = (layerData: Partial<Layer>) => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: layerData.name || "طبقة جديدة",
      description: layerData.description,
      type: layerData.type || "VECTOR",
      geometryType: layerData.geometryType || "POINT",
      visible: layerData.visible ?? true,
      opacity: layerData.opacity ?? 1,
      style: layerData.style || drawStyle,
      order: layers.length,
      userId: "user-1",
      features: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newLayers = [...layers, newLayer];
    setLayers(newLayers);
    pushToHistory(newLayers);
    setActiveLayerId(newLayer.id);
  };

  const handleUpdateLayer = (id: string, updates: Partial<Layer>) => {
    const newLayers = layers.map((layer) =>
      layer.id === id ? { ...layer, ...updates, updatedAt: new Date() } : layer
    );
    setLayers(newLayers);
    pushToHistory(newLayers);
  };

  const handleDeleteLayer = (id: string) => {
    const newLayers = layers.filter((layer) => layer.id !== id);
    setLayers(newLayers);
    pushToHistory(newLayers);
    if (activeLayerId === id) {
      setActiveLayerId(null);
    }
  };

  const handleMapClick = (lngLat: { lng: number; lat: number }) => {
    if (drawMode === "none" || drawMode === "select" || drawMode === "delete") return;
    if (!activeLayerId) return;

    const activeLayer = layers.find((l) => l.id === activeLayerId);
    if (!activeLayer) return;

    let geometry: GeoJSONGeometry;

    if (drawMode === "point") {
      geometry = { type: "Point", coordinates: [lngLat.lng, lngLat.lat] };
    } else {
      return;
    }

    const newFeature: Feature = {
      id: `feature-${Date.now()}`,
      geometry,
      properties: { name: `عنصر ${activeLayer.features.length + 1}` },
      layerId: activeLayerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newLayers = layers.map((layer) =>
      layer.id === activeLayerId
        ? { ...layer, features: [...layer.features, newFeature] }
        : layer
    );
    setLayers(newLayers);
    pushToHistory(newLayers);
  };

  const handleSave = () => {
    setIsSaveDialogOpen(true);
  };

  const handleExport = () => {
    const geojson = {
      type: "FeatureCollection",
      features: layers.flatMap((layer) =>
        layer.features.map((f) => ({
          type: "Feature",
          id: f.id,
          geometry: f.geometry,
          properties: { ...f.properties, layerName: layer.name },
        }))
      ),
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${mapName.replace(/\s+/g, "_")}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (activeLayerId) {
      const newLayers = layers.map((layer) =>
        layer.id === activeLayerId ? { ...layer, features: [] } : layer
      );
      setLayers(newLayers);
      pushToHistory(newLayers);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Home className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold">GIS Maps Pro</span>
          </Link>
          <Badge variant="outline" className="text-xs">
            {params.id === "new" ? "خريطة جديدة" : `خريطة #${params.id}`}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-1" onClick={handleExport}>
            <Download className="h-4 w-4" />
            تصدير
          </Button>
          <Button size="sm" className="gap-1" onClick={handleSave}>
            <Save className="h-4 w-4" />
            حفظ
          </Button>
        </div>
      </header>

      {/* Drawing Tools */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30">
        <DrawingTools
          activeMode={drawMode}
          onModeChange={setDrawMode}
          style={drawStyle}
          onStyleChange={setDrawStyle}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onSave={handleSave}
          onClear={handleClear}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      </div>

      {/* Main Content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Map View */}
        <ResizablePanel defaultSize={75} minSize={50}>
          <MapViewer
            center={[3.05, 36.75]}
            zoom={5}
            baseMap="OSM"
            layers={layers.filter((l) => l.visible)}
            onMapClick={handleMapClick}
            className="w-full h-full"
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Layer Control */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
          <LayerControl
            layers={layers}
            onLayersChange={setLayers}
            onAddLayer={handleAddLayer}
            onUpdateLayer={handleUpdateLayer}
            onDeleteLayer={handleDeleteLayer}
            className="h-full rounded-none border-0"
          />
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Save Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حفظ الخريطة</DialogTitle>
            <DialogDescription>
              أدخل اسم الخريطة لحفظها
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="mapName">اسم الخريطة</Label>
            <Input
              id="mapName"
              value={mapName}
              onChange={(e) => setMapName(e.target.value)}
              placeholder="أدخل اسم الخريطة"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={() => setIsSaveDialogOpen(false)}>
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
