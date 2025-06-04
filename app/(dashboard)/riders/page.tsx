"use client";
import {useEffect, useMemo, useState} from 'react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {Badge} from '@/components/ui/badge';
import Image from 'next/image';
import {generateRiders} from "@/dummy/riders";
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
import {Rider} from "@/types/rider";
import {Link} from "next-view-transitions";

// Dummy data
const riders = generateRiders(27);

const Riders = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({key: '', direction: ''});
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Search filter
    const filteredData = useMemo(() => {
        return riders.filter(
            (rider) =>
                rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rider.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    // Sorting
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;
        return [...filteredData].sort((a: Rider, b: Rider) => {
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
        const storedItemsPerPage = localStorage.getItem('riders-itemsPerPage');
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
        localStorage.setItem('riders-itemsPerPage', value.toString());
        setItemsPerPage(value);
    }

    // Function to delete a rider with a simulated API call (success or failure randomly simulated)
    const deleteRider = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                Math.random() > 0.5 ? reject("Deletion failed") : resolve("Rider deleted");
            }, 1000);
        });
    }

    const handleDelete = async () => {
        await toast.promise(
            deleteRider(),
            {
                loading: 'Deleting...',
                success: 'Rider deleted!',
                error: 'Failed to delete rider',
            }
        )
    }

    return (
        <div className="flex flex-col w-full space-y-6">
            {/* Title Row */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold motion-preset-blur-right">All Riders</h1>
                <Link href="/riders/enroll">
                    <Button className="motion-preset-blur-left text-white">Add Rider</Button>
                </Link>
            </div>

            {/* Search Row */}
            <div className="flex items-center justify-between py-4">
                {/* Search Bar */}
                <Input
                    placeholder="Search riders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm motion-preset-blur-right delay-75"
                />

                {/* Items Per Row */}
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
            </div>

            {/* Riders Table */}
            <Table className="motion-preset-blur-up" suppressHydrationWarning>
                <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-zinc-800 cursor-pointer rounded-2xl">
                        <TableHead>Avatar</TableHead>
                        <TableHead onClick={() => handleSort('name')}>
                            Rider {sortConfig.key === 'name' && (
                            <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                        )}
                        </TableHead>
                        <TableHead onClick={() => handleSort('vehicleNumber')}>
                            Vehicle Number {sortConfig.key === 'vehicleNumber' && (
                            <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                        )}
                        </TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead onClick={() => handleSort('amountEarned')}>
                            Amount Earned {sortConfig.key === 'amountEarned' && (
                            <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                        )}
                        </TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.map((rider) => (
                        <TableRow key={rider.id}>
                            <TableCell suppressHydrationWarning>
                                <Image
                                    src={rider.avatar}
                                    alt={`${rider.name}'s avatar`}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                            </TableCell>
                            <TableCell>{rider.name}</TableCell>
                            <TableCell>{rider.vehicleNumber}</TableCell>
                            <TableCell>
                                {Array.from({length: 5}, (_, i) => (
                                    <Star
                                        weight="fill"
                                        key={i}
                                        className={i < Math.floor(rider.rating) ?
                                            'text-yellow-500 inline-block' :
                                            'text-gray-300 inline-block'}
                                        size={16}
                                    />
                                ))}
                                <span className="ml-2">{rider.rating}</span>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={rider.status === 'online' ? "outline_success" : "outline_destructive"}
                                >
                                    {rider.status}
                                </Badge>
                            </TableCell>
                            <TableCell>GH¢{rider.amountEarned}</TableCell>
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
                                                    onClick={() => redirect(`/riders/profile/${rider.id}`)}
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
                                            <DialogTrigger>
                                                {/* Delete Rider Button */}
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Button variant="ghost" size="icon" className="rounded-full">
                                                            <Trash size={32} className="" weight="duotone"/>
                                                        </Button>
                                                        <TooltipContent>
                                                            Delete
                                                        </TooltipContent>
                                                    </TooltipTrigger>
                                                </Tooltip>
                                            </DialogTrigger>

                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                </DialogHeader>
                                                <DialogBody>
                                                    <DialogDescription>
                                                        You&#39;re trying to delete a rider&#39;s account.
                                                        <p>
                                                            This will delete the
                                                            rider and disable the rider&#39;s account.
                                                        </p>
                                                    </DialogDescription>
                                                </DialogBody>
                                                <DialogFooter>
                                                    <div className="flex gap-2">
                                                        <DialogClose>
                                                            <Button variant="ghost">Close</Button>
                                                        </DialogClose>
                                                        <DialogClose>
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

export default Riders;