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
import {ChevronDown, Menu, User, UserPlus} from "lucide-react";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {IdentificationBadge, MoneyWavy, Motorcycle, PresentationChart, ReadCvLogo} from "@phosphor-icons/react";
import AuthenticatedAvatar from "@/components/auth/authenticated-avatar";
import {useState} from "react";
import {usePathname} from "next/navigation";

const menuItems = [
    {title: "Dashboard", url: "/dashboard", icon: PresentationChart},
    {
        title: "Riders",
        icon: Motorcycle,
        url: "/riders",
        submenu: [
            {title: "All Riders", url: "/riders", icon: User},
            {title: "Enroll Rider", url: "/riders/enroll", icon: UserPlus},
        ],
    },
    {title: "Passengers", url: "/passengers", icon: User},
    {title: "Revenue", url: "/revenue", icon: MoneyWavy},
    {title: "Audit Log", url: "/audit-log", icon: ReadCvLogo},
    {title: "Manager Admins", url: "/manager-admins", icon: IdentificationBadge},
];

export function AppSidebar({collapsed, setCollapsed}: { collapsed: boolean; setCollapsed: (val: boolean) => void }) {
    const [openSubmenus, setOpenSubmenus] = useState(new Set());
    const pathname = usePathname();

    const toggleSubmenu = (title: string) => {
        setOpenSubmenus(prev => {
            const newSet = new Set(prev);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            newSet.has(title) ? newSet.delete(title) : newSet.add(title);
            return newSet;
        });
    };

    return (
        <Sidebar
            className={cn("transition-all duration-300 h-screen fixed px-2 bg-sidebar", collapsed ? "w-16" : "w-64")}>
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

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className={cn("transition-opacity", collapsed ? "opacity-0" : "opacity-100")}>
                        Menu
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => {
                                const isParentActive = item.url && pathname.startsWith(item.url);
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        {item.submenu ? (
                                            <>
                                                <SidebarMenuButton
                                                    onClick={() => toggleSubmenu(item.title)}
                                                    className={cn(
                                                        "flex items-center gap-2 hover:bg-[#FF9F0E] hover:text-white transition-all duration-300 p-2 rounded-md w-full",
                                                        isParentActive && "bg-[#FF9F0E] text-white"
                                                    )}
                                                >
                                                    <Link href={item.url}>
                                                        <item.icon/>
                                                    </Link>
                                                    {!collapsed && <span className="flex-1">{item.title}</span>}
                                                    {!collapsed && (
                                                        <ChevronDown
                                                            className={`ml-auto transition-transform ${openSubmenus.has(item.title) ? "rotate-180" : ""}`}
                                                        />
                                                    )}
                                                </SidebarMenuButton>
                                                {openSubmenus.has(item.title) && !collapsed && (
                                                    <div className="ml-3 overflow-hidden">
                                                        <SidebarMenu
                                                            className="w-full"
                                                            style={{width: 'calc(100% - 0.30rem)'}}
                                                        >
                                                            {item.submenu.map((sub, index) => {
                                                                const isSubActive = pathname === sub.url;
                                                                return (
                                                                    <SidebarMenuItem key={sub.title}
                                                                                     className={cn(index === 0 && "mt-1")}>
                                                                        <SidebarMenuButton
                                                                            asChild
                                                                            className={cn(
                                                                                "hover:bg-[#FF9F0E] hover:text-white transition-all duration-300 p-2 rounded-md w-full",
                                                                                isSubActive && "bg-[#FF9F0E] text-white"
                                                                            )}
                                                                        >
                                                                            <Link href={sub.url}
                                                                                  className="flex items-center gap-2 w-full">
                                                                                <sub.icon size="32"/>
                                                                                <span
                                                                                    className="truncate">{sub.title}</span>
                                                                            </Link>
                                                                        </SidebarMenuButton>
                                                                    </SidebarMenuItem>
                                                                );
                                                            })}
                                                        </SidebarMenu>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <SidebarMenuButton
                                                asChild
                                                className={cn(
                                                    "flex items-center gap-2 hover:bg-[#FF9F0E] hover:text-white transition-all duration-300 p-2 rounded-md w-full",
                                                    pathname === item.url && "bg-[#FF9F0E] text-white"
                                                )}
                                            >
                                                <Link href={item.url || "#"} className="flex items-center gap-2 w-full">
                                                    <item.icon className="w-8 h-8"/>
                                                    {!collapsed && <span className="truncate">{item.title}</span>}
                                                </Link>
                                            </SidebarMenuButton>
                                        )}
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="w-full">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex w-full">
                            <AuthenticatedAvatar collapsed={collapsed}/>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}