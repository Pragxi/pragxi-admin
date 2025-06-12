"use client";
import {toast} from "sonner";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {format} from "date-fns";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";
import {Calendar as CalendarIcon} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {createRiderSecurityInformation} from "@/app/actions/rider-security-actions";

const formSchema = z.object({
    vehicle: z.string().min(1, "Vehicle is required"),
    vehicle_number: z.string().min(1, "Vehicle number is required"),
    vehicle_color: z.string().min(1, "Vehicle color is required"),
    id_number: z.string().min(1, "ID number is required"),
    drivers_license_number: z.string().min(1, "Driver's license number is required"),
    insurance_type: z.string().min(1, "Insurance type is required"),
    insurance_number: z.string().min(1, "Insurance number is required"),
    insurance_expiration: z.coerce.date({
        required_error: "Insurance expiration date is required.",
        invalid_type_error: "Invalid date format for insurance expiration.",
    }).min(new Date(), "Expiration date must be in the future."),
    witness_name: z.string().min(1, "Witness name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    witness_contact_number: z.string().min(1, "Witness contact number is required"),
});

const relationships = [
    {label: "Parent", value: "parent"},
    {label: "Guardian", value: "guardian"},
    {label: "Sibling", value: "sibling"},
    {label: "Friend", value: "friend"},
];

const AddRiderSecurityInformationForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            relationship: "parent",
            vehicle: "",
            vehicle_number: "",
            vehicle_color: "",
            id_number: "",
            drivers_license_number: "",
            insurance_type: "",
            insurance_number: "",
            insurance_expiration: undefined,
            witness_name: "",
            witness_contact_number: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log("Submitting values:", values);
            const result = await createRiderSecurityInformation(values);

            if (result.success) {
                toast.success("Security information saved successfully");
                form.reset();
            } else if (result.error) {
                console.error("Server action error:", result.error);
                toast.error(result.error);
            }
        } catch (error) {
            console.error("Client-side form submission error:", error);
            toast.error("An unexpected error occurred. Please try again.");
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
                                <FormLabel>Insurance Expiration Date</FormLabel>
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
                                            disabled={(date) => date < new Date()}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                    Your insurance expiration date.
                                </FormDescription>
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

                <FormField
                    control={form.control}
                    name="witness_contact_number"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Witness Contact Number</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. 233248999999" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
};

export default AddRiderSecurityInformationForm;