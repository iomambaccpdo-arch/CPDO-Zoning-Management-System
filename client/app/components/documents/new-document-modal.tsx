"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, UploadCloud, MapPin, CheckCircle2 } from "lucide-react"

import { Button } from "~/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Calendar } from "~/components/ui/calendar"
import { Stepper } from "~/components/ui/stepper"
import { cn } from "~/lib/utils"

const steps = [
    { title: "Document", description: "Basic Info" },
    { title: "Personnel", description: "Applicant Details" },
    { title: "Location", description: "Site Details" },
    { title: "Property", description: "Measurements" },
    { title: "Attachments", description: "Upload Files" },
]

const formSchema = z.object({
    // Step 1
    documentTitle: z.string().min(1, { message: "Document Title is required" }),
    zoning: z.string().min(1, { message: "Zoning is required" }),
    zoningApplicationNo: z.string().min(1, { message: "Application No is required" }),
    typeOfProject: z.string().min(1, { message: "Type of Project is required" }),
    dateOfApplication: z.date({ message: "A date of application is required." }),
    dueDate: z.string().optional(),

    // Step 2
    applicantName: z.string().min(1, { message: "Applicant Name is required" }),
    receivedBy: z.string().min(1, { message: "Received By is required" }),
    assistedBy: z.string().optional(),
    routedTo: z.string().min(1, { message: "Routed to is required" }),
    oic: z.string().min(1, { message: "OIC is required" }),

    // Step 3
    barangay: z.string().min(1, { message: "Barangay is required" }),
    purok: z.string().min(1, { message: "Purok is required" }),
    landmark: z.string().min(1, { message: "Landmark is required" }),
    coordinates: z.string().min(1, { message: "Coordinates are required" }),

    // Step 4
    floorArea: z.string().min(1, { message: "Floor Area is required" }),
    lotArea: z.string().min(1, { message: "Lot Area is required" }),
    storey: z.string().min(1, { message: "Storey is required" }),
    mezanine: z.string().optional(),

    // Step 5
    files: z.any().optional(),
})

interface NewDocumentModalProps {
    children?: React.ReactNode
}

export function NewDocumentModal({ children }: NewDocumentModalProps) {
    const [open, setOpen] = React.useState(false)
    const [activeStep, setActiveStep] = React.useState(0)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            documentTitle: "",
            zoning: "",
            zoningApplicationNo: "",
            typeOfProject: "",
            applicantName: "",
            receivedBy: "",
            assistedBy: "",
            routedTo: "",
            oic: "",
            barangay: "",
            purok: "",
            landmark: "",
            coordinates: "",
            floorArea: "",
            lotArea: "",
            storey: "",
            mezanine: "",
            dueDate: "March 13, 2026", // Mock calculated date
        },
    })

    // Ensure due date calculates (mocked here)
    React.useEffect(() => {
        if (form.watch("dateOfApplication")) {
            // Mock logic: +12 working days
            form.setValue("dueDate", "March 13, 2026")
        }
    }, [form.watch("dateOfApplication")])

    const nextStep = async () => {
        let fieldsToValidate: any[] = []

        if (activeStep === 0) {
            fieldsToValidate = ['documentTitle', 'zoning', 'zoningApplicationNo', 'typeOfProject', 'dateOfApplication']
        } else if (activeStep === 1) {
            fieldsToValidate = ['applicantName', 'receivedBy', 'routedTo', 'oic']
        } else if (activeStep === 2) {
            fieldsToValidate = ['barangay', 'purok', 'landmark', 'coordinates']
        } else if (activeStep === 3) {
            fieldsToValidate = ['floorArea', 'lotArea', 'storey']
        }

        const isValid = await form.trigger(fieldsToValidate)
        if (isValid) {
            setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))
        }
    }

    const prevStep = () => {
        setActiveStep((prev) => Math.max(prev - 1, 0))
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        // Handle submission logic
        setOpen(false)
        form.reset()
        setActiveStep(0)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] w-[95vw] sm:w-full max-h-[90dvh] flex flex-col p-0 gap-0">
                <div className="p-6 pb-2">
                    <DialogHeader>
                        <DialogTitle>New Document</DialogTitle>
                        <DialogDescription>
                            Fill out the form below to register a new document in the CPDO Zoning System.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="h-auto min-h-[5rem] py-2 border-b px-6 bg-background relative z-10">
                    <Stepper activeStep={activeStep} steps={steps} />
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar min-h-0">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            {/* STEP 1: Document Information */}
                            <div className={cn("flex flex-col gap-6", activeStep === 0 ? "flex" : "hidden")}>
                                <FormField
                                    control={form.control}
                                    name="documentTitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Document Title *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Document Title" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="locational-clearance">Locational Clearance</SelectItem>
                                                    <SelectItem value="zoning-certification">Zoning Certification</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="zoning"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Zoning *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Zoning" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="residential">Residential</SelectItem>
                                                    <SelectItem value="commercial">Commercial</SelectItem>
                                                    <SelectItem value="industrial">Industrial</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="zoningApplicationNo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Zoning Application No. *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter application number" className="bg-blue-50/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dateOfApplication"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date of Application *</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal bg-blue-50/50",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "MMMM d, yyyy")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="typeOfProject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type of Project *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full bg-gray-50/50">
                                                        <SelectValue placeholder="Select Type of Project" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="new">New</SelectItem>
                                                    <SelectItem value="renewal">Renewal</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dueDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Due Date (Auto 12 Working Days excl. PH Holidays) *</FormLabel>
                                            <FormControl>
                                                <Input readOnly className="bg-blue-50/50 font-medium" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* STEP 2: Personnel & Applicant */}
                            <div className={cn("flex flex-col gap-6", activeStep === 1 ? "flex" : "hidden")}>
                                <FormField
                                    control={form.control}
                                    name="applicantName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name of Applicant *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter applicant name" className="bg-green-50/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="receivedBy"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Received By *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Received by" className="bg-gray-50/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="assistedBy"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Assisted By</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Assisted by" className="bg-gray-50/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="routedTo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Routed to *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Search by name or email..." className="border-red-300 bg-gray-50/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="oic"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>OIC *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full bg-gray-50/50">
                                                        <SelectValue placeholder="Select OIC" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="oic-1">Juan Dela Cruz</SelectItem>
                                                    <SelectItem value="oic-2">Maria Clara</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* STEP 3: Location Details */}
                            <div className={cn("flex flex-col gap-6", activeStep === 2 ? "flex" : "hidden")}>
                                <FormField
                                    control={form.control}
                                    name="barangay"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Barangay *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full bg-gray-50/50">
                                                        <SelectValue placeholder="Select Barangay" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="brgy-1">Barangay 1</SelectItem>
                                                    <SelectItem value="brgy-2">Barangay 2</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="purok"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Purok *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full bg-gray-50/50">
                                                        <SelectValue placeholder="Select Purok" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="purok-1">Purok 1</SelectItem>
                                                    <SelectItem value="purok-2">Purok 2</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="landmark"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Landmark *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter landmark" className="bg-green-50/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="coordinates"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Geographic Coordinates *</FormLabel>
                                            <div className="flex gap-2">
                                                <FormControl>
                                                    <Input placeholder="Click to select coordinates" className="bg-blue-50/50 flex-1" {...field} />
                                                </FormControl>
                                                <Button type="button" variant="outline" size="icon" className="shrink-0 text-red-500">
                                                    <MapPin className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* STEP 4: Property Details */}
                            <div className={cn("flex flex-col gap-6", activeStep === 3 ? "flex" : "hidden")}>
                                <FormField
                                    control={form.control}
                                    name="floorArea"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Floor Area (square meter) *</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="0" className="bg-green-50/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lotArea"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Lot Area (square meter) *</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="0" className="bg-green-50/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="storey"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Storey (Number of Floors) *</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="0" className="bg-green-50/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="mezanine"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mezanine *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter mezanine details" className="bg-green-50/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* STEP 5: Attachments */}
                            <div className={cn("flex flex-col gap-6", activeStep === 4 ? "flex" : "hidden")}>
                                <FormField
                                    control={form.control}
                                    name="files"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="sr-only">Upload Files</FormLabel>
                                            <FormControl>
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                                    <UploadCloud className="h-10 w-10 text-gray-400 mb-4" />
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Button type="button" className="bg-green-600 hover:bg-green-700 text-white">
                                                            <UploadCloud className="mr-2 h-4 w-4" />
                                                            Upload files
                                                        </Button>
                                                        <span className="text-sm text-gray-500">No file attached. Upload one or more files.</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        Supported files: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                                                    </p>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="bg-blue-50/50 p-4 rounded-lg flex items-start gap-3 mt-6">
                                    <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-sm text-blue-900">Review your submission</h4>
                                        <p className="text-sm text-blue-700 mt-1">
                                            Please ensure all information provided across the steps is accurate before submitting the application.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </form>
                    </Form>
                </div>

                <DialogFooter className="p-6 border-t mt-auto flex sm:justify-between items-center w-full flex-row">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={activeStep === 0}
                    >
                        Previous
                    </Button>

                    {activeStep < steps.length - 1 ? (
                        <Button type="button" onClick={nextStep} className="bg-green-600 hover:bg-green-700 text-white">
                            Next Step
                        </Button>
                    ) : (
                        <Button onClick={form.handleSubmit(onSubmit)} className="bg-green-600 hover:bg-green-700 text-white">
                            Submit Document
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
