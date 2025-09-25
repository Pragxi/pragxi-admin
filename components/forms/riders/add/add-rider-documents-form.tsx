"use client";
import {useState} from "react";
import {toast} from "sonner";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";
import * as z from "zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {FileInput, FileUploader, FileUploaderContent, FileUploaderItem} from "@/components/ui/file-upload";
import {CloudUpload, Loader2, Paperclip} from "lucide-react";
import {createRiderDocuments} from "@/app/(server-actions)/(riders-actions)/rider-document.actions";
import {RiderDocumentSchema} from "@/types/rider";

interface AddRiderDocumentsFormProps {
    onSaveSuccess?: () => void;
}

const AddRiderDocumentsForm: React.FC<AddRiderDocumentsFormProps> = ({ onSaveSuccess }) => {
    const [hideSubmitButton, setHideSubmitButton] = useState(false);
    const [idCardFiles, setIdCardFiles] = useState<File[]>([]);
    const [driversLicenseFiles, setDriversLicenseFiles] = useState<File[]>([]);
    const [insuranceFiles, setInsuranceFiles] = useState<File[]>([]);
    const [profilePicture, setProfilePicture] = useState<File[] | null>(null);

    const dropZoneConfig = {
        maxFiles: 5,
        maxSize: 4 * 1024 * 1024,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg'],
            'application/pdf': ['.pdf'],
            'image/svg+xml': ['.svg'],
            'image/gif': ['.gif'],
        },
    };

    const profileDropZoneConfig = {
        maxFiles: 1,
        maxSize: 1024 * 1024 * 4,
        multiple: false,
    };

    const form = useForm<z.infer<typeof RiderDocumentSchema>>({
        resolver: zodResolver(RiderDocumentSchema),
        defaultValues: {
            id_card: [],
            profile_picture: [],
            drivers_license: [],
            insurance: [],
            rider_id: localStorage.getItem("added-rider-id") || "",
        },
    });

    const {mutate, isPending} = useMutation({
        mutationFn: async (values: z.infer<typeof RiderDocumentSchema>) => {
            const formData = new FormData();
            values.profile_picture?.forEach(file => formData.append("profile_picture", file));
            values.id_card.forEach(file => formData.append("id_card", file));
            values.drivers_license.forEach(file => formData.append("drivers_license", file));
            values.insurance.forEach(file => formData.append("insurance", file));
            formData.append("rider_id", values.rider_id);

            return await createRiderDocuments(formData);
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success("Documents uploaded successfully");
                setHideSubmitButton(true);
                form.reset();
                setIdCardFiles([]);
                setDriversLicenseFiles([]);
                setInsuranceFiles([]);
                setProfilePicture([]);
                onSaveSuccess?.();
            } else if (data.error) {
                toast.error(data.error);
            }
        },
        onError: () => {
            toast.error("An unexpected error occurred. Please try again.");
        }
    });

    const onSubmit = (values: z.infer<typeof RiderDocumentSchema>) => {
        values.rider_id = localStorage.getItem("added-rider-id") || "";
        mutate(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 my-3 motion-preset-blur-right delay-100">
                <div className="grid grid-cols-2 gap-4">
                    {/* Profile Picture */}
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
                                            field.onChange(files);
                                        }}
                                        dropzoneOptions={profileDropZoneConfig}
                                        className="relative bg-background rounded-lg p-2"
                                    >
                                        <FileInput
                                            className="outline-dashed outline-1 outline-slate-500 hover:outline-primary transition-all duration-300">
                                            <div className="flex items-center justify-center flex-col p-8 w-full ">
                                                <CloudUpload className="text-gray-500 w-10 h-10"/>
                                                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-semibold">Click to upload</span> or drag and
                                                    drop
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG</p>
                                            </div>
                                        </FileInput>
                                        <FileUploaderContent>
                                            {profilePicture?.map((file, i) => (
                                                <FileUploaderItem key={i}>
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

                    {/* ID Card */}
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
                                            setIdCardFiles(files!);
                                            field.onChange(files);
                                        }}
                                        dropzoneOptions={dropZoneConfig}
                                        className="relative bg-background rounded-lg p-2"
                                    >
                                        <FileInput
                                            className="outline-dashed outline-1 outline-slate-500 hover:outline-primary transition-all duration-300">
                                            <div className="flex items-center justify-center flex-col p-8 w-full ">
                                                <CloudUpload className="text-gray-500 w-10 h-10"/>
                                                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-semibold">Click to upload</span> or drag and
                                                    drop
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG,
                                                    PDF or GIF</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">You can add more
                                                    than one document</p>
                                            </div>
                                        </FileInput>
                                        <FileUploaderContent>
                                            {idCardFiles.map((file, i) => (
                                                <FileUploaderItem key={i}>
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
                    {/* Driver's License */}
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
                                            setDriversLicenseFiles(files!);
                                            field.onChange(files);
                                        }}
                                        dropzoneOptions={dropZoneConfig}
                                        className="relative bg-background rounded-lg p-2"
                                    >
                                        <FileInput
                                            className="outline-dashed outline-1 outline-slate-500 hover:outline-primary transition-all duration-300">
                                            <div className="flex items-center justify-center flex-col p-8 w-full ">
                                                <CloudUpload className="text-gray-500 w-10 h-10"/>
                                                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-semibold">Click to upload</span> or drag and
                                                    drop
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG,
                                                    PDF or GIF</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">You can add more
                                                    than one document</p>
                                            </div>
                                        </FileInput>
                                        <FileUploaderContent>
                                            {driversLicenseFiles.map((file, i) => (
                                                <FileUploaderItem key={i}>
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

                    {/* Insurance */}
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
                                            setInsuranceFiles(files!);
                                            field.onChange(files);
                                        }}
                                        dropzoneOptions={dropZoneConfig}
                                        className="relative bg-background rounded-lg p-2"
                                    >
                                        <FileInput
                                            className="outline-dashed outline-1 outline-slate-500 hover:outline-primary transition-all duration-300">
                                            <div className="flex items-center justify-center flex-col p-8 w-full ">
                                                <CloudUpload className="text-gray-500 w-10 h-10"/>
                                                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-semibold">Click to upload</span> or drag and
                                                    drop
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG,
                                                    PDF or GIF</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">You can add more
                                                    than one document</p>
                                            </div>
                                        </FileInput>
                                        <FileUploaderContent>
                                            {insuranceFiles.map((file, i) => (
                                                <FileUploaderItem key={i}>
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

                {!hideSubmitButton && (
                    <Button type="submit" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                Submitting...
                            </>
                        ) : (
                            "Submit"
                        )}
                    </Button>
                )}
            </form>
        </Form>
    );
};

export default AddRiderDocumentsForm;
