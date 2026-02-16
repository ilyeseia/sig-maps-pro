"use client";

import { useState, useSyncExternalStore, useCallback } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Map,
  Layers,
  Activity,
  Users,
  Settings,
  Plus,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  Moon,
  Sun,
  TrendingUp,
  Clock,
  MapPin,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuthStore } from "@/lib/stores/auth-store";

const mockStats = {
  totalMaps: 12,
  totalLayers: 45,
  totalFeatures: 1247,
  totalUsers: 8,
};

const mockRecentMaps = [
  {
    id: "1",
    name: "خريطة المدينة",
    description: "خريطة تفصيلية للمدينة",
    features: 156,
    layers: 5,
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "2",
    name: "خريطة الطرق",
    description: "شبكة الطرق الرئيسية",
    features: 89,
    layers: 3,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "3",
    name: "خريطة المناطق",
    description: "تقسيم المناطق الإدارية",
    features: 234,
    layers: 4,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

const mockRecentActivities = [
  {
    id: "1",
    action: "إضافة طبقة جديدة",
    details: "تم إضافة طبقة 'المدارس'",
    time: "منذ 15 دقيقة",
  },
  {
    id: "2",
    action: "تحديث خريطة",
    details: "تم تحديث 'خريطة المدينة'",
    time: "منذ ساعة",
  },
  {
    id: "3",
    action: "حذف عنصر",
    details: "تم حذف 3 عناصر من طبقة 'الحدائق'",
    time: "منذ ساعتين",
  },
  {
    id: "4",
    action: "تصدير بيانات",
    details: "تم تصدير طبقة 'الطرق' بصيغة GeoJSON",
    time: "منذ 3 ساعات",
  },
];

const mockChartData = [
  { name: "يناير", maps: 4, features: 120 },
  { name: "فبراير", maps: 6, features: 180 },
  { name: "مارس", maps: 8, features: 240 },
  { name: "أبريل", maps: 10, features: 320 },
  { name: "مايو", maps: 12, features: 450 },
  { name: "يونيو", maps: 15, features: 580 },
];

export default function DashboardPage() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    useCallback(() => () => {}, []),
    () => true,
    () => false
  );
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed top-0 right-0 h-full w-64 bg-card border-l border-border z-40">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Map className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-lg">GIS Maps Pro</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Link href="/dashboard">
              <Button variant="secondary" className="w-full justify-start gap-2">
                <LayoutDashboard className="h-4 w-4" />
                لوحة التحكم
              </Button>
            </Link>
            <Link href="/dashboard/maps">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Map className="h-4 w-4" />
                الخرائط
              </Button>
            </Link>
            <Link href="/dashboard/layers">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Layers className="h-4 w-4" />
                الطبقات
              </Button>
            </Link>
            <Link href="/dashboard/admin">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" />
                المستخدمين
              </Button>
            </Link>
          </nav>

          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {user?.firstName || user?.username || "المستخدم"}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {user?.email || "user@example.com"}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="mr-64">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold">لوحة التحكم</h1>
              <p className="text-sm text-muted-foreground">
                مرحباً بك في نظام المعلومات الجغرافية
              </p>
            </div>
            <div className="flex items-center gap-4">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              )}
              <Link href="/viewer/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  خريطة جديدة
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  الخرائط
                </CardTitle>
                <Map className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockStats.totalMaps}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+2</span> هذا الأسبوع
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  الطبقات
                </CardTitle>
                <Layers className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockStats.totalLayers}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+5</span> هذا الأسبوع
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  العناصر
                </CardTitle>
                <MapPin className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {mockStats.totalFeatures.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+127</span> هذا الأسبوع
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  المستخدمين
                </CardTitle>
                <Users className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockStats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  نشط الآن: 3
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Recent Items */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-border/50">
              <CardHeader>
                <CardTitle>نشاط الخرائط</CardTitle>
                <CardDescription>الخرائط المضافة شهرياً</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockChartData}>
                      <defs>
                        <linearGradient id="colorMaps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="maps"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorMaps)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  آخر النشاطات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {mockRecentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                          <MapPin className="h-3 w-3 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {activity.details}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Recent Maps */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>الخرائط الأخيرة</CardTitle>
                  <CardDescription>الخرائط التي قمت بتحريرها مؤخراً</CardDescription>
                </div>
                <Link href="/dashboard/maps">
                  <Button variant="outline">عرض الكل</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الخريطة</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead>العناصر</TableHead>
                    <TableHead>الطبقات</TableHead>
                    <TableHead>آخر تحديث</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRecentMaps.map((map) => (
                    <TableRow key={map.id} className="group">
                      <TableCell>
                        <Link
                          href={`/viewer/${map.id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {map.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {map.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{map.features}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{map.layers}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {map.updatedAt.toLocaleDateString("ar", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 ml-2" />
                              عرض
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit3 className="h-4 w-4 ml-2" />
                              تحرير
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4 ml-2" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
