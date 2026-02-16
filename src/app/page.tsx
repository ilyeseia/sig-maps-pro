"use client";

import { useState, useSyncExternalStore, useCallback } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Map,
  Layers,
  Pencil,
  BarChart3,
  Users,
  Shield,
  Globe,
  Zap,
  ArrowLeft,
  Check,
  Moon,
  Sun,
  Database,
  Download,
  Upload,
  MousePointer,
  Navigation,
} from "lucide-react";

export default function HomePage() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    useCallback(() => () => {}, []),
    () => true,
    () => false
  );

  const features = [
    {
      icon: Map,
      title: "عارض خرائط تفاعلي",
      description: "عرض الخرائط باستخدام MapLibre GL JS مع دعم التكبير والتصغير والتحريك السلس",
      color: "text-blue-500",
    },
    {
      icon: Layers,
      title: "إدارة الطبقات",
      description: "إنشاء وتحرير وإدارة طبقات جغرافية متعددة مع التحكم في الشفافية والترتيب",
      color: "text-green-500",
    },
    {
      icon: Pencil,
      title: "أدوات الرسم",
      description: "رسم النقاط والخطوط والمضلعات مباشرة على الخريطة مع تخصيص الأنماط",
      color: "text-orange-500",
    },
    {
      icon: Database,
      title: "دعم GeoJSON",
      description: "استيراد وتصدير البيانات بصيغة GeoJSON مع الحفاظ على الخصائص",
      color: "text-purple-500",
    },
    {
      icon: Globe,
      title: "خرائط أساسية متعددة",
      description: "الاختيار بين الخرائط الأساسية: OpenStreetMap، القمر الصناعي، الوضع الداكن",
      color: "text-cyan-500",
    },
    {
      icon: Shield,
      title: "نظام صلاحيات",
      description: "إدارة المستخدمين والصلاحيات مع أدوار متعددة للمستخدمين والمسؤولين",
      color: "text-red-500",
    },
    {
      icon: BarChart3,
      title: "لوحة تحكم شاملة",
      description: "إحصائيات تفصيلية حول الخرائط والطبقات والعناصر مع رسوم بيانية",
      color: "text-indigo-500",
    },
    {
      icon: Zap,
      title: "أداء عالي",
      description: "تحميل سريع للخرائط مع تقنيات التخزين المؤقت والتحميل التدريجي",
      color: "text-yellow-500",
    },
  ];

  const drawingTools = [
    { icon: MousePointer, name: "تحديد", description: "تحديد وتحرير العناصر" },
    { icon: Navigation, name: "نقاط", description: "إضافة نقاط اهتمام" },
    { icon: Pencil, name: "خطوط", description: "رسم خطوط ومسارات" },
    { icon: Layers, name: "مضلعات", description: "رسم مناطق ومضلعات" },
  ];

  const baseMaps = [
    { name: "OpenStreetMap", description: "خريطة الشوارع العالمية" },
    { name: "القمر الصناعي", description: "صور القمر الصناعي عالية الدقة" },
    { name: "الوضع الداكن", description: "تصميم داكن مريح للعين" },
    { name: "التضاريس", description: "خريطة التضاريس والارتفاعات" },
  ];

  const stats = [
    { value: "10K+", label: "مستخدم نشط" },
    { value: "50K+", label: "خريطة منشأة" },
    { value: "1M+", label: "عنصر جغرافي" },
    { value: "99.9%", label: "وقت التشغيل" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 right-0 left-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="GIS Maps Pro" width={40} height={40} className="rounded-lg" />
            <span className="text-xl font-bold bg-gradient-to-l from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              GIS Maps Pro
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            )}
            <Link href="/dashboard">
              <Button variant="ghost">لوحة التحكم</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline">تسجيل الدخول</Button>
            </Link>
            <Link href="/auth/register">
              <Button>إنشاء حساب</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 hero-gradient">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
            <div className="space-y-8">
              <Badge variant="outline" className="text-sm py-1 px-3">
                <Zap className="h-3 w-3 ml-1" />
                نظام المعلومات الجغرافية المتكامل
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                أنشئ خرائطك
                <span className="block bg-gradient-to-l from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                  باحترافية عالية
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                نظام معلومات جغرافية متكامل يتيح لك إنشاء وإدارة الخرائط التفاعلية،
                إضافة الطبقات الجغرافية، ورسم العناصر بسهولة تامة.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="gap-2">
                    ابدأ مجاناً
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Map className="h-4 w-4" />
                    استكشف لوحة التحكم
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border">
                <Image
                  src="/hero-map.png"
                  alt="GIS Maps Pro Interface"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              </div>
              
              {/* Floating cards */}
              <Card className="absolute -bottom-4 -right-4 w-48 shadow-lg animate-fade-in">
                <CardContent className="p-3 flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Layers className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">3 طبقات نشطة</div>
                    <div className="text-xs text-muted-foreground">15 عنصر</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="absolute -top-4 -left-4 w-48 shadow-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <CardContent className="p-3 flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Map className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">خريطة تفاعلية</div>
                    <div className="text-xs text-muted-foreground">MapLibre GL</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">المميزات</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              كل ما تحتاجه لإدارة الخرائط
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              أدوات متكاملة ومتطورة لإنشاء وتحرير وتحليل البيانات الجغرافية
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover border-border/50">
                <CardHeader>
                  <div className={`p-3 rounded-xl bg-muted w-fit mb-3 ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Drawing Tools Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">أدوات الرسم</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ارسم على الخريطة بسهولة
              </h2>
              <p className="text-muted-foreground mb-8">
                أدوات رسم متقدمة لإضافة النقاط والخطوط والمضلعات مباشرة على الخريطة
                مع إمكانية تخصيص الأنماط والألوان.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {drawingTools.map((tool, index) => (
                  <Card key={index} className="border-border/50">
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <tool.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{tool.name}</div>
                        <div className="text-sm text-muted-foreground">{tool.description}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-2xl p-8 border border-border">
              <div className="aspect-video bg-card rounded-xl border border-border flex items-center justify-center">
                <div className="text-center p-6">
                  <Map className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    مساحة الرسم التفاعلية
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Base Maps Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">الخرائط الأساسية</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              اختر الخريطة المناسبة
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              مجموعة متنوعة من الخرائط الأساسية لتناسب جميع احتياجاتك
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {baseMaps.map((map, index) => (
              <Card key={index} className="card-hover overflow-hidden border-border/50">
                <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                  <Globe className="h-12 w-12 text-primary" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{map.name}</CardTitle>
                  <CardDescription className="text-xs">{map.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Import/Export Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-6">
                <Card className="card-hover border-border/50">
                  <CardContent className="p-6 text-center">
                    <div className="p-4 rounded-full bg-green-500/10 w-fit mx-auto mb-4">
                      <Upload className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="font-semibold mb-2">استيراد GeoJSON</h3>
                    <p className="text-sm text-muted-foreground">
                      استيراد البيانات الجغرافية من ملفات GeoJSON
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="card-hover border-border/50">
                  <CardContent className="p-6 text-center">
                    <div className="p-4 rounded-full bg-blue-500/10 w-fit mx-auto mb-4">
                      <Download className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="font-semibold mb-2">تصدير GeoJSON</h3>
                    <p className="text-sm text-muted-foreground">
                      تصدير الطبقات والعناصر بصيغة GeoJSON
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <Badge variant="secondary" className="mb-4">استيراد / تصدير</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                تبادل البيانات بسهولة
              </h2>
              <p className="text-muted-foreground mb-6">
                استيراد وتصدير البيانات الجغرافية بصيغة GeoJSON بسهولة تامة،
                مع الحفاظ على جميع الخصائص والأنماط.
              </p>
              
              <ul className="space-y-3">
                {["دعم كامل لمعيار GeoJSON", "استيراد ملفات متعددة", "تصدير طبقات محددة", "الحفاظ على الخصائص"].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-primary/20">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-cyan-500/5">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ابدأ رحلتك مع الخرائط التفاعلية
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                انضم إلى آلاف المستخدمين الذين يستخدمون GIS Maps Pro لإنشاء وإدارة خرائطهم
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="gap-2">
                    إنشاء حساب مجاني
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline">
                    استكشف المميزات
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="GIS Maps Pro" width={24} height={24} className="rounded" />
              <span className="font-semibold">GIS Maps Pro</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} GIS Maps Pro. جميع الحقوق محفوظة.
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">الشروط</Link>
              <Separator orientation="vertical" className="h-4" />
              <Link href="#" className="hover:text-foreground transition-colors">الخصوصية</Link>
              <Separator orientation="vertical" className="h-4" />
              <Link href="#" className="hover:text-foreground transition-colors">الدعم</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
