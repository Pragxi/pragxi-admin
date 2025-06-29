"use client";
import React from 'react';
import {toast} from "sonner";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {format} from "date-fns";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";
import {Calendar as CalendarIcon} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";

const formSchema = z.object({
    vehicle: z.string().min(1),
    vehicle_number: z.string().min(1),
    vehicle_color: z.string().min(1),
    id_number: z.string().min(1),
    drivers_license_number: z.string().min(1),
    insurance_type: z.string().min(1),
    insurance_number: z.string().min(1),
    insurance_expiration: z.coerce.date(),
    witness_name: z.string().min(1),
    relationship: z.string(),
    witness_contact_number: z.string().min(1),
});

const relationships = [
    {label: "Parent", value: "parent"},
    {label: "Guardian", value: "guardian"},
    {label: "Sibling", value: "sibling"},
    {label: "Friend", value: "friend"},
];

interface ViewRiderSecurityInformationFormProps {
    rider: any;
}

const ViewRiderSecurityInformationForm: React.FC<ViewRiderSecurityInformationFormProps> = ({ rider }) => {
    const security = rider?.security || {};
    
    return (
        <div className="space-y-6 my-3 motion-preset-blur-right delay-100">
            {/* Vehicle Information */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Vehicle</label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {security.vehicle || "Not provided"}
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Vehicle Number</label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {security.vehicle_number || "Not provided"}
                    </div>
                </div>
            </div>

            {/* Vehicle Color & ID Number */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Vehicle Color</label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {security.vehicle_color || "Not provided"}
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">ID Number</label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {security.id_number || "Not provided"}
                    </div>
                </div>
            </div>

            {/* Driver&apos;s License & Insurance Type */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Driver&apos;s License Number</label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {security.drivers_license_number || "Not provided"}
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Insurance Type</label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {security.insurance_type || "Not provided"}
                    </div>
                </div>
            </div>

            {/* Insurance Details */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Insurance Number</label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {security.insurance_number || "Not provided"}
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Insurance Expiration</label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {security.insurance_expiration ? format(new Date(security.insurance_expiration), "PPP") : "Not provided"}
                    </div>
                </div>
            </div>

            {/* Witness Information */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Witness Name</label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {security.witness_name || "Not provided"}
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Witness Contact Number</label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {security.witness_contact_number || "Not provided"}
                    </div>
                </div>
            </div>

            {/* Relationship */}
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Relationship</label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {security.relationship ? security.relationship.charAt(0).toUpperCase() + security.relationship.slice(1) : "Not provided"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewRiderSecurityInformationForm;