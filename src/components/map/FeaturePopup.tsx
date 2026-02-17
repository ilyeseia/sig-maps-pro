"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MapPin,
  Edit3,
  Trash2,
  Save,
  X,
  Copy,
  ExternalLink,
} from "lucide-react";
import type { Feature } from "@/lib/types";

interface FeaturePopupProps {
  feature: Feature | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (id: string, properties: Record<string, unknown>) => void;
  onDelete?: (id: string) => void;
}

export default function FeaturePopup({
  feature,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: FeaturePopupProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProperties, setEditedProperties] = useState<Record<string, unknown>>({});

  if (!feature) return null;

  const properties = feature.properties as Record<string, unknown>;

  const handleEdit = () => {
    setEditedProperties({ ...properties });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(feature.id, editedProperties);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProperties({});
  };

  const handleCopyCoordinates = () => {
    const coords = feature.geometry.coordinates;
    navigator.clipboard.writeText(`${coords[1]}, ${coords[0]}`);
  };

  const getGeometryTypeLabel = () => {
    const labels: Record<string, string> = {
      Point: "نقطة",
      LineString: "خط",
      Polygon: "مضلع",
      MultiPoint: "نقاط متعددة",
      MultiLineString: "خطوط متعددة",
      MultiPolygon: "مضلعات متعددة",
    };
    return labels[feature.geometry.type] || feature.geometry.type;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {isEditing ? "تحرير العنصر" : (properties.name as string) || "عنصر جغرافي"}
          </SheetTitle>
          <SheetDescription>
            <Badge variant="outline" className="mr-2">
              {getGeometryTypeLabel()}
            </Badge>
            <span className="text-xs text-muted-foreground">
              ID: {feature.id.slice(0, 8)}...
            </span>
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Coordinates Section */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">الإحداثيات</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-2 bg-muted rounded-lg font-mono text-sm">
                {feature.geometry.coordinates[1].toFixed(6)}, {feature.geometry.coordinates[0].toFixed(6)}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyCoordinates}
                title="نسخ الإحداثيات"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Properties Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground">الخصائص</Label>
              {!isEditing && (
                <Button variant="ghost" size="sm" onClick={handleEdit}>
                  <Edit3 className="h-4 w-4 ml-1" />
                  تحرير
                </Button>
              )}
            </div>

            <ScrollArea className="h-[300px] pr-4">
              {isEditing ? (
                <div className="space-y-4">
                  {Object.entries(editedProperties).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key} className="text-xs">
                        {key}
                      </Label>
                      <Input
                        id={key}
                        value={String(value)}
                        onChange={(e) =>
                          setEditedProperties((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                      />
                    </div>
                  ))}
                  
                  {/* Add new property */}
                  <Button variant="outline" size="sm" className="w-full">
                    + إضافة خاصية
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(properties).length > 0 ? (
                    Object.entries(properties).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-start justify-between p-2 rounded-lg bg-muted/50"
                      >
                        <span className="text-sm text-muted-foreground">{key}</span>
                        <span className="text-sm font-medium text-left" dir="ltr">
                          {String(value)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      لا توجد خصائص
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </div>

          <Separator />

          {/* Metadata */}
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>تاريخ الإنشاء</span>
              <span>{new Date(feature.createdAt).toLocaleDateString("ar")}</span>
            </div>
            <div className="flex justify-between">
              <span>آخر تحديث</span>
              <span>{new Date(feature.updatedAt).toLocaleDateString("ar")}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" className="flex-1" onClick={handleCancel}>
                  <X className="h-4 w-4 ml-1" />
                  إلغاء
                </Button>
                <Button className="flex-1" onClick={handleSave}>
                  <Save className="h-4 w-4 ml-1" />
                  حفظ
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(`https://www.google.com/maps?q=${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}`, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 ml-1" />
                  فتح في خرائط Google
                </Button>
                {onDelete && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(feature.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
