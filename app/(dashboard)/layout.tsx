"use client";

import {Fragment, ReactNode, useEffect, useState} from "react";
import {SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {Home} from "lucide-react";

export default function MainLayout({children}: Readonly<{ children: ReactNode }>) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    // Load sidebar state from localStorage on mount
    useEffect(() => {
        const storedState = localStorage.getItem("sidebarCollapsed");
        if (storedState !== null) {
            setCollapsed(JSON.parse(storedState));
        }
    }, []);

    // Save sidebar state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
    }, [collapsed]);

    // Generate breadcrumb items
    const breadcrumbItems = pathname
        .split("/")
        .filter(Boolean) // Remove empty strings
        .map((segment, index, array) => {
            const path = `/${array.slice(0, index + 1).join("/")}`;
            return {label: segment, href: path};
        });

    console.log({breadcrumbItems});

    return (
        <SidebarProvider suppressHydrationWarning>
            <div suppressHydrationWarning>
                {/* Sidebar */}
                <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed}/>

                {/* Main Content */}
                <main className={cn("transition-all duration-300 p-6 w-full", collapsed ? "ml-16" : "ml-64")}>
                    {/* Breadcrumbs */}
                    <div className="flex gap-1 text-gray-500">
                        <Home size={20}/>
                        <span>{">"}</span>
                        {breadcrumbItems.map(({label, href}, index) => (
                            <Fragment key={href}>
                                <Link href={href}>
                                    {label}
                                </Link>
                                {(index + 1 !== breadcrumbItems.length) && <span>{">"}</span>}
                            </Fragment>
                        ))}
                    </div>

                    {/* Page Content */}
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}
