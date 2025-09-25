"use client";
import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Trash } from '@phosphor-icons/react/dist/ssr';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Star } from "@phosphor-icons/react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {toast} from "sonner";
import { redirect } from "next/navigation";
import { Link } from "next-view-transitions";
import { createClient } from "@/utils/supabase/client";

type RiderRow = {
    id: string;
    name: string;
    vehicleNumber?: string | null;
    avatar?: string | null;
    rating?: number | null;
    status?: string | null;
    amountEarned?: number | null;
};

const Riders = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | '' }>({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [rows, setRows] = useState<RiderRow[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Debounce search input
    useEffect(() => {
        const id = setTimeout(() => setDebouncedSearch(searchTerm), 400);
        return () => clearTimeout(id);
    }, [searchTerm]);

    // When search changes, jump back to page 1
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch]);

    // Client-side sorting (applies to current page data)
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return rows;
        return [...rows].sort((a: any, b: any) => {
            const av = a[sortConfig.key] ?? '';
            const bv = b[sortConfig.key] ?? '';
            if (av < bv) return sortConfig.direction === 'asc' ? -1 : 1;
            if (av > bv) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [rows, sortConfig]);

    useEffect(() => {
        const storedItemsPerPage = localStorage.getItem('riders-itemsPerPage');
        if (storedItemsPerPage) {
            setItemsPerPage(Number(storedItemsPerPage));
        }
    }, [])

    // Fetch riders from Supabase with pagination and search
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const supabase = createClient();
                const offset = (currentPage - 1) * itemsPerPage;

                let query = supabase
                    .from('riders_personal_information')
                    .select('rider_id, first_name, last_name', { count: 'exact' })
                    .order('last_name', { ascending: true })
                    .range(offset, offset + itemsPerPage - 1);

                if (debouncedSearch.trim()) {
                    const term = debouncedSearch.trim();
                    query = query.or(`first_name.ilike.%${term}%,last_name.ilike.%${term}%`);
                }

                const { data: personal, error: personalError, count } = await query;
                if (personalError) throw new Error(personalError.message);

                const riderIds = (personal ?? []).map((p) => p.rider_id);
                let securityMap: Record<string, { vehicle_number: string | null }> = {};
                if (riderIds.length > 0) {
                    const { data: security, error: secErr } = await supabase
                        .from('riders_security_information')
                        .select('rider_id, vehicle_number')
                        .in('rider_id', riderIds);
                    if (secErr) throw new Error(secErr.message);
                    securityMap = (security ?? []).reduce((acc, cur) => {
                        acc[cur.rider_id as string] = { vehicle_number: cur.vehicle_number ?? null };
                        return acc;
                    }, {} as Record<string, { vehicle_number: string | null }>);
                }

                const rowsMapped: RiderRow[] = (personal ?? []).map((p) => {
                    const name = `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim();
                    const vehicleNumber = securityMap[p.rider_id]?.vehicle_number ?? null;
                    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'Rider')}`;
                    return {
                        id: p.rider_id,
                        name,
                        vehicleNumber,
                        avatar,
                        rating: null,
                        status: null,
                        amountEarned: null,
                    };
                });

                setRows(rowsMapped);
                setTotalCount(count ?? 0);
            } catch (e: any) {
                setError(e?.message || 'Failed to load riders');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentPage, itemsPerPage, debouncedSearch]);

    const handleSort = (key: string) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });
    };

    const handleSetItemsPerPage = (value: number) => {
        localStorage.setItem('riders-itemsPerPage', value.toString());
        setItemsPerPage(value);
    }

    // Call API to delete a rider from auth and all rider tables
    const deleteRider = async (id: string) => {
        const res = await fetch(`/api/riders/${id}`, { method: 'DELETE' });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
            throw new Error(body?.error || 'Failed to delete rider');
        }
        return 'Rider deleted';
    };

    const handleDelete = async (id: string) => {
        await toast.promise(
            deleteRider(id),
            {
                loading: 'Deleting...',
                success: 'Rider deleted!',
                error: (err) => err?.message || 'Failed to delete rider',
            }
        );
        // Optimistically remove from current list and adjust total count
        setRows(prev => prev.filter(r => r.id !== id));
        setTotalCount(prev => Math.max(0, prev - 1));
        // If page becomes empty after deletion and not on first page, go back a page
        setTimeout(() => {
            const remainingOnPage = rows.length - 1; // minus the deleted one
            if (remainingOnPage <= 0 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        }, 0);
    };

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
                    {loading && (
                        <TableRow>
                            <TableCell colSpan={7}>Loading...</TableCell>
                        </TableRow>
                    )}
                    {!loading && error && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-red-500">{error}</TableCell>
                        </TableRow>
                    )}
                    {!loading && !error && sortedData.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7}>No riders found</TableCell>
                        </TableRow>
                    )}
                    {!loading && !error && sortedData.map((rider) => (
                        <TableRow key={rider.id}>
                            <TableCell suppressHydrationWarning>
                                <img
                                    src={`/api/avatar/${rider.id}`}
                                    alt={`${rider.name}'s avatar`}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                            </TableCell>
                            <TableCell>{rider.name}</TableCell>
                            <TableCell>{rider.vehicleNumber || '-'}</TableCell>
                            <TableCell>
                                {Array.from({ length: 5 }, (_, i) => (
                                    <Star
                                        weight="fill"
                                        key={i}
                                        className={i < Math.floor(rider?.rating || 0) ?
                                            'text-yellow-500 inline-block' :
                                            'text-gray-300 inline-block'}
                                        size={16}
                                    />
                                ))}
                                <span className="ml-2">{rider?.rating ?? '-'}</span>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={rider?.status === 'online' ? "outline_success" : "outline_destructive"}
                                >
                                    {rider?.status ?? 'offline'}
                                </Badge>
                            </TableCell>
                            <TableCell>GH¢{rider?.amountEarned ?? '-'}</TableCell>
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
                                                    <Eye size={32} weight="duotone" />
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
                                                            <Trash size={32} className="" weight="duotone" />
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
                                                <div>
                                                    <DialogDescription>
                                                        You&#39;re trying to delete a rider&#39;s account.
                                                        <p>
                                                            This will delete the
                                                            rider and disable the rider&#39;s account.
                                                        </p>
                                                    </DialogDescription>
                                                </div>
                                                <DialogFooter>
                                                    <div className="flex gap-2">
                                                        <DialogClose>
                                                            <Button variant="ghost">Close</Button>
                                                        </DialogClose>
                                                        <DialogClose>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => handleDelete(rider.id)}>
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
                        {currentPage < Math.ceil(totalCount / itemsPerPage) && (
                            <PaginationLink isActive className='border-0'
                                onClick={() => setCurrentPage(currentPage + 1)}>{currentPage + 1}</PaginationLink>
                        )}
                        {currentPage < Math.ceil(totalCount / itemsPerPage) - 1 && (
                            <PaginationLink isActive className='border-0'
                                onClick={() => setCurrentPage(currentPage + 2)}>{currentPage + 2}</PaginationLink>
                        )}
                    </PaginationItem>
                    <PaginationItem className='cursor-pointer'>
                        <PaginationNext
                            onClick={() => setCurrentPage(prev =>
                                Math.min(prev + 1, Math.ceil(totalCount / itemsPerPage))
                            )}
                            isActive={currentPage < Math.ceil(totalCount / itemsPerPage)}
                        />
                    </PaginationItem>
                    <PaginationItem className='cursor-pointer'>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.ceil(totalCount / itemsPerPage))}
                            disabled={currentPage === Math.ceil(totalCount / itemsPerPage)}
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