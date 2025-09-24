"use client";
import {toast} from "sonner";
import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {format} from "date-fns";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";
import {Calendar as CalendarIcon, Check, ChevronsUpDown} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

const formSchema = z.object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    phone_number: z.string().min(1),
    email: z.string().email(),
    date_of_birth: z.coerce.date(),
    marital_status: z.string(),
    gender: z.string(),
    nationality: z.string(),
    city: z.string().min(1),
    gps_address: z.string().min(1),
});

const countries = [
    {label: "Ghana", value: "ghana"},
    {label: "Nigeria", value: "nigeria"},
    {label: "Kenya", value: "kenya"},
    {label: "South Africa", value: "south-africa"},
    // Add more countries as needed
];

type PersonalData = {
    first_name?: string | null;
    last_name?: string | null;
    phone_number?: string | null;
    email?: string | null;
    dob?: string | null; // ISO string from Supabase
    marital_status?: string | null;
    gender?: string | null;
    nationality?: string | null;
    city?: string | null;
    gps_address?: string | null;
};

type Props = {
    data?: PersonalData;
    editable?: boolean;
};

const ViewRiderPersonalInformationForm = ({ data, editable = false }: Props) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date_of_birth: new Date(),
            nationality: "ghana",
            gender: "male",
            marital_status: "single",
        },
    });

    useEffect(() => {
        if (!data) return;
        form.reset({
            first_name: data.first_name ?? "",
            last_name: data.last_name ?? "",
            phone_number: data.phone_number ?? "",
            email: data.email ?? "",
            date_of_birth: data.dob ? new Date(data.dob) : new Date(),
            marital_status: data.marital_status ?? "single",
            gender: data.gender ?? "male",
            nationality: (data.nationality?.toLowerCase() as any) ?? "ghana",
            city: data.city ?? "",
            gps_address: data.gps_address ?? "",
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
                                            placeholder="eg. John"
                                            type="text"
                                            className="w-full"
                                            {...field}
                                            disabled={!editable}
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
                                            placeholder="eg. Doe"
                                            type="text"
                                            className="w-full"
                                            {...field}
                                            disabled={!editable}
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
                                            placeholder="eg. 0244567885"
                                            type="text"
                                            className="w-full"
                                            {...field}
                                            disabled={!editable}
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
                                            placeholder="eg. johndoe@email.com"
                                            type="email"
                                            className="w-full"
                                            {...field}
                                            disabled={!editable}
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
                            name="date_of_birth"
                            render={({field}) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date of birth</FormLabel>
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
                    <div>
                        <FormField
                            control={form.control}
                            name="marital_status"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Marital Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full" disabled={!editable}>
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
                                            <SelectTrigger className="w-full" disabled={!editable}>
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
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    disabled={!editable}
                                                >
                                                    {field.value
                                                        ? countries.find(
                                                            (country) => country.value === field.value
                                                        )?.label
                                                        : "Select country"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Search country..."/>
                                                <CommandList>
                                                    <CommandEmpty>No country found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {countries.map((country) => (
                                                            <CommandItem
                                                                key={country.value}
                                                                value={country.label}
                                                                onSelect={() => {
                                                                    form.setValue("nationality", country.value);
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
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* City/Town & GPS Address */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <FormField
                            control={form.control}
                            name="city"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>City/Town</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="eg. Mpraeso"
                                            type="text"
                                            className="w-full"
                                            {...field}
                                            disabled={!editable}
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
                                            placeholder="GW-178-937"
                                            type="text"
                                            className="w-full"
                                            {...field}
                                            disabled={!editable}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Button type="submit" disabled={!editable}>Submit</Button>
            </form>
        </Form>
    );
};

export default ViewRiderPersonalInformationForm;
