"use client";

import React from 'react';
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {CalendarCheck, Dot, PencilSimpleLine, Phone, Star, User} from "@phosphor-icons/react/dist/ssr";
import {generateRiders} from "@/dummy/riders";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import ViewRiderPersonalInformationForm from "@/components/forms/riders/view/view-rider-personal-information-form";
import ViewRiderSecurityInformationForm from '@/components/forms/riders/view/view-rider-security-information-form';
import ViewRiderFinanceInformationForm from "@/components/forms/riders/view/view-rider-finance-information-form";
import ViewRiderDocumentsForm from "@/components/forms/riders/view/view-rider-documents-form";
import {useParams} from "next/navigation";
import {Params} from "next/dist/server/request/params";

const riders = generateRiders(200);
const RiderProfile = () => {

    const {id}: Params = useParams();

    const rider = riders[Number(id) - 1]

    return (
        <div className="flex flex-col w-full space-y-6">
            <div className="flex justify-between">
                {/* User Image and mini details */}
                <div className="flex gap-4">
                    {/* Image */}
                    <Image
                        src={rider.avatar}
                        alt="Rider"
                        height={100}
                        width={100}
                        className="rounded-lg w-28 h-28"
                    />
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-1 items-center">
                            <div className="text-xl font-bold">{rider.name}</div>
                            <Dot size={32} weight="duotone" className="text-green-500"/>
                            <Button size="icon" className="rounded-full">
                                <Phone size={32} weight="duotone" className="text-white"/>
                            </Button>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex gap-2 items-center">
                                <div className="flex">
                                    {Array.from({length: 5}, (_, i) => (
                                        <Star
                                            weight="fill"
                                            key={i}
                                            className={i < Math.floor(rider.rating) ?
                                                'text-primary' :
                                                'text-gray-300'}
                                            size={16}
                                        />
                                    ))}
                                </div>
                                <div className="text-gray-500">{rider.rating} Stars</div>
                            </div>
                            <div className="flex gap-2 text-sm text-gray-500 items-center">
                                <Image
                                    src="/icons/packs/pragxi-mini-icon.svg"
                                    alt="praxi mini icon"
                                    height={100}
                                    width={100}
                                    className="w-6 h-6"
                                />
                                201 Completed Trips
                            </div>
                        </div>
                    </div>
                </div>
                <Button className="motion-preset-blur-left text-white">
                    <PencilSimpleLine
                        size={32}
                        weight="duotone"
                    />
                    Edit
                </Button>
            </div>
            <hr/>
            <Tabs defaultValue="profile">
                {/* Outer Tabs */}
                <TabsList className="p-1">
                    <TabsTrigger value="profile" className="px-2">
                        <User size={32} weight="duotone"/> Profile
                    </TabsTrigger>
                    <TabsTrigger value="history" className="px-2">
                        <CalendarCheck size={32} weight="duotone"/> History
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    {/* Inner tabs for profile */}
                    <Tabs defaultValue="personal_information">
                        <TabsList className="bg-transparent flex gap-2">
                            <TabsTrigger
                                value="personal_information"
                                className="px-2 data-[state=active]:text-primary
                                data-[state=active]:shadow-none data-[state=active]:border-b-2
                                data-[state=active]:border-b-primary
                                data-[state=inactive]:text-gray-500">
                                Personal Information
                            </TabsTrigger>
                            <TabsTrigger
                                value="security_information"
                                className="px-2 data-[state=active]:text-primary
                                data-[state=active]:shadow-none data-[state=active]:border-b-2
                                data-[state=active]:border-b-primary
                                data-[state=inactive]:text-gray-500">
                                Security Information
                            </TabsTrigger>
                            <TabsTrigger
                                value="document"
                                className="px-2 data-[state=active]:text-primary
                                data-[state=active]:shadow-none data-[state=active]:border-b-2
                                data-[state=active]:border-b-primary
                                data-[state=inactive]:text-gray-500">
                                Document
                            </TabsTrigger>
                            <TabsTrigger
                                value="finance"
                                className="px-2 data-[state=active]:text-primary
                                data-[state=active]:shadow-none data-[state=active]:border-b-2
                                data-[state=active]:border-b-primary
                                data-[state=inactive]:text-gray-500">
                                Finance
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="personal_information">
                            <ViewRiderPersonalInformationForm/>
                        </TabsContent>

                        <TabsContent value="security_information">
                            <ViewRiderSecurityInformationForm/>
                        </TabsContent>

                        <TabsContent value="document">
                            <ViewRiderDocumentsForm/>
                        </TabsContent>

                        <TabsContent value="finance">
                            <ViewRiderFinanceInformationForm/>
                        </TabsContent>

                    </Tabs>
                </TabsContent>

                <TabsContent value="history">
                    Rider History Will be here
                </TabsContent>
            </Tabs>

        </div>
    );
};

export default RiderProfile;