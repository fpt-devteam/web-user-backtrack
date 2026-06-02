// ─────────────────────────────────────────────────────────
//  Claim status model — mirrors the console's ConversationStatus.
//  Labels are user-facing (the reporter tracking their own claim).
// ─────────────────────────────────────────────────────────

/** Server-side conversation status values (same as the console backend). */
export type ClaimStatus = 'queue' | 'in_progress' | 'in_verified' | 'closed' | 'rejected'

export const CLAIM_STATUSES: Array<ClaimStatus> = ['queue', 'in_progress', 'in_verified', 'closed', 'rejected']

/** User-facing label for each status (what the reporter sees). */
export const STATUS_LABEL: Record<ClaimStatus, string> = {
  queue:       'Submitted',
  in_progress: 'In Review',
  in_verified: 'Verified',
  closed:      'Resolved',
  rejected:    'Rejected',
}

export const STATUS_BADGE: Record<ClaimStatus, string> = {
  queue:       'bg-amber-50 text-amber-600 border border-amber-200',
  in_progress: 'bg-blue-50 text-blue-700 border border-blue-200',
  in_verified: 'bg-violet-50 text-violet-700 border border-violet-200',
  closed:      'bg-emerald-50 text-emerald-700 border border-emerald-200',
  rejected:    'bg-rose-50 text-rose-700 border border-rose-200',
}

export const STATUS_DOT: Record<ClaimStatus, string> = {
  queue:       'bg-amber-400',
  in_progress: 'bg-blue-500',
  in_verified: 'bg-violet-500',
  closed:      'bg-emerald-500',
  rejected:    'bg-rose-500',
}

/** Whether the dot should pulse (active, in-flight states). */
export const STATUS_PULSE: Record<ClaimStatus, boolean> = {
  queue:       false,
  in_progress: true,
  in_verified: false,
  closed:      false,
  rejected:    false,
}

/**
 * Status-bar tabs. Each tab maps to one or more item statuses.
 * The "Closed" tab groups the two terminal states — Resolved (`closed`)
 * and Rejected (`rejected`).
 */
export type ClaimTabKey = 'queue' | 'in_progress' | 'in_verified' | 'closed'

export const CLAIM_TABS: Array<{ key: ClaimTabKey; label: string; statuses: Array<ClaimStatus> }> = [
  { key: 'queue',       label: 'Submitted', statuses: ['queue'] },
  { key: 'in_progress', label: 'In Review', statuses: ['in_progress'] },
  { key: 'in_verified', label: 'Verified',  statuses: ['in_verified'] },
  { key: 'closed',      label: 'Closed',    statuses: ['closed', 'rejected'] },
]

export const CATEGORY_COLOR: Record<string, { bg: string; text: string }> = {
  PersonalBelongings: { bg: 'bg-amber-50',   text: 'text-amber-600' },
  Cards:              { bg: 'bg-blue-50',     text: 'text-blue-600' },
  Accessories:        { bg: 'bg-rose-50',     text: 'text-rose-600' },
  Electronics:        { bg: 'bg-violet-50',   text: 'text-violet-600' },
  Others:             { bg: 'bg-neutral-100', text: 'text-neutral-600' },
}

export function categoryColor(category?: string | null) {
  return CATEGORY_COLOR[category ?? 'Others'] ?? CATEGORY_COLOR.Others
}

/** Normalise a raw backend status string into a known ClaimStatus. */
export function normalizeStatus(raw?: string | null): ClaimStatus {
  switch (raw) {
    case 'queue':       return 'queue'
    case 'in_progress': return 'in_progress'
    case 'in_verified': return 'in_verified'
    case 'closed':      return 'closed'
    case 'rejected':    return 'rejected'
    // legacy / alternate spellings kept for safety
    case 'verified':    return 'in_verified'
    case 'active':      return 'in_progress'
    case 'resolved':    return 'closed'
    case 'reject':      return 'rejected'
    default:            return 'queue'
  }
}
