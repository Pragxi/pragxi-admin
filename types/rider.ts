import * as z from "zod";

export type Rider = {
    id: number;
    avatar: string;
    name: string;
    vehicleNumber: string;
    rating: number;
    status: string;
    amountEarned: number;
    [key: string]: string | number;
}

export const riderPersonalInformationSchema = z.object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    phone_number: z.string().min(1),
    email: z.string().email(),
    date_of_birth: z.coerce.date(),
    marital_status: z.string(),
    gender: z.string(),
    nationality: z.string(),
    city: z.string().min(1),
    gps_address: z.string().min(1),
});

export const riderSecurityInformationSchema = z.object({
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