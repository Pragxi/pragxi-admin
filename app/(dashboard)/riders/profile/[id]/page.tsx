"use client";

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {CalendarCheck, Dot, Phone, Star, User} from "@phosphor-icons/react/dist/ssr";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import ViewRiderPersonalInformationForm from "@/components/forms/riders/view/view-rider-personal-information-form";
import ViewRiderSecurityInformationForm from '@/components/forms/riders/view/view-rider-security-information-form';
import ViewRiderFinanceInformationForm from "@/components/forms/riders/view/view-rider-finance-information-form";
import ViewRiderDocumentsForm from "@/components/forms/riders/view/view-rider-documents-form";
import {useParams} from "next/navigation";
import {Params} from "next/dist/server/request/params";
import { getRiderById } from "@/app/(server-actions)/(riders-actions)/get-rider-by-id.action";

export default function RiderProfile() {
    const {id}: Params = useParams();
    const [rider, setRider] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRider() {
            setLoading(true);
            setError(null);
            try {
                const data = await getRiderById(id as string);
                if (data) {
                    setRider(data);
                } else {
                    setError("Rider not found");
                }
            } catch (err) {
                console.error('Error fetching rider:', err);
                setError("Failed to load rider information");
            } finally {
                setLoading(false);
            }
        }
        
        if (id) {
            fetchRider();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading rider information...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-red-500">{error}</div>
            </div>
        );
    }

    if (!rider) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Rider not found</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full space-y-6">
            <div className="flex justify-between">
                {/* User Image and mini details */}
                <div className="flex gap-4">
                    {/* Image with fallback */}
                    <Image
                        src={rider?.avatar || rider?.personal?.profile_picture || "/default-avatar.png"}
                        alt={`${rider?.name || rider?.personal?.first_name || 'Rider'} profile`}
                        height={100}
                        width={100}
                        className="rounded-lg w-28 h-28 object-cover"
                        priority
                    />
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-1 items-center">
                            <div className="text-xl font-bold">
                                {rider?.name || 
                                 `${rider?.personal?.first_name || ''} ${rider?.personal?.last_name || ''}`.trim() || 
                                 "Unknown Rider"}
                            </div>
                            <Dot size={32} weight="duotone" className="text-green-500"/>
                            {rider?.personal?.phone_number && (
                                <Button size="icon" className="rounded-full">
                                    <Phone size={32} weight="duotone" className="text-white"/>
                                </Button>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex gap-2 items-center">
                                <div className="flex">
                                    {Array.from({length: 5}, (_, i) => (
                                        <Star
                                            weight="fill"
                                            key={i}
                                            className={i < Math.floor(rider?.rating || 0) ? 
                                                'text-primary' : 
                                                'text-gray-300'}
                                            size={16}
                                        />
                                    ))}
                                </div>
                                <div className="text-gray-500">
                                    {rider?.rating?.toFixed(1) || "0.0"} Stars
                                </div>
                            </div>
                            <div className="flex gap-2 text-sm text-gray-500 items-center">
                                <Image
                                    src="/icons/packs/pragxi-mini-icon.svg"
                                    alt="praxi mini icon"
                                    height={100}
                                    width={100}
                                    className="w-6 h-6"
                                />
                                {rider?.completedTrips || rider?.completed_trips || 0} Completed Trips
                            </div>
                        </div>
                    </div>
                </div>
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
                            <ViewRiderPersonalInformationForm rider={rider} />
                        </TabsContent>

                        <TabsContent value="security_information">
                            <ViewRiderSecurityInformationForm rider={rider} />
                        </TabsContent>

                        <TabsContent value="document">
                            <ViewRiderDocumentsForm rider={rider} />
                        </TabsContent>

                        <TabsContent value="finance">
                            <ViewRiderFinanceInformationForm rider={rider} />
                        </TabsContent>
                    </Tabs>
                </TabsContent>

                <TabsContent value="history">
                    <div className="p-6 text-center text-gray-500">
                        Rider trip history will be displayed here
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}