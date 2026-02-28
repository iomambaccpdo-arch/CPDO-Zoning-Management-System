export default function Settings() {
    return (
        <div className="flex flex-col h-full bg-zinc-50 border-t border-zinc-200">
            <div className="px-5 py-3 border-b bg-white shrink-0">
                <nav className="flex mb-1" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-1 text-[11px] text-zinc-500">
                        <li className="flex items-center">
                            <span className="font-medium text-zinc-800">Settings</span>
                        </li>
                    </ol>
                </nav>
                <h1 className="text-[16px] font-bold text-[#1a202c] tracking-tight uppercase leading-none mt-1">
                    Settings
                </h1>
            </div>
            <div className="p-5">
                <p className="text-[13px] text-zinc-700">Settings content goes here.</p>
            </div>
        </div>
    );
}
