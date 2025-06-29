"use client";

import React, {useEffect, useMemo, useState} from 'react';
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Image from "next/image";
import {Eye, Star} from "@phosphor-icons/react";
import {Badge} from "@/components/ui/badge";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {redirect} from "next/navigation";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import {Passenger} from "@/types/passenger";
import {generatePassengers} from "@/dummy/passengers";

const passengers = generatePassengers(50);

const PassengerProfile = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({key: '', direction: ''});
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Search filter
    const filteredData = useMemo(() => {
        return passengers.filter(
            (passenger) =>
                passenger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                passenger.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                passenger.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    // Sorting
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;
        return [...filteredData].sort((a: Passenger, b: Passenger) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [filteredData, sortConfig]);

    useEffect(() => {
        const storedItemsPerPage = localStorage.getItem('passengers-itemsPerPage');
        if (storedItemsPerPage) {
            setItemsPerPage(Number(storedItemsPerPage));
        }
    }, [])

    // Pagination
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedData.slice(startIndex, startIndex + itemsPerPage);
    }, [currentPage, itemsPerPage, sortedData]);

    const handleSort = (key: string) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({key, direction});
    };

    const handleSetItemsPerPage = (value: number) => {
        localStorage.setItem('passengers-itemsPerPage', value.toString());
        setItemsPerPage(value);
    }

    return (
        <div className="flex flex-col w-full space-y-2">
            {/* Title Row */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold motion-preset-blur-right">Ride History</h1>
            </div>

            {/* Search Row */}
            <div className="flex items-center justify-between py-4">
                {/* Search Bar */}
                <Input
                    placeholder="Search ride history..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm motion-preset-blur-right delay-75"
                />

                {/* Items Per Row */}
                <div className="flex gap-4">
                    <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => {
                            handleSetItemsPerPage(Number(value))
                            if (currentPage === 1) {
                                setCurrentPage(2);
                                setTimeout(() => {
                                    setCurrentPage(1);
                                }, 0)
                            } else {
                                setCurrentPage(1)
                            }
                        }}
                    >
                        <SelectTrigger className="w-[180px] motion-preset-blur-right delay-100">
                            <SelectValue placeholder="Rows per page"/>
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 20, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={pageSize.toString()}>
                                    {pageSize} rows per page
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button className="motion-preset-blur-left" variant="outline">Export</Button>
                </div>
            </div>

            {/* Riders Table */}
            <Table className="motion-preset-blur-up" suppressHydrationWarning>
                <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-zinc-800 cursor-pointer rounded-2xl">
                        <TableHead>Avatar</TableHead>
                        <TableHead onClick={() => handleSort('name')}>
                            Name {sortConfig.key === 'name' && (
                            <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                        )}
                        </TableHead>
                        <TableHead onClick={() => handleSort('email')}>
                            Email {sortConfig.key === 'email' && (
                            <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                        )}
                        </TableHead>
                        <TableHead onClick={() => handleSort('rating')}>
                            Rating {sortConfig.key === 'rating' && (
                            <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                        )}
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead onClick={() => handleSort('totalRides')}>
                            Total Rides {sortConfig.key === 'totalRides' && (
                            <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                        )}
                        </TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.map((passenger) => (
                        <TableRow key={passenger.id}>
                            <TableCell suppressHydrationWarning>
                                <Image
                                    src={passenger.avatar}
                                    alt={`${passenger.name}'s avatar`}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                            </TableCell>
                            <TableCell>{passenger.name}</TableCell>
                            <TableCell>{passenger.email}</TableCell>
                            <TableCell>
                                {Array.from({length: 5}, (_, i) => (
                                    <Star
                                        weight="fill"
                                        key={i}
                                        className={i < Math.floor(passenger.rating) ?
                                            'text-yellow-500 inline-block' :
                                            'text-gray-300 inline-block'}
                                        size={16}
                                    />
                                ))}
                                <span className="ml-2">{passenger.rating}</span>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={passenger.status === 'online' ? "outline_success" : "outline_destructive"}
                                >
                                    {passenger.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{passenger.totalRides}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <TooltipProvider>
                                        {/* View Rider Button */}
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="rounded-full"
                                                    onClick={() => redirect(`/passengers/profile/${passenger.id}/ride/${passenger.id}`)}
                                                >
                                                    <Eye size={32} weight="duotone"/>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                View
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination Row */}
            <Pagination>
                <PaginationContent>
                    <PaginationItem className='cursor-pointer'>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                        >
                            First
                        </Button>
                    </PaginationItem>
                    <PaginationItem className='cursor-pointer'>
                        <PaginationPrevious
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            isActive={currentPage > 1}
                        />
                    </PaginationItem>
                    <PaginationItem className='cursor-pointer flex gap-1'>
                        {currentPage > 2 && (
                            <PaginationLink isActive className='border-0'
                                            onClick={() => setCurrentPage(currentPage - 2)}>{currentPage - 2}</PaginationLink>
                        )}
                        {currentPage > 1 && (
                            <PaginationLink isActive className='border-0'
                                            onClick={() => setCurrentPage(currentPage - 1)}>{currentPage - 1}</PaginationLink>
                        )}
                        <PaginationLink isActive className='border-0'>{currentPage}</PaginationLink>
                        {currentPage < Math.ceil(sortedData.length / itemsPerPage) && (
                            <PaginationLink isActive className='border-0'
                                            onClick={() => setCurrentPage(currentPage + 1)}>{currentPage + 1}</PaginationLink>
                        )}
                        {currentPage < Math.ceil(sortedData.length / itemsPerPage) - 1 && (
                            <PaginationLink isActive className='border-0'
                                            onClick={() => setCurrentPage(currentPage + 2)}>{currentPage + 2}</PaginationLink>
                        )}
                    </PaginationItem>
                    <PaginationItem className='cursor-pointer'>
                        <PaginationNext
                            onClick={() => setCurrentPage(prev =>
                                Math.min(prev + 1, Math.ceil(sortedData.length / itemsPerPage))
                            )}
                            isActive={currentPage < Math.ceil(sortedData.length / itemsPerPage)}
                        />
                    </PaginationItem>
                    <PaginationItem className='cursor-pointer'>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.ceil(sortedData.length / itemsPerPage))}
                            disabled={currentPage === Math.ceil(sortedData.length / itemsPerPage)}
                        >
                            Last
                        </Button>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

        </div>
    );
};

export default PassengerProfile;