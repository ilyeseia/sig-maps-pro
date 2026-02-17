// Service Layer - Business Logic
import bcrypt from 'bcryptjs';
import { userRepository, mapRepository, layerRepository, featureRepository } from './repositories';
import type { LoginInput, RegisterInput, CreateMapInput, CreateLayerInput, CreateFeatureInput, PaginationInput } from '@/lib/validators';

// Auth Service
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);

    if (!user) {
      throw new Error('بيانات الدخول غير صحيحة');
    }

    const isValid = await bcrypt.compare(input.password, user.password);
    if (!isValid) {
      throw new Error('بيانات الدخول غير صحيحة');
    }

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token: this.generateToken(user.id),
    };
  }

  async register(input: RegisterInput) {
    const existingEmail = await userRepository.findByEmail(input.email);
    if (existingEmail) {
      throw new Error('البريد الإلكتروني مستخدم بالفعل');
    }

    const existingUsername = await userRepository.findByUsername(input.username);
    if (existingUsername) {
      throw new Error('اسم المستخدم مستخدم بالفعل');
    }

    const hashedPassword = await bcrypt.hash(input.password, this.SALT_ROUNDS);

    const user = await userRepository.create({
      ...input,
      password: hashedPassword,
      role: 'USER',
      isActive: true,
    });

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token: this.generateToken(user.id),
    };
  }

  private generateToken(userId: string): string {
    return `token-${userId}-${Date.now()}`;
  }
}

// Map Service
export class MapService {
  async getAll(params: PaginationInput, userId?: string) {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (userId) {
      where.userId = userId;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      mapRepository.findAll({ skip, take: limit, where }),
      mapRepository.count(where),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    const map = await mapRepository.findWithLayers(id);
    if (!map) {
      throw new Error('الخريطة غير موجودة');
    }
    return map;
  }

  async create(input: CreateMapInput, userId: string) {
    return mapRepository.create({
      ...input,
      userId,
      centerLat: input.centerLat ?? 0,
      centerLng: input.centerLng ?? 0,
      zoom: input.zoom ?? 2,
      baseMap: input.baseMap ?? 'OSM',
      isPublic: input.isPublic ?? false,
    });
  }

  async update(id: string, input: Partial<CreateMapInput>) {
    const existing = await mapRepository.findById(id);
    if (!existing) {
      throw new Error('الخريطة غير موجودة');
    }
    return mapRepository.update(id, input);
  }

  async delete(id: string) {
    const existing = await mapRepository.findById(id);
    if (!existing) {
      throw new Error('الخريطة غير موجودة');
    }
    await mapRepository.delete(id);
  }
}

// Layer Service
export class LayerService {
  async getAll(params: PaginationInput) {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      layerRepository.findAll({ skip, take: limit, where }),
      layerRepository.count(where),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    const layer = await layerRepository.findWithFeatures(id);
    if (!layer) {
      throw new Error('الطبقة غير موجودة');
    }
    return layer;
  }

  async create(input: CreateLayerInput, userId: string) {
    const count = await layerRepository.count({ userId });
    return layerRepository.create({
      ...input,
      userId,
      order: count,
      type: input.type ?? 'VECTOR',
      visible: input.visible ?? true,
      opacity: input.opacity ?? 1,
    });
  }

  async update(id: string, input: Partial<CreateLayerInput>) {
    const existing = await layerRepository.findById(id);
    if (!existing) {
      throw new Error('الطبقة غير موجودة');
    }
    return layerRepository.update(id, input);
  }

  async delete(id: string) {
    const existing = await layerRepository.findById(id);
    if (!existing) {
      throw new Error('الطبقة غير موجودة');
    }
    await layerRepository.delete(id);
  }

  async reorder(layerIds: string[]) {
    const updates = layerIds.map((id, index) => 
      layerRepository.updateOrder(id, index)
    );
    return Promise.all(updates);
  }
}

// Feature Service
export class FeatureService {
  async getByLayerId(layerId: string, params: PaginationInput) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [features, total] = await Promise.all([
      featureRepository.findByLayerId(layerId, { skip, take: limit }),
      featureRepository.countByLayer(layerId),
    ]);

    // Return as GeoJSON
    const geojson = {
      type: 'FeatureCollection',
      features: features.map((f: any) => ({
        type: 'Feature',
        id: f.id,
        geometry: f.geometry,
        properties: f.properties,
      })),
    };

    return {
      data: geojson,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(input: CreateFeatureInput) {
    return featureRepository.create({
      ...input,
      properties: input.properties ?? {},
    });
  }

  async update(id: string, input: Partial<CreateFeatureInput>) {
    return featureRepository.update(id, input);
  }

  async delete(id: string) {
    await featureRepository.delete(id);
  }

  async bulkImport(layerId: string, features: CreateFeatureInput[]) {
    const data = features.map(f => ({
      ...f,
      layerId,
      properties: f.properties ?? {},
    }));
    return featureRepository.bulkCreate(data);
  }
}

// Export instances
export const authService = new AuthService();
export const mapService = new MapService();
export const layerService = new LayerService();
export const featureService = new FeatureService();
