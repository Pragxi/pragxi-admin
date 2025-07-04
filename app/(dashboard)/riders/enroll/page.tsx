"use client";

import React, {useState, useCallback} from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
// import AddRiderPersonalInformationForm from "@/components/forms/riders/add/add-rider-personal-information-form";
// import AddRiderSecurityInformationForm from '@/components/forms/riders/add/add-rider-security-information-form';
// import AddRiderFinanceInformationForm from "@/components/forms/riders/add/add-rider-finance-information-form";
// import AddRiderDocumentsForm from "@/components/forms/riders/add/add-rider-documents-form";
import dynamic from "next/dynamic";
import { getRiderById } from "@/app/(server-actions)/(riders-actions)/get-rider-by-id.action";

const AddRiderPersonalInformationForm = dynamic(
    () => import('@/components/forms/riders/add/add-rider-personal-information-form'),
    { ssr: false }
);

const AddRiderSecurityInformationForm = dynamic(
    () => import('@/components/forms/riders/add/add-rider-security-information-form'),
    { ssr: false }
);

const AddRiderFinanceInformationForm = dynamic(
    () => import('@/components/forms/riders/add/add-rider-finance-information-form'),
    { ssr: false }
);

const AddRiderDocumentsForm = dynamic(
    () => import('@/components/forms/riders/add/add-rider-documents-form'),
    { ssr: false }
);

const EnrollRider = () => {
    const [activeTab, setActiveTab] = useState("personal_information");
    const [rider, setRider] = useState<any>(null);
    const [isFetchingRider, setIsFetchingRider] = useState(false);

    // Called after personal info is saved
    const handlePersonalInfoSaved = useCallback(async () => {
        const riderId = localStorage.getItem("added-rider-id");
        if (riderId) {
            setIsFetchingRider(true);
            try {
                const fetchedRider = await getRiderById(riderId);
                setRider(fetchedRider);
            } catch (err) {
                // Optionally handle error
                setRider(null);
            } finally {
                setIsFetchingRider(false);
            }
        }
    }, []);

    return (
        <div className="flex flex-col w-full space-y-6">
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <div className="text-2xl font-bold">
                        Add New Rider
                    </div>
                    <div className="text-gray-400">
                        Register a new rider to the system.
                    </div>
                </div>
            </div>
            <hr/>

            <Tabs
                defaultValue="personal_information"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
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
                                data-[state=inactive]:text-gray-500"
                        disabled={!rider}
                    >
                        Security Information
                    </TabsTrigger>
                    <TabsTrigger
                        value="document"
                        className="px-2 data-[state=active]:text-primary
                                data-[state=active]:shadow-none data-[state=active]:border-b-2
                                data-[state=active]:border-b-primary
                                data-[state=inactive]:text-gray-500"
                        disabled={!rider}
                    >
                        Document
                    </TabsTrigger>
                    <TabsTrigger
                        value="finance"
                        className="px-2 data-[state=active]:text-primary
                                data-[state=active]:shadow-none data-[state=active]:border-b-2
                                data-[state=active]:border-b-primary
                                data-[state=inactive]:text-gray-500"
                        disabled={!rider}
                    >
                        Finance
                    </TabsTrigger>
                </TabsList>

                <TabsContent
                    value="personal_information"
                    forceMount
                    hidden={activeTab !== "personal_information"}
                >
                    <AddRiderPersonalInformationForm onSaveSuccess={handlePersonalInfoSaved} />
                </TabsContent>

                <TabsContent
                    value="security_information"
                    forceMount
                    hidden={activeTab !== "security_information"}
                >
                    <AddRiderSecurityInformationForm rider={rider} />
                </TabsContent>

                <TabsContent
                    value="document"
                    forceMount
                    hidden={activeTab !== "document"}
                >
                    <AddRiderDocumentsForm />
                </TabsContent>

                <TabsContent
                    value="finance"
                    forceMount
                    hidden={activeTab !== "finance"}
                >
                    <AddRiderFinanceInformationForm rider={rider} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default EnrollRider;