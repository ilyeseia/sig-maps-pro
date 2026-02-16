// GIS Types for Maps Pro Application

// GeoJSON Types
export type GeoJSONPoint = {
  type: 'Point';
  coordinates: [number, number];
};

export type GeoJSONLineString = {
  type: 'LineString';
  coordinates: [number, number][];
};

export type GeoJSONPolygon = {
  type: 'Polygon';
  coordinates: [number, number][][];
};

export type GeoJSONMultiPoint = {
  type: 'MultiPoint';
  coordinates: [number, number][];
};

export type GeoJSONMultiLineString = {
  type: 'MultiLineString';
  coordinates: [number, number][][];
};

export type GeoJSONMultiPolygon = {
  type: 'MultiPolygon';
  coordinates: [number, number][][][];
};

export type GeoJSONGeometry = 
  | GeoJSONPoint 
  | GeoJSONLineString 
  | GeoJSONPolygon 
  | GeoJSONMultiPoint 
  | GeoJSONMultiLineString 
  | GeoJSONMultiPolygon;

export type GeoJSONFeature = {
  type: 'Feature';
  id?: string;
  geometry: GeoJSONGeometry;
  properties: Record<string, unknown>;
};

export type GeoJSONFeatureCollection = {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
};

// Layer Types
export type LayerType = 'VECTOR' | 'RASTER' | 'WMS' | 'TILE';
export type GeometryType = 'POINT' | 'LINESTRING' | 'POLYGON' | 'MULTIPOINT' | 'MULTILINESTRING' | 'MULTIPOLYGON';
export type BaseMap = 'OSM' | 'SATELLITE' | 'DARK' | 'TERRAIN';
export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

// Layer Style Types
export interface LayerStyle {
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  lineColor?: string;
  lineWidth?: number;
  lineOpacity?: number;
  pointRadius?: number;
  pointSymbol?: string;
  iconUrl?: string;
  labelField?: string;
  labelColor?: string;
  labelSize?: number;
}

// Database Entity Types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  organization?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Layer {
  id: string;
  name: string;
  description?: string;
  type: LayerType;
  geometryType?: GeometryType;
  visible: boolean;
  opacity: number;
  style?: LayerStyle;
  order: number;
  mapId?: string;
  userId: string;
  features: Feature[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Feature {
  id: string;
  geometry: GeoJSONGeometry;
  properties: Record<string, unknown>;
  layerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MapEntity {
  id: string;
  name: string;
  description?: string;
  centerLat: number;
  centerLng: number;
  zoom: number;
  baseMap: BaseMap;
  isPublic: boolean;
  thumbnail?: string;
  userId: string;
  layers: Layer[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  action: string;
  details?: string;
  userId: string;
  createdAt: Date;
}

// API Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
  message: string;
}

export interface CreateMapRequest {
  name: string;
  description?: string;
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  baseMap?: BaseMap;
  isPublic?: boolean;
}

export interface UpdateMapRequest extends Partial<CreateMapRequest> {
  id: string;
}

export interface CreateLayerRequest {
  name: string;
  description?: string;
  type?: LayerType;
  geometryType?: GeometryType;
  visible?: boolean;
  opacity?: number;
  style?: LayerStyle;
  mapId?: string;
}

export interface UpdateLayerRequest extends Partial<CreateLayerRequest> {
  id: string;
}

export interface CreateFeatureRequest {
  geometry: GeoJSONGeometry;
  properties?: Record<string, unknown>;
  layerId: string;
}

export interface UpdateFeatureRequest extends Partial<CreateFeatureRequest> {
  id: string;
}

// Drawing Tool Types
export type DrawMode = 'none' | 'point' | 'line' | 'polygon' | 'select' | 'delete';

export interface DrawTool {
  mode: DrawMode;
  active: boolean;
  color: string;
  lineWidth: number;
  fillColor: string;
  fillOpacity: number;
}

// Map State Types
export interface MapState {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
  baseMap: BaseMap;
}

// Statistics Types
export interface DashboardStats {
  totalMaps: number;
  totalLayers: number;
  totalFeatures: number;
  totalUsers: number;
  recentMaps: MapEntity[];
  recentActivities: Activity[];
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
