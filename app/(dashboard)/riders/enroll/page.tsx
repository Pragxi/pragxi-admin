"use client";

import React from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import AddRiderPersonalInformationForm from "@/components/forms/riders/add/add-rider-personal-information-form";
import AddRiderSecurityInformationForm from '@/components/forms/riders/add/add-rider-security-information-form';
import AddRiderFinanceInformationForm from "@/components/forms/riders/add/add-rider-finance-information-form";
import AddRiderDocumentsForm from "@/components/forms/riders/add/add-rider-documents-form";


const EnrollRider = () => {

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

            {/* tabs for profile */}
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
                    <AddRiderPersonalInformationForm/>
                </TabsContent>

                <TabsContent value="security_information">
                    <AddRiderSecurityInformationForm/>
                </TabsContent>

                <TabsContent value="document">
                    <AddRiderDocumentsForm/>
                </TabsContent>

                <TabsContent value="finance">
                    <AddRiderFinanceInformationForm/>
                </TabsContent>

            </Tabs>

        </div>
    );
};

export default EnrollRider;