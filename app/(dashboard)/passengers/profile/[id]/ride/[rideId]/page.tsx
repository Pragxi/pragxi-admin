"use client";

import React from 'react';
import {useParams} from "next/navigation";
import {Params} from "next/dist/server/request/params";
import ViewPassengerRiderForm from "@/components/forms/passenger/view/view-passenger-ride-form";
import {RideDetailsProps} from '@/types/ride';

const PassengerProfile = () => {

    const {rideId}: Params = useParams();

    console.log({rideId})

    const rideDetails = {
        id: 1,
        riderName: "Kojo Benson",
        rideRequestDate: "2021-09-01",
        requestTime: "12:03 pm",
        completionDate: "2021-09-02",
        completionTime: "12:50pm",
        pickupLocation: "Abetifi",
        destinationLocation: "Mpraeso",
        amount: 1000,
        rating: 4,
        status: "pending",
    } as RideDetailsProps;

    return (
        <div className="flex flex-col w-full space-y-6">
            <div className="text-2xl font-semibold">Ride Details</div>
            <ViewPassengerRiderForm {...rideDetails}/>
        </div>
    );
};

export default PassengerProfile;