'use client';

import React, { useState, useMemo } from 'react';
import { Search, Download } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import Image from 'next/image';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RevenueEntry {
    id: string;
    dateTime: string;
    account: string;
    revenue: number;
}

interface RiderRevenueEntry {
    id: string;
    dateTime: string;
    riderName: string;
    avatar: string;
    generatedRevenue: number;
}

// Type guard functions
const isRevenueEntry = (entry: RevenueEntry | RiderRevenueEntry): entry is RevenueEntry => {
    return 'account' in entry && 'revenue' in entry;
};

const isRiderRevenueEntry = (entry: RevenueEntry | RiderRevenueEntry): entry is RiderRevenueEntry => {
    return 'riderName' in entry && 'generatedRevenue' in entry;
};

const systemRevenueData: RevenueEntry[] = [
    {
        id: '1',
        dateTime: '13 Jan, 2025 - 08:21am',
        account: 'System',
        revenue: 20000
    },
    {
        id: '2',
        dateTime: '13 Jan, 2025 - 08:21am',
        account: 'System',
        revenue: 15000
    },
    {
        id: '3',
        dateTime: '13 Jan, 2025 - 10:41pm',
        account: 'System',
        revenue: 3000
    },
    {
        id: '4',
        dateTime: '13 Jan, 2025 - 2:02am',
        account: 'System',
        revenue: 2540
    },
    {
        id: '5',
        dateTime: '13 Jan, 2025 - 03:21pm',
        account: 'System',
        revenue: 10500
    }
];

const riderRevenueData: RiderRevenueEntry[] = [
    {
        id: '1',
        dateTime: '13 Jan, 2025 - 08:21am',
        riderName: 'Michael Watson',
        avatar: 'https://i.pravatar.cc/150?img=1',
        generatedRevenue: 20000
    },
    {
        id: '2',
        dateTime: '13 Jan, 2025 - 08:21am',
        riderName: 'Caitlyn King',
        avatar: 'https://i.pravatar.cc/150?img=2',
        generatedRevenue: 15000
    },
    {
        id: '3',
        dateTime: '13 Jan, 2025 - 10:41pm',
        riderName: 'Fleur Cook',
        avatar: 'https://i.pravatar.cc/150?img=3',
        generatedRevenue: 3000
    },
    {
        id: '4',
        dateTime: '13 Jan, 2025 - 2:02am',
        riderName: 'Marco Kelly',
        avatar: 'https://i.pravatar.cc/150?img=4',
        generatedRevenue: 3000
    },
    {
        id: '5',
        dateTime: '13 Jan, 2025 - 03:21pm',
        riderName: 'Lulu Meyers',
        avatar: 'https://i.pravatar.cc/150?img=5',
        generatedRevenue: 2540
    },
    {
        id: '6',
        dateTime: '13 Jan, 2025 - 03:21pm',
        riderName: 'Mikey Lawrence',
        avatar: 'https://i.pravatar.cc/150?img=6',
        generatedRevenue: 2340
    },
    {
        id: '7',
        dateTime: '13 Jan, 2025 - 03:21pm',
        riderName: 'Freya Browning',
        avatar: 'https://i.pravatar.cc/150?img=7',
        generatedRevenue: 10500
    },
    {
        id: '8',
        dateTime: '13 Jan, 2025 - 04:00pm',
        riderName: 'Valid Rider',
        avatar: 'https://i.pravatar.cc/150?img=8',
        generatedRevenue: 5000
    }
];

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export default function RevenuePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'System' | 'Riders'>('System');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);

    const dataToDisplay = useMemo(() => {
        return activeTab === 'System' ? systemRevenueData : riderRevenueData;
    }, [activeTab]);

    const filteredData = useMemo(() => {
        if (!searchTerm) {
            return dataToDisplay;
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return dataToDisplay.filter(entry => {
            if (isRiderRevenueEntry(entry)) {
                return entry.riderName.toLowerCase().includes(lowerCaseSearchTerm);
            }
            if (isRevenueEntry(entry)) {
                return entry.account.toLowerCase().includes(lowerCaseSearchTerm);
            }
            return false;
        });
    }, [searchTerm, dataToDisplay]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredData.slice(startIndex, endIndex);

    // When items per page changes, reset to first page
    const handleSetItemsPerPage = (value: number) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    return (
        <div className="flex flex-col w-full space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
                <div className="flex flex-col mb-4">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white motion-preset-blur-right">Revenue</h1>
                        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                            {filteredData.length} items
                        </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Revenue for system and riders</p>
                </div>

                <Tabs defaultValue="System" className="w-full mb-6" onValueChange={(value) => {
                    setActiveTab(value as 'System' | 'Riders');
                    setCurrentPage(1);
                    setSearchTerm('');
                }}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="System">System</TabsTrigger>
                        <TabsTrigger value="Riders">Riders</TabsTrigger>
                    </TabsList>

                    <TabsContent value="System" className="mt-4">
                        <div className="flex items-center justify-between py-4">
                            <div className="relative flex items-center max-w-sm">
                                <Search className="absolute left-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                                />
                            </div>

                            <div className="flex gap-4">
                                <Select
                                    value={itemsPerPage.toString()}
                                    onValueChange={(value) => handleSetItemsPerPage(Number(value))}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Rows per page" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ITEMS_PER_PAGE_OPTIONS.map((pageSize) => (
                                            <SelectItem key={pageSize} value={pageSize.toString()}>
                                                {pageSize} rows per page
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button variant="outline">
                                    <Download className="h-4 w-4 mr-2" />
                                    <span>Export</span>
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <Table className="motion-preset-blur-up" suppressHydrationWarning>
                                <TableHeader>
                                    <TableRow className="bg-gray-100 dark:bg-zinc-800 cursor-pointer rounded-2xl">
                                        <TableHead className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Date/Time</TableHead>
                                        <TableHead className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Account</TableHead>
                                        <TableHead className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Revenue (GHS)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentItems.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-24 text-center text-gray-500 dark:text-gray-400">
                                                No system revenue entries found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        currentItems.map((entry) => {
                                            if (isRevenueEntry(entry)) {
                                                return (
                                                    <TableRow key={entry.id} className="border-b last:border-b-0 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                                        <TableCell className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{entry.dateTime}</TableCell>
                                                        <TableCell className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{entry.account}</TableCell>
                                                        <TableCell className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{entry.revenue.toLocaleString()}</TableCell>
                                                    </TableRow>
                                                );
                                            }
                                            return null;
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <Pagination className="py-4">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.max(1, prev - 1)); }}
                                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href="#"
                                            isActive={page === currentPage}
                                            onClick={(e) => { e.preventDefault(); setCurrentPage(page); }}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.min(totalPages, prev + 1)); }}
                                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </TabsContent>

                    <TabsContent value="Riders" className="mt-4">
                        <div className="flex items-center justify-between py-4">
                            <div className="relative flex items-center max-w-sm">
                                <Search className="absolute left-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search riders..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                                />
                            </div>

                            <div className="flex gap-4">
                                <Select
                                    value={itemsPerPage.toString()}
                                    onValueChange={(value) => handleSetItemsPerPage(Number(value))}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Rows per page" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ITEMS_PER_PAGE_OPTIONS.map((pageSize) => (
                                            <SelectItem key={pageSize} value={pageSize.toString()}>
                                                {pageSize} rows per page
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button variant="outline">
                                    <Download className="h-4 w-4 mr-2" />
                                    <span>Export</span>
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <Table className="motion-preset-blur-up" suppressHydrationWarning>
                                <TableHeader>
                                    <TableRow className="bg-gray-100 dark:bg-zinc-800 cursor-pointer rounded-2xl">
                                        <TableHead className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Date/Time</TableHead>
                                        <TableHead className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Rider</TableHead>
                                        <TableHead className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Generated Revenue (GHS)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentItems.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-24 text-center text-gray-500 dark:text-gray-400">
                                                No rider revenue entries found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        currentItems.map((entry) => {
                                            if (isRiderRevenueEntry(entry)) {
                                                return (
                                                    <TableRow key={entry.id} className="border-b last:border-b-0 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                                        <TableCell className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{entry.dateTime}</TableCell>
                                                        <TableCell className="py-3 px-4">
                                                            <div className="flex items-center gap-2">
                                                                <Image
                                                                    src={entry.avatar}
                                                                    alt={entry.riderName}
                                                                    width={32}
                                                                    height={32}
                                                                    className="rounded-full object-cover"
                                                                    onError={(e) => {
                                                                        console.error("Image load error for:", entry.riderName, e);
                                                                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.riderName)}&background=random&size=32`;
                                                                    }}
                                                                />
                                                                <span className="text-sm text-gray-800 dark:text-gray-200">{entry.riderName}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{entry.generatedRevenue.toLocaleString()}</TableCell>
                                                    </TableRow>
                                                );
                                            }
                                            return null;
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <Pagination className="py-4">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.max(1, prev - 1)); }}
                                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href="#"
                                            isActive={page === currentPage}
                                            onClick={(e) => { e.preventDefault(); setCurrentPage(page); }}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.min(totalPages, prev + 1)); }}
                                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}