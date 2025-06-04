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
import {Calendar as CalendarIcon} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {riderSecurityInformationSchema} from "@/types/rider";

const relationships = [
    {label: "Parent", value: "parent"},
    {label: "Guardian", value: "guardian"},
    {label: "Sibling", value: "sibling"},
    {label: "Friend", value: "friend"},
];

const AddRiderSecurityInformationForm = () => {
    const form = useForm<z.infer<typeof riderSecurityInformationSchema>>({
        resolver: zodResolver(riderSecurityInformationSchema),
        defaultValues: {
            insurance_expiration: new Date(),
        },
    });

    function onSubmit(values: z.infer<typeof riderSecurityInformationSchema>) {
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
                                    <Input placeholder="e.g. Sonia MG-2301" {...field} />
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
                                    <Input placeholder="e.g. ABC-1234" {...field} />
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
                                    <Input placeholder="e.g. Red" {...field} />
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
                                    <Input placeholder="e.g. GH123456789" {...field} />
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
                                    <Input placeholder="e.g. DL123456789" {...field} />
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
                                    <Input placeholder="e.g. Comprehensive" {...field} />
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
                                    <Input placeholder="e.g. INS123456789" {...field} />
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
                                    <Input placeholder="e.g. John Doe" {...field} />
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

                {/* Witness Contact */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="witness_contact_number"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Witness Contact Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. +233 24 123 4567" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
};

export default AddRiderSecurityInformationForm;