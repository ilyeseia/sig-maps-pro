"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Map, Mail, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      // Error handled by store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="p-2 rounded-lg bg-primary/10">
            <Map className="h-6 w-6 text-primary" />
          </div>
          <span className="text-2xl font-bold">GIS Maps Pro</span>
        </div>

        <Card className="border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">تسجيل الدخول</CardTitle>
            <CardDescription>
              أدخل بياناتك للوصول إلى حسابك
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pr-10"
                    required
                    dir="ltr"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    required
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-border" />
                  <span>تذكرني</span>
                </label>
                <Link href="#" className="text-primary hover:underline">
                  نسيت كلمة المرور؟
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    جاري التحميل...
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
              
              <div className="relative w-full">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                  أو
                </span>
              </div>
              
              <p className="text-sm text-center text-muted-foreground">
                ليس لديك حساب؟{" "}
                <Link href="/auth/register" className="text-primary hover:underline">
                  إنشاء حساب جديد
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        {/* Demo credentials */}
        <Card className="mt-4 border-border/50 bg-muted/50">
          <CardContent className="p-4 text-center text-sm text-muted-foreground">
            <p>للتجربة، استخدم:</p>
            <p className="font-mono text-xs mt-1">demo@gis.pro / demo123</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
