import type { JSX } from "react";
import type { LucideIcon } from "lucide-react";
import { templateCoreModule } from "@/template-core/module";

export type PageImporter = () => Promise<{
  default: () => JSX.Element;
}>;

export type AppRouteConfig = {
  path: string;
  component: PageImporter;
  nav?: {
    category: string;
    label: string;
    icon: LucideIcon;
  };
};

export type AppModuleConfig = {
  id: string;
  appName: string;
  appSubtitle?: string;
  initialRoute: string;
  routes: AppRouteConfig[];
};

export type NavigationItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

export type NavigationSection = {
  category: string;
  items: NavigationItem[];
};

const activeModule: AppModuleConfig = templateCoreModule;

const sectionMap = new Map<string, NavigationSection>();
for (const route of activeModule.routes) {
  if (!route.nav) continue;
  const existing = sectionMap.get(route.nav.category);
  if (!existing) {
    sectionMap.set(route.nav.category, {
      category: route.nav.category,
      items: [
        {
          label: route.nav.label,
          path: route.path,
          icon: route.nav.icon,
        },
      ],
    });
    continue;
  }
  existing.items.push({
    label: route.nav.label,
    path: route.path,
    icon: route.nav.icon,
  });
}

export const appConfig = {
  moduleId: activeModule.id,
  appName: activeModule.appName,
  appSubtitle: activeModule.appSubtitle,
  initialRoute: activeModule.initialRoute,
  routes: activeModule.routes,
  navigation: Array.from(sectionMap.values()),
};
