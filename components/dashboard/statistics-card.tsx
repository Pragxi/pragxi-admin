import React from 'react';
import {Card, CardContent} from "@/components/ui/card";
import {cn} from "@/lib/utils";

const StatisticsCard = ({...props}) => {
    const {icon, title, value, className} = props;

    return (
        <Card className={cn("hover:border-primary hover:transition-all duration-300", className)}>
            <CardContent>
                <div className="grid grid-cols-5 items-center gap-3">
                    <div className="shadow-sm col-span-1 rounded-lg px-1 py-2 flex items-center justify-center">
                        {icon}
                    </div>
                    <div className="text-gray-500 col-span-4 text-sm">
                        {title}
                    </div>
                    <div className="col-span-5 justify-self-end font-bold text-2xl">
                        {value}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default StatisticsCard;