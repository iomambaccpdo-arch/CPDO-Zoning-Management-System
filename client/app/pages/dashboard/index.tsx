export default function Dashboard() {
    return (
        <div className="flex flex-col h-full bg-zinc-50 border-t border-zinc-200">
            <div className="px-5 py-3 border-b bg-white shrink-0">
                <h1 className="text-[16px] font-bold text-[#1a202c] tracking-tight uppercase leading-none mt-1">
                    Dashboard
                </h1>
            </div>
            <div className="p-5">
                <p className="text-[13px] text-zinc-700">Welcome to the CPDO Zoning Management System Dashboard.</p>
            </div>
        </div>
    );
}
