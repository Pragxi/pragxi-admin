"use client";
import {useState, useEffect} from "react";
import {toast} from "sonner";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";
import * as z from "zod";

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Loader2} from "lucide-react";

import {createRiderFinanceInformation} from "@/app/(server-actions)/(riders-actions)/rider-finance.actions";
import {RiderFinanceSchema} from "@/types/rider";
import {updateRiderFinanceAction} from "@/app/(server-actions)/(riders-actions)/update-rider-finance.action";

const serviceProviders = [
    {label: "MTN", value: "mtn"},
    {label: "Telecel", value: "telecel"},
    {label: "AirtelTigo", value: "airteltigo"},
];

interface UpdateRiderFinanceInformationFormProps {
    rider: any;
    onSaveSuccess?: () => void;
}

const UpdateRiderFinanceInformationForm: React.FC<UpdateRiderFinanceInformationFormProps> = ({ rider, onSaveSuccess }) => {
    const [hideSubmitButton, setHideSubmitButton] = useState(false);

    const form = useForm<z.infer<typeof RiderFinanceSchema>>({
        resolver: zodResolver(RiderFinanceSchema),
        defaultValues: {
            service_provider: rider?.finance?.service_provider || "mtn",
            mobile_money_number: rider?.finance?.mobile_money_number || "",
            rider_id: rider?.rider_id || "",
        },
    });

    useEffect(() => {
        if (rider) {
            const f = rider.finance || {};
            form.reset({
                service_provider: f.service_provider || "mtn",
                mobile_money_number: f.mobile_money_number || "",
                rider_id: rider.rider_id || "",
            });
        }
    }, [rider, form]);

    const { mutate, isPending } = useMutation({
        mutationFn: async (values: z.infer<typeof RiderFinanceSchema>) => {
            return await updateRiderFinanceAction(rider.rider_id, values);
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success("Financial information updated successfully");
                setHideSubmitButton(true);
                if (onSaveSuccess) onSaveSuccess();
            } else if (data.error) {
                toast.error(data.error);
            }
        },
        onError: () => {
            toast.error("An unexpected error occurred. Please try again.");
        },
    });

    const onSubmit = (values: z.infer<typeof RiderFinanceSchema>) => {
        mutate(values);
    };

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
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Service Provider</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={isPending || hideSubmitButton}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select service provider"/>
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
                                    <Input
                                        placeholder="e.g. 233248999999"
                                        {...field}
                                        disabled={isPending || hideSubmitButton}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                {!hideSubmitButton && (
                    <Button type="submit" disabled={isPending}>
                        {isPending ? (
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
};

export default UpdateRiderFinanceInformationForm;
