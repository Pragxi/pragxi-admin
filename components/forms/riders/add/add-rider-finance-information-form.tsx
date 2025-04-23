"use client";
import {toast} from "sonner";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";

const formSchema = z.object({
    service_provider: z.string().min(1),
    mobile_money_number: z.string().min(1),
});

const relationships = [
    {label: "MTN", value: "mtn"},
    {label: "Telecel", value: "Telecel"},
    {label: "AirtelTigo", value: "AirtelTigo"},
];

const AddRiderFinanceInformationForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            service_provider: "mtn",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);
            toast(
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
                        name="service_provider"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Service Provider</FormLabel>
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
                    <FormField
                        control={form.control}
                        name="mobile_money_number"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Mobile Money Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. 233248999999" {...field} />
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

export default AddRiderFinanceInformationForm;