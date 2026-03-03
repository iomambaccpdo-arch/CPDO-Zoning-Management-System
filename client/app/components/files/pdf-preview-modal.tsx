import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog"

interface PdfPreviewModalProps {
    open: boolean
    onClose: () => void
    attachmentId: number
    fileName: string
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000"

export function PdfPreviewModal({ open, onClose, attachmentId, fileName }: PdfPreviewModalProps) {
    const previewUrl = `${API_BASE}/api/attachments/${attachmentId}/preview`

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[900px] w-[95vw] max-h-[92dvh] flex flex-col p-0 gap-0">
                {/* Header */}
                <div className="px-6 py-4 border-b shrink-0">
                    <DialogHeader>
                        <DialogTitle className="text-[14px] text-zinc-800 truncate max-w-[600px]">
                            {fileName}
                        </DialogTitle>
                    </DialogHeader>
                </div>

                {/* PDF iframe */}
                <div className="flex-1 min-h-0 bg-zinc-100">
                    <iframe
                        src={previewUrl}
                        title={fileName}
                        className="w-full h-full"
                        style={{ minHeight: "75dvh" }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
