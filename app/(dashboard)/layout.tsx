"use client";

import {ReactNode, useEffect, useState} from "react";
import {SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import {cn} from "@/lib/utils";
import Breadcrumbs from "@/components/breadcrumbs";

export default function MainLayout({children}: Readonly<{ children: ReactNode }>) {
    const [collapsed, setCollapsed] = useState(true);

    const handleSetIsCollapsed = (collapsed: boolean) => {
        setCollapsed(collapsed);
        localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
    }

    useEffect(() => {
        const storedState = localStorage.getItem("sidebarCollapsed");
        if (storedState !== null) {
            setCollapsed(JSON.parse(storedState));
        }
    }, []);

    // useEffect(() => {
    //     localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
    // }, [collapsed]);

    return (
        <SidebarProvider suppressHydrationWarning>
            <div suppressHydrationWarning className="w-full">
                {/* Sidebar */}
                <AppSidebar collapsed={collapsed} setCollapsed={handleSetIsCollapsed}/>

                {/* Main Content */}
                <main className={cn(
                    "transition-all duration-300 p-6",
                    collapsed
                        ? "ml-16 w-[calc(100vw-4rem)]"
                        : "ml-64 w-[calc(100vw-16rem)]"
                )}>
                    {/* Breadcrumbs */}
                    <Breadcrumbs/>

                    {/* Page Content */}
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}