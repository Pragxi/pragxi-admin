import { z } from 'zod'

export const riderSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone_number: z.string().min(1),
  email: z.string().email(),
  dob: z.coerce.date(),
  marital_status: z.string(),
  gender: z.string(),
  nationality: z.string(),
  city: z.string().min(1),
  gps_address: z.string().min(1),
})

export type RiderFormData = z.infer<typeof riderSchema>




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

