"use client";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {format} from "date-fns";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";
import {Calendar as CalendarIcon, Loader2} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {RiderSecuritySchema} from "@/types/rider";
import {useState, useEffect, forwardRef, useImperativeHandle} from "react";
import {updateRiderSecurityAction} from "@/app/(server-actions)/(riders-actions)/update-rider-security.action";

const relationships = [
    {label: "Parent", value: "parent"},
    {label: "Guardian", value: "guardian"},
    {label: "Sibling", value: "sibling"},
    {label: "Friend", value: "friend"},
];

interface UpdateRiderSecurityInformationFormProps {
    rider: any;
    onSaveSuccess?: () => void;
    setIsPending?: (pending: boolean) => void;
}

const UpdateRiderSecurityInformationForm = forwardRef<{ submit: () => void }, UpdateRiderSecurityInformationFormProps>(({ rider, onSaveSuccess, setIsPending }, ref) => {
    const [hideSubmitButton, setHideSubmitButton] = useState(false);

    const form = useForm<z.infer<typeof RiderSecuritySchema>>({
        resolver: zodResolver(RiderSecuritySchema),
        defaultValues: {
            relationship: rider?.security?.relationship || "parent",
            vehicle: rider?.security?.vehicle || "",
            vehicle_number: rider?.security?.vehicle_number || "",
            vehicle_color: rider?.security?.vehicle_color || "",
            id_number: rider?.security?.id_number || "",
            drivers_license_number: rider?.security?.drivers_license_number || "",
            insurance_type: rider?.security?.insurance_type || "",
            insurance_number: rider?.security?.insurance_number || "",
            insurance_expiration: rider?.security?.insurance_expiration ? new Date(rider.security.insurance_expiration) : undefined,
            witness_name: rider?.security?.witness_name || "",
            witness_contact_number: rider?.security?.witness_contact_number || "",
            rider_id: rider?.rider_id || "",
        },
    });

    useEffect(() => {
        if (rider) {
            const s = rider.security || {};
            form.reset({
                relationship: s.relationship || "parent",
                vehicle: s.vehicle || "",
                vehicle_number: s.vehicle_number || "",
                vehicle_color: s.vehicle_color || "",
                id_number: s.id_number || "",
                drivers_license_number: s.drivers_license_number || "",
                insurance_type: s.insurance_type || "",
                insurance_number: s.insurance_number || "",
                insurance_expiration: s.insurance_expiration ? new Date(s.insurance_expiration) : undefined,
                witness_name: s.witness_name || "",
                witness_contact_number: s.witness_contact_number || "",
                rider_id: rider.rider_id || "",
            });
        }
    }, [rider, form]);

    const updateMutation = useMutation({
        mutationFn: (values: z.infer<typeof RiderSecuritySchema>) => updateRiderSecurityAction(rider.rider_id, values),
        onSuccess: (data) => {
            if (data && data.success) {
                toast.success("Rider security updated successfully", { closeButton: true });
                setHideSubmitButton(true);
                onSaveSuccess?.();
            } else {
                toast.error(data?.error || "Failed to update rider security", { closeButton: true });
            }
        },
        onError: (error) => {
            toast.error("Failed to update rider security", { closeButton: true });
        },
    });

    useEffect(() => {
        if (setIsPending) setIsPending(updateMutation.isPending);
    }, [updateMutation.isPending, setIsPending]);

    const onSubmit = async (values: z.infer<typeof RiderSecuritySchema>) => {
        try {
            updateMutation.mutate(values);
        } catch (err) {
            toast.error("Something went wrong. Please try again.", { closeButton: true });
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
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 my-3 motion-preset-blur-right delay-100"
            >
                {/* Vehicle Information */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="vehicle"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Vehicle</FormLabel>
                                <FormControl>
                                    <Input disabled={updateMutation.isPending || hideSubmitButton}
                                           placeholder="e.g. Sonia MG-2301" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="vehicle_number"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Vehicle Number</FormLabel>
                                <FormControl>
                                    <Input disabled={updateMutation.isPending || hideSubmitButton}
                                           placeholder="e.g. ABC-1234" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Vehicle Color & ID Number */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="vehicle_color"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Vehicle Color</FormLabel>
                                <FormControl>
                                    <Input disabled={updateMutation.isPending || hideSubmitButton} placeholder="e.g. Red" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="id_number"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>ID Number</FormLabel>
                                <FormControl>
                                    <Input disabled={updateMutation.isPending || hideSubmitButton}
                                           placeholder="e.g. GH123456789" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Driver's License & Insurance Type */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="drivers_license_number"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Driver&#39;s License Number</FormLabel>
                                <FormControl>
                                    <Input disabled={updateMutation.isPending || hideSubmitButton}
                                           placeholder="e.g. DL123456789" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="insurance_type"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Insurance Type</FormLabel>
                                <FormControl>
                                    <Input disabled={updateMutation.isPending || hideSubmitButton}
                                           placeholder="e.g. Comprehensive" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Insurance Details */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="insurance_number"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Insurance Number</FormLabel>
                                <FormControl>
                                    <Input disabled={updateMutation.isPending || hideSubmitButton}
                                           placeholder="e.g. INS123456789" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="insurance_expiration"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Insurance Expiration Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                disabled={updateMutation.isPending || hideSubmitButton}
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
                                            disabled={(date) => date < new Date()}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>Your insurance expiration date.</FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Witness Info */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="witness_name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Witness Name</FormLabel>
                                <FormControl>
                                    <Input disabled={updateMutation.isPending || hideSubmitButton}
                                           placeholder="e.g. John Doe" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="relationship"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Relationship</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}
                                        disabled={updateMutation.isPending || hideSubmitButton}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select relationship"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {relationships.map((rel) => (
                                            <SelectItem key={rel.value} value={rel.value}>
                                                {rel.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="witness_contact_number"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Witness Contact Number</FormLabel>
                            <FormControl>
                                <Input disabled={updateMutation.isPending || hideSubmitButton}
                                       placeholder="e.g. 233248999999" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {!hideSubmitButton && (
                    <Button type="submit" disabled={updateMutation.isPending} className="w-full">
                        {updateMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                Updating...
                            </>
                        ) : (
                            "Update Rider"
                        )}
                    </Button>
                )}
            </form>
        </Form>
    );
});

UpdateRiderSecurityInformationForm.displayName = 'UpdateRiderSecurityInformationForm';

export default UpdateRiderSecurityInformationForm;
