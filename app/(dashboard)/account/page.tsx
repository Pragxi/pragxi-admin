"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, User, Lock } from "lucide-react";
import { updateUserProfileAction, updateUserPasswordAction } from "@/app/(server-actions)/(user-actions)/update-user-profile.action";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserDataAction } from "@/app/(server-actions)/(user-actions)/get-user-data.action";

const profileSchema = z.object({
    display_name: z.string().min(1, "Display name is required"),
    email: z.string().email("Please enter a valid email address"),
});

const passwordSchema = z.object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(6, "New password must be at least 6 characters"),
    confirm_password: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const AccountPage = () => {
    const queryClient = useQueryClient();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
    const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

    const { data: userData } = useQuery({
        queryKey: ['logged-in-user'],
        queryFn: getUserDataAction,
    });

    const profileForm = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            display_name: "",
            email: ""
        },
    });

    const passwordForm = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            current_password: "",
            new_password: "",
            confirm_password: "",
        },
    });

    // Update form values when user data loads
    useEffect(() => {
        if (userData?.success && userData.user && !profileForm.formState.isDirty) {
            const user = userData.user;
            profileForm.reset({
                display_name: user.user.user_metadata?.display_name || user.user.email?.split('@')[0] || "",
                email: user.user.email || "",
            });
        }
    }, [userData, profileForm]);

    const onProfileSubmit = async (data: ProfileFormData) => {
        setIsProfileSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('display_name', data.display_name);
            formData.append('email', data.email);

            const result = await updateUserProfileAction(formData);

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Profile updated successfully!");
                // Get the user email safely
                const userEmail = userData?.success ? userData.user?.email : "";
                // Update the form with the new values
                profileForm.reset({
                    ...data,
                    email: data.email || userEmail
                });

                // Invalidate the user data query to refetch the latest data
                await queryClient.invalidateQueries({ queryKey: ['logged-in-user'] });
            }
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error("An unexpected error occurred while updating your profile.");
        } finally {
            setIsProfileSubmitting(false);
        }
    };

    const onPasswordSubmit = async (data: PasswordFormData) => {
        setIsPasswordSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('current_password', data.current_password);
            formData.append('new_password', data.new_password);
            formData.append('confirm_password', data.confirm_password);

            const result = await updateUserPasswordAction(formData);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Password updated successfully!");
                passwordForm.reset();
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsPasswordSubmitting(false);
        }
    };

    if (!userData?.success || !userData.user) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account information and security settings.
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Security
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your display name and email address.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...profileForm}>
                                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                                    <FormField
                                        control={profileForm.control}
                                        name="display_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Display Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your display name" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    This is the name that will be displayed throughout the application.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={profileForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="Enter your email" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    This email will be used for login and notifications.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" disabled={isProfileSubmitting}>
                                        {isProfileSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Update Profile
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>
                                Update your password to keep your account secure.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...passwordForm}>
                                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                                    <FormField
                                        control={passwordForm.control}
                                        name="current_password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Current Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type={showCurrentPassword ? "text" : "password"}
                                                            placeholder="Enter your current password"
                                                            {...field}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        >
                                                            {showCurrentPassword ? (
                                                                <EyeOff className="h-4 w-4" />
                                                            ) : (
                                                                <Eye className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={passwordForm.control}
                                        name="new_password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type={showNewPassword ? "text" : "password"}
                                                            placeholder="Enter your new password"
                                                            {...field}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                        >
                                                            {showNewPassword ? (
                                                                <EyeOff className="h-4 w-4" />
                                                            ) : (
                                                                <Eye className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormDescription>
                                                    Password must be at least 6 characters long.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={passwordForm.control}
                                        name="confirm_password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm New Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            placeholder="Confirm your new password"
                                                            {...field}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        >
                                                            {showConfirmPassword ? (
                                                                <EyeOff className="h-4 w-4" />
                                                            ) : (
                                                                <Eye className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" disabled={isPasswordSubmitting}>
                                        {isPasswordSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Update Password
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AccountPage;
