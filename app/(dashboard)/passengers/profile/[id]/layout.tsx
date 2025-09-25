"use client";

import React, {ReactNode} from 'react';
import Image from "next/image";
import {Phone} from "@phosphor-icons/react/dist/ssr";
import {useParams} from "next/navigation";
import {Params} from "next/dist/server/request/params";
import {Badge} from '@/components/ui/badge';
import {Envelope, Motorcycle} from "@phosphor-icons/react";
import {generatePassengers} from "@/dummy/passengers";
import {Link} from "next-view-transitions";

const passengers = generatePassengers(50);
const PassengerProfileLayout = ({children}: Readonly<{ children: ReactNode }>) => {

    const {id}: Params = useParams();

    const passenger = passengers[Number(id) - 1]

    return (
        <div className="flex flex-col w-full space-y-6">
            <div
                className="flex justify-between border border-gray-200 dark:border-gray-600 p-4 rounded-lg motion-preset-blur-up">
                {/* User Image and mini details */}
                <div className="flex flex-col gap-1">
                    <div className="flex gap-4 items-center">
                        {/* Image */}
                        <img
                            src={passenger.avatar}
                            alt="Passenger"
                            height={100}
                            width={100}
                            className="rounded-full w-16 h-16"
                        />
                        <div className="text-3xl font-bold">
                            {passenger.name}
                        </div>
                        <Badge variant="outline_success" className="text-sm rounded-full">
                            {passenger.status}
                        </Badge>
                    </div>
                    <div className="flex gap-3 text-sm text-gray-400 dark:text-gray-500 items-center">
                        <div className="flex gap-1 s ml-2">
                            <Envelope size={20} weight="duotone"/>
                            <div>
                                <Link href={`mailto:${passenger.email}`}>
                                    {passenger.email}
                                </Link>
                            </div>
                        </div>
                        <div className="flex">
                            <Phone size={20} weight="duotone"/>
                            <div>
                                <Link href={`tel:${passenger.phoneNumber}`}>
                                    {passenger.phoneNumber}
                                </Link>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <Motorcycle size={20} weight="duotone"/>
                            <div>
                                <Link href={`tel:${passenger.totalRides}`}>
                                    {passenger.totalRides}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {children}
        </div>
    );
};

export default PassengerProfileLayout;