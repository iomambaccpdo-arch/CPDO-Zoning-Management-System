import * as React from "react"
import { Search, Plus, Eye, Pencil, Trash2, FileText } from "lucide-react"
import { format } from "date-fns"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Skeleton } from "~/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"
import { useQuery } from "@tanstack/react-query"
import { DocumentService } from "~/api/DocumentService"
import type { Document } from "~/api/DocumentService"
import { NewDocumentModal } from "~/components/documents/new-document-modal"
import { DocumentPreviewModal } from "~/components/documents/document-preview-modal"
import { DeleteDocumentConfirm } from "~/components/documents/delete-document-confirm"
import { useAuthStore } from "~/store/auth"

export default function Files() {
    const { user } = useAuthStore()
    const canCreateFile = user?.roles?.some(role =>
        role.permissions?.some((p: any) => p.resource === 'Files' && p.name === 'create')
    )

    const [search, setSearch] = React.useState("")
    const [debouncedSearch, setDebouncedSearch] = React.useState("")
    const [page, setPage] = React.useState(1)
    const [previewDoc, setPreviewDoc] = React.useState<Document | null>(null)
    const [deleteDocId, setDeleteDocId] = React.useState<number | null>(null)
    const [deleteDocTitle, setDeleteDocTitle] = React.useState<string>("")

    // Debounce search
    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400)
        return () => clearTimeout(timer)
    }, [search])

    const { data, isLoading } = useQuery({
        queryKey: ["documents", debouncedSearch, page],
        queryFn: () => DocumentService.getDocuments({ search: debouncedSearch, page, per_page: 15 }),
    })

    const documents = data?.data ?? []
    const totalPages = data?.last_page ?? 1

    return (
        <div className="flex flex-col h-full bg-zinc-50 border-t border-zinc-200">
            <div className="px-5 py-3 border-b bg-white shrink-0">
                <h1 className="text-[16px] font-bold text-[#1a202c] tracking-tight uppercase leading-none mt-1">
                    Files Management
                </h1>
            </div>

            <div className="flex-1 p-5 space-y-4 overflow-auto">
                {/* Toolbar */}
                <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by title, applicant, app no..."
                            className="pl-8 text-[13px] h-8"
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1) }}
                        />
                    </div>
                    {canCreateFile && (
                        <NewDocumentModal>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white font-medium h-8 text-[13px] px-3">
                                <Plus className="mr-1 h-3.5 w-3.5" /> New Document
                            </Button>
                        </NewDocumentModal>
                    )}
                </div>

                {/* Table */}
                <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className=" text-[12px] font-semibold">Date</TableHead>
                                <TableHead className=" text-[12px] font-semibold">Title</TableHead>
                                <TableHead className=" text-[12px] font-semibold">Type</TableHead>
                                <TableHead className=" text-[12px] font-semibold">Zn App No.</TableHead>
                                <TableHead className=" text-[12px] font-semibold">Due Date</TableHead>
                                <TableHead className=" text-[12px] font-semibold">Applicant</TableHead>
                                <TableHead className=" text-[12px] font-semibold">Location</TableHead>
                                <TableHead className=" text-[12px] font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        {Array.from({ length: 8 }).map((_, j) => (
                                            <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                            {!isLoading && documents.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                        <p className="text-sm">No documents found.</p>
                                    </TableCell>
                                </TableRow>
                            )}
                            {!isLoading && documents.map((doc) => (
                                <TableRow key={doc.id} className="hover:bg-zinc-50 text-[13px]">
                                    <TableCell className="text-muted-foreground whitespace-nowrap">
                                        {doc.created_at
                                            ? format(new Date(doc.created_at), "MMM d, yyyy h:mm a")
                                            : "—"}
                                    </TableCell>
                                    <TableCell className="font-medium max-w-[140px] truncate">{doc.document_title}</TableCell>
                                    <TableCell className="max-w-[130px] truncate text-blue-600">{doc.project_type?.name ?? "—"}</TableCell>
                                    <TableCell className="font-mono text-[12px]">{doc.zoning_application_no}</TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {doc.due_date ? format(new Date(doc.due_date), "MMM d, yyyy") : "—"}
                                    </TableCell>
                                    <TableCell className="max-w-[150px] truncate">{doc.applicant_name}</TableCell>
                                    <TableCell className="max-w-[140px] truncate">
                                        {doc.barangay?.name && doc.purok?.name
                                            ? `${doc.barangay.name}, Purok ${doc.purok.name}`
                                            : "—"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-6 px-2 text-[11px] gap-1"
                                                onClick={() => setPreviewDoc(doc)}
                                            >
                                                <Eye className="h-3 w-3" /> Preview
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="h-6 px-2 text-[11px] gap-1 bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                <Pencil className="h-3 w-3" /> Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="h-6 px-2 text-[11px] gap-1 bg-red-600 hover:bg-red-700 text-white"
                                                onClick={() => {
                                                    setDeleteDocId(doc.id)
                                                    setDeleteDocTitle(doc.document_title)
                                                }}
                                            >
                                                <Trash2 className="h-3 w-3" /> Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-end gap-2 pt-1">
                        <span className="text-xs text-muted-foreground">
                            Page {data?.current_page} of {totalPages} ({data?.total} total)
                        </span>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[12px]"
                            disabled={page <= 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[12px]"
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>

            {/* Modals */}
            <DocumentPreviewModal
                document={previewDoc}
                open={!!previewDoc}
                onClose={() => setPreviewDoc(null)}
            />
            <DeleteDocumentConfirm
                documentId={deleteDocId}
                documentTitle={deleteDocTitle}
                open={!!deleteDocId}
                onClose={() => setDeleteDocId(null)}
            />
        </div>
    )
}
