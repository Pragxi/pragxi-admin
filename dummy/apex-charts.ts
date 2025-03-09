import {ApexOptions} from "apexcharts";


export const dashboardCharts = {
    series: [
        { name: "Session Duration", data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10] },
        { name: "Page Views", data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35] },
        { name: 'Total Visits', data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47] }
    ],
    options: {
        chart: {
            height: 350,
            type: 'line',
            zoom: { enabled: false },
            toolbar: { show: false }
        },
        dataLabels: { enabled: false },
        stroke: {
            width: [5, 7, 5],
            curve: 'straight',
            dashArray: [0, 8, 5]
        },
        title: {
            text: 'Page Statistics',
            align: 'left',
            style: { fontWeight: 600 }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            tooltipHoverFormatter: (val: string, opts: unknown) =>
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-expect-error
                `${val} - <strong>${opts?.w.globals.series[opts.seriesIndex][opts.dataPointIndex]}</strong>`
        },
        markers: {
            size: 0,
            hover: { sizeOffset: 6 }
        },
        xaxis: {
            categories: [
                '01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan',
                '06 Jan', '07 Jan', '08 Jan', '09 Jan', '10 Jan',
                '11 Jan', '12 Jan'
            ],
            axisTicks: { show: false },
            axisBorder: { show: false }
        },
        tooltip: {
            y: [
                {
                    title: {
                        formatter: (val: number) => `${val} mins`
                    }
                },
                {
                    title: {
                        formatter: (val: number) => `${val} per session`
                    }
                },
                {
                    title: {
                        formatter: (val: number) => val.toString()
                    }
                }
            ]
        },
        grid: {
            borderColor: '#f1f1f1',
            padding: {
                top: -20,
                right: 0,
                bottom: 15,
                left: 10
            }
        }
    } as ApexOptions
};