"use client";
import {useEffect, useMemo, useState} from 'react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
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
import {Eye} from "@phosphor-icons/react";
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
import {Link} from "next-view-transitions";
import {getAllRiders} from "@/app/(server-actions)/(riders-actions)/get-all-riders.action";

const Riders = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({key: '', direction: ''});
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [riders, setRiders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRiders = async () => {
            setLoading(true);
            setError('');
            try {
                const result = await getAllRiders();
                if (result.error) {
                    setError(result.error);
                } else if (result.data) {
                    setRiders(result.data);
                }
            } catch (_err) {
                setError('Failed to fetch riders.');
            }
            setLoading(false);
        };
        fetchRiders();
        const storedItemsPerPage = localStorage.getItem('riders-itemsPerPage');
        if (storedItemsPerPage) {
            setItemsPerPage(Number(storedItemsPerPage));
        }
    }, []);

    // Search filter
    const filteredData = useMemo(() => {
        return riders.filter((rider) => {
            const name = `${rider.first_name || ''} ${rider.last_name || ''}`.toLowerCase();
            const vehicleNumber = rider.security?.vehicle_number?.toLowerCase() || '';
            return (
                name.includes(searchTerm.toLowerCase()) ||
                vehicleNumber.includes(searchTerm.toLowerCase())
            );
        });
    }, [searchTerm, riders]);

    // Sorting
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;
        return [...filteredData].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];
            if (sortConfig.key === 'name') {
                aValue = `${a.first_name || ''} ${a.last_name || ''}`;
                bValue = `${b.first_name || ''} ${b.last_name || ''}`;
            }
            if (sortConfig.key === 'vehicleNumber') {
                aValue = a.security?.vehicle_number || '';
                bValue = b.security?.vehicle_number || '';
            }
            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [filteredData, sortConfig]);

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

            {/* Error Message */}
            {error && (
                <div className="text-red-500 font-semibold mb-2">{error}</div>
            )}

            {/* Riders Table */}
            <Table className="motion-preset-blur-up" suppressHydrationWarning>
                <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-zinc-800 cursor-pointer rounded-2xl">
                        <TableHead onClick={() => handleSort('name')}>Name</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Nationality</TableHead>
                        <TableHead onClick={() => handleSort('vehicleNumber')}>Vehicle Number</TableHead>
                        <TableHead>Vehicle Color</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                                <div className="flex justify-center items-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                                    <span className="ml-3 text-gray-600 dark:text-gray-400"></span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : paginatedData.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6}>No riders found.</TableCell>
                        </TableRow>
                    ) : (
                        paginatedData.map((rider) => (
                            <TableRow key={rider.rider_id}>
                                <TableCell>{`${rider.first_name || 'Not submitted'} ${rider.last_name || ''}`}</TableCell>
                                <TableCell>{rider.gender || 'Not submitted'}</TableCell>
                                <TableCell>{rider.nationality || 'Not submitted'}</TableCell>
                                <TableCell>{rider.security?.vehicle_number || 'Not submitted'}</TableCell>
                                <TableCell>{rider.security?.vehicle_color || 'Not submitted'}</TableCell>
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
                                                        onClick={() => redirect(`/riders/profile/${rider.rider_id}`)}
                                                    >
                                                        <Eye size={32} weight="duotone"/>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>View</TooltipContent>
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
                                                            <TooltipContent>Delete</TooltipContent>
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
                        ))
                    )}
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