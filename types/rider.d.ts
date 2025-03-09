type Rider = {
    id: number;
    avatar: string;
    name: string;
    vehicleNumber: string;
    rating: number;
    status: string;
    amountEarned: number;
    [key: string]: string | number;
}