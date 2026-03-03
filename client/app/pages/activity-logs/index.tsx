import * as React from "react"
import { Search, ChevronLeft, ChevronRight, ShieldAlert } from "lucide-react"
import { format } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Skeleton } from "~/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"
import { ActivityLogService } from "~/api/ActivityLogService"
import type { ActivityLog } from "~/api/ActivityLogService"

// ─── Action badge ─────────────────────────────────────────────────────────────
const ACTION_STYLES: Record<string, string> = {
    login: "bg-blue-50 text-blue-700 border-blue-200",
    logout: "bg-zinc-100 text-zinc-600 border-zinc-300",
    create: "bg-green-50 text-green-700 border-green-200",
    update: "bg-amber-50 text-amber-700 border-amber-200",
    delete: "bg-red-50 text-red-700 border-red-200",
    download: "bg-purple-50 text-purple-700 border-purple-200",
}

function ActionBadge({ action }: { action: string }) {
    const cls = ACTION_STYLES[action] ?? "bg-zinc-100 text-zinc-600 border-zinc-300"
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[11px] font-semibold uppercase tracking-wide ${cls}`}>
            {action}
        </span>
    )
}

// ─── Module badge ─────────────────────────────────────────────────────────────
const MODULE_LABELS: Record<string, string> = {
    auth: "Auth",
    documents: "Documents",
    files: "Files",
    accounts: "Accounts",
}

// ─── Unique filter options ─────────────────────────────────────────────────────
const ACTION_OPTIONS = ["login", "logout", "create", "update", "delete", "download"]
const MODULE_OPTIONS = ["auth", "documents", "files", "accounts"]

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ActivityLogs() {
    const [search, setSearch] = React.useState("")
    const [debouncedSearch, setDebounced] = React.useState("")
    const [action, setAction] = React.useState("")
    const [module, setModule] = React.useState("")
    const [dateFrom, setDateFrom] = React.useState("")
    const [dateTo, setDateTo] = React.useState("")
    const [page, setPage] = React.useState(1)

    // Debounce search
    React.useEffect(() => {
        const t = setTimeout(() => setDebounced(search), 400)
        return () => clearTimeout(t)
    }, [search])

    const { data, isLoading } = useQuery({
        queryKey: ["activity-logs", debouncedSearch, action, module, dateFrom, dateTo, page],
        queryFn: () =>
            ActivityLogService.getLogs({
                search: debouncedSearch || undefined,
                action: action || undefined,
                module: module || undefined,
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
                page,
                per_page: 20,
            }),
    })

    const logs = data?.data ?? []
    const totalPages = data?.last_page ?? 1

    const handleClear = () => {
        setSearch(""); setDebounced(""); setAction(""); setModule("")
        setDateFrom(""); setDateTo(""); setPage(1)
    }

    return (
        <div className="flex flex-col h-full bg-zinc-50 border-t border-zinc-200">
            {/* Header */}
            <div className="px-5 py-3 border-b bg-white shrink-0">
                <h1 className="text-[16px] font-bold text-[#1a202c] tracking-tight uppercase leading-none mt-1">
                    Activity Logs
                </h1>
                <p className="text-[12px] text-zinc-400 mt-0.5">
                    Read-only audit trail of create, edit, and delete actions across documents, users, and files.
                </p>
            </div>

            <div className="flex-1 p-5 space-y-4 overflow-auto">
                {/* Filters toolbar */}
                <div className="flex flex-wrap items-end justify-end gap-2">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px] max-w-xs">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search user or record…"
                            className="pl-8 text-[13px] h-8"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                        />
                    </div>

                    {/* Action filter */}
                    <select
                        value={action}
                        onChange={(e) => { setAction(e.target.value); setPage(1) }}
                        className="h-8 text-[13px] border border-input rounded-md px-2 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
                    >
                        <option value="">All actions</option>
                        {ACTION_OPTIONS.map((a) => (
                            <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>
                        ))}
                    </select>

                    {/* Module filter */}
                    <select
                        value={module}
                        onChange={(e) => { setModule(e.target.value); setPage(1) }}
                        className="h-8 text-[13px] border border-input rounded-md px-2 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
                    >
                        <option value="">All modules</option>
                        {MODULE_OPTIONS.map((m) => (
                            <option key={m} value={m}>{MODULE_LABELS[m] ?? m}</option>
                        ))}
                    </select>

                    {/* Date from */}
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
                        className="h-8 text-[13px] border border-input rounded-md px-2 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
                    />
                    <span className="text-[12px] text-zinc-400">to</span>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
                        className="h-8 text-[13px] border border-input rounded-md px-2 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
                    />

                    {/* Clear */}
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-[12px] px-3"
                        onClick={handleClear}
                    >
                        Clear
                    </Button>
                </div>

                {/* Table */}
                <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-[12px] font-semibold">Timestamp</TableHead>
                                <TableHead className="text-[12px] font-semibold">User</TableHead>
                                <TableHead className="text-[12px] font-semibold">Action</TableHead>
                                <TableHead className="text-[12px] font-semibold">Module</TableHead>
                                <TableHead className="text-[12px] font-semibold">Record / Resource</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Loading */}
                            {isLoading &&
                                Array.from({ length: 8 }).map((_, i) => (
                                    <TableRow key={i}>
                                        {Array.from({ length: 5 }).map((_, j) => (
                                            <TableCell key={j}>
                                                <Skeleton className="h-4 w-full" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}

                            {/* Empty */}
                            {!isLoading && logs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-14 text-muted-foreground">
                                        <ShieldAlert className="h-8 w-8 mx-auto mb-2 opacity-25" />
                                        <p className="text-sm">No activity logs found.</p>
                                    </TableCell>
                                </TableRow>
                            )}

                            {/* Rows */}
                            {!isLoading &&
                                logs.map((log: ActivityLog) => (
                                    <TableRow key={log.id} className="hover:bg-zinc-50 text-[13px]">
                                        <TableCell className="text-muted-foreground whitespace-nowrap">
                                            {log.created_at
                                                ? format(new Date(log.created_at), "MMM d, yyyy h:mm a")
                                                : "—"}
                                        </TableCell>
                                        <TableCell>
                                            {log.user
                                                ? `${log.user.first_name} ${log.user.last_name}`
                                                : <span className="italic text-muted-foreground">Unknown</span>
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <ActionBadge action={log.action} />
                                        </TableCell>
                                        <TableCell className="capitalize text-zinc-600">
                                            {MODULE_LABELS[log.module] ?? log.module}
                                        </TableCell>
                                        <TableCell className="max-w-[280px] truncate text-zinc-700">
                                            {log.record ?? <span className="italic text-muted-foreground">—</span>}
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
        </div>
    )
}
