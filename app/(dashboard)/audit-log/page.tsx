'use client';

import React, { useState, useMemo } from 'react';
import { Search, Download, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
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
import { cn } from "@/lib/utils";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AuditLogEntry {
    id: string;
    dateTime: string;
    userName: string;
    userClass: 'Rider' | 'Passenger';
    actionTaken: string;
    status: 'Success' | 'Failed';
}

const auditLogData: AuditLogEntry[] = [
    {
        id: '1',
        dateTime: '2 Feb, 2025 - 07:21am',
        userName: 'John',
        userClass: 'Rider',
        actionTaken: 'Login',
        status: 'Success'
    },
    {
        id: '2',
        dateTime: '2 Feb, 2025 - 07:21am',
        userName: 'Mark',
        userClass: 'Passenger',
        actionTaken: 'Request Ride',
        status: 'Success'
    },
    {
        id: '3',
        dateTime: '2 Feb, 2025 - 07:21am',
        userName: 'Andy',
        userClass: 'Rider',
        actionTaken: 'Accept Ride',
        status: 'Failed'
    },
    {
        id: '4',
        dateTime: '2 Feb, 2025 - 07:21am',
        userName: 'Obeng',
        userClass: 'Passenger',
        actionTaken: 'Cancel Ride',
        status: 'Success'
    },
    {
        id: '5',
        dateTime: '2 Feb, 2025 - 07:21am',
        userName: 'William',
        userClass: 'Rider',
        actionTaken: 'Log out',
        status: 'Failed'
    },
    {
        id: '6',
        dateTime: '2 Feb, 2025 - 07:21am',
        userName: 'Tuffour',
        userClass: 'Rider',
        actionTaken: 'Login',
        status: 'Success'
    },
    {
        id: '7',
        dateTime: '2 Feb, 2025 - 07:21am',
        userName: 'Okyere',
        userClass: 'Passenger',
        actionTaken: 'Call Rider',
        status: 'Success'
    }
];

export default function AuditLogPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<string | null>(null);

    const handleDelete = (entryId: string) => {
        setSelectedEntry(entryId);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        console.log('Deleting entry:', selectedEntry);
        setShowDeleteModal(false);
        setSelectedEntry(null);
    };

    const StatusBadge = ({ status }: { status: 'Success' | 'Failed' }) => (
        <span className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
            status === 'Success' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        )}>
            <span className={cn(
                "w-2 h-2 rounded-full mr-1",
                status === 'Success' ? "bg-green-500" : "bg-red-500"
            )} />
            {status}
        </span>
    );

    const filteredData = useMemo(() => {
        if (!searchTerm) {
            return auditLogData;
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return auditLogData.filter(entry => {
            return (
                entry.userName.toLowerCase().includes(lowerCaseSearchTerm) ||
                entry.userClass.toLowerCase().includes(lowerCaseSearchTerm)
            );
        });
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredData.slice(startIndex, endIndex);

    const handleSetItemsPerPage = (value: number) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

  return (
        <div className="flex flex-col w-full space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold motion-preset-blur-right">Audit Log</h1>
            </div>

            <div className="flex items-center justify-between py-4">
                <div className="relative flex items-center max-w-sm motion-preset-blur-right delay-75">
                    <Search className="absolute left-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by name or user class..."
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
                        <SelectTrigger className="w-[180px] motion-preset-blur-right delay-100">
                            <SelectValue placeholder="Rows per page" />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 20, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={pageSize.toString()}>
                                    {pageSize} rows per page
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button variant="outline" className="motion-preset-blur-left">
                        <Download className="h-4 w-4 mr-2" />
                        <span>Export</span>
                    </Button>
                </div>
            </div>

            <Table className="motion-preset-blur-up" suppressHydrationWarning>
                <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-zinc-800 cursor-pointer rounded-2xl">
                        <TableHead className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Date/Time</TableHead>
                        <TableHead className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">User Name</TableHead>
                        <TableHead className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">User Class</TableHead>
                        <TableHead className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Action Taken</TableHead>
                        <TableHead className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</TableHead>
                        <TableHead className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentItems.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-gray-500 dark:text-gray-400">
                                No audit log entries found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        currentItems.map((entry) => (
                            <TableRow key={entry.id} className="border-b last:border-b-0 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                <TableCell className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{entry.dateTime}</TableCell>
                                <TableCell className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{entry.userName}</TableCell>
                                <TableCell className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{entry.userClass}</TableCell>
                                <TableCell className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{entry.actionTaken}</TableCell>
                                <TableCell className="py-3 px-4">
                                    <StatusBadge status={entry.status} />
                                </TableCell>
                                <TableCell className="py-3 px-4">
                                    <div className="flex gap-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="rounded-full">
                                                        <Eye size={20} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    View Details
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleDelete(entry.id)}>
                                                        <Trash2 size={20} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Delete
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="rounded-full">
                                                        <MoreHorizontal size={20} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    More Actions
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

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

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-xl w-full max-w-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Entry</h3>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-700" onClick={() => setShowDeleteModal(false)}>
                                &times;
                            </Button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                            Are you sure you want to delete this audit log entry? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700">
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
    </div>
    );
} 