import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "~/components/ui/sidebar"
import { useAuthStore } from "~/store/auth"
import { NavLink, useLocation } from "react-router"
import { Home, FileText, Users, Settings } from "lucide-react"

// Define the static items, and their required permission "name" in the backend.
const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        resourceName: "Dashboard",
    },
    {
        title: "Files",
        url: "/files",
        icon: FileText,
        resourceName: "Files",
    },
    {
        title: "Accounts",
        url: "/accounts",
        icon: Users,
        resourceName: "Accounts",
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
        resourceName: "Settings", // Assuming settings view is available, can be adjusted
    },
];

export function AppSidebar() {
    const { user } = useAuthStore();

    // Helper to check if user has view permission for a specific module
    const hasViewPermission = (resourceName: string) => {
        if (!user) return false;

        // Check permissions within roles
        return user.roles?.some((role) =>
            role.permissions?.some(
                (perm) => perm.resource === resourceName && perm.name === "view"
            )
        );
    };

    // Filter items based on permissions
    const accessibleItems = items.filter(item => hasViewPermission(item.resourceName));

    return (
        <Sidebar>
            <SidebarHeader className="p-3 flex items-center justify-center border-b">
                {/* Logo Placeholder that matches the design */}
                <div className="flex flex-col items-center">
                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border-2 border-green-600 mb-1">
                        {/* A rough SVG representation of the logo from the screenshot */}
                        <svg viewBox="0 0 100 100" className="w-6 h-6 text-green-700 fill-current">
                            <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
                            <circle cx="50" cy="50" r="30" fill="white" />
                            <text x="50" y="55" fontSize="20" textAnchor="middle" fill="green" fontWeight="bold">CPDO</text>
                        </svg>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {accessibleItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        isActive={location.pathname.startsWith(item.url)}
                                        className="data-[active=true]:bg-gray-200 data-[active=true]:text-gray-900 data-[active=true]:font-semibold"
                                    >
                                        <NavLink
                                            to={item.url}
                                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px]"
                                        >
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

        </Sidebar>
    )
}
