import React, {Fragment} from 'react';
import {Home} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";

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
        <div className="flex gap-1 text-gray-500 motion-preset-slide-right mb-4">
            <Home size={20}/>
            <span>{">"}</span>
            {breadcrumbItems?.map(({label, href}, index) => (
                <Fragment key={href}>
                    <Link href={href}>
                        {label}
                    </Link>
                    {(index + 1 !== breadcrumbItems.length) && <span>{">"}</span>}
                </Fragment>
            ))}
        </div>
    );
};

export default Breadcrumbs;