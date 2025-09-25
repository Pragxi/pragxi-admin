"use client";
import {toast} from "sonner";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {format} from "date-fns";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";
import {Calendar as CalendarIcon, Check, ChevronsUpDown, Loader2} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {addRiderPersonalAction} from "@/app/(server-actions)/(riders-actions)/add-rider-personal.action";
import {updateRiderPersonalAction} from "@/app/(server-actions)/(riders-actions)/update-rider-personal.action";
import {RiderInfoSchema} from "@/types/rider";
import {useMutation} from "@tanstack/react-query";
import {useState, useEffect, forwardRef, useImperativeHandle} from "react";

const countries = [
    {label: "Ghana", value: "ghana"},
    {label: "Nigeria", value: "nigeria"},
    {label: "Kenya", value: "kenya"},
    {label: "South Africa", value: "south-africa"},
    // Add more countries as needed
];

interface AddRiderPersonalInformationFormProps {
    rider?: any;
    isEditMode?: boolean;
    onSaveSuccess?: () => void;
}

const AddRiderPersonalInformationForm = forwardRef<{ submit: () => void }, AddRiderPersonalInformationFormProps>(({ 
    rider, 
    isEditMode = false, 
    onSaveSuccess 
}, ref) => {
    const [hideSubmitButton, setHideSubmitButton] = useState(false);

    const form = useForm<z.infer<typeof RiderInfoSchema>>({
        resolver: zodResolver(RiderInfoSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            phone_number: "",
            email: "",
            marital_status: "",
            gender: "",
            nationality: "ghana",
            city: "",
            gps_address: "",
        },
    });

    // Set form values when rider data is available (for edit mode)
    useEffect(() => {
        if (rider?.personal && isEditMode) {
            form.reset({
                first_name: rider.personal.first_name || "",
                last_name: rider.personal.last_name || "",
                phone_number: rider.personal.phone_number || "",
                email: rider.personal.email || "",
                marital_status: rider.personal.marital_status || "",
                gender: rider.personal.gender || "",
                nationality: rider.personal.nationality || "ghana",
                city: rider.personal.city || "",
                gps_address: rider.personal.gps_address || "",
                dob: rider.personal.dob ? new Date(rider.personal.dob) : undefined,
            });
        }
    }, [rider, isEditMode, form]);

    const createMutation = useMutation({
        mutationFn: addRiderPersonalAction,
        onSuccess: (data) => {
            if (data.error || !data.success) {
                toast.error(data.error, {
                    closeButton: true
                });
            } else {
                setHideSubmitButton(true);
                localStorage.setItem("added-rider-id", data?.data?.user_id!);
                toast.success("Rider created successfully", {
                    closeButton: true
                });
                // notify parent so it can fetch rider and advance stepper
                onSaveSuccess?.();
            }
        },
        onError: () => {
            toast.error("Failed to create rider", {
                closeButton: true
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: (values: z.infer<typeof RiderInfoSchema>) => 
            updateRiderPersonalAction(rider.rider_id, values),
        onSuccess: (data) => {
            if (data.error || !data.success) {
                toast.error(data.error, {
                    closeButton: true
                });
            } else {
                toast.success("Rider updated successfully", {
                    closeButton: true
                });
                onSaveSuccess?.();
            }
        },
        onError: () => {
            toast.error("Failed to update rider", {
                closeButton: true
            });
        },
    });

    const isPending = createMutation.isPending || updateMutation.isPending;

    const onSubmit = async (values: z.infer<typeof RiderInfoSchema>) => {
        if (isEditMode) {
            updateMutation.mutate(values);
        } else {
            localStorage.setItem("added-rider-id", "");
            createMutation.mutate(values);
        }
    };

    useImperativeHandle(ref, () => ({
        submit: () => {
            form.handleSubmit(onSubmit)();
        }
    }));

    return (
        <Form {...form}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)(e);
                }}
                className="space-y-4 my-3 motion-preset-blur-right delay-100"
            >
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <FormField
                            control={form.control}
                            name="first_name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending || hideSubmitButton}
                                            placeholder="eg. John"
                                            type="text"
                                            className="w-full"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <FormField
                            control={form.control}
                            name="last_name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending || hideSubmitButton}
                                            placeholder="eg. Doe"
                                            type="text"
                                            className="w-full"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Phone Number & Email Address */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <FormField
                            control={form.control}
                            name="phone_number"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending || hideSubmitButton}
                                            placeholder="eg. 0244567885"
                                            type="text"
                                            className="w-full"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending || hideSubmitButton}
                                            placeholder="eg. johndoe@email.com"
                                            type="email"
                                            className="w-full"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Date of Birth & Marital Status */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <FormField
                            control={form.control}
                            name="dob"
                            render={({field}) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date of birth</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    disabled={isPending || hideSubmitButton}
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <FormField
                            control={form.control}
                            name="marital_status"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Marital Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Marital Status"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="single">Single</SelectItem>
                                            <SelectItem value="married">Married</SelectItem>
                                            <SelectItem value="divorced">Divorced</SelectItem>
                                            <SelectItem value="widowed">Widow(er)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Gender & Nationality */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Gender</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Gender"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <FormField
                            control={form.control}
                            name="nationality"
                            render={({field}) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Nationality</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    disabled={isPending || hideSubmitButton}
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? countries.find((country) => country.value === field.value)?.label
                                                        : "Select country"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Search country..."/>
                                                <CommandEmpty>No country found.</CommandEmpty>
                                                <CommandGroup>
                                                    {countries.map((country) => (
                                                        <CommandItem
                                                            value={country.label}
                                                            key={country.value}
                                                            onSelect={() => {
                                                                form.setValue("nationality", country.value)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    country.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {country.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* City & GPS Address */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <FormField
                            control={form.control}
                            name="city"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending || hideSubmitButton}
                                            placeholder="eg. Accra"
                                            type="text"
                                            className="w-full"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <FormField
                            control={form.control}
                            name="gps_address"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>GPS Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending || hideSubmitButton}
                                            placeholder="eg. GA-123-456"
                                            type="text"
                                            className="w-full"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {!hideSubmitButton && (
                    <Button type="submit" disabled={isPending} className="w-full">
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                {isEditMode ? "Updating..." : "Creating..."}
                            </>
                        ) : (
                            isEditMode ? "Update Rider" : "Create Rider"
                        )}
                    </Button>
                )}
            </form>
        </Form>
    );
});

AddRiderPersonalInformationForm.displayName = 'AddRiderPersonalInformationForm';

export default AddRiderPersonalInformationForm;


