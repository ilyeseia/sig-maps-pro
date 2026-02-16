import { create } from 'zustand';
import type { 
  BaseMap, 
  Layer, 
  Feature, 
  DrawMode, 
  MapState,
  GeoJSONGeometry 
} from '../types';

interface MapStoreState {
  // Map state
  mapState: MapState;
  
  // Layers
  layers: Layer[];
  activeLayerId: string | null;
  
  // Features
  selectedFeatureId: string | null;
  
  // Drawing
  drawMode: DrawMode;
  drawingCoordinates: [number, number][];
  
  // UI state
  sidebarOpen: boolean;
  layerPanelOpen: boolean;
  
  // Actions
  setMapState: (state: Partial<MapState>) => void;
  setBaseMap: (baseMap: BaseMap) => void;
  
  // Layer actions
  setLayers: (layers: Layer[]) => void;
  addLayer: (layer: Layer) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  removeLayer: (id: string) => void;
  setActiveLayer: (id: string | null) => void;
  toggleLayerVisibility: (id: string) => void;
  setLayerOpacity: (id: string, opacity: number) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
  
  // Feature actions
  setSelectedFeature: (id: string | null) => void;
  addFeature: (layerId: string, feature: Feature) => void;
  updateFeature: (id: string, updates: Partial<Feature>) => void;
  removeFeature: (id: string) => void;
  
  // Drawing actions
  setDrawMode: (mode: DrawMode) => void;
  addDrawingPoint: (coord: [number, number]) => void;
  clearDrawing: () => void;
  finishDrawing: () => GeoJSONGeometry | null;
  
  // UI actions
  toggleSidebar: () => void;
  toggleLayerPanel: () => void;
}

export const useMapStore = create<MapStoreState>((set, get) => ({
  // Initial map state (centered on Saudi Arabia)
  mapState: {
    center: [24.7136, 46.6753],
    zoom: 5,
    bearing: 0,
    pitch: 0,
    baseMap: 'OSM',
  },
  
  // Layers
  layers: [],
  activeLayerId: null,
  
  // Features
  selectedFeatureId: null,
  
  // Drawing
  drawMode: 'none',
  drawingCoordinates: [],
  
  // UI
  sidebarOpen: true,
  layerPanelOpen: true,
  
  // Map actions
  setMapState: (state) => set((prev) => ({
    mapState: { ...prev.mapState, ...state },
  })),
  
  setBaseMap: (baseMap) => set((prev) => ({
    mapState: { ...prev.mapState, baseMap },
  })),
  
  // Layer actions
  setLayers: (layers) => set({ layers }),
  
  addLayer: (layer) => set((prev) => ({
    layers: [...prev.layers, layer],
  })),
  
  updateLayer: (id, updates) => set((prev) => ({
    layers: prev.layers.map((layer) =>
      layer.id === id ? { ...layer, ...updates } : layer
    ),
  })),
  
  removeLayer: (id) => set((prev) => ({
    layers: prev.layers.filter((layer) => layer.id !== id),
    activeLayerId: prev.activeLayerId === id ? null : prev.activeLayerId,
  })),
  
  setActiveLayer: (id) => set({ activeLayerId: id }),
  
  toggleLayerVisibility: (id) => set((prev) => ({
    layers: prev.layers.map((layer) =>
      layer.id === id ? { ...layer, visible: !layer.visible } : layer
    ),
  })),
  
  setLayerOpacity: (id, opacity) => set((prev) => ({
    layers: prev.layers.map((layer) =>
      layer.id === id ? { ...layer, opacity } : layer
    ),
  })),
  
  reorderLayers: (fromIndex, toIndex) => set((prev) => {
    const newLayers = [...prev.layers];
    const [removed] = newLayers.splice(fromIndex, 1);
    newLayers.splice(toIndex, 0, removed);
    return { layers: newLayers };
  }),
  
  // Feature actions
  setSelectedFeature: (id) => set({ selectedFeatureId: id }),
  
  addFeature: (layerId, feature) => set((prev) => ({
    layers: prev.layers.map((layer) =>
      layer.id === layerId
        ? { ...layer, features: [...layer.features, feature] }
        : layer
    ),
  })),
  
  updateFeature: (id, updates) => set((prev) => ({
    layers: prev.layers.map((layer) => ({
      ...layer,
      features: layer.features.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
    })),
  })),
  
  removeFeature: (id) => set((prev) => ({
    layers: prev.layers.map((layer) => ({
      ...layer,
      features: layer.features.filter((f) => f.id !== id),
    })),
    selectedFeatureId: prev.selectedFeatureId === id ? null : prev.selectedFeatureId,
  })),
  
  // Drawing actions
  setDrawMode: (mode) => set({ drawMode: mode, drawingCoordinates: [] }),
  
  addDrawingPoint: (coord) => set((prev) => ({
    drawingCoordinates: [...prev.drawingCoordinates, coord],
  })),
  
  clearDrawing: () => set({ drawingCoordinates: [], drawMode: 'none' }),
  
  finishDrawing: () => {
    const state = get();
    const coords = state.drawingCoordinates;
    
    if (coords.length === 0) return null;
    
    let geometry: GeoJSONGeometry | null = null;
    
    switch (state.drawMode) {
      case 'point':
        geometry = {
          type: 'Point',
          coordinates: coords[0],
        };
        break;
      case 'line':
        if (coords.length >= 2) {
          geometry = {
            type: 'LineString',
            coordinates: coords,
          };
        }
        break;
      case 'polygon':
        if (coords.length >= 3) {
          // Close the polygon
          geometry = {
            type: 'Polygon',
            coordinates: [[...coords, coords[0]]],
          };
        }
        break;
    }
    
    set({ drawingCoordinates: [], drawMode: 'none' });
    return geometry;
  },
  
  // UI actions
  toggleSidebar: () => set((prev) => ({ sidebarOpen: !prev.sidebarOpen })),
  toggleLayerPanel: () => set((prev) => ({ layerPanelOpen: !prev.layerPanelOpen })),
}));
