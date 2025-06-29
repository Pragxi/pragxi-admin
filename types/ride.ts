export type RideDetailsProps = {
    riderName: string;
    rideRequestDate: string;
    requestTime: string;
    completionDate: string;
    completionTime: string;
    pickupLocation: string;
    destinationLocation: string;
    status: "completed" | "cancelled" | "pending";
    amount: number;
    rating: number;
}