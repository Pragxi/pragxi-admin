'use client';

import { useState } from 'react';
import { Search, Trash2, Pencil } from 'lucide-react';
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
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Admin {
    id: number;
    fullName: string;
    email: string;
    dateEnrolled: string;
    role: string;
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export default function ManageAdminsPage() {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [inviteEmails, setInviteEmails] = useState(['']);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
    
    // Sample admin data
    const [admins] = useState<Admin[]>([
        {
            id: 1,
            fullName: 'Olivia Rhye',
            email: 'olivia@infogov.com',
            dateEnrolled: 'Jan 10, 2025',
            role: 'Super Admin'
        },
        {
            id: 2,
            fullName: 'Phoenix Baker',
            email: 'phoenix@infogov.com',
            dateEnrolled: 'Jan 10, 2025',
            role: 'Admin'
        },
        {
            id: 3,
            fullName: 'Lana Steiner',
            email: 'lana@infogov.com',
            dateEnrolled: 'Jan 10, 2025',
            role: 'Admin'
        },
        {
            id: 4,
            fullName: 'Demi Wilkinson',
            email: 'demi@infogov.com',
            dateEnrolled: 'Jan 10, 2025',
            role: 'Admin'
        }
    ]);

    const filteredAdmins = admins.filter(admin =>
        admin.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredAdmins.slice(startIndex, endIndex);

    const handleSetItemsPerPage = (value: number) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    const handleInviteSubmit = () => {
        console.log('Inviting admins:', inviteEmails.filter(email => email.trim()));
        setIsInviteModalOpen(false);
        setInviteEmails(['']);
    };

    const handleAddEmailField = () => {
        setInviteEmails([...inviteEmails, '']);
    };

    const handleEmailChange = (index: number, value: string) => {
        const newEmails = [...inviteEmails];
        newEmails[index] = value;
        setInviteEmails(newEmails);
    };

    const handleRemoveEmailField = (index: number) => {
        if (inviteEmails.length > 1) {
            const newEmails = inviteEmails.filter((_, i) => i !== index);
            setInviteEmails(newEmails);
        }
    };

    const handleEdit = (adminId: number) => {
        console.log('Edit admin:', adminId);
    };

    const handleDelete = (adminId: number) => {
        console.log('Delete admin:', adminId);
    };

    return (
        <div className="flex flex-col w-full space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
                {/* Page Header */}
                <div className="flex flex-col mb-4">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white motion-preset-blur-right">Manage Admins</h1>
                        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                            {filteredAdmins.length} items
                        </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage system administrators and their roles</p>
                </div>

                <div className="flex items-center justify-between py-4">
                    <div className="relative flex items-center max-w-sm">
                        <Search className="absolute left-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search admins..."
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
                                {ITEMS_PER_PAGE_OPTIONS.map((pageSize) => (
                                    <SelectItem key={pageSize} value={pageSize.toString()}>
                                        {pageSize} rows per page
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button 
                            onClick={() => setIsInviteModalOpen(true)}
                            className="motion-preset-blur-left"
                        >
                            + Invite Admin
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <Table className="motion-preset-blur-up" suppressHydrationWarning>
                    <TableHeader>
                        <TableRow className="bg-gray-100 dark:bg-zinc-800 cursor-pointer rounded-2xl">
                            <TableHead className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Full Name</TableHead>
                            <TableHead className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Email</TableHead>
                            <TableHead className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Date Enrolled</TableHead>
                            <TableHead className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Role</TableHead>
                            <TableHead className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-gray-500 dark:text-gray-400">
                                    No admins found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentItems.map((admin) => (
                                <TableRow key={admin.id} className="border-b last:border-b-0 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                    <TableCell className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{admin.fullName}</TableCell>
                                    <TableCell className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{admin.email}</TableCell>
                                    <TableCell className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{admin.dateEnrolled}</TableCell>
                                    <TableCell className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{admin.role}</TableCell>
                                    <TableCell className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(admin.id)}
                                                className="h-8 w-8"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(admin.id)}
                                                className="h-8 w-8"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="mt-4">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        onClick={() => setCurrentPage(page)}
                                        isActive={currentPage === page}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>

            {/* Invite Admin Modal */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Invite Admin</h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsInviteModalOpen(false)}
                            >
                                ×
                            </Button>
                        </div>
                        
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Invite people to join as administrators.
                        </p>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email Address
                            </label>
                            {inviteEmails.map((email, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        type="email"
                                        placeholder="example@gmail.com"
                                        value={email}
                                        onChange={(e) => handleEmailChange(index, e.target.value)}
                                        className="flex-1"
                                    />
                                    {inviteEmails.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveEmailField(index)}
                                        >
                                            ×
                                        </Button>
                                    )}
                                </div>
                            ))}
                            
                            <Button
                                variant="outline"
                                onClick={handleAddEmailField}
                                className="w-full"
                            >
                                + Add Another
                            </Button>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setIsInviteModalOpen(false)}
                            >
                                Discard
                            </Button>
                            <Button onClick={handleInviteSubmit}>
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}