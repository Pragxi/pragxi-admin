"use client";

import {FormEvent, useState} from "react";
import Image from "next/image";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {useMutation} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle} from "lucide-react";
import {loginAction} from "@/app/(server-actions)/(auth-actions)/login.action";

export default function Home() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");

    const loginMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            return loginAction(formData);
        },
        onSuccess: (data) => {
            if (data.success) {
                router.push("/dashboard");
            } else if (data.error) {
                setErrorMessage(data.error);
            }
        },
        onError: () => {
            setErrorMessage("An unexpected error occurred. Please try again.");
        }
    });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage("");
        const formData = new FormData(e.currentTarget);
        loginMutation.mutate(formData);
    };

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
                    <span className="text-3xl font-black text-slate-900 dark:text-gray-200">Pragxi</span>
                </div>
                <div className="flex flex-col gap-1 p-6">
                    <div className="flex flex-col gap-1 items-center">
                        <div className="font-semibold text-lg">Sign In</div>
                        <div className="text-muted-foreground">Sign in to manage your dashboard</div>
                    </div>
                    <div>
                        <form className="flex flex-col gap-3 mt-4" onSubmit={handleSubmit}>
                            {errorMessage && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4"/>
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>
                                        {errorMessage}
                                    </AlertDescription>
                                </Alert>
                            )}
                            <div className="flex flex-col space-y-1">
                                <Label className="text-sm text-muted-foreground">Email</Label>
                                <Input name="email" placeholder="eg: admin@email.com" type="email" required/>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <Label className="text-sm text-muted-foreground">Password</Label>
                                <Input name="password" placeholder="***********" type="password" required/>
                            </div>
                            <Button
                                type="submit"
                                disabled={loginMutation.isPending}
                                className="flex items-center justify-center"
                            >
                                {loginMutation.isPending ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing In...
                                    </>
                                ) : "Sign In"}
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