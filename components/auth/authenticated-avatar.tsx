import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";

const AuthenticatedAvatar = ({...prop}) => {

    const {collapsed} = prop;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className={
                    cn("rounded-full transition-all duration-300 cursor-pointer p-1 flex items-center gap-2 w-full hover:bg-gray-100 dark:hover:bg-zinc-800",
                        !collapsed && "rounded-lg p-2 border border-gray-200 dark:border-zinc-700")}>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png"/>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {!collapsed && <div>Joe</div>}
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem>
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default AuthenticatedAvatar;