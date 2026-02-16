# 🗺️ برومبت تطوير نظام GIS Maps Pro
## نظام معلومات جغرافية متطور - نسخة محسنة

---

## 📋 نظرة عامة على المشروع

قم بتطوير نظام معلومات جغرافية (GIS) متكامل يوفر:
- إدارة وعرض البيانات الجغرافية المكانية
- تحليل ومعالجة البيانات الجيومترية
- مشاركة الخرائط والطبقات مع صلاحيات متعددة
- واجهة مستخدم حديثة وسهلة الاستخدام

---

## 🏗️ التحسينات المطلوبة مقارنة بالمشروع الأصلي

### ✅ المشروع الأصلي (SIG Maps)
| الجانب | التقنية | المشكلة |
|--------|---------|---------|
| Frontend | Nuxt.js 2 + Vue 2 | تقنيات قديمة |
| TypeScript | غير موجود | ضعف التحقق من الأنواع |
| اختبارات | < 5% | تغطية ضعيفة جداً |
| Documentation | محدودة | نقص التوثيق |
| State Management | Vuex | معقد وغير فعال |

### 🚀 المشروع المحسن (GIS Maps Pro)
| الجانب | التقنية الجديدة | التحسين |
|--------|-----------------|---------|
| Frontend | **Nuxt 3 + Vue 3** | تقنيات حديثة |
| TypeScript | **مدمج بالكامل** | أنواع قوية |
| اختبارات | **80%+** | تغطية شاملة |
| Documentation | **كاملة** | توثيق تفصيلي |
| State Management | **Pinia** | بسيط وفعال |

---

## 🛠️ التقنيات المطلوبة

### Frontend (الواجهة الأمامية)
```
- Nuxt 3.x (أحدث إصدار)
- Vue 3.x مع Composition API
- TypeScript 5.x
- Pinia (إدارة الحالة)
- MapLibre GL JS أو OpenLayers (بدلاً من Leaflet)
- Tailwind CSS + Shadcn/UI
- Vitest + Playwright (اختبارات)
```

### Backend (الواجهة الخلفية)
```
- Spring Boot 3.2+
- Java 17 أو 21
- Spring Security 6 + JWT + OAuth2
- Spring Data JPA + Hibernate 6
- PostgreSQL 16 + PostGIS 3.4
- Redis (Cache + Sessions)
- GeoTools 31.x
- Flyway (Migrations)
- OpenAPI 3.0 / Swagger
```

### Infrastructure (البنية التحتية)
```
- Docker + Docker Compose
- Kubernetes (اختياري)
- GitHub Actions (CI/CD)
- Prometheus + Grafana (Monitoring)
- ELK Stack (Logging)
```

---

## 📐 البنية المعمارية المطلوبة

### 1. Architecture Pattern
```
┌─────────────────────────────────────────────────────────────┐
│                    CLEAN ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │              DOMAIN LAYER (Core)                     │   │
│  │  - Entities (Layer, Map, User, Geometry)            │   │
│  │  - Use Cases (Services)                             │   │
│  │  - Repository Interfaces                            │   │
│  │  - Domain Events                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                  │
│                           ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            APPLICATION LAYER                         │   │
│  │  - DTOs                                             │   │
│  │  - Mappers                                          │   │
│  │  - Application Services                             │   │
│  │  - CQRS (Command/Query Separation)                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                  │
│                           ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            INFRASTRUCTURE LAYER                      │   │
│  │  - REST Controllers                                 │   │
│  │  - Repository Implementations (JPA)                 │   │
│  │  - External Services (GeoServer, Redis)             │   │
│  │  - File Storage (S3/MinIO)                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                  │
│                           ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              PRESENTATION LAYER                      │   │
│  │  - Nuxt 3 Pages                                     │   │
│  │  - Vue 3 Components                                 │   │
│  │  - Pinia Stores                                     │   │
│  │  - Composables                                      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2. Backend Package Structure
```
com.gismaps.pro/
├── domain/                          # Domain Layer
│   ├── entity/                      # Domain Entities
│   │   ├── Layer.java
│   │   ├── Map.java
│   │   ├── User.java
│   │   ├── Geometry.java
│   │   └── Organization.java
│   ├── repository/                  # Repository Interfaces
│   │   ├── LayerRepository.java
│   │   └── MapRepository.java
│   ├── service/                     # Domain Services
│   │   ├── LayerDomainService.java
│   │   └── GeometryService.java
│   ├── event/                       # Domain Events
│   │   ├── LayerCreatedEvent.java
│   │   └── MapSharedEvent.java
│   └── exception/                   # Domain Exceptions
│       ├── LayerNotFoundException.java
│       └── InvalidGeometryException.java
│
├── application/                     # Application Layer
│   ├── dto/                         # Data Transfer Objects
│   │   ├── request/
│   │   │   ├── CreateLayerRequest.java
│   │   │   └── UpdateMapRequest.java
│   │   └── response/
│   │       ├── LayerResponse.java
│   │       └── MapResponse.java
│   ├── mapper/                      # Entity-DTO Mappers
│   │   ├── LayerMapper.java
│   │   └── MapMapper.java
│   ├── service/                     # Application Services
│   │   ├── LayerService.java
│   │   ├── MapService.java
│   │   └── GeoProcessingService.java
│   └── command/                     # CQRS Commands
│       ├── CreateLayerCommand.java
│       └── ShareMapCommand.java
│
├── infrastructure/                  # Infrastructure Layer
│   ├── persistence/                 # Data Persistence
│   │   ├── entity/                  # JPA Entities
│   │   ├── repository/              # JPA Repositories
│   │   └── config/                  # JPA Config
│   ├── security/                    # Security
│   │   ├── jwt/                     # JWT Implementation
│   │   ├── oauth2/                  # OAuth2 Integration
│   │   └── config/                  # Security Config
│   ├── geo/                         # Geospatial
│   │   ├── geotools/                # GeoTools Integration
│   │   ├── geoserver/               # GeoServer Client
│   │   └── postgis/                 # PostGIS Operations
│   ├── cache/                       # Caching
│   │   └── redis/                   # Redis Config
│   └── storage/                     # File Storage
│       └── s3/                      # S3/MinIO Client
│
├── presentation/                    # Presentation Layer
│   ├── controller/                  # REST Controllers
│   │   ├── LayerController.java
│   │   ├── MapController.java
│   │   ├── AuthController.java
│   │   └── GeoProcessingController.java
│   ├── websocket/                   # WebSocket Handlers
│   └── exception/                   # Global Exception Handling
│
└── config/                          # Application Config
    ├── OpenApiConfig.java
    ├── CorsConfig.java
    └── AsyncConfig.java
```

### 3. Frontend Directory Structure
```
gis-maps-pro-frontend/
├── app/
│   ├── pages/                       # Nuxt Pages
│   │   ├── index.vue
│   │   ├── auth/
│   │   │   ├── login.vue
│   │   │   └── register.vue
│   │   ├── dashboard/
│   │   │   ├── index.vue
│   │   │   ├── maps/
│   │   │   ├── layers/
│   │   │   └── admin/
│   │   └── viewer/
│   │       └── [id].vue
│   │
│   ├── components/                  # Vue Components
│   │   ├── map/
│   │   │   ├── MapViewer.vue
│   │   │   ├── LayerControl.vue
│   │   │   ├── DrawingTools.vue
│   │   │   └── GeoProcessing.vue
│   │   ├── dashboard/
│   │   │   ├── MapList.vue
│   │   │   ├── LayerList.vue
│   │   │   └── Statistics.vue
│   │   ├── ui/                      # Reusable UI Components
│   │   │   ├── Button.vue
│   │   │   ├── Modal.vue
│   │   │   ├── Table.vue
│   │   │   └── Form/
│   │   └── layout/
│   │       ├── Navbar.vue
│   │       ├── Sidebar.vue
│   │       └── Footer.vue
│   │
│   ├── composables/                 # Vue Composables
│   │   ├── useMap.ts
│   │   ├── useLayer.ts
│   │   ├── useAuth.ts
│   │   └── useGeoProcessing.ts
│   │
│   ├── stores/                      # Pinia Stores
│   │   ├── auth.ts
│   │   ├── map.ts
│   │   ├── layer.ts
│   │   └── ui.ts
│   │
│   ├── services/                    # API Services
│   │   ├── api.ts                   # Axios Config
│   │   ├── auth.service.ts
│   │   ├── map.service.ts
│   │   ├── layer.service.ts
│   │   └── geo.service.ts
│   │
│   ├── types/                       # TypeScript Types
│   │   ├── map.types.ts
│   │   ├── layer.types.ts
│   │   ├── user.types.ts
│   │   └── geometry.types.ts
│   │
│   ├── utils/                       # Utility Functions
│   │   ├── geometry.ts
│   │   ├── format.ts
│   │   └── validation.ts
│   │
│   └── plugins/                     # Nuxt Plugins
│       ├── maplibre.ts
│       └── auth.ts
│
├── server/                          # Nuxt Server
│   ├── api/                         # Server API Routes
│   └── middleware/                  # Server Middleware
│
├── assets/                          # Static Assets
│   ├── styles/
│   └── images/
│
├── tests/                           # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── nuxt.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 📊 نموذج قاعدة البيانات

### الجداول الرئيسية

```sql
-- Schema: gis

-- ==================== USERS & AUTH ====================

CREATE TABLE gis.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    is_enabled BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    role VARCHAR(50) DEFAULT 'USER', -- USER, ADMIN, SUPER_ADMIN
    organization_id UUID REFERENCES gis.organizations(id),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

CREATE TABLE gis.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url VARCHAR(500),
    settings JSONB DEFAULT '{}',
    max_layers INTEGER DEFAULT 100,
    max_maps INTEGER DEFAULT 50,
    max_storage_mb INTEGER DEFAULT 1024,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gis.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    organization_id UUID REFERENCES gis.organizations(id),
    permissions JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gis.user_groups (
    user_id UUID REFERENCES gis.users(id) ON DELETE CASCADE,
    group_id UUID REFERENCES gis.groups(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, group_id)
);

-- ==================== LAYERS ====================

CREATE TABLE gis.layers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- VECTOR, RASTER, WMS, WFS, TILE
    geometry_type VARCHAR(50), -- POINT, LINESTRING, POLYGON, MULTI*, GEOMETRYCOLLECTION
    srid INTEGER DEFAULT 4326,
    
    -- Style Configuration
    default_style JSONB DEFAULT '{}',
    min_zoom INTEGER DEFAULT 0,
    max_zoom INTEGER DEFAULT 22,
    
    -- GeoServer Integration
    geoserver_workspace VARCHAR(100),
    geoserver_layername VARCHAR(100),
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    tags VARCHAR(100)[],
    
    -- Ownership & Permissions
    owner_id UUID REFERENCES gis.users(id),
    organization_id UUID REFERENCES gis.organizations(id),
    visibility VARCHAR(50) DEFAULT 'PRIVATE', -- PRIVATE, ORGANIZATION, PUBLIC
    
    -- Statistics
    feature_count INTEGER DEFAULT 0,
    extent BOX2D,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_published BOOLEAN DEFAULT false
);

CREATE TABLE gis.fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    layer_id UUID REFERENCES gis.layers(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- TEXT, NUMBER, DATE, BOOLEAN, SELECT, MULTISELECT, IMAGE, URL
    required BOOLEAN DEFAULT false,
    unique_field BOOLEAN DEFAULT false,
    default_value TEXT,
    validation_rules JSONB DEFAULT '{}',
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    is_filterable BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== FEATURES (ENTITY ELEMENTS) ====================

CREATE TABLE gis.features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    layer_id UUID REFERENCES gis.layers(id) ON DELETE CASCADE,
    geometry GEOMETRY(Geometry, 4326),
    properties JSONB DEFAULT '{}',
    style_overrides JSONB,
    
    -- Audit
    created_by UUID REFERENCES gis.users(id),
    updated_by UUID REFERENCES gis.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Soft Delete
    deleted_at TIMESTAMPTZ,
    
    -- Indexing for spatial queries
    CONSTRAINT features_layer_id_valid CHECK (layer_id IS NOT NULL)
);

-- Spatial Index
CREATE INDEX idx_features_geometry ON gis.features USING GIST(geometry);
CREATE INDEX idx_features_layer_id ON gis.features(layer_id);
CREATE INDEX idx_features_properties ON gis.features USING GIN(properties);

-- ==================== MAPS ====================

CREATE TABLE gis.maps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500),
    
    -- Map Configuration
    center POINT,
    zoom INTEGER DEFAULT 10,
    min_zoom INTEGER DEFAULT 0,
    max_zoom INTEGER DEFAULT 22,
    extent BOX2D,
    
    -- Base Map
    base_map VARCHAR(100) DEFAULT 'OSM', -- OSM, SATELLITE, TERRAIN, DARK, CUSTOM
    base_map_url VARCHAR(500),
    
    -- Settings
    settings JSONB DEFAULT '{}', -- controls, legends, etc.
    
    -- Ownership & Permissions
    owner_id UUID REFERENCES gis.users(id),
    organization_id UUID REFERENCES gis.organizations(id),
    visibility VARCHAR(50) DEFAULT 'PRIVATE', -- PRIVATE, ORGANIZATION, PUBLIC, LINK_ONLY
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_published BOOLEAN DEFAULT false
);

CREATE TABLE gis.map_layers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    map_id UUID REFERENCES gis.maps(id) ON DELETE CASCADE,
    layer_id UUID REFERENCES gis.layers(id) ON DELETE CASCADE,
    
    -- Layer Order & Visibility
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    opacity DECIMAL(3,2) DEFAULT 1.0,
    
    -- Layer Style Override
    style_override JSONB,
    
    -- Filters
    filter_config JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(map_id, layer_id)
);

-- ==================== SHARING & PERMISSIONS ====================

CREATE TABLE gis.layer_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    layer_id UUID REFERENCES gis.layers(id) ON DELETE CASCADE,
    shared_with_type VARCHAR(50) NOT NULL, -- USER, GROUP, ORGANIZATION
    shared_with_id UUID NOT NULL,
    permission_level VARCHAR(50) DEFAULT 'VIEW', -- VIEW, EDIT, ADMIN
    created_by UUID REFERENCES gis.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(layer_id, shared_with_type, shared_with_id)
);

CREATE TABLE gis.map_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    map_id UUID REFERENCES gis.maps(id) ON DELETE CASCADE,
    shared_with_type VARCHAR(50) NOT NULL, -- USER, GROUP, ORGANIZATION, PUBLIC_LINK
    shared_with_id UUID,
    permission_level VARCHAR(50) DEFAULT 'VIEW', -- VIEW, EDIT, ADMIN
    share_token VARCHAR(100) UNIQUE,
    expires_at TIMESTAMPTZ,
    created_by UUID REFERENCES gis.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== GEOPROCESSING ====================

CREATE TABLE gis.geo_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- BUFFER, INTERSECTION, UNION, DIFFERENCE, etc.
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, RUNNING, COMPLETED, FAILED
    parameters JSONB NOT NULL,
    result JSONB,
    error_message TEXT,
    
    input_layer_ids UUID[],
    output_layer_id UUID,
    
    created_by UUID REFERENCES gis.users(id),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== AUDIT & LOGS ====================

CREATE TABLE gis.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL, -- LAYER, MAP, FEATURE, USER
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE, VIEW, SHARE
    changes JSONB,
    
    user_id UUID REFERENCES gis.users(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== NOTIFICATIONS ====================

CREATE TABLE gis.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES gis.users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔌 واجهات API REST

### Authentication API
```yaml
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
GET    /api/v1/auth/me
PUT    /api/v1/auth/me
```

### Layers API
```yaml
GET    /api/v1/layers                    # Liste des couches (paginée)
POST   /api/v1/layers                    # Créer une couche
GET    /api/v1/layers/{id}               # Détails d'une couche
PUT    /api/v1/layers/{id}               # Modifier une couche
DELETE /api/v1/layers/{id}               # Supprimer une couche

GET    /api/v1/layers/{id}/fields        # Champs de la couche
POST   /api/v1/layers/{id}/fields        # Ajouter un champ
PUT    /api/v1/layers/{id}/fields/{fid}  # Modifier un champ

GET    /api/v1/layers/{id}/features      # Features (GeoJSON)
POST   /api/v1/layers/{id}/features      # Créer un feature
PUT    /api/v1/layers/{id}/features/{fid}
DELETE /api/v1/layers/{id}/features/{fid}

POST   /api/v1/layers/{id}/import        # Import Shapefile/GeoJSON
GET    /api/v1/layers/{id}/export        # Export (GeoJSON, Shapefile, KML)

POST   /api/v1/layers/{id}/share         # Partager la couche
GET    /api/v1/layers/{id}/shares        # Liste des partages
DELETE /api/v1/layers/{id}/shares/{sid}  # Révoquer un partage
```

### Maps API
```yaml
GET    /api/v1/maps                      # Liste des cartes
POST   /api/v1/maps                      # Créer une carte
GET    /api/v1/maps/{id}                 # Détails d'une carte
PUT    /api/v1/maps/{id}                 # Modifier une carte
DELETE /api/v1/maps/{id}                 # Supprimer une carte

PUT    /api/v1/maps/{id}/layers          # Gérer les couches de la carte
POST   /api/v1/maps/{id}/layers/{layerId}# Ajouter une couche
DELETE /api/v1/maps/{id}/layers/{layerId}# Retirer une couche

POST   /api/v1/maps/{id}/share           # Partager la carte
GET    /api/v1/maps/public/{token}       # Carte publique (par token)
GET    /api/v1/maps/{id}/thumbnail       # Miniature de la carte
```

### GeoProcessing API
```yaml
POST   /api/v1/geo/buffer                # Créer un buffer
POST   /api/v1/geo/intersect             # Intersection
POST   /api/v1/geo/union                 # Union
POST   /api/v1/geo/difference            # Différence
POST   /api/v1/geo/centroid              # Centroïde
POST   /api/v1/geo/simplify              # Simplification
POST   /api/v1/geo/clip                  # Découpage
POST   /api/v1/geo/dissolve              # Dissoudre

GET    /api/v1/geo/jobs                  # Liste des jobs
GET    /api/v1/geo/jobs/{id}             # Statut d'un job
DELETE /api/v1/geo/jobs/{id}             # Annuler un job
```

### Admin API
```yaml
GET    /api/v1/admin/users               # Liste des utilisateurs
POST   /api/v1/admin/users               # Créer un utilisateur
PUT    /api/v1/admin/users/{id}          # Modifier un utilisateur
DELETE /api/v1/admin/users/{id}          # Supprimer un utilisateur

GET    /api/v1/admin/groups              # Liste des groupes
POST   /api/v1/admin/groups              # Créer un groupe
PUT    /api/v1/admin/groups/{id}
DELETE /api/v1/admin/groups/{id}

GET    /api/v1/admin/statistics          # Statistiques globales
GET    /api/v1/admin/audit-logs          # Logs d'audit
```

---

## 🔒 الأمان

### 1. Authentication
```typescript
// JWT Configuration
{
  "accessTokenTTL": "15m",
  "refreshTokenTTL": "7d",
  "algorithm": "RS256",  // Utiliser RSA au lieu de HS512
  "issuer": "gis-maps-pro",
  "audience": "gis-maps-pro-api"
}
```

### 2. Authorization (RBAC + ABAC)
```java
// Permissions structure
{
  "layer": {
    "create": "LAYER_CREATE",
    "read": "LAYER_READ",
    "update": "LAYER_UPDATE",
    "delete": "LAYER_DELETE",
    "share": "LAYER_SHARE"
  },
  "map": {
    "create": "MAP_CREATE",
    "read": "MAP_READ",
    "update": "MAP_UPDATE",
    "delete": "MAP_DELETE",
    "share": "MAP_SHARE",
    "publish": "MAP_PUBLISH"
  },
  "admin": {
    "manageUsers": "ADMIN_USERS",
    "manageGroups": "ADMIN_GROUPS",
    "manageSettings": "ADMIN_SETTINGS",
    "viewAudit": "ADMIN_AUDIT"
  }
}
```

### 3. Security Headers
```yaml
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Content-Security-Policy: default-src 'self'
- Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## 🧪 الاختبارات

### Backend Tests
```java
// Unit Tests (Jest pour JS, JUnit 5 pour Java)
@Test
void shouldCreateLayerWithValidData() {
    // Given
    CreateLayerRequest request = new CreateLayerRequest("Test Layer", LayerType.VECTOR);
    
    // When
    LayerResponse response = layerService.create(request);
    
    // Then
    assertNotNull(response.getId());
    assertEquals("Test Layer", response.getName());
}

// Integration Tests
@SpringBootTest
@Testcontainers
class LayerIntegrationTest {
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgis/postgis:15-3.3");
    
    @Test
    void shouldPersistLayerToDatabase() {
        // Test with real database
    }
}

// API Tests (RestAssured)
@Test
void shouldReturn401WhenUnauthorized() {
    given()
        .get("/api/v1/layers")
    .then()
        .statusCode(401);
}
```

### Frontend Tests
```typescript
// Unit Tests (Vitest)
describe('useMap composable', () => {
  it('should initialize map with default options', () => {
    const { map, initializeMap } = useMap()
    initializeMap({ center: [0, 0], zoom: 10 })
    expect(map.value).toBeDefined()
  })
})

// Component Tests
describe('LayerControl.vue', () => {
  it('should render layers list', () => {
    const wrapper = mount(LayerControl, {
      props: { layers: mockLayers }
    })
    expect(wrapper.findAll('.layer-item')).toHaveLength(3)
  })
})

// E2E Tests (Playwright)
test('user can create a new map', async ({ page }) => {
  await page.goto('/dashboard/maps')
  await page.click('[data-testid="create-map-btn"]')
  await page.fill('[data-testid="map-name-input"]', 'New Map')
  await page.click('[data-testid="save-btn"]')
  await expect(page.locator('.toast-success')).toBeVisible()
})
```

---

## 📦 Docker Configuration

### docker-compose.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgis/postgis:16-3.4
    container_name: gis-postgres
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-gis_db}
      POSTGRES_USER: ${POSTGRES_USER:-gis_user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD required}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-db:/docker-entrypoint-initdb.d
    networks:
      - gis-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-gis_user}"]
      interval: 10s
      timeout: 5s
      retries: 10

  redis:
    image: redis:7-alpine
    container_name: gis-redis
    volumes:
      - redis_data:/data
    networks:
      - gis-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: gis-backend
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/${POSTGRES_DB:-gis_db}
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-gis_user}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD}
      SPRING_REDIS_HOST: redis
      SPRING_REDIS_PORT: 6379
      JAVA_OPTS: ${JAVA_OPTS:--Xms512m -Xmx1024m}
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - gis-network
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 10

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        NUXT_PUBLIC_API_BASE: ${API_BASE_URL:-http://localhost:8080}
    container_name: gis-frontend
    environment:
      NUXT_PUBLIC_API_BASE: ${API_BASE_URL:-http://localhost:8080}
    ports:
      - "80:3000"
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - gis-network

networks:
  gis-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
```

---

## 📋 خطة التطوير

### Phase 1: Foundation (4 semaines)
```
Semaine 1-2:
- [ ] Setup Backend project (Spring Boot 3.2)
- [ ] Setup Frontend project (Nuxt 3)
- [ ] Database schema design
- [ ] Docker configuration
- [ ] CI/CD pipeline setup

Semaine 3-4:
- [ ] Authentication system (JWT + OAuth2)
- [ ] User management API
- [ ] Basic Frontend layout
- [ ] Unit test setup
```

### Phase 2: Core Features (6 semaines)
```
Semaine 5-6:
- [ ] Layer CRUD operations
- [ ] Field management
- [ ] Feature storage (GeoJSON/PostGIS)
- [ ] Map viewer component

Semaine 7-8:
- [ ] Map management
- [ ] Layer ordering and visibility
- [ ] Style configuration (SLD)
- [ ] Import/Export (Shapefile, GeoJSON, KML)

Semaine 9-10:
- [ ] Sharing system
- [ ] Permissions management
- [ ] GeoServer integration
- [ ] Integration tests
```

### Phase 3: Advanced Features (4 semaines)
```
Semaine 11-12:
- [ ] GeoProcessing tools
- [ ] Spatial analysis
- [ ] Advanced styling
- [ ] Map printing

Semaine 13-14:
- [ ] Notifications system
- [ ] Audit logging
- [ ] Performance optimization
- [ ] E2E tests
```

### Phase 4: Polish & Deploy (2 semaines)
```
Semaine 15-16:
- [ ] Documentation (API, User Guide)
- [ ] Performance testing
- [ ] Security audit
- [ ] Production deployment
```

---

## ✅ معايير الجودة

### Code Quality
```
- Test Coverage: ≥ 80%
- SonarQube Quality Gate: A
- TypeScript: Strict mode
- ESLint/Prettier: Configured
- No security vulnerabilities
```

### Performance
```
- API Response Time: < 200ms (P95)
- Map Load Time: < 2s
- Lighthouse Score: ≥ 90
- Database Query Optimization
- Redis caching for frequently accessed data
```

### Documentation
```
- OpenAPI specification (Swagger UI)
- README with setup instructions
- Architecture decision records (ADRs)
- Inline code documentation (Javadoc, TSDoc)
- User guide
```

---

## 📝 ملاحظات إضافية

1. **التوافق**: يجب أن يدعم المشروع الاستيراد من المشروع الأصلي (SIG Maps)
2. **الأداء**: تحسين معالجة البيانات الجغرافية الكبيرة
3. **الأمان**: تطبيق أفضل الممارسات الأمنية
4. **القابلية للتوسع**: تصميم يدعم النمو المستقبلي
5. **تجربة المستخدم**: واجهة سهلة الاستخدام ومتجاوبة

---

*تم إنشاء هذا البرومبت بناءً على تحليل معماري شامل لمشروع SIG Maps الأصلي*
