"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import {Menu, User, UserPlus} from "lucide-react";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {IdentificationBadge, MoneyWavy, Motorcycle, PresentationChart, ReadCvLogo} from "@phosphor-icons/react";
import AuthenticatedAvatar from "@/components/auth/authenticated-avatar";

const menuItems = [
    {title: "Dashboard", url: "/dashboard", icon: PresentationChart},
    {
        title: "Riders",
        icon: Motorcycle,
        url: "/riders/all",
        submenu: [
            {title: "All Riders", url: "/riders/all", icon: User},
            {title: "Enroll Rider", url: "/riders/enroll", icon: UserPlus},
        ],
    },
    {title: "Passengers", url: "/passengers", icon: User},
    {title: "Revenue", url: "/revenue", icon: MoneyWavy},
    {title: "Audit Log", url: "/audit-log", icon: ReadCvLogo},
    {title: "Manager Admins", url: "/manager-admins", icon: IdentificationBadge},
];

export function AppSidebar({collapsed, setCollapsed}: { collapsed: boolean; setCollapsed: (val: boolean) => void }) {
    return (
        <Sidebar
            className={cn("transition-all duration-300 h-screen fixed px-2 bg-sidebar", collapsed ? "w-16" : "w-64")}>
            {/* Sidebar Header */}
            <SidebarHeader>
                <div className={`flex ${collapsed && "flex-col"} items-center justify-between p-2`}>
                    {!collapsed && (
                        <div className="flex items-center gap-4">
                            <div className="shadow-md rounded-lg">
                                <Image
                                    src="/icons/favicon/android-chrome-512x512.png"
                                    alt="logo"
                                    height={100}
                                    width={100}
                                    className="h-12 w-12 rounded-lg"
                                />
                            </div>
                            <span className="text-2xl font-black text-slate-900 dark:text-zinc-400">Pragxi</span>
                        </div>
                    )}
                    <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-md hover:bg-gray-200">
                        <Menu size={20}/>
                    </button>
                </div>
            </SidebarHeader>

            {/* Sidebar Content */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className={cn("transition-opacity", collapsed ? "opacity-0" : "opacity-100")}>
                        Menu
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className="flex items-center gap-2 hover:bg-[#FF9F0E] hover:text-white
                                        transition-all duration-300 p-2 rounded-md"
                                    >

                                        <Link href={item.url || "#"} className="flex items-center gap-2">
                                            <item.icon className="w-8 h-8"/>
                                            {!collapsed && <span>{item.title}</span>}
                                        </Link>

                                    </SidebarMenuButton>

                                    {/* Render submenus if available */}
                                    {item.submenu && !collapsed && (
                                        <SidebarMenu className="ml-4">
                                            {item.submenu.map((sub) => (
                                                <SidebarMenuItem key={sub.title}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        className="hover:bg-[#FF9F0E] hover:text-white
                                                        transition-all duration-300 p-2 rounded-md">
                                                        <Link href={sub.url} title={item.title}
                                                              className="flex items-center gap-2">
                                                            <sub.icon size="32"/>
                                                            <span>{sub.title}</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="w-full">
                <div className="flex w-full">
                    <AuthenticatedAvatar collapsed={collapsed}/>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
