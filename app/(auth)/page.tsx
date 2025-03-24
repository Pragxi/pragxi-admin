"use client";

import Image from "next/image";
import {useTransitionRouter} from 'next-view-transitions';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";

export default function Home() {
    const router = useTransitionRouter();

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-center flex-col items-center">
                <div className="flex items-center gap-4 p-6">
                    <div className="shadow-md rounded-lg">
                        <Image
                            src="/icons/favicon/android-chrome-512x512.png"
                            alt="logo"
                            height={100}
                            width={100}
                            className="h-12 w-12 rounded-lg"
                        />
                    </div>
                    <span className="text-3xl font-black text-slate-900">Pragxi</span>
                </div>
                <div className="flex flex-col gap-1 p-6">
                    <div className="flex flex-col gap-1 items-center">
                        <div className="font-semibold text-lg">Sign In</div>
                        <div className="text-gray-500">Sign in to manage your dashboard</div>
                    </div>
                    <div>
                        <form className="flex flex-col gap-1 mt-4">
                            <Label className="text-sm text-gray-800">Email</Label>
                            <Input placeholder="eg: admin@email.com" type="email" required/>
                            <Button type="button" onClick={() => router.push("/dashboard")}>
                                Sign In
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="h-full">
                <Image
                    src="/img/auth/auth-bg.png"
                    alt="logo"
                    height={1000}
                    width={1000}
                    className="h-screen w-full object-cover"
                />
            </div>
        </div>
    );
}
