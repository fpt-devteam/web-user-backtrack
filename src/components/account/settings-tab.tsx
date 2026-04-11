import { useState } from 'react'
import {
  Camera,
  ChevronRight,
  Eye,
  EyeOff,
  KeyRound,
  Phone,
  User,
} from 'lucide-react'
import type React from 'react'
import type { UserProfile } from '@/types/user.type'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUpdatePassword } from '@/hooks/use-auth'
import { useUpdateMe, useUploadAvatar } from '@/hooks/use-user'
import { auth } from '@/lib/firebase'

function getInitials(name?: string | null, email?: string | null) {
  if (name) return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  if (email) return email[0].toUpperCase()
  return 'U'
}

export function SettingsTab({ profile }: { profile: UserProfile }) {
  const { mutate: updateMe, isPending } = useUpdateMe()

  const hasPasswordProvider = auth.currentUser?.providerData.some(
    (p) => p.providerId === 'password'
  ) ?? false

  const initials = getInitials(profile.displayName, profile.email)

  return (
    <section>
      <h2 className="text-[1.75rem] font-extrabold text-[#222] tracking-tight mb-8">
        My profile
      </h2>

      <div className="flex flex-col sm:flex-row gap-10">

        {/* ── Avatar column ── */}
        <div className="flex flex-col items-center gap-3 sm:w-40 shrink-0">
          <AvatarEditor
            avatarUrl={profile.avatarUrl}
            initials={initials}
          />
        </div>

        {/* ── Fields column ── */}
        <div className="flex-1 min-w-0">
          <p className="text-[15px] text-[#666] mb-6 leading-relaxed">
            Your Backtrack profile is visible when returning items and chatting with organisations.
          </p>

          {/* 2-col profile fields grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 border border-[#DDDDDD] rounded-2xl
                          overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <ProfileField
              icon={User}
              label="Display name"
              value={profile.displayName ?? ''}
              placeholder="Add your name"
              maxLength={255}
              disabled={isPending}
              className="sm:border-r border-[#EBEBEB]"
              onSave={(val) => updateMe({ displayName: val })}
            />
            <ProfileField
              icon={Phone}
              label="Phone"
              value={profile.phone ?? ''}
              placeholder="Add your phone"
              maxLength={20}
              disabled={isPending}
              onSave={(val) => updateMe({ phone: val })}
            />
          </div>

          {/* Privacy toggles */}
          <div className="mt-8">
            <p className="text-xs font-bold text-[#888] uppercase tracking-widest mb-3">Privacy</p>
            <div className="bg-white rounded-2xl border border-[#DDDDDD] divide-y divide-[#F3F4F6]
                            shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
              <ToggleRow
                label="Show email publicly"
                description="Other users can see your email on your profile"
                checked={profile.showEmail}
                disabled={isPending}
                onChange={(val) => updateMe({ showEmail: val })}
              />
              <ToggleRow
                label="Show phone publicly"
                description="Other users can see your phone on your profile"
                checked={profile.showPhone}
                disabled={isPending}
                onChange={(val) => updateMe({ showPhone: val })}
              />
            </div>
          </div>

          {/* Security */}
          {hasPasswordProvider && (
            <div className="mt-8">
              <p className="text-xs font-bold text-[#888] uppercase tracking-widest mb-3">Security</p>
              <ChangePasswordCard />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ── Avatar editor ────────────────────────────────────────────── */

function AvatarEditor({
  avatarUrl,
  initials,
}: {
  avatarUrl?: string | null
  initials: string
}) {
  const { mutate: upload, isPending } = useUploadAvatar()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    upload(file)
    // reset input so selecting the same file again still triggers onChange
    e.target.value = ''
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar circle with camera overlay */}
      <div className="relative">
        <Avatar className="w-32 h-32 border-2 border-[#E5E7EB] shadow-sm">
          <AvatarImage src={avatarUrl ?? undefined} />
          <AvatarFallback className="bg-[#222] text-white text-3xl font-black">
            {initials}
          </AvatarFallback>
        </Avatar>

        <label
          className={[
            'absolute bottom-1 right-1 w-9 h-9 rounded-full bg-white border border-[#DDDDDD]',
            'shadow flex items-center justify-center transition-colors',
            isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#F7F7F7] cursor-pointer',
          ].join(' ')}
          aria-label="Change avatar"
        >
          {isPending
            ? <span className="w-4 h-4 border-2 border-[#888] border-t-transparent rounded-full animate-spin" />
            : <Camera className="w-4 h-4 text-[#333]" strokeWidth={1.8} />
          }
          <input
            type="file"
            accept="image/*"
            disabled={isPending}
            onChange={handleFileChange}
            className="sr-only"
          />
        </label>
      </div>

      <span className="text-xs font-medium text-[#888]">
        {isPending ? 'Uploading…' : 'Profile photo'}
      </span>
    </div>
  )
}

/* ── Profile field (Airbnb grid cell) ────────────────────────── */

function ProfileField({
  icon: Icon,
  label,
  value,
  placeholder,
  maxLength,
  disabled,
  className = '',
  onSave,
}: {
  icon: React.ElementType
  label: string
  value: string
  placeholder: string
  maxLength: number
  disabled: boolean
  className?: string
  onSave: (val: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState(value)

  const handleSave = () => {
    if (draft.trim() !== value) onSave(draft.trim())
    setEditing(false)
  }

  const handleCancel = () => { setDraft(value); setEditing(false) }

  return (
    <div className={`px-5 py-4 border-b border-[#EBEBEB] last:border-b-0 ${className}`}>
      {editing ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <Icon className="w-4 h-4 text-[#888]" strokeWidth={1.8} />
            <span className="text-xs font-bold text-[#888] uppercase tracking-widest">{label}</span>
          </div>
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={maxLength}
            placeholder={placeholder}
            className="w-full text-[15px] border border-[#DDDDDD] rounded-lg px-3 py-1.5
                       focus:outline-none focus:border-[#111] transition-colors"
          />
          <div className="flex gap-2 mt-1">
            <button
              onClick={handleSave}
              disabled={disabled}
              className="px-3 py-1 rounded-lg bg-[#222] text-white text-xs font-bold
                         hover:bg-[#000] transition-colors cursor-pointer disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 rounded-lg border border-[#DDDDDD] text-xs font-semibold
                         text-[#555] hover:border-[#999] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => { setDraft(value); setEditing(true) }}
          className="group w-full text-left cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Icon className="w-4 h-4 text-[#888]" strokeWidth={1.8} />
            <span className="text-xs font-bold text-[#888] uppercase tracking-widest">{label}</span>
          </div>
          <p className={`text-[15px] pb-1 border-b border-[#DDDDDD] group-hover:border-[#111] transition-colors ${
            value ? 'font-semibold text-[#111]' : 'text-[#bbb] font-normal'
          }`}>
            {value || placeholder}
          </p>
        </button>
      )}
    </div>
  )
}

/* ── Toggle row ───────────────────────────────────────────────── */

function ToggleRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  disabled: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div>
        <p className="text-[15px] font-semibold text-[#111] leading-tight">{label}</p>
        <p className="text-xs text-[#aaa] mt-0.5">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex w-11 h-6 rounded-full shrink-0 transition-colors duration-200 cursor-pointer',
          'focus:outline-none disabled:opacity-50',
          checked ? 'bg-[#222]' : 'bg-[#DDDDDD]',
        ].join(' ')}
      >
        <span className={[
          'inline-block w-5 h-5 rounded-full bg-white shadow-sm',
          'absolute top-0.5 transition-transform duration-200',
          checked ? 'translate-x-5' : 'translate-x-0.5',
        ].join(' ')} />
      </button>
    </div>
  )
}

/* ── Change password card ─────────────────────────────────────── */

function ChangePasswordCard() {
  const { mutate: updatePassword, isPending } = useUpdatePassword()
  const [open, setOpen]               = useState(false)
  const [currentPw, setCurrentPw]     = useState('')
  const [newPw, setNewPw]             = useState('')
  const [confirmPw, setConfirmPw]     = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew]         = useState(false)
  const [error, setError]             = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (newPw.length < 6) { setError('New password must be at least 6 characters'); return }
    if (newPw !== confirmPw) { setError('Passwords do not match'); return }
    updatePassword(
      { currentPassword: currentPw, newPassword: newPw },
      {
        onSuccess: () => {
          setOpen(false)
          setCurrentPw(''); setNewPw(''); setConfirmPw('')
        },
      }
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#DDDDDD] shadow-[0_2px_8px_rgba(0,0,0,0.05)] overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="group w-full flex items-center gap-4 px-5 py-4 text-left
                   hover:bg-[#F9F9F9] transition-colors duration-150 cursor-pointer"
      >
        <span className="w-10 h-10 rounded-xl bg-[#F3F4F6] group-hover:bg-[#E9EAEC]
                         flex items-center justify-center shrink-0 transition-colors duration-150">
          <KeyRound className="w-5 h-5 text-[#555]" strokeWidth={1.8} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-[#111] leading-tight">Change password</p>
          <p className="text-xs text-[#aaa] mt-0.5">Update your login password</p>
        </div>
        <ChevronRight
          className={[
            'w-4 h-4 text-[#ccc] shrink-0 transition-all duration-200',
            open ? 'rotate-90 text-[#888]' : 'group-hover:text-[#888]',
          ].join(' ')}
        />
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="border-t border-[#F3F4F6] px-5 py-5 flex flex-col gap-4">
          <PwField
            label="Current password"
            value={currentPw}
            show={showCurrent}
            onToggle={() => setShowCurrent((v) => !v)}
            onChange={setCurrentPw}
          />
          <PwField
            label="New password"
            value={newPw}
            show={showNew}
            onToggle={() => setShowNew((v) => !v)}
            onChange={setNewPw}
          />
          <PwField
            label="Confirm new password"
            value={confirmPw}
            show={showNew}
            onToggle={() => setShowNew((v) => !v)}
            onChange={setConfirmPw}
          />

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={isPending || !currentPw || !newPw || !confirmPw}
              className="px-5 py-2 rounded-xl bg-[#222] text-white text-sm font-bold
                         hover:bg-[#000] transition-colors cursor-pointer disabled:opacity-40"
            >
              {isPending ? 'Saving…' : 'Update password'}
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); setCurrentPw(''); setNewPw(''); setConfirmPw(''); setError(null) }}
              className="px-5 py-2 rounded-xl border border-[#DDDDDD] text-sm font-semibold
                         text-[#555] hover:border-[#999] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

function PwField({
  label, value, show, onToggle, onChange,
}: {
  label: string; value: string; show: boolean
  onToggle: () => void; onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="text-xs font-bold text-[#888] uppercase tracking-widest block mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-[15px] border border-[#DDDDDD] rounded-lg px-3 py-2 pr-10
                     focus:outline-none focus:border-[#111] transition-colors"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#555] cursor-pointer"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}
