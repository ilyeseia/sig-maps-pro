"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  MousePointer,
  MapPin,
  Route,
  Pentagon,
  Trash2,
  Undo2,
  Redo2,
  Save,
  Settings2,
  Palette,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DrawMode, LayerStyle } from "@/lib/types";

interface DrawingToolsProps {
  activeMode: DrawMode;
  onModeChange: (mode: DrawMode) => void;
  style: LayerStyle;
  onStyleChange: (style: LayerStyle) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onClear?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  className?: string;
}

const drawingModes: { mode: DrawMode; icon: React.ElementType; label: string; shortcut: string }[] = [
  { mode: "select", icon: MousePointer, label: "تحديد", shortcut: "V" },
  { mode: "point", icon: MapPin, label: "نقطة", shortcut: "P" },
  { mode: "line", icon: Route, label: "خط", shortcut: "L" },
  { mode: "polygon", icon: Pentagon, label: "مضلع", shortcut: "G" },
];

export default function DrawingTools({
  activeMode,
  onModeChange,
  style,
  onStyleChange,
  onUndo,
  onRedo,
  onSave,
  onClear,
  canUndo = false,
  canRedo = false,
  className,
}: DrawingToolsProps) {
  const [showStylePanel, setShowStylePanel] = useState(false);

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex items-center gap-1 bg-background/95 backdrop-blur-sm rounded-lg border border-border p-1.5 shadow-lg",
          className
        )}
      >
        {/* Drawing Modes */}
        <div className="flex items-center gap-1">
          {drawingModes.map((item) => (
            <Tooltip key={item.mode}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeMode === item.mode ? "default" : "ghost"}
                  size="icon"
                  className={cn("h-9 w-9", activeMode === item.mode && "shadow-md")}
                  onClick={() => onModeChange(item.mode)}
                >
                  <item.icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="flex items-center gap-2">
                <span>{item.label}</span>
                <Badge variant="outline" className="text-xs">
                  {item.shortcut}
                </Badge>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Delete Mode */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeMode === "delete" ? "destructive" : "ghost"}
              size="icon"
              className="h-9 w-9"
              onClick={() => onModeChange("delete")}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <span>حذف عنصر</span>
            <Badge variant="outline" className="text-xs mr-2">
              D
            </Badge>
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={onUndo}
                disabled={!canUndo}
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <span>تراجع</span>
              <Badge variant="outline" className="text-xs mr-2">
                Ctrl+Z
              </Badge>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={onRedo}
                disabled={!canRedo}
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <span>إعادة</span>
              <Badge variant="outline" className="text-xs mr-2">
                Ctrl+Y
              </Badge>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Style Popover */}
        <Popover open={showStylePanel} onOpenChange={setShowStylePanel}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">أنماط الرسم</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setShowStylePanel(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Color */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">لون الحدود</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={style.color || "#3b82f6"}
                    onChange={(e) =>
                      onStyleChange({ ...style, color: e.target.value })
                    }
                    className="w-10 h-10 p-1"
                  />
                  <Input
                    value={style.color || "#3b82f6"}
                    onChange={(e) =>
                      onStyleChange({ ...style, color: e.target.value })
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Fill Color */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">لون التعبئة</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={style.fillColor || "#3b82f6"}
                    onChange={(e) =>
                      onStyleChange({ ...style, fillColor: e.target.value })
                    }
                    className="w-10 h-10 p-1"
                  />
                  <Input
                    value={style.fillColor || "#3b82f6"}
                    onChange={(e) =>
                      onStyleChange({ ...style, fillColor: e.target.value })
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Line Width */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">سمك الخط</Label>
                  <span className="text-xs">{style.lineWidth || 2}px</span>
                </div>
                <Slider
                  value={[style.lineWidth || 2]}
                  onValueChange={(value) =>
                    onStyleChange({ ...style, lineWidth: value[0] })
                  }
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              {/* Fill Opacity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">شفافية التعبئة</Label>
                  <span className="text-xs">{Math.round((style.fillOpacity || 0.5) * 100)}%</span>
                </div>
                <Slider
                  value={[(style.fillOpacity || 0.5) * 100]}
                  onValueChange={(value) =>
                    onStyleChange({ ...style, fillOpacity: value[0] / 100 })
                  }
                  min={0}
                  max={100}
                  step={5}
                />
              </div>

              {/* Point Radius */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">حجم النقطة</Label>
                  <span className="text-xs">{style.pointRadius || 8}px</span>
                </div>
                <Slider
                  value={[style.pointRadius || 8]}
                  onValueChange={(value) =>
                    onStyleChange({ ...style, pointRadius: value[0] })
                  }
                  min={4}
                  max={20}
                  step={1}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Save & Clear */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={onClear}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <span>مسح الكل</span>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="icon"
                className="h-9 w-9"
                onClick={onSave}
              >
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <span>حفظ</span>
              <Badge variant="outline" className="text-xs mr-2">
                Ctrl+S
              </Badge>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Current Mode Indicator */}
        <div className="mr-2 flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {activeMode === "none"
              ? "وضع العرض"
              : activeMode === "select"
              ? "وضع التحديد"
              : activeMode === "point"
              ? "رسم نقاط"
              : activeMode === "line"
              ? "رسم خطوط"
              : activeMode === "polygon"
              ? "رسم مضلعات"
              : activeMode === "delete"
              ? "وضع الحذف"
              : ""}
          </Badge>
        </div>
      </div>
    </TooltipProvider>
  );
}
