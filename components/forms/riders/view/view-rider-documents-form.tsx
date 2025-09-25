"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    FileInput,
    FileUploader,
    FileUploaderContent,
    FileUploaderItem,
} from "@/components/ui/file-upload";
import { CloudUpload, Paperclip } from "lucide-react";

// Updated Zod schema to handle File objects
const formSchema = z.object({
    id_card: z.array(z.instanceof(File)).nonempty("At least one ID card file is required"),
    drivers_license: z.array(z.instanceof(File)).nonempty("At least one driver's license file is required"),
    insurance: z.array(z.instanceof(File)).nonempty("At least one insurance file is required"),
});

type Props = {
    editable?: boolean;
};

const ViewRiderDocumentsForm = ({ editable = false }: Props) => {
    const [idCardFiles, setIdCardFiles] = useState<File[] | null>(null);
    const [driversLicenseFiles, setDriversLicenseFiles] = useState<File[] | null>(null);
    const [insuranceFiles, setInsuranceFiles] = useState<File[] | null>(null);

    const dropZoneConfig = {
        maxFiles: 5,
        maxSize: 1024 * 1024 * 4, // 4MB
        multiple: true,
    };

    // Initialize form with Zod resolver
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id_card: [],
            drivers_license: [],
            insurance: [],
        },
    });

    // Handle form submission
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
                {/* ID Card Field */}
                <FormField
                    control={form.control}
                    name="id_card"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>ID Card</FormLabel>
                            <FormControl>
                                <FileUploader
                                    value={idCardFiles}
                                    onValueChange={(files) => {
                                        if (!editable) return;
                                        setIdCardFiles(files);
                                        field.onChange(files); // Update react-hook-form state
                                    }}
                                    dropzoneOptions={dropZoneConfig}
                                    className={`relative bg-background rounded-lg p-2 ${!editable ? 'pointer-events-none opacity-60' : ''}`}
                                >
                                    <FileInput
                                        id="fileInput"
                                        className="outline-dashed outline-1 outline-slate-500 hover:outline-primary transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-center flex-col p-8 w-full ">
                                            <CloudUpload className="text-gray-500 w-10 h-10" />
                                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click to upload</span> &nbsp; or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                SVG, PNG, JPG, PDF or GIF
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                You can add more than one document
                                            </p>
                                        </div>
                                    </FileInput>
                                    <FileUploaderContent>
                                        {idCardFiles &&
                                            idCardFiles.length > 0 &&
                                            idCardFiles.map((file, i) => (
                                                <FileUploaderItem key={i}>
                                                    <Paperclip className="h-4 w-4 stroke-current" />
                                                    <span>{file.name}</span>
                                                </FileUploaderItem>
                                            ))}
                                    </FileUploaderContent>
                                </FileUploader>
                            </FormControl>
                            <FormDescription>Select a file to upload.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Driver's license Field */}
                <FormField
                    control={form.control}
                    name="drivers_license"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Driver&#39;s License</FormLabel>
                            <FormControl>
                                <FileUploader
                                    value={driversLicenseFiles}
                                    onValueChange={(files) => {
                                        if (!editable) return;
                                        setDriversLicenseFiles(files);
                                        field.onChange(files); // Update react-hook-form state
                                    }}
                                    dropzoneOptions={dropZoneConfig}
                                    className={`relative bg-background rounded-lg p-2 ${!editable ? 'pointer-events-none opacity-60' : ''}`}
                                >
                                    <FileInput
                                        id="fileInput"
                                        className="outline-dashed outline-1 outline-slate-500 hover:outline-primary transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-center flex-col p-8 w-full ">
                                            <CloudUpload className="text-gray-500 w-10 h-10" />
                                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click to upload</span> &nbsp; or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                SVG, PNG, JPG, PDF or GIF
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                You can add more than one document
                                            </p>
                                        </div>
                                    </FileInput>
                                    <FileUploaderContent>
                                        {driversLicenseFiles &&
                                            driversLicenseFiles.length > 0 &&
                                            driversLicenseFiles.map((file, i) => (
                                                <FileUploaderItem key={i}>
                                                    <Paperclip className="h-4 w-4 stroke-current" />
                                                    <span>{file.name}</span>
                                                </FileUploaderItem>
                                            ))}
                                    </FileUploaderContent>
                                </FileUploader>
                            </FormControl>
                            <FormDescription>Select a file to upload.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Insurance Field */}
                <FormField
                    control={form.control}
                    name="insurance"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Insurance</FormLabel>
                            <FormControl>
                                <FileUploader
                                    value={insuranceFiles}
                                    onValueChange={(files) => {
                                        if (!editable) return;
                                        setInsuranceFiles(files);
                                        field.onChange(files); // Update react-hook-form state
                                    }}
                                    dropzoneOptions={dropZoneConfig}
                                    className={`relative bg-background rounded-lg p-2 ${!editable ? 'pointer-events-none opacity-60' : ''}`}
                                >
                                    <FileInput
                                        id="fileInput"
                                        className="outline-dashed outline-1 outline-slate-500 hover:outline-primary transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-center flex-col p-8 w-full ">
                                            <CloudUpload className="text-gray-500 w-10 h-10" />
                                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click to upload</span> &nbsp; or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                SVG, PNG, JPG, PDF or GIF
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                You can add more than one document
                                            </p>
                                        </div>
                                    </FileInput>
                                    <FileUploaderContent>
                                        {insuranceFiles &&
                                            insuranceFiles.length > 0 &&
                                            insuranceFiles.map((file, i) => (
                                                <FileUploaderItem key={i}>
                                                    <Paperclip className="h-4 w-4 stroke-current" />
                                                    <span>{file.name}</span>
                                                </FileUploaderItem>
                                            ))}
                                    </FileUploaderContent>
                                </FileUploader>
                            </FormControl>
                            <FormDescription>Select a file to upload.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={!editable}>Submit</Button>
            </form>
        </Form>
    );
};

export default ViewRiderDocumentsForm;