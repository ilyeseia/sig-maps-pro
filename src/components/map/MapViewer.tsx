"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl, { Map, GeoJSONSource, LngLatLike } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Locate,
  Layers as LayersIcon,
  MapIcon,
  Satellite,
  Mountain,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseMap, GeoJSONFeature, Layer as LayerType } from "@/lib/types";

interface MapViewerProps {
  center?: [number, number];
  zoom?: number;
  baseMap?: BaseMap;
  layers?: LayerType[];
  onMapClick?: (lngLat: { lng: number; lat: number }) => void;
  onFeatureClick?: (feature: GeoJSONFeature) => void;
  className?: string;
  showControls?: boolean;
}

const baseMapStyles: Record<BaseMap, string> = {
  OSM: "https://demotiles.maplibre.org/style.json",
  SATELLITE: "https://maps.gis-ops.com/tileserver/style_satellite.json",
  DARK: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  TERRAIN: "https://demotiles.maplibre.org/style.json",
};

const baseMapLabels: Record<BaseMap, { name: string; icon: React.ElementType }> = {
  OSM: { name: "خريطة الشوارع", icon: MapIcon },
  SATELLITE: { name: "القمر الصناعي", icon: Satellite },
  DARK: { name: "الوضع الداكن", icon: Moon },
  TERRAIN: { name: "التضاريس", icon: Mountain },
};

export default function MapViewer({
  center = [0, 0],
  zoom = 2,
  baseMap = "OSM",
  layers = [],
  onMapClick,
  onFeatureClick,
  className,
  showControls = true,
}: MapViewerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentBaseMap, setCurrentBaseMap] = useState<BaseMap>(baseMap);
  const [showBaseMapSelector, setShowBaseMapSelector] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [coordinates, setCoordinates] = useState({ lng: center[0], lat: center[1] });

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: baseMapStyles[currentBaseMap],
      center: center as LngLatLike,
      zoom: zoom,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-left");
    map.addControl(new maplibregl.ScaleControl(), "bottom-left");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

    map.on("load", () => {
      setMapLoaded(true);
    });

    map.on("click", (e) => {
      setCoordinates({ lng: e.lngLat.lng, lat: e.lngLat.lat });
      if (onMapClick) {
        onMapClick({ lng: e.lngLat.lng, lat: e.lngLat.lat });
      }
    });

    map.on("zoom", () => {
      setCurrentZoom(map.getZoom());
    });

    map.on("mousemove", (e) => {
      setCoordinates({ lng: e.lngLat.lng, lat: e.lngLat.lat });
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update base map
  useEffect(() => {
    if (mapInstance.current && mapLoaded) {
      mapInstance.current.setStyle(baseMapStyles[currentBaseMap]);
    }
  }, [currentBaseMap, mapLoaded]);

  // Update layers
  useEffect(() => {
    if (!mapInstance.current || !mapLoaded) return;

    const map = mapInstance.current;

    // Remove existing layers and sources
    layers.forEach((layer) => {
      if (map.getLayer(layer.id)) {
        map.removeLayer(layer.id);
      }
      if (map.getSource(layer.id)) {
        map.removeSource(layer.id);
      }
    });

    // Add new layers
    layers.forEach((layer) => {
      if (!layer.visible) return;

      const geojson: GeoJSONFeatureCollection = {
        type: "FeatureCollection",
        features: layer.features.map((f) => ({
          type: "Feature",
          id: f.id,
          geometry: f.geometry,
          properties: f.properties,
        })),
      };

      map.addSource(layer.id, {
        type: "geojson",
        data: geojson,
      });

      // Add layer based on geometry type
      if (layer.geometryType === "POINT" || layer.geometryType === "MULTIPOINT") {
        map.addLayer({
          id: layer.id,
          type: "circle",
          source: layer.id,
          paint: {
            "circle-radius": layer.style?.pointRadius || 8,
            "circle-color": layer.style?.color || "#3b82f6",
            "circle-opacity": layer.opacity || 1,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          },
        });
      } else if (layer.geometryType === "LINESTRING" || layer.geometryType === "MULTILINESTRING") {
        map.addLayer({
          id: layer.id,
          type: "line",
          source: layer.id,
          paint: {
            "line-color": layer.style?.lineColor || "#3b82f6",
            "line-width": layer.style?.lineWidth || 3,
            "line-opacity": layer.opacity || 1,
          },
        });
      } else {
        map.addLayer({
          id: layer.id,
          type: "fill",
          source: layer.id,
          paint: {
            "fill-color": layer.style?.fillColor || "#3b82f6",
            "fill-opacity": layer.style?.fillOpacity || 0.5,
          },
        });

        // Add outline for polygons
        map.addLayer({
          id: `${layer.id}-outline`,
          type: "line",
          source: layer.id,
          paint: {
            "line-color": layer.style?.lineColor || "#1e40af",
            "line-width": layer.style?.lineWidth || 2,
          },
        });
      }

      // Handle feature click
      map.on("click", layer.id, (e) => {
        if (e.features && e.features[0] && onFeatureClick) {
          onFeatureClick(e.features[0] as unknown as GeoJSONFeature);
        }
      });

      // Change cursor on hover
      map.on("mouseenter", layer.id, () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", layer.id, () => {
        map.getCanvas().style.cursor = "";
      });
    });
  }, [layers, mapLoaded, onFeatureClick]);

  // Fly to location
  const flyTo = useCallback((lng: number, lat: number, zoomLevel?: number) => {
    if (mapInstance.current) {
      mapInstance.current.flyTo({
        center: [lng, lat],
        zoom: zoomLevel || currentZoom,
        duration: 1500,
      });
    }
  }, [currentZoom]);

  // Zoom controls
  const handleZoomIn = () => {
    if (mapInstance.current) {
      mapInstance.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstance.current) {
      mapInstance.current.zoomOut();
    }
  };

  const handleResetView = () => {
    if (mapInstance.current) {
      mapInstance.current.resetNorthPitch();
    }
  };

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        flyTo(position.coords.longitude, position.coords.latitude, 14);
      });
    }
  };

  return (
    <div className={cn("relative w-full h-full", className)}>
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Map Controls */}
      {showControls && (
        <>
          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleZoomIn}
              className="bg-background/90 backdrop-blur-sm shadow-md"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleZoomOut}
              className="bg-background/90 backdrop-blur-sm shadow-md"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleResetView}
              className="bg-background/90 backdrop-blur-sm shadow-md"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleLocate}
              className="bg-background/90 backdrop-blur-sm shadow-md"
            >
              <Locate className="h-4 w-4" />
            </Button>
          </div>

          {/* Base Map Selector */}
          <div className="absolute bottom-4 right-4 z-10">
            <div className="relative">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setShowBaseMapSelector(!showBaseMapSelector)}
                className="bg-background/90 backdrop-blur-sm shadow-md"
              >
                <LayersIcon className="h-4 w-4" />
              </Button>

              {showBaseMapSelector && (
                <div className="absolute bottom-12 right-0 bg-background/95 backdrop-blur-sm rounded-lg shadow-lg border border-border p-2 min-w-[180px]">
                  <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                    الخريطة الأساسية
                  </div>
                  {Object.entries(baseMapLabels).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setCurrentBaseMap(key as BaseMap);
                        setShowBaseMapSelector(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-colors",
                        currentBaseMap === key
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      )}
                    >
                      <value.icon className="h-4 w-4" />
                      <span>{value.name}</span>
                      {currentBaseMap === key && (
                        <Badge variant="secondary" className="mr-auto text-xs">
                          نشط
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Coordinates Display */}
          <div className="absolute bottom-4 left-4 z-10 bg-background/90 backdrop-blur-sm rounded-lg shadow-md px-3 py-2 text-xs font-mono">
            <span className="text-muted-foreground">خط الطول: </span>
            <span>{coordinates.lng.toFixed(6)}</span>
            <span className="text-muted-foreground mr-2"> | خط العرض: </span>
            <span>{coordinates.lat.toFixed(6)}</span>
            <span className="text-muted-foreground mr-2"> | التقريب: </span>
            <span>{currentZoom.toFixed(1)}</span>
          </div>
        </>
      )}

      {/* Loading Indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-20">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            <span className="text-sm text-muted-foreground">جاري تحميل الخريطة...</span>
          </div>
        </div>
      )}
    </div>
  );
}
