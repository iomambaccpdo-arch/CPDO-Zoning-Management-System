import { Search, Plus, MoreHorizontal, FileText as FileIcon, File as DocumentIcon, Image as ImageIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import { NewDocumentModal } from "~/components/documents/new-document-modal";
import { useAuthStore } from "~/store/auth";

const dummyFiles = [
    { id: 1, name: "Zoning Ordinance 2024.pdf", type: "PDF", size: "2.4 MB", date: "2024-01-15", owner: "John Doe" },
    { id: 2, name: "Land Use Map Update.png", type: "Image", size: "5.1 MB", date: "2024-02-10", owner: "Jane Smith" },
    { id: 3, name: "Q1 Progress Report.docx", type: "Word", size: "1.2 MB", date: "2024-02-25", owner: "Alice Johnson" },
    { id: 4, name: "Building Permit Application Form.pdf", type: "PDF", size: "0.8 MB", date: "2024-03-01", owner: "Bob Brown" },
    { id: 5, name: "Site Inspection Photos.zip", type: "Archive", size: "15.0 MB", date: "2024-03-05", owner: "Chris Wilson" },
];

export default function Files() {
    const { user } = useAuthStore();
    const canCreateFile = user?.roles?.some(role =>
        role.permissions?.some(p => p.resource === 'Files' && p.name === 'create')
    );

    return (
        <div className="flex flex-col h-full bg-zinc-50 border-t border-zinc-200">
            <div className="px-5 py-3 border-b bg-white shrink-0">
                <h1 className="text-[16px] font-bold text-[#1a202c] tracking-tight uppercase leading-none mt-1">
                    Files Management
                </h1>
            </div>

            <div className="flex-1 p-5 space-y-4 overflow-auto">
                <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search files..."
                            className="pl-8 text-[13px] h-8"
                        />
                    </div>
                    {canCreateFile && (
                        <NewDocumentModal>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 hover:opacity-75 text-white font-medium h-8 text-[13px] px-3">
                                <Plus className="mr-1 h-3.5 w-3.5" /> New Document
                            </Button>
                        </NewDocumentModal>
                    )}
                </div>

                <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-zinc-50">
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Uploaded</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dummyFiles.map((file) => (
                                <TableRow key={file.id} className="hover:bg-zinc-50">
                                    <TableCell className="font-medium flex items-center gap-2">
                                        {file.type === "PDF" && <DocumentIcon className="h-4 w-4 text-red-500" />}
                                        {file.type === "Image" && <ImageIcon className="h-4 w-4 text-blue-500" />}
                                        {file.type === "Word" && <FileIcon className="h-4 w-4 text-blue-700" />}
                                        {file.type === "Archive" && <FileIcon className="h-4 w-4 text-yellow-600" />}
                                        {file.name}
                                    </TableCell>
                                    <TableCell>{file.type}</TableCell>
                                    <TableCell>{file.size}</TableCell>
                                    <TableCell>{file.date}</TableCell>
                                    <TableCell>{file.owner}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4 text-zinc-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
