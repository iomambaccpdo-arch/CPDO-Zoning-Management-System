import { Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import { PageHeader } from "../page-header";
import { useAuthStore } from "~/store/auth";
import { Authentication } from "~/api/auth";

export default function AuthenticatedLayout() {
    const { isAuthenticated, setUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function checkAuth() {
            try {
                const data = await Authentication.user();
                if (data?.user) {
                    setUser(data.user);
                } else {
                    navigate("/login");
                }
            } catch (error: any) {
                console.error("Auth check failed:", error);
                navigate("/login");
            } finally {
                setIsLoading(false);
            }
        }

        checkAuth();
    }, [setUser, navigate]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
                    <p className="text-sm text-gray-500 font-medium font-sans">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 w-full bg-zinc-50 flex flex-col min-h-screen relative overflow-hidden">
                <PageHeader />
                <div className="flex-1 overflow-auto relative w-full flex flex-col">
                    <Outlet />
                </div>
            </main>
        </SidebarProvider>
    );
}
