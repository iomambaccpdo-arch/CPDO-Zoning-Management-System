import { SidebarTrigger } from "~/components/ui/sidebar"
import { useAuthStore } from "~/store/auth"
import { Link, useNavigate } from "react-router"
import { LogOut, User } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { Authentication } from "~/api/auth"

export function PageHeader() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await Authentication.logout()
            logout()
            navigate("/login")
        } catch (error) {
            console.error("Logout failed:", error)
            logout()
            navigate("/login")
        }
    }

    const firstLetter = user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'

    return (
        <header className="h-12 bg-white border-b flex items-center justify-between px-4 shrink-0 w-full relative z-10 sticky top-0">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
            </div>

            <div className="flex items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center justify-center p-0 h-8 w-8 md:h-8 md:w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors">
                            <Avatar className="h-full w-full bg-gray-900 text-white font-medium text-xs">
                                <AvatarFallback className="bg-transparent text-white">{firstLetter}</AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[220px] mt-2 p-0">
                        <div className="flex flex-col space-y-1 p-3 pb-2">
                            <p className="text-[13px] font-semibold leading-none text-slate-900 truncate">
                                {user?.first_name} {user?.middle_name ? `${user.middle_name.charAt(0)}.` : ''} {user?.last_name}
                            </p>
                            <p className="text-[12px] font-normal leading-none text-slate-500 truncate">
                                {user?.email}
                            </p>
                        </div>
                        <DropdownMenuSeparator className="mx-0" />
                        <div className="p-1">
                            <Link to="/profile">
                                <DropdownMenuItem className="cursor-pointer gap-2 py-1.5 px-2 text-[13px] text-slate-700 focus:text-slate-900">
                                    <User className="h-[14px] w-[14px] text-slate-500" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                            </Link>
                        </div>
                        <DropdownMenuSeparator className="mx-0" />
                        <div className="p-1">
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer gap-2 py-1.5 px-2 text-[13px] text-red-600 focus:text-red-700 focus:bg-red-50">
                                <LogOut className="h-[14px] w-[14px]" />
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
