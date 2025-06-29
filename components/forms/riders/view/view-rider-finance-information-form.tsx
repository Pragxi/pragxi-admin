"use client";
import React from 'react';

interface ViewRiderFinanceInformationFormProps {
    rider: any;
}

const ViewRiderFinanceInformationForm: React.FC<ViewRiderFinanceInformationFormProps> = ({ rider }) => {
    const finance = rider?.finance || {};
    
    const getServiceProviderLabel = (value: string) => {
        const providers = {
            mtn: "MTN",
            telecel: "Telecel",
            airteltigo: "AirtelTigo"
        };
        return providers[value as keyof typeof providers] || value;
    };
    
    return (
        <div className="space-y-6 my-3 motion-preset-blur-right delay-100">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Service Provider</label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {finance.service_provider ? getServiceProviderLabel(finance.service_provider) : "Not provided"}
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Money Number</label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {finance.mobile_money_number || "Not provided"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewRiderFinanceInformationForm;