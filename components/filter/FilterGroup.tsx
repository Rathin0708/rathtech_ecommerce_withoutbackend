"use client";

import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterGroupProps {
  title: string;
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  defaultOpen?: boolean;
}

export default function FilterGroup({
  title,
  options,
  selected,
  onChange,
  defaultOpen = true,
}: FilterGroupProps) {
  const activeCount = selected.length;

  function handleToggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  return (
    <Accordion defaultValue={defaultOpen ? [title] : []}>
      <AccordionItem value={title} className="border-none">
        <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
          <span className="flex items-center gap-2">
            {title}
            {activeCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeCount}
              </span>
            )}
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-0.5 pb-2">
            {options.map((option) => {
              const isChecked = selected.includes(option.value);
              const id = `filter-${title}-${option.value}`;
              return (
                <label
                  key={option.value}
                  htmlFor={id}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1.5 text-sm transition-colors hover:bg-muted"
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggle(option.value)}
                    className={cn(
                      "h-4 w-4 rounded border-border bg-background accent-primary",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    )}
                  />
                  <span className={cn("flex-1", isChecked && "font-medium")}>
                    {option.label}
                  </span>
                  {option.count != null && (
                    <span className="text-xs text-muted-foreground">
                      ({option.count})
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
