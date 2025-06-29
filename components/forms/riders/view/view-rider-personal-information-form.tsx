"use client";

import React from 'react';
import { format } from "date-fns";

interface ViewRiderPersonalInformationFormProps {
    rider: any;
}

const ViewRiderPersonalInformationForm: React.FC<ViewRiderPersonalInformationFormProps> = ({ rider }) => {
    const personal = rider?.personal || {};
    
    return (
        <div className="space-y-6 my-3 motion-preset-blur-right delay-100">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {personal.first_name || "Not provided"}
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {personal.last_name || "Not provided"}
                    </div>
                </div>
            </div>

            {/* Phone Number & Email Address */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {personal.phone_number || "Not provided"}
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {personal.email || "Not provided"}
                    </div>
                </div>
            </div>

            {/* Date of Birth & Marital Status */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {personal.dob ? format(new Date(personal.dob), "PPP") : "Not provided"}
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Marital Status</label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {personal.marital_status ? personal.marital_status.charAt(0).toUpperCase() + personal.marital_status.slice(1) : "Not provided"}
                    </div>
                </div>
            </div>

            {/* Gender & Nationality */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {personal.gender ? personal.gender.charAt(0).toUpperCase() + personal.gender.slice(1) : "Not provided"}
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nationality</label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {personal.nationality ? personal.nationality.charAt(0).toUpperCase() + personal.nationality.slice(1) : "Not provided"}
                    </div>
                </div>
            </div>

            {/* City & GPS Address */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {personal.city || "Not provided"}
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">GPS Address</label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {personal.gps_address || "Not provided"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewRiderPersonalInformationForm;
