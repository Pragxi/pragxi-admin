"use client";

import {useEffect, useMemo, useState} from 'react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {Badge} from '@/components/ui/badge';
import Image from 'next/image';
import {generatePassengers} from "@/dummy/passengers";
import {Trash} from '@phosphor-icons/react/dist/ssr';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Eye, Star} from "@phosphor-icons/react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {DialogBody} from "next/dist/client/components/react-dev-overlay/ui/components/dialog";
import toast from "react-hot-toast";
import {redirect} from "next/navigation";
import {Passenger} from "@/types/passenger";

// Dummy data
const passengers = generatePassengers(27);

const Passengers = () => {
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
    }, []);

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
    };

    // Function to delete a rider with a simulated API call
    const deletePassenger = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                Math.random() > 0.5 ? reject("Deletion failed") : resolve("Passenger deleted");
            }, 1000);
        });
    };

    const handleDelete = async () => {
        await toast.promise(
            deletePassenger(),
            {
                loading: 'Deleting...',
                success: 'Passenger deleted!',
                error: 'Failed to delete passenger',
            }
        );
    };

    return (
        <div className="flex flex-col w-full space-y-6">
            {/* Title Row */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold motion-preset-blur-right">All Passengers</h1>
            </div>

            {/* Search Row */}
            <div className="flex items-center justify-between py-4">
                {/* Search Bar */}
                <Input
                    placeholder="Search passengers..."
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
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="rounded-full"
                                                    onClick={() => redirect(`/passengers/profile/${passenger.id}`)}
                                                >
                                                    <Eye size={32} weight="duotone"/>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                View
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                        {/* Delete Rider Dialog Trigger */}
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                {/* Delete Rider Button */}
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="rounded-full">
                                                            <Trash size={32} weight="duotone"/>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Delete
                                                    </TooltipContent>
                                                </Tooltip>
                                            </DialogTrigger>

                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                </DialogHeader>
                                                <DialogBody>
                                                    <DialogDescription>
                                                        You&#39;re trying to delete a passenger&#39;s account.
                                                        <p>
                                                            This will delete the
                                                            passenger and disable the passenger&#39;s account.
                                                        </p>
                                                    </DialogDescription>
                                                </DialogBody>
                                                <DialogFooter>
                                                    <div className="flex gap-2">
                                                        <DialogClose asChild>
                                                            <Button variant="ghost">Close</Button>
                                                        </DialogClose>
                                                        <DialogClose asChild>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={handleDelete}>
                                                                Delete
                                                            </Button>
                                                        </DialogClose>
                                                    </div>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
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

export default Passengers;