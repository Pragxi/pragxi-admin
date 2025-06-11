"use client";
import {useState} from "react";
import {toast} from "sonner";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {FileInput, FileUploader, FileUploaderContent, FileUploaderItem,} from "@/components/ui/file-upload";
import {CloudUpload, Paperclip} from "lucide-react";
import {createRiderDocuments} from "@/app/actions/rider-document-actions";

// Updated Zod schema to handle File objects and null values
const formSchema = z.object({
    id_card: z.array(z.instanceof(File)).nonempty("At least one ID card file is required"),
    profile_picture: z.array(z.instanceof(File)).length(1, "Exactly one profile picture is required"),
    drivers_license: z.array(z.instanceof(File)).nonempty("At least one driver's license file is required"),
    insurance: z.array(z.instanceof(File)).nonempty("At least one insurance file is required"),
});

const AddRiderDocumentsForm = () => {
    const [idCardFiles, setIdCardFiles] = useState<File[]>([]);
    const [driversLicenseFiles, setDriversLicenseFiles] = useState<File[]>([]);
    const [insuranceFiles, setInsuranceFiles] = useState<File[]>([]);
    const [profilePicture, setProfilePicture] = useState<File[] | null>(null);

    const dropZoneConfig = {
        maxFiles: 5,
        maxSize: 5 * 1024 * 1024, // 5MB
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg'],
            'application/pdf': ['.pdf'],
        },
    };

    const profileDropZoneConfig = {
        maxFiles: 1,
        maxSize: 1024 * 1024 * 4, // 4MB
        multiple: false,
    };

    // Initialize form with Zod resolver
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id_card: [],
            profile_picture: [],
            drivers_license: [],
            insurance: [],
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const formData = new FormData();
            values.id_card.forEach(file => formData.append('id_card', file));
            values.drivers_license.forEach(file => formData.append('drivers_license', file));
            values.insurance.forEach(file => formData.append('insurance', file));

            const result = await createRiderDocuments(formData);

            if (result.success) {
                toast.success("Documents uploaded successfully");
                form.reset();
                setIdCardFiles([]);
                setDriversLicenseFiles([]);
                setInsuranceFiles([]);
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
                    {/* Profile Picture Field */}
                    <FormField
                        control={form.control}
                        name="profile_picture"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Profile Picture</FormLabel>
                                <FormControl>
                                    <FileUploader
                                        value={profilePicture}
                                        onValueChange={(files) => {
                                            setProfilePicture(files);
                                            field.onChange(files); // Update react-hook-form state
                                        }}
                                        dropzoneOptions={profileDropZoneConfig}
                                        className="relative bg-background rounded-lg p-2"
                                    >
                                        <FileInput
                                            id="fileInput"
                                            className="outline-dashed outline-1 outline-slate-500 hover:outline-primary transition-all duration-300"
                                        >
                                            <div className="flex items-center justify-center flex-col p-8 w-full ">
                                                <CloudUpload className="text-gray-500 w-10 h-10"/>
                                                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-semibold">Click to upload</span> &nbsp; or
                                                    drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG</p>
                                            </div>
                                        </FileInput>
                                        <FileUploaderContent>
                                            {profilePicture &&
                                                profilePicture.length > 0 &&
                                                profilePicture.map((file, i) => (
                                                    <FileUploaderItem key={i} index={i}>
                                                        <Paperclip className="h-4 w-4 stroke-current"/>
                                                        <span>{file.name}</span>
                                                    </FileUploaderItem>
                                                ))}
                                        </FileUploaderContent>
                                    </FileUploader>
                                </FormControl>
                                <FormDescription>Select a file to upload.</FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {/* ID Card Field */}
                    <FormField
                        control={form.control}
                        name="id_card"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>ID Card</FormLabel>
                                <FormControl>
                                    <FileUploader
                                        value={idCardFiles}
                                        onValueChange={(files) => {
                                            setIdCardFiles(files);
                                            field.onChange(files); // Update react-hook-form state
                                        }}
                                        dropzoneOptions={dropZoneConfig}
                                        className="relative bg-background rounded-lg p-2"
                                    >
                                        <FileInput
                                            id="fileInput"
                                            className="outline-dashed outline-1 outline-slate-500 hover:outline-primary transition-all duration-300"
                                        >
                                            <div className="flex items-center justify-center flex-col p-8 w-full ">
                                                <CloudUpload className="text-gray-500 w-10 h-10"/>
                                                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-semibold">Click to upload</span> &nbsp; or
                                                    drag and drop
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
                                                    <FileUploaderItem key={i} index={i}>
                                                        <Paperclip className="h-4 w-4 stroke-current"/>
                                                        <span>{file.name}</span>
                                                    </FileUploaderItem>
                                                ))}
                                        </FileUploaderContent>
                                    </FileUploader>
                                </FormControl>
                                <FormDescription>Select a file to upload.</FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Driver's License Field */}
                    <FormField
                        control={form.control}
                        name="drivers_license"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Driver&#39;s License</FormLabel>
                                <FormControl>
                                    <FileUploader
                                        value={driversLicenseFiles}
                                        onValueChange={(files) => {
                                            setDriversLicenseFiles(files);
                                            field.onChange(files); // Update react-hook-form state
                                        }}
                                        dropzoneOptions={dropZoneConfig}
                                        className="relative bg-background rounded-lg p-2"
                                    >
                                        <FileInput
                                            id="fileInput"
                                            className="outline-dashed outline-1 outline-slate-500 hover:outline-primary transition-all duration-300"
                                        >
                                            <div className="flex items-center justify-center flex-col p-8 w-full ">
                                                <CloudUpload className="text-gray-500 w-10 h-10"/>
                                                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-semibold">Click to upload</span> &nbsp; or
                                                    drag and drop
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
                                                    <FileUploaderItem key={i} index={i}>
                                                        <Paperclip className="h-4 w-4 stroke-current"/>
                                                        <span>{file.name}</span>
                                                    </FileUploaderItem>
                                                ))}
                                        </FileUploaderContent>
                                    </FileUploader>
                                </FormControl>
                                <FormDescription>Select a file to upload.</FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {/* Insurance Field */}
                    <FormField
                        control={form.control}
                        name="insurance"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Insurance</FormLabel>
                                <FormControl>
                                    <FileUploader
                                        value={insuranceFiles}
                                        onValueChange={(files) => {
                                            setInsuranceFiles(files);
                                            field.onChange(files); // Update react-hook-form state
                                        }}
                                        dropzoneOptions={dropZoneConfig}
                                        className="relative bg-background rounded-lg p-2"
                                    >
                                        <FileInput
                                            id="fileInput"
                                            className="outline-dashed outline-1 outline-slate-500 hover:outline-primary transition-all duration-300"
                                        >
                                            <div className="flex items-center justify-center flex-col p-8 w-full ">
                                                <CloudUpload className="text-gray-500 w-10 h-10"/>
                                                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-semibold">Click to upload</span> &nbsp; or
                                                    drag and drop
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
                                                    <FileUploaderItem key={i} index={i}>
                                                        <Paperclip className="h-4 w-4 stroke-current"/>
                                                        <span>{file.name}</span>
                                                    </FileUploaderItem>
                                                ))}
                                        </FileUploaderContent>
                                    </FileUploader>
                                </FormControl>
                                <FormDescription>Select a file to upload.</FormDescription>
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

export default AddRiderDocumentsForm;