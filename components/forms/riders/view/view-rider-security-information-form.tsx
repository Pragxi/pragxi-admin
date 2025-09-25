"use client";
import {toast} from "sonner";
import {useEffect} from "react";
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
import {Calendar as CalendarIcon} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";

const formSchema = z.object({
    vehicle: z.string().min(1),
    vehicle_number: z.string().min(1),
    vehicle_color: z.string().min(1),
    id_number: z.string().min(1),
    drivers_license_number: z.string().min(1),
    insurance_type: z.string().min(1),
    insurance_number: z.string().min(1),
    insurance_expiration: z.coerce.date(),
    witness_name: z.string().min(1),
    relationship: z.string(),
    witness_contact_number: z.string().min(1),
});

const relationships = [
    {label: "Parent", value: "parent"},
    {label: "Guardian", value: "guardian"},
    {label: "Sibling", value: "sibling"},
    {label: "Friend", value: "friend"},
];

type SecurityData = {
    vehicle?: string | null;
    vehicle_number?: string | null;
    vehicle_color?: string | null;
    id_number?: string | null;
    drivers_license_number?: string | null;
    insurance_type?: string | null;
    insurance_number?: string | null;
    insurance_expiration_date?: string | null; // ISO date string (YYYY-MM-DD)
    witness_name?: string | null;
    relationship?: string | null; // witness_relationship
    witness_contact_number?: string | null;
};

type Props = {
    data?: SecurityData;
    editable?: boolean;
};

const ViewRiderSecurityInformationForm = ({ data, editable = false }: Props) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            insurance_expiration: new Date(),
        },
    });

    useEffect(() => {
        if (!data) return;
        form.reset({
            vehicle: data.vehicle ?? "",
            vehicle_number: data.vehicle_number ?? "",
            vehicle_color: data.vehicle_color ?? "",
            id_number: data.id_number ?? "",
            drivers_license_number: data.drivers_license_number ?? "",
            insurance_type: data.insurance_type ?? "",
            insurance_number: data.insurance_number ?? "",
            insurance_expiration: data.insurance_expiration_date ? new Date(data.insurance_expiration_date) : new Date(),
            witness_name: data.witness_name ?? "",
            relationship: data.relationship ?? relationships[0].value,
            witness_contact_number: data.witness_contact_number ?? "",
        });
    }, [data]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);
            toast.success(
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
            );
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

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
                                    <Input placeholder="e.g. Sonia MG-2301" {...field} disabled={!editable} />
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
                                    <Input placeholder="e.g. ABC-1234" {...field} disabled={!editable} />
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
                                    <Input placeholder="e.g. Red" {...field} disabled={!editable} />
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
                                    <Input placeholder="e.g. GH123456789" {...field} disabled={!editable} />
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
                                    <Input placeholder="e.g. DL123456789" {...field} disabled={!editable} />
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
                                    <Input placeholder="e.g. Comprehensive" {...field} disabled={!editable} />
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
                                    <Input placeholder="e.g. INS123456789" {...field} disabled={!editable} />
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
                                <FormLabel>Insurance Expiration</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            disabled={!editable}
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

                {/* Witness Information */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="witness_name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Witness Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. John Doe" {...field} disabled={!editable} />
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full" disabled={!editable}>
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

                {/* Witness Contact */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="witness_contact_number"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Witness Contact Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. +233 24 123 4567" {...field} disabled={!editable} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={!editable}>Submit</Button>
            </form>
        </Form>
    );
};

export default ViewRiderSecurityInformationForm;