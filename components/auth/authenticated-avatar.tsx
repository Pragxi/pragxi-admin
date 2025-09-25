"use client"

import {BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles,} from "lucide-react"
import {Avatar, AvatarFallback, AvatarImage,} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,} from "@/components/ui/sidebar"
import {useQuery} from "@tanstack/react-query"
import {getUserDataAction} from "@/app/(server-actions)/(user-actions)/get-user-data.action"
import {logoutAction} from "@/app/(server-actions)/(auth-actions)/logout.action"
import {useRouter} from "next/navigation"
import {toast} from "sonner";
import {Skeleton} from "@/components/ui/skeleton"
import {updateMetaData} from "@/app/(server-actions)/(auth-actions)/test";

const AuthenticatedAvatar = () => {
    const {isMobile} = useSidebar()
    const router = useRouter()

    const {data: userData, isLoading, error} = useQuery({
        queryKey: ['logged-in-user'],
        queryFn: getUserDataAction,
    });

    // const {data} = useQuery({
    //     queryKey: ['admin-role'],
    //     queryFn: updateMetaData,
    // });

    if (isLoading) return (
        <SidebarMenu>
            <SidebarMenuItem>
                <Skeleton className="h-10 w-10 rounded-lg"/>
            </SidebarMenuItem>
        </SidebarMenu>
    )
    if (error || !userData || 'error' in userData) return (
        <SidebarMenu>
            <SidebarMenuItem>
                <Skeleton className="h-10 w-10 rounded-lg"/>
            </SidebarMenuItem>
        </SidebarMenu>
    )

    const user = userData.user

    const handleLogout = async () => {
        toast.promise(
            logoutAction(),
            {
                loading: "Logging out...",
                success: () => {
                    router.push("/login");
                    return "You have been logged out successfully.";
                },
                error: (err: Error) => `Failed to log out: ${err?.message || "Unknown error"}`
            },
        );
    }


    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-6 w-6 rounded-lg">
                                <AvatarImage src={user?.user_metadata.avatarUrl || `/api/avatar/${user?.id}`}/>
                                <AvatarFallback>{user?.user_metadata.display_name?.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{user?.user_metadata.display_name}</span>
                                <span className="truncate text-xs">{user?.user_metadata.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={user?.user_metadata.avatarUrl || `/api/avatar/${user?.id}`}/>
                                    <AvatarFallback>{user?.user_metadata.display_name?.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{user?.user_metadata.display_name}</span>
                                    <span className="truncate text-xs">{user?.user_metadata.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Sparkles/>
                                Upgrade to Pro
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <BadgeCheck/>
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <CreditCard/>
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell/>
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut/>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export default AuthenticatedAvatar
