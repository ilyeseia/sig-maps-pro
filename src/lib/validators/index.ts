import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(4, 'كلمة المرور يجب أن تكون 4 أحرف على الأقل'),
});

export const registerSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  username: z.string().min(3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل').max(50),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  organization: z.string().max(200).optional(),
});

// Map Schemas
export const createMapSchema = z.object({
  name: z.string().min(1, 'اسم الخريطة مطلوب').max(255),
  description: z.string().max(1000).optional(),
  centerLat: z.number().min(-90).max(90).optional(),
  centerLng: z.number().min(-180).max(180).optional(),
  zoom: z.number().min(0).max(22).optional(),
  baseMap: z.enum(['OSM', 'SATELLITE', 'DARK', 'TERRAIN']).optional(),
  isPublic: z.boolean().optional(),
});

export const updateMapSchema = createMapSchema.partial();

// Layer Schemas
export const createLayerSchema = z.object({
  name: z.string().min(1, 'اسم الطبقة مطلوب').max(255),
  description: z.string().max(1000).optional(),
  type: z.enum(['VECTOR', 'RASTER', 'WMS', 'TILE']).optional(),
  geometryType: z.enum(['POINT', 'LINESTRING', 'POLYGON', 'MULTIPOINT', 'MULTILINESTRING', 'MULTIPOLYGON']).optional(),
  visible: z.boolean().optional(),
  opacity: z.number().min(0).max(1).optional(),
  style: z.object({
    color: z.string().optional(),
    fillColor: z.string().optional(),
    fillOpacity: z.number().min(0).max(1).optional(),
    lineColor: z.string().optional(),
    lineWidth: z.number().min(0).max(20).optional(),
    pointRadius: z.number().min(1).max(50).optional(),
  }).optional(),
  mapId: z.string().optional(),
});

export const updateLayerSchema = createLayerSchema.partial();

// Feature Schemas
export const createFeatureSchema = z.object({
  layerId: z.string().min(1, 'معرف الطبقة مطلوب'),
  geometry: z.object({
    type: z.enum(['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon']),
    coordinates: z.any(), // Complex GeoJSON validation
  }),
  properties: z.record(z.any()).optional(),
});

export const updateFeatureSchema = createFeatureSchema.partial().omit({ layerId: true });

// Pagination Schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(255).optional(),
  sortBy: z.string().max(50).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// GeoProcessing Schemas
export const bufferSchema = z.object({
  layerId: z.string().min(1),
  distance: z.number().min(0),
  segments: z.number().int().min(1).max(100).optional(),
});

export const intersectSchema = z.object({
  layerId1: z.string().min(1),
  layerId2: z.string().min(1),
});

export const simplifySchema = z.object({
  layerId: z.string().min(1),
  tolerance: z.number().min(0).max(1),
});

// Types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateMapInput = z.infer<typeof createMapSchema>;
export type UpdateMapInput = z.infer<typeof updateMapSchema>;
export type CreateLayerInput = z.infer<typeof createLayerSchema>;
export type UpdateLayerInput = z.infer<typeof updateLayerSchema>;
export type CreateFeatureInput = z.infer<typeof createFeatureSchema>;
export type UpdateFeatureInput = z.infer<typeof updateFeatureSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
