import React, {Fragment} from 'react';
import {Home} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {ThemeToggle} from "@/components/theme-toggle";

const Breadcrumbs = () => {
    const pathname = usePathname();

    // Generate breadcrumb items
    const breadcrumbItems = pathname
        .split("/")
        .filter(Boolean) // Remove empty strings
        .map((segment, index, array) => {
            const path = `/${array.slice(0, index + 1).join("/")}`;
            return {label: segment, href: path};
        });

    return (
        <div className="flex text-gray-500 mb-4 justify-between">
            <div className="flex gap-1">
                <Home size={20} className="motion-preset-slide-right"/>
                <span>{">"}</span>
                {breadcrumbItems?.map(({label, href}, index) => (
                    <Fragment key={href}>
                        <Link href={href} className="motion-preset-slide-right">
                            {label}
                        </Link>
                        {(index + 1 !== breadcrumbItems.length) &&
                            <span className="motion-preset-slide-right">{">"}</span>}
                    </Fragment>
                ))}</div>

            <div className="motion-preset-blur-left-lg">
                <ThemeToggle/>
            </div>
        </div>
    );
};

export default Breadcrumbs;