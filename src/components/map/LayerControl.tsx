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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Layers,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  MoreVertical,
  ChevronDown,
  ChevronLeft,
  GripVertical,
  Edit3,
  Copy,
  Download,
  Upload,
  Palette,
  Settings2,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import type { Layer, LayerType, GeometryType, LayerStyle } from "@/lib/types";

interface LayerControlProps {
  layers: Layer[];
  onLayersChange: (layers: Layer[]) => void;
  onAddLayer: (layer: Partial<Layer>) => void;
  onUpdateLayer: (id: string, updates: Partial<Layer>) => void;
  onDeleteLayer: (id: string) => void;
  className?: string;
}

const layerTypeLabels: Record<LayerType, string> = {
  VECTOR: "متجه",
  RASTER: "صورة",
  WMS: "خدمة ويب",
  TILE: "بلاط",
};

const geometryTypeLabels: Record<GeometryType, string> = {
  POINT: "نقاط",
  LINESTRING: "خطوط",
  POLYGON: "مضلعات",
  MULTIPOINT: "نقاط متعددة",
  MULTILINESTRING: "خطوط متعددة",
  MULTIPOLYGON: "مضلعات متعددة",
};

interface SortableLayerItemProps {
  layer: Layer;
  onToggleVisibility: (id: string) => void;
  onUpdateOpacity: (id: string, opacity: number) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Layer>) => void;
}

function SortableLayerItem({
  layer,
  onToggleVisibility,
  onUpdateOpacity,
  onDelete,
  onUpdate,
}: SortableLayerItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(layer.name);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: layer.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSaveName = () => {
    if (editName.trim()) {
      onUpdate(layer.id, { name: editName.trim() });
    }
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-card border border-border rounded-lg transition-shadow",
        isDragging && "shadow-lg z-50"
      )}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-2 p-3">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          {/* Visibility Toggle */}
          <button
            onClick={() => onToggleVisibility(layer.id)}
            className="text-muted-foreground hover:text-foreground"
          >
            {layer.visible ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </button>

          {/* Layer Info */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex gap-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-7 text-sm"
                  autoFocus
                />
                <Button size="sm" onClick={handleSaveName}>
                  حفظ
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{layer.name}</span>
                <Badge variant="outline" className="text-xs">
                  {geometryTypeLabels[layer.geometryType || "POINT"]}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {layer.features.length} عنصر
                </Badge>
              </div>
            )}
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 ml-2" />
                إعادة تسمية
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                <Copy className="h-4 w-4 ml-2" />
                نسخ الطبقة
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                <Download className="h-4 w-4 ml-2" />
                تصدير GeoJSON
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(layer.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 ml-2" />
                حذف الطبقة
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Expand Toggle */}
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>

        {/* Expanded Content */}
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4 border-t border-border pt-3">
            {/* Opacity Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">الشفافية</Label>
                <span className="text-xs text-muted-foreground">
                  {Math.round(layer.opacity * 100)}%
                </span>
              </div>
              <Slider
                value={[layer.opacity * 100]}
                onValueChange={(value) =>
                  onUpdateOpacity(layer.id, value[0] / 100)
                }
                max={100}
                step={1}
              />
            </div>

            {/* Style Controls */}
            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1">
                <Palette className="h-3 w-3" />
                الأنماط
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">اللون</Label>
                  <Input
                    type="color"
                    value={layer.style?.color || "#3b82f6"}
                    onChange={(e) =>
                      onUpdate(layer.id, {
                        style: { ...layer.style, color: e.target.value },
                      })
                    }
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">لون التعبئة</Label>
                  <Input
                    type="color"
                    value={layer.style?.fillColor || "#3b82f6"}
                    onChange={(e) =>
                      onUpdate(layer.id, {
                        style: { ...layer.style, fillColor: e.target.value },
                      })
                    }
                    className="h-8"
                  />
                </div>
              </div>
            </div>

            {/* Layer Details */}
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>النوع:</span>
                <span>{layerTypeLabels[layer.type]}</span>
              </div>
              <div className="flex justify-between">
                <span>نوع الهندسة:</span>
                <span>{geometryTypeLabels[layer.geometryType || "POINT"]}</span>
              </div>
              <div className="flex justify-between">
                <span>تاريخ الإنشاء:</span>
                <span>{new Date(layer.createdAt).toLocaleDateString("ar")}</span>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default function LayerControl({
  layers,
  onLayersChange,
  onAddLayer,
  onUpdateLayer,
  onDeleteLayer,
  className,
}: LayerControlProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLayerName, setNewLayerName] = useState("");
  const [newLayerType, setNewLayerType] = useState<GeometryType>("POINT");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = layers.findIndex((l) => l.id === active.id);
      const newIndex = layers.findIndex((l) => l.id === over.id);
      const reorderedLayers = arrayMove(layers, oldIndex, newIndex).map(
        (layer, index) => ({ ...layer, order: index })
      );
      onLayersChange(reorderedLayers);
    }
  };

  const handleToggleVisibility = (id: string) => {
    const layer = layers.find((l) => l.id === id);
    if (layer) {
      onUpdateLayer(id, { visible: !layer.visible });
    }
  };

  const handleUpdateOpacity = (id: string, opacity: number) => {
    onUpdateLayer(id, { opacity });
  };

  const handleAddLayer = () => {
    if (newLayerName.trim()) {
      onAddLayer({
        name: newLayerName.trim(),
        geometryType: newLayerType,
        type: "VECTOR",
        visible: true,
        opacity: 1,
        style: {
          color: "#3b82f6",
          fillColor: "#3b82f6",
          fillOpacity: 0.5,
          lineWidth: 2,
          pointRadius: 8,
        },
      });
      setNewLayerName("");
      setNewLayerType("POINT");
      setIsAddDialogOpen(false);
    }
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">الطبقات</CardTitle>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                طبقة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة طبقة جديدة</DialogTitle>
                <DialogDescription>
                  قم بإنشاء طبقة جغرافية جديدة للرسم عليها
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>اسم الطبقة</Label>
                  <Input
                    value={newLayerName}
                    onChange={(e) => setNewLayerName(e.target.value)}
                    placeholder="مثال: مواقع المدن"
                  />
                </div>
                <div className="space-y-2">
                  <Label>نوع الهندسة</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["POINT", "LINESTRING", "POLYGON"] as GeometryType[]).map(
                      (type) => (
                        <Button
                          key={type}
                          variant={newLayerType === type ? "default" : "outline"}
                          onClick={() => setNewLayerType(type)}
                          className="text-xs"
                        >
                          {geometryTypeLabels[type]}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleAddLayer} disabled={!newLayerName.trim()}>
                  إنشاء الطبقة
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>
          {layers.length} طبقة • {layers.reduce((acc, l) => acc + l.features.length, 0)} عنصر
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-400px)]">
          {layers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Layers className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground mb-2">
                لا توجد طبقات بعد
              </p>
              <p className="text-xs text-muted-foreground/70">
                قم بإنشاء طبقة جديدة للبدء في الرسم
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={layers.map((l) => l.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2 p-3">
                  {layers.map((layer) => (
                    <SortableLayerItem
                      key={layer.id}
                      layer={layer}
                      onToggleVisibility={handleToggleVisibility}
                      onUpdateOpacity={handleUpdateOpacity}
                      onDelete={onDeleteLayer}
                      onUpdate={onUpdateLayer}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
