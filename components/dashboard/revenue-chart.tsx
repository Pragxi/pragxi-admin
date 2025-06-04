"use client";

import {Line} from "react-chartjs-2";
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useState} from "react";
import {cn} from "@/lib/utils";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

type TimePeriod = "12M" | "30D" | "7D" | "24H";

type RevenueData = {
    labels: string[];
    gross: number[];
    net: number[];
};

const sampleData: Record<TimePeriod, RevenueData> = {
    "12M": {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        gross: [120, 150, 170, 160, 180, 190, 200, 210, 220, 230, 240, 250],
        net: [100, 130, 150, 140, 160, 170, 180, 190, 200, 210, 220, 230],
    },
    "30D": {
        labels: Array.from({length: 30}, (_, i) => `Day ${i + 1}`),
        gross: Array.from({length: 30}, () => Math.floor(Math.random() * 100 + 150)),
        net: Array.from({length: 30}, () => Math.floor(Math.random() * 100 + 100)),
    },
    "7D": {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        gross: [200, 220, 210, 230, 240, 250, 260],
        net: [180, 200, 190, 210, 220, 230, 240],
    },
    "24H": {
        labels: Array.from({length: 24}, (_, i) => `${i}:00`),
        gross: Array.from({length: 24}, () => Math.floor(Math.random() * 50 + 100)),
        net: Array.from({length: 24}, () => Math.floor(Math.random() * 40 + 80)),
    },
};

export default function RevenueChart() {
    const [activePeriod, setActivePeriod] = useState<TimePeriod>("12M");
    const data = sampleData[activePeriod];

    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: "Gross Revenue",
                data: data.gross,
                borderColor: "#3B82F6",
                backgroundColor: "#BFDBFE",
                tension: 0.4,
            },
            {
                label: "Net Revenue",
                data: data.net,
                borderColor: "#10B981",
                backgroundColor: "#86EFAC",
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom" as const,
            },
            title: {
                display: true,
                text: "Revenue Comparison",
                align: "start" as const,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (tickValue: string | number) {
                        if (typeof tickValue === 'number') {
                            return `$${tickValue.toLocaleString()}`;
                        }
                        return tickValue;
                    },
                },
            },
        },
    };

    return (
        <div className="p-6 shadow-md">
            <Tabs defaultValue="12M" className="mb-6 justify-self-end">
                <TabsList>
                    <TabsTrigger value="12M" onClick={() => setActivePeriod("12M")}>
                        12 Months
                    </TabsTrigger>
                    <TabsTrigger value="30D" onClick={() => setActivePeriod("30D")}>
                        30 Days
                    </TabsTrigger>
                    <TabsTrigger value="7D" onClick={() => setActivePeriod("7D")}>
                        7 Days
                    </TabsTrigger>
                    <TabsTrigger value="24H" onClick={() => setActivePeriod("24H")}>
                        24 Hours
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <div className={cn("h-[400px]", {"h-[600px]": activePeriod === "24H"})}>
                <Line data={chartData} options={options}/>
            </div>
        </div>
    );
}