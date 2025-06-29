"use client";

import React from 'react';
import { Paperclip, FileText, Shield, Car } from "lucide-react";

interface ViewRiderDocumentsFormProps {
    rider: any;
}

const ViewRiderDocumentsForm: React.FC<ViewRiderDocumentsFormProps> = ({ rider }) => {
    const documents = rider?.documents || {};
    
    const renderDocumentList = (documents: any[], title: string, icon: React.ReactNode) => {
        return (
            <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    {icon}
                    {title}
                </label>
                <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border min-h-[60px]">
                    {documents && documents.length > 0 ? (
                        <div className="space-y-2">
                            {documents.map((doc: any, index: number) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                    <Paperclip className="h-4 w-4 text-gray-500" />
                                    <span>{doc.filename || doc.name || `Document ${index + 1}`}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span className="text-gray-500">No documents uploaded</span>
                    )}
                </div>
            </div>
        );
    };
    
    return (
        <div className="space-y-6 my-3 motion-preset-blur-right delay-100">
            <div className="grid grid-cols-1 gap-4">
                {renderDocumentList(
                    documents.id_card || [], 
                    "ID Card Documents", 
                    <FileText className="h-4 w-4" />
                )}
                
                {renderDocumentList(
                    documents.drivers_license || [], 
                    "Driver&apos;s License Documents", 
                    <Car className="h-4 w-4" />
                )}
                
                {renderDocumentList(
                    documents.insurance || [], 
                    "Insurance Documents", 
                    <Shield className="h-4 w-4" />
                )}
            </div>
        </div>
    );
};

export default ViewRiderDocumentsForm;