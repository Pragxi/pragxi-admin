"use client";

import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Star} from "@phosphor-icons/react";
import {Badge} from "@/components/ui/badge";
import {RideDetailsProps} from "@/types/ride";


const ViewPassengerRiderForm = (
    {
        riderName,
        rideRequestDate,
        requestTime,
        completionDate,
        completionTime,
        pickupLocation,
        destinationLocation,
        status,
        amount,
        rating,
    }: RideDetailsProps) => {
    return (
        <div className="flex flex-col gap-4 motion-preset-blur-up">

            {/* Rider Name & Ride ID */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <Label>Ratings</Label>
                    <div className="flex items-center gap-1">
                        {Array.from({length: 5}, (_, i) => (
                            <Star
                                key={i}
                                weight={i < Math.floor(rating) ? "fill" : "regular"}
                                size={20}
                                className={i < Math.floor(rating) ? "text-yellow-500" : "text-gray-300"}
                            />
                        ))}
                        <span className="ml-2">{rating.toFixed(1)}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Status</Label>
                    <Badge
                        variant={
                            status === "completed"
                                ? "outline_success"
                                : status === "pending"
                                    ? "outline_warning"
                                    : "outline_destructive"
                        }
                        className="w-fit"
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                </div>
            </div>

            {/* Amount & Ratings */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <Label>Rider Name</Label>
                    <Input
                        value={riderName}
                        readOnly
                        disabled
                        type="text"
                        className="w-full cursor-not-allowed"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Amount</Label>
                    <Input
                        value={`GHc. ${amount.toFixed(2)}`}
                        readOnly
                        disabled
                        type="text"
                        className="w-full cursor-not-allowed"
                    />
                </div>

            </div>


            {/* Ride Request Date & Time */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <Label>Ride Request Date</Label>
                    <Input
                        value={rideRequestDate}
                        readOnly
                        disabled
                        type="text"
                        className="w-full cursor-not-allowed"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Request Time</Label>
                    <Input
                        value={requestTime}
                        readOnly
                        disabled
                        type="text"
                        className="w-full cursor-not-allowed"
                    />
                </div>
            </div>

            {/* Completion Date & Time */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <Label>Completion Date</Label>
                    <Input
                        value={completionDate || "N/A"}
                        readOnly
                        disabled
                        type="text"
                        className="w-full cursor-not-allowed"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Completion Time</Label>
                    <Input
                        value={completionTime || "N/A"}
                        readOnly
                        disabled
                        type="text"
                        className="w-full cursor-not-allowed"
                    />
                </div>
            </div>

            {/* Pickup & Destination Locations */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <Label>Pickup Location</Label>
                    <Input
                        value={pickupLocation}
                        readOnly
                        disabled
                        type="text"
                        className="w-full cursor-not-allowed"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Destination Location</Label>
                    <Input
                        value={destinationLocation}
                        readOnly
                        disabled
                        type="text"
                        className="w-full cursor-not-allowed"
                    />
                </div>
            </div>

        </div>
    );
};

export default ViewPassengerRiderForm;