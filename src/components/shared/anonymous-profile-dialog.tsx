import { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

/* ── Random name generator ───────────────────────────────────────── */
const ADJECTIVES = ['Curious', 'Swift', 'Bright', 'Lucky', 'Calm', 'Brave', 'Wild', 'Happy', 'Clever', 'Gentle']
const ANIMALS    = ['Fox', 'Panda', 'Tiger', 'Eagle', 'Wolf', 'Otter', 'Owl', 'Deer', 'Lynx', 'Crane']

const AVATAR_COLORS = [
  '#E67E22', '#E74C3C', '#9B59B6', '#2980B9',
  '#27AE60', '#16A085', '#D35400', '#8E44AD',
  '#2471A3', '#1E8449',
]

function randomItem<T>(arr: Array<T>): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateName(): string {
  return `${randomItem(ADJECTIVES)} ${randomItem(ANIMALS)}`
}

function pickColor(name: string): string {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[idx]
}

/* ── Props ───────────────────────────────────────────────────────── */
interface AnonymousProfileDialogProps {
  open: boolean
  onConfirm: (displayName: string) => Promise<void>
  onCancel: () => void
}

export function AnonymousProfileDialog({ open, onConfirm, onCancel }: AnonymousProfileDialogProps) {
  const [name, setName] = useState(generateName)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Re-generate when dialog opens
  useEffect(() => {
    if (open) setName(generateName())
  }, [open])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.select(), 80)
  }, [open])

  const color = pickColor(name)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const initial = (name.trim()[0] ?? '?').toUpperCase()

  const handleConfirm = async () => {
    const trimmed = name.trim() || generateName()
    setLoading(true)
    try {
      await onConfirm(trimmed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onCancel() }}>
      <DialogContent className="max-w-sm rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-gray-900">
            You&apos;re joining as a guest
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-0.5">
            Pick a name so the organisation knows who to reply to.
          </p>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 mt-2">
          {/* Avatar preview */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-md select-none transition-colors duration-200"
            style={{ backgroundColor: color }}
          >
            {initial}
          </div>

          {/* Name input */}
          <div className="w-full">
            <input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') void handleConfirm() }}
              maxLength={40}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-brand-400 text-center"
            />
            <button
              type="button"
              onClick={() => setName(generateName())}
              className="mt-1.5 w-full text-[11px] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              ↺ Generate another name
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl h-10 text-sm font-semibold cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={() => void handleConfirm()}
            disabled={loading || !name.trim()}
            className="flex-1 rounded-xl h-10 text-sm font-black bg-brand-primary hover:bg-brand-hover text-white border-0 cursor-pointer"
          >
            {loading ? 'Joining…' : 'Start chat'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
