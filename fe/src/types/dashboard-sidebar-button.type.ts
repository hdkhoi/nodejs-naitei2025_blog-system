type DashboardSidebarButton = {
    title: string;
    url: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

type DashboardSidebarButtons = DashboardSidebarButton[];

export type { DashboardSidebarButton, DashboardSidebarButtons };