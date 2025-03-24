import React, {Fragment} from 'react';
import {ChevronLeft, ChevronRight, Home} from "lucide-react";
import {Link} from 'next-view-transitions';
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
            <div className="flex gap-1 items-center">
                {
                    pathname !== "/dashboard" && <div
                        onClick={() => window.history.back()}
                        className="motion-preset-slide-right border p-2 cursor-pointer
                    hover:bg-gray-200 transition-all duration-300
                    rounded-full border-gray-500 mr-2"
                    >
                        <ChevronLeft size={16} className="motion-preset-slide-right"/>
                    </div>
                }
                <Home size={20} className="motion-preset-slide-right"/>
                <ChevronRight size={20} className="motion-preset-slide-right"/>
                {breadcrumbItems?.map(({label, href}, index) => (
                    <Fragment key={href}>
                        <Link href={href} className="motion-preset-slide-right">
                            {label}
                        </Link>
                        {
                            (index + 1 !== breadcrumbItems.length) &&
                            <ChevronRight size={20} className="motion-preset-slide-right"/>
                        }
                    </Fragment>
                ))}
            </div>

            <div className="motion-preset-blur-left-lg">
                <ThemeToggle/>
            </div>
        </div>
    );
};

export default Breadcrumbs;