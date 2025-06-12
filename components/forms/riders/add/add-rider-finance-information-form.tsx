"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createRiderFinanceInformation } from "@/app/actions/rider-finance-actions"; // Import the server action

const formSchema = z.object({
    service_provider: z.string().min(1, "Service provider is required"),
    mobile_money_number: z.string().min(1, "Mobile money number is required")
        .regex(/^\d+$/, "Must contain only numbers"),
});

const serviceProviders = [
    { label: "MTN", value: "mtn" },
    { label: "Telecel", value: "telecel" },
    { label: "AirtelTigo", value: "airteltigo" },
];

const AddRiderFinanceInformationForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            service_provider: "mtn",
            mobile_money_number: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const result = await createRiderFinanceInformation(values);

            if (result.success) {
                toast.success("Financial information saved successfully");
                form.reset(); // Optionally reset the form on success
            } else if (result.error) {
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
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="service_provider"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Service Provider</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select service provider" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {serviceProviders.map((provider) => (
                                            <SelectItem key={provider.value} value={provider.value}>
                                                {provider.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="mobile_money_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mobile Money Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. 233248999999" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
};

export default AddRiderFinanceInformationForm;