import {z} from 'zod'

export const RiderInfoSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    phone_number: z.string().min(10, "Phone number should be at least 10 digits long")
        .regex(/^\d+$/, "Phone number should only contain numbers"),
    email: z.string().email("Invalid email address"),
    dob: z.coerce.date(),
    marital_status: z.string().min(1, "Marital status is required"),
    gender: z.string().min(1, "Gender is required"),
    nationality: z.string().min(1, "Nationality is required"),
    city: z.string().min(1, "City is required"),
    gps_address: z.string().min(1, "GPS address is required"),
});

export const RiderSecuritySchema = z.object({
    vehicle: z.string().min(1, "Vehicle is required"),
    vehicle_number: z.string().min(1, "Vehicle number is required"),
    vehicle_color: z.string().min(1, "Vehicle color is required"),
    id_number: z.string().min(1, "ID number is required"),
    drivers_license_number: z.string().min(1, "Driver's license number is required"),
    insurance_type: z.string().min(1, "Insurance type is required"),
    insurance_number: z.string().min(1, "Insurance number is required"),
    insurance_expiration: z.coerce.date({
        required_error: "Insurance expiration date is required.",
        invalid_type_error: "Invalid date format for insurance expiration.",
    }).min(new Date(), "Expiration date must be in the future."),
    witness_name: z.string().min(1, "Witness name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    witness_contact_number: z.string().min(1, "Witness contact number is required"),
    rider_id: z.string(),
});

export const RiderDocumentSchema = z.object({
    id_card: z.array(z.instanceof(File)).nonempty("At least one ID card file is required"),
    profile_picture: z.array(z.instanceof(File)).length(1, "Exactly one profile picture is required"),
    drivers_license: z.array(z.instanceof(File)).nonempty("At least one driver's license file is required"),
    insurance: z.array(z.instanceof(File)).nonempty("At least one insurance file is required"),
    rider_id: z.string(),
});

export const RiderFinanceSchema = z.object({
    service_provider: z.string().min(1, "Service provider is required"),
    mobile_money_number: z.string().min(1, "Mobile money number is required")
        .regex(/^\d+$/, "Must contain only numbers"),
    rider_id: z.string(),
});


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

