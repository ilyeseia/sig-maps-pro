"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Map,
  Layers,
  Users,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useUIStore } from "@/lib/stores";

const menuItems = [
  {
    title: "الرئيسية",
    items: [
      { title: "لوحة التحكم", href: "/?view=dashboard", icon: LayoutDashboard },
      { title: "الخرائط", href: "/?view=maps", icon: Map },
      { title: "الطبقات", href: "/?view=layers", icon: Layers },
    ],
  },
  {
    title: "الإدارة",
    items: [
      { title: "المستخدمين", href: "/?view=users", icon: Users },
      { title: "الإعدادات", href: "/?view=settings", icon: Settings },
    ],
  },
];

const bottomItems = [
  { title: "المساعدة", href: "/?view=help", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        "fixed top-16 right-0 z-40 h-[calc(100vh-4rem)] border-l border-border bg-background transition-all duration-300",
        isSidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-end p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            {isSidebarCollapsed ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        <ScrollArea className="flex-1 px-2">
          <nav className="space-y-6">
            {menuItems.map((group, groupIndex) => (
              <div key={groupIndex}>
                {!isSidebarCollapsed && (
                  <h4 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {group.title}
                  </h4>
                )}
                <div className="space-y-1">
                  {group.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        pathname === item.href
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!isSidebarCollapsed && <span>{item.title}</span>}
                    </Link>
                  ))}
                </div>
                {groupIndex < menuItems.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>

        <div className="border-t border-border p-2">
          {bottomItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!isSidebarCollapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
