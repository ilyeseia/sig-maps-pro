// Base Repository Pattern for Database Operations
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Base Repository Interface
export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(params?: { skip?: number; take?: number; where?: Record<string, unknown> }): Promise<T[]>;
  create(data: unknown): Promise<T>;
  update(id: string, data: unknown): Promise<T>;
  delete(id: string): Promise<void>;
  count(where?: Record<string, unknown>): Promise<number>;
}

// Base Repository Implementation
export abstract class BaseRepository<T> implements IBaseRepository<T> {
  protected model: any;

  constructor(model: any) {
    this.model = model;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async findAll(params?: { skip?: number; take?: number; where?: Record<string, unknown> }): Promise<T[]> {
    return this.model.findMany({
      skip: params?.skip,
      take: params?.take,
      where: params?.where,
    });
  }

  async create(data: unknown): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: string, data: unknown): Promise<T> {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.model.delete({ where: { id } });
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.model.count({ where });
  }
}

// User Repository
export class UserRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.user);
  }

  async findByEmail(email: string) {
    return this.model.findUnique({ where: { email } });
  }

  async findByUsername(username: string) {
    return this.model.findUnique({ where: { username } });
  }

  async findWithOrganizations(userId: string) {
    return this.model.findUnique({
      where: { id: userId },
      include: { organization: true },
    });
  }
}

// Map Repository
export class MapRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.map);
  }

  async findWithLayers(mapId: string) {
    return this.model.findUnique({
      where: { id: mapId },
      include: {
        layers: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findPublicMaps(params?: { skip?: number; take?: number }) {
    return this.model.findMany({
      where: { isPublic: true },
      skip: params?.skip,
      take: params?.take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUserId(userId: string, params?: { skip?: number; take?: number }) {
    return this.model.findMany({
      where: { userId },
      skip: params?.skip,
      take: params?.take,
      orderBy: { updatedAt: 'desc' },
    });
  }
}

// Layer Repository
export class LayerRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.layer);
  }

  async findWithFeatures(layerId: string) {
    return this.model.findUnique({
      where: { id: layerId },
      include: { features: true },
    });
  }

  async findByMapId(mapId: string) {
    return this.model.findMany({
      where: { mapId },
      orderBy: { order: 'asc' },
    });
  }

  async updateOrder(layerId: string, order: number) {
    return this.model.update({
      where: { id: layerId },
      data: { order },
    });
  }
}

// Feature Repository
export class FeatureRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.feature);
  }

  async findByLayerId(layerId: string, params?: { skip?: number; take?: number }) {
    return this.model.findMany({
      where: { layerId },
      skip: params?.skip,
      take: params?.take,
    });
  }

  async findWithinBbox(layerId: string, bbox: [number, number, number, number]) {
    const [minX, minY, maxX, maxY] = bbox;
    return this.model.findMany({
      where: {
        layerId,
        geometry: {
          path: ['coordinates'],
          array_contains: [minX, minY],
        },
      },
    });
  }

  async bulkCreate(features: unknown[]) {
    return this.model.createMany({ data: features });
  }

  async countByLayer(layerId: string) {
    return this.model.count({ where: { layerId } });
  }
}

// Export instances
export const userRepository = new UserRepository();
export const mapRepository = new MapRepository();
export const layerRepository = new LayerRepository();
export const featureRepository = new FeatureRepository();
