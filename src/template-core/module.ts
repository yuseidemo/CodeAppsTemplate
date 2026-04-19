import { LayoutDashboard } from "lucide-react";

export const templateCoreModule = {
  id: "template-core",
  appName: "Template Core",
  appSubtitle: "Power Apps Code Apps Starter",
  initialRoute: "dashboard",
  routes: [
    {
      path: "dashboard",
      component: () => import("@/template-core/pages/dashboard"),
      nav: {
        category: "Core",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
    },
  ],
};
