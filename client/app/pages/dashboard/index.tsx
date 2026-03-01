import * as React from "react"
import { format } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import { FileText, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { DocumentService } from "~/api/DocumentService"
import type { DashboardMonthCount } from "~/api/DocumentService"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"
import { Button } from "~/components/ui/button"
import { Skeleton } from "~/components/ui/skeleton"

// ─── Year helpers ───────────────────────────────────────────────────────────
const CURRENT_YEAR = new Date().getFullYear()
const CURRENT_MONTH = new Date().getMonth() + 1 // 1-indexed
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i)

// ─── Month Documents table ───────────────────────────────────────────────────
function MonthDocumentsTable({
    year,
    month,
    monthName,
    onClose,
}: {
    year: number
    month: number
    monthName: string
    onClose: () => void
}) {
    const [page, setPage] = React.useState(1)

    const { data, isLoading } = useQuery({
        queryKey: ["documents", year, month, page],
        queryFn: () =>
            DocumentService.getDocuments({ year, month, page, per_page: 10 }),
    })

    const docs = data?.data ?? []
    const totalPages = data?.last_page ?? 1

    return (
        <div className="mt-4 rounded-md border bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-zinc-50">
                <div>
                    <p className="text-[11px] text-zinc-400 uppercase tracking-wide font-medium">
                        Documents for
                    </p>
                    <p className="text-[14px] font-bold text-zinc-800">
                        {monthName} {year}
                    </p>
                    <p className="text-[12px] text-zinc-500 mt-0.5">
                        {data?.total ?? "..."} Documents &nbsp;·&nbsp; (C) City Planning Development Office
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="rounded-full p-1.5 hover:bg-zinc-200 transition-colors text-zinc-500"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-[12px] font-semibold">Date</TableHead>
                        <TableHead className="text-[12px] font-semibold">Title</TableHead>
                        <TableHead className="text-[12px] font-semibold">App No.</TableHead>
                        <TableHead className="text-[12px] font-semibold">Type</TableHead>
                        <TableHead className="text-[12px] font-semibold">Applicant</TableHead>
                        <TableHead className="text-[12px] font-semibold">Location</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading &&
                        Array.from({ length: 4 }).map((_, i) => (
                            <TableRow key={i}>
                                {Array.from({ length: 6 }).map((_, j) => (
                                    <TableCell key={j}>
                                        <Skeleton className="h-4 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    {!isLoading && docs.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                <FileText className="h-7 w-7 mx-auto mb-2 opacity-30" />
                                <p className="text-[13px]">No documents for this month.</p>
                            </TableCell>
                        </TableRow>
                    )}
                    {!isLoading &&
                        docs.map((doc) => (
                            <TableRow key={doc.id} className="hover:bg-zinc-50 text-[13px]">
                                <TableCell className="text-muted-foreground whitespace-nowrap">
                                    {doc.created_at
                                        ? format(new Date(doc.created_at), "MMM d, yyyy h:mm a")
                                        : "—"}
                                </TableCell>
                                <TableCell className="font-medium max-w-[160px] truncate">
                                    {doc.document_title}
                                </TableCell>
                                <TableCell className="font-mono text-[12px]">
                                    {doc.zoning_application_no}
                                </TableCell>
                                <TableCell className="text-blue-600 max-w-[120px] truncate">
                                    {doc.project_type?.name ?? "—"}
                                </TableCell>
                                <TableCell className="max-w-[150px] truncate">
                                    {doc.applicant_name}
                                </TableCell>
                                <TableCell className="max-w-[140px] truncate">
                                    {doc.barangay?.name && doc.purok?.name
                                        ? `${doc.barangay.name}, Purok ${doc.purok.name}`
                                        : "—"}
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 px-4 py-2 border-t">
                    <span className="text-xs text-muted-foreground">
                        Page {data?.current_page} of {totalPages}
                    </span>
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-7 w-7 p-0"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-7 w-7 p-0"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                </div>
            )}
        </div>
    )
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function Dashboard() {
    const [selectedYear, setSelectedYear] = React.useState(CURRENT_YEAR)
    const [selectedMonth, setSelectedMonth] = React.useState<DashboardMonthCount | null>(null)

    const { data, isLoading } = useQuery({
        queryKey: ["dashboard", selectedYear],
        queryFn: () => DocumentService.getDashboard(selectedYear),
    })

    const monthlyCounts = data?.monthly_counts ?? []
    const recentAttachments = data?.recent_attachments ?? []

    // Pre-select current month once data loads
    React.useEffect(() => {
        if (monthlyCounts.length > 0 && selectedMonth === null) {
            const currentMonthCard = monthlyCounts.find(m => m.month === CURRENT_MONTH)
            if (currentMonthCard) setSelectedMonth(currentMonthCard)
        }
    }, [monthlyCounts])

    const handleCardClick = (m: DashboardMonthCount) => {
        // Toggle off if same card is clicked again
        setSelectedMonth((prev) =>
            prev?.month === m.month ? null : m
        )
    }

    return (
        <div className="flex flex-col h-full bg-zinc-50 border-t border-zinc-200">
            {/* Page header */}
            <div className="px-5 py-3 border-b bg-white shrink-0">
                <h1 className="text-[16px] font-bold text-[#1a202c] tracking-tight uppercase leading-none mt-1">
                    Dashboard
                </h1>
            </div>

            <div className="flex-1 overflow-auto p-5 space-y-6">

                {/* ── Section: Document / Months ── */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-[13px] font-semibold text-zinc-700 uppercase tracking-wide">
                            Document / Months
                        </h2>
                        {/* Year filter */}
                        <div className="flex items-center gap-2">
                            <label className="text-[12px] text-zinc-500 font-medium">Year:</label>
                            <select
                                value={selectedYear}
                                onChange={(e) => {
                                    setSelectedYear(Number(e.target.value))
                                    setSelectedMonth(null)
                                }}
                                className="text-[12px] border border-zinc-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
                            >
                                <option value={0}>All Years</option>
                                {YEAR_OPTIONS.map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Month cards grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-4 md:grid-cols-6 xl:grid-cols-12 gap-2">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <Skeleton key={i} className="h-[72px] rounded-md" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 md:grid-cols-6 xl:grid-cols-12 gap-2">
                            {monthlyCounts.map((m) => {
                                const isSelected = selectedMonth?.month === m.month
                                return (
                                    <button
                                        key={m.month}
                                        onClick={() => handleCardClick(m)}
                                        className={`
                                            relative rounded-md border text-left px-3 py-2.5 transition-all
                                            ${isSelected
                                                ? "bg-green-600 border-green-600 text-white shadow-md"
                                                : "bg-white border-zinc-200 hover:border-green-400 hover:shadow-sm text-zinc-700"
                                            }
                                        `}
                                    >
                                        <p className={`text-[10px] font-semibold uppercase tracking-wide truncate ${isSelected ? "text-green-100" : "text-zinc-400"}`}>
                                            {m.month_name.slice(0, 3)}
                                        </p>
                                        <p className={`text-[22px] font-bold leading-tight mt-0.5 ${isSelected ? "text-white" : "text-zinc-800"}`}>
                                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : m.count}
                                        </p>
                                        <p className={`text-[9px] mt-0.5 ${isSelected ? "text-green-100" : "text-zinc-400"}`}>
                                            {m.count === 1 ? "document" : "documents"}
                                        </p>
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    {/* Inline documents table on month card click */}
                    {selectedMonth && (
                        <MonthDocumentsTable
                            year={selectedYear}
                            month={selectedMonth.month}
                            monthName={selectedMonth.month_name}
                            onClose={() => setSelectedMonth(null)}
                        />
                    )}
                </div>

                {/* ── Section: Recent Files ── */}
                <div>
                    <h2 className="text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-3">
                        Recent Files
                    </h2>
                    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-[12px] font-semibold">Filename</TableHead>
                                    <TableHead className="text-[12px] font-semibold text-right">
                                        Date Uploaded
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading &&
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-3/4" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-36 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))}
                                {!isLoading && recentAttachments.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center py-10 text-muted-foreground">
                                            <FileText className="h-7 w-7 mx-auto mb-2 opacity-30" />
                                            <p className="text-[13px]">No recent files uploaded.</p>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {!isLoading &&
                                    recentAttachments.map((att) => (
                                        <TableRow key={att.id} className="hover:bg-zinc-50 text-[13px]">
                                            <TableCell className="text-green-700 font-medium">
                                                {att.file_name}
                                            </TableCell>
                                            <TableCell className="text-right text-zinc-500 whitespace-nowrap">
                                                {att.created_at
                                                    ? format(new Date(att.created_at), "MMMM d, yyyy h:mm a")
                                                    : "—"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

            </div>
        </div>
    )
}
