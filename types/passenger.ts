export type Passenger = {
    id: number;
    name: string;
    email: string;
    avatar: string;
    status: string;
    phoneNumber: string;
    rating: number;
    totalRides: number;
    [key: string]: string | number;
};
