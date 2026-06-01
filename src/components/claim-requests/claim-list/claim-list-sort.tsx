import { DropdownMenu } from 'radix-ui'
import { ArrowDownUp, Check } from 'lucide-react'

export type ClaimSort = 'newest' | 'oldest'

const SORT_LABEL: Record<ClaimSort, string> = {
  newest: 'Newest first',
  oldest: 'Oldest first',
}

const OPTIONS: Array<ClaimSort> = ['newest', 'oldest']

interface ClaimListSortProps {
  value: ClaimSort
  onChange: (value: ClaimSort) => void
}

/** The order bar: a dropdown to sort the claim list newest / oldest. */
export function ClaimListSort({ value, onChange }: ClaimListSortProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex shrink-0 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-[13px] font-bold text-[#111] shadow-[0_1px_4px_rgba(0,0,0,0.02)] transition-colors hover:bg-[#F9FAFB] cursor-pointer outline-none"
        >
          <ArrowDownUp className="h-4 w-4 text-[#9CA3AF]" />
          {SORT_LABEL[value]}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-[10rem] rounded-xl border border-[#E5E7EB] bg-white p-1 shadow-lg"
        >
          {OPTIONS.map((option) => (
            <DropdownMenu.Item
              key={option}
              onSelect={() => onChange(option)}
              className="flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-[13px] font-bold text-[#111] outline-none transition-colors data-[highlighted]:bg-[#F3F4F6]"
            >
              {SORT_LABEL[option]}
              {value === option && <Check className="h-4 w-4 text-rose-500" />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
