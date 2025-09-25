"use client";

import React, {useEffect, useMemo, useState} from 'react';
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {CalendarCheck, Dot, PencilSimpleLine, Phone, Star, User} from "@phosphor-icons/react/dist/ssr";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import ViewRiderPersonalInformationForm from "@/components/forms/riders/view/view-rider-personal-information-form";
import ViewRiderSecurityInformationForm from '@/components/forms/riders/view/view-rider-security-information-form';
import ViewRiderFinanceInformationForm from "@/components/forms/riders/view/view-rider-finance-information-form";
import ViewRiderDocumentsForm from "@/components/forms/riders/view/view-rider-documents-form";
import {useParams} from "next/navigation";
import {Params} from "next/dist/server/request/params";
import {createClient} from "@/utils/supabase/client";

type Personal = {
    rider_id: string;
    first_name: string | null;
    last_name: string | null;
    phone_number: string | null;
    email: string | null;
    dob: string | null;
    marital_status: string | null;
    gender: string | null;
    nationality: string | null;
    city: string | null;
    gps_address: string | null;
};

type Security = {
    rider_id: string;
    vehicle: string | null;
    vehicle_number: string | null;
    vehicle_color: string | null;
    id_number: string | null;
    drivers_license_number: string | null;
    insurance_type: string | null;
    insurance_number: string | null;
    insurance_expiration_date: string | null; // YYYY-MM-DD
    witness_name: string | null;
    witness_relationship: string | null;
    witness_phone_number: string | null;
};

type Finance = {
    rider_id: string;
    service_provider: string | null;
    mobile_money_number: string | null;
};

type Documents = {
    rider_id: string;
    id_card_paths: string[] | null;
    drivers_license_paths: string[] | null;
    insurance_paths: string[] | null;
};

const RiderProfile = () => {

    const {id}: Params = useParams();

    const [personal, setPersonal] = useState<Personal | null>(null);
    const [security, setSecurity] = useState<Security | null>(null);
    const [finance, setFinance] = useState<Finance | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [documents, setDocuments] = useState<Documents | null>(null);

    useEffect(() => {
        const supabase = createClient();
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const riderId = String(id);
                const { data: p, error: perr } = await supabase
                    .from('riders_personal_information')
                    .select('*')
                    .eq('rider_id', riderId)
                    .maybeSingle();
                if (perr) throw new Error(perr.message);

                const { data: s, error: serr } = await supabase
                    .from('riders_security_information')
                    .select('*')
                    .eq('rider_id', riderId)
                    .maybeSingle();
                if (serr && serr.code !== 'PGRST116') throw new Error(serr.message);

                const { data: f, error: ferr } = await supabase
                    .from('riders_financial_information')
                    .select('*')
                    .eq('rider_id', riderId)
                    .maybeSingle();
                if (ferr && ferr.code !== 'PGRST116') throw new Error(ferr.message);

                const { data: d, error: derr } = await supabase
                    .from('riders_document_information')
                    .select('*')
                    .eq('rider_id', riderId)
                    .maybeSingle();
                if (derr && derr.code !== 'PGRST116') throw new Error(derr.message);

                setPersonal(p as any);
                setSecurity(s as any);
                setFinance(f as any);
                setDocuments(d as any);
            } catch (e: any) {
                setError(e?.message || 'Failed to load rider');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const displayName = useMemo(() => {
        const name = `${personal?.first_name ?? ''} ${personal?.last_name ?? ''}`.trim();
        return name || 'Rider';
    }, [personal]);


    return (
        <div className="flex flex-col w-full space-y-6">
            <div className="flex justify-between">
                {/* User Image and mini details */}
                <div className="flex gap-4">
                    {/* Image */}
                    <img
                        src={`/api/avatar/${id}`}
                        alt="Rider"
                        height={100}
                        width={100}
                        className="rounded-lg w-28 h-28"
                    />
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-1 items-center">
                            <div className="text-xl font-bold">{displayName}</div>
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
                                            className={i < Math.floor(0) ?
                                                'text-primary' :
                                                'text-gray-300'}
                                            size={16}
                                        />
                                    ))}
                                </div>
                                <div className="text-gray-500">- Stars</div>
                            </div>
                            <div className="flex gap-2 text-sm text-gray-500 items-center">
                                <Image
                                    src="/icons/packs/pragxi-mini-icon.svg"
                                    alt="praxi mini icon"
                                    height={100}
                                    width={100}
                                    className="w-6 h-6"
                                />
                                Completed Trips: -
                            </div>
                        </div>
                    </div>
                </div>
                <Button className="motion-preset-blur-left text-white" onClick={() => setIsEditing((v) => !v)}>
                    <PencilSimpleLine
                        size={32}
                        weight="duotone"
                    />
                    {isEditing ? 'Done' : 'Edit'}
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
                            {loading ? (
                                <div className="p-4">Loading...</div>
                            ) : error ? (
                                <div className="p-4 text-red-500">{error}</div>
                            ) : (
                                <ViewRiderPersonalInformationForm data={personal ?? undefined} editable={isEditing}/>
                            )}
                        </TabsContent>

                        <TabsContent value="security_information">
                            {loading ? (
                                <div className="p-4">Loading...</div>
                            ) : error ? (
                                <div className="p-4 text-red-500">{error}</div>
                            ) : (
                                <ViewRiderSecurityInformationForm editable={isEditing} data={security ? {
                                    vehicle: security.vehicle,
                                    vehicle_number: security.vehicle_number,
                                    vehicle_color: security.vehicle_color,
                                    id_number: security.id_number,
                                    drivers_license_number: security.drivers_license_number,
                                    insurance_type: security.insurance_type,
                                    insurance_number: security.insurance_number,
                                    insurance_expiration_date: security.insurance_expiration_date,
                                    witness_name: security.witness_name,
                                    relationship: security.witness_relationship,
                                    witness_contact_number: security.witness_phone_number,
                                } : undefined}/>
                            )}
                        </TabsContent>

                        <TabsContent value="document">
                            <ViewRiderDocumentsForm editable={isEditing} data={documents ?? undefined} />
                        </TabsContent>

                        <TabsContent value="finance">
                            {loading ? (
                                <div className="p-4">Loading...</div>
                            ) : error ? (
                                <div className="p-4 text-red-500">{error}</div>
                            ) : (
                                <ViewRiderFinanceInformationForm data={finance ?? undefined} editable={isEditing}/>
                            )}
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