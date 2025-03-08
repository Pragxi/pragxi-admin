"use client";
import StatisticsCard from "@/components/dashboard/statistics-card";
import {CurrencyCircleDollar} from "@phosphor-icons/react/dist/ssr";
import {dashboardCharts} from "@/constants/apex-charts";
import dynamic from 'next/dynamic';
import RevenueChart from "@/components/revenue-chart";
import {Motorcycle, Users} from "@phosphor-icons/react";

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});


export default function Dashboard() {


    return (
        <div className="">
            <div className="flex flex-col motion-preset-slide-right-sm">
                <div className="text-2xl font-semibold">
                    Welcome back, Joe
                </div>
                <div>
                    <p className="text-gray-500">Your Summary and activities</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
                <StatisticsCard
                    className="motion-preset-blur-right"
                    icon={
                        <CurrencyCircleDollar
                            weight="duotone"
                            color="gray" size={28}
                            className="text-gray-600"
                        />
                    }
                    title="All Time Earnings"
                    value="$1,234.56"
                />
                <StatisticsCard
                    className="motion-preset-blur-right motion-delay-[75ms]"
                    icon={
                        <Motorcycle
                            weight="duotone"
                            color="gray" size={28}
                            className="text-gray-600"
                        />
                    }
                    title="Active Riders"
                    value="78"
                />
                <StatisticsCard
                    className="motion-preset-blur-right motion-delay-[120ms]"
                    icon={
                        <Users
                            weight="duotone"
                            color="gray" size={28}
                            className="text-gray-600"
                        />
                    }
                    title="Total Users"
                    value="3,789"
                />
            </div>
            <div className="mt-4">
                <Chart
                    options={dashboardCharts.options}
                    series={dashboardCharts.series}
                    type="line"
                    height={350}
                />

                <RevenueChart/>
            </div>
        </div>
    );
}