import * as React from "react"
import { X, Check } from "lucide-react"

import { Badge } from "~/components/ui/badge"
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandEmpty,
    CommandList,
    CommandInput,
} from "~/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover"
import { cn } from "~/lib/utils"

export type Option = {
    label: string;
    value: string;
}

interface MultiSelectProps {
    options: Option[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    className?: string;
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Select items...",
    className,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)

    const handleUnselect = (item: string) => {
        onChange(selected.filter((i) => i !== item))
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    className={cn(
                        "relative flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background cursor-pointer",
                        !selected.length && "text-muted-foreground",
                        className
                    )}
                    onClick={(e) => {
                        // Don't open if they're clicking a badge
                        if (!(e.target as HTMLElement).closest('.badge-close')) {
                            setOpen(true)
                        }
                    }}
                >
                    {selected.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {selected.map((item) => {
                                const option = options.find((o) => o.value === item)
                                return (
                                    <Badge
                                        key={item}
                                        variant="secondary"
                                        className="hover:bg-secondary/80 gap-1 rounded-sm px-1 font-normal"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                        }}
                                    >
                                        {option?.label}
                                        <div
                                            className="badge-close rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer hover:bg-muted"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleUnselect(item)
                                            }}
                                        >
                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                        </div>
                                    </Badge>
                                )
                            })}
                        </div>
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                            {options.map((option) => {
                                const isSelected = selected.includes(option.value)
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                            if (isSelected) {
                                                handleUnselect(option.value)
                                            } else {
                                                onChange([...selected, option.value])
                                            }
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}
                                        >
                                            <Check className={cn("h-4 w-4")} />
                                        </div>
                                        {option.label}
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
