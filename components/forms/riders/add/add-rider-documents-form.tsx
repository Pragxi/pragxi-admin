"use client"
import {useState} from "react"
import {toast} from "sonner"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {CloudUpload, Paperclip} from "lucide-react"
import {FileInput, FileUploader, FileUploaderContent, FileUploaderItem} from "@/components/ui/file-upload"

const formSchema = z.object({
    id_card: z.string(),
    drivers_license: z.string(),
    insurance: z.string()
});

const AddRiderDocumentsForm = () => {

    const [idCardFiles, setIdCardFiles] = useState<File[] | null>(null);
    const [driversLicenseFiles, setDriversLicenseFiles] = useState<File[] | null>(null);
    const [insuranceFiles, setInsuranceFiles] = useState<File[] | null>(null);

    const dropZoneConfig = {
        maxFiles: 5,
        maxSize: 1024 * 1024 * 4,
        multiple: true,
    };
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

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
            <form onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 max-w-3xl my-3 motion-preset-blur-right delay-100">

                <FormField
                    control={form.control}
                    name="id_card"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>ID Card</FormLabel>
                            <FormControl>
                                <FileUploader
                                    value={idCardFiles}
                                    onValueChange={setIdCardFiles}
                                    dropzoneOptions={dropZoneConfig}
                                    className="relative bg-background rounded-lg p-2"
                                >
                                    <FileInput
                                        id="fileInput"
                                        className="outline-dashed outline-1 outline-slate-500"
                                    >
                                        <div className="flex items-center justify-center flex-col p-8 w-full ">
                                            <CloudUpload className='text-gray-500 w-10 h-10'/>
                                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click to upload</span>
                                                &nbsp; or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                SVG, PNG, JPG, PDF or GIF
                                            </p>

                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                you can add more than one document
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

                <FormField
                    control={form.control}
                    name="drivers_license"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Driver&#39;s License</FormLabel>
                            <FormControl>
                                <FileUploader
                                    value={driversLicenseFiles}
                                    onValueChange={setDriversLicenseFiles}
                                    dropzoneOptions={dropZoneConfig}
                                    className="relative bg-background rounded-lg p-2"
                                >
                                    <FileInput
                                        id="fileInput"
                                        className="outline-dashed outline-1 outline-slate-500"
                                    >
                                        <div className="flex items-center justify-center flex-col p-8 w-full ">
                                            <CloudUpload className='text-gray-500 w-10 h-10'/>
                                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click to upload</span>
                                                &nbsp; or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                SVG, PNG, JPG, PDF or GIF
                                            </p>

                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                you can add more than one document
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

                <FormField
                    control={form.control}
                    name="insurance"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Insurance</FormLabel>
                            <FormControl>
                                <FileUploader
                                    value={insuranceFiles}
                                    onValueChange={setInsuranceFiles}
                                    dropzoneOptions={dropZoneConfig}
                                    className="relative bg-background rounded-lg p-2"
                                >
                                    <FileInput
                                        id="fileInput"
                                        className="outline-dashed outline-1 outline-slate-500"
                                    >
                                        <div className="flex items-center justify-center flex-col p-8 w-full ">
                                            <CloudUpload className='text-gray-500 w-10 h-10'/>
                                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click to upload</span>
                                                &nbsp; or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                SVG, PNG, JPG, PDF or GIF
                                            </p>

                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                you can add more than one document
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
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default AddRiderDocumentsForm;