import {
  Camera,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  CreditCard,
  Handshake,
  PenLine,
  QrCode,
} from 'lucide-react'
import { useState } from 'react'
import type { ElementType } from 'react'

const CLAIM_STEPS = [
  { icon: CreditCard,    title: 'Prepare your identification',    desc: 'Bring your national ID, passport, or any valid identification document.' },
  { icon: QrCode,        title: 'Provide item information',       desc: 'Present a QR code from Backtrack or provide a detailed description and images of the item.' },
  { icon: PenLine,       title: 'Sign return confirmation',       desc: 'Complete and sign the item return record to finish the process safely for both parties.' },
]
const DEPOSIT_STEPS = [
  { icon: ClipboardList, title: 'Describe the found item',          desc: 'Provide details such as item type, color, identifying marks, and where it was found.' },
  { icon: Camera,        title: 'Take photos and verify condition', desc: 'Photograph the item at drop-off to ensure transparency and prevent later disputes.' },
  { icon: Handshake,     title: 'Sign handover record',             desc: 'Receive a drop-off confirmation slip as legal proof that protects your rights.' },
]

function AccordionSection({
  title, steps, open, onToggle,
}: {
  title: string
  steps: Array<{ icon: ElementType; title: string; desc: string }>
  open: boolean
  onToggle: () => void
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-5 py-4
                   hover:bg-[#FAFAFA] transition-colors duration-200 cursor-pointer
                   focus:outline-none focus:bg-[#FAFAFA] text-left"
      >
        <span className="text-sm font-black text-[#111]">{title}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-[#888] shrink-0" />
          : <ChevronDown className="w-4 h-4 text-[#888] shrink-0" />}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-0">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-7 h-7 rounded-full bg-brand-primary flex items-center justify-center
                                text-white text-xs font-black shadow-sm">
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 my-1 bg-[#E5E7EB]" />
                )}
              </div>
              <div className="pb-5 pt-0.5 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <step.icon className="w-3.5 h-3.5 text-brand-primary" aria-hidden="true" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Step {i + 1}</span>
                </div>
                <p className="text-sm font-bold text-[#111] leading-snug">{step.title}</p>
                <p className="text-xs text-[#888] mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function GuidesAccordion() {
  const [openClaim, setOpenClaim] = useState(false)
  const [openDeposit, setOpenDeposit] = useState(false)

  return (
    <div className="bg-white border border-[#ebebeb] rounded-2xl overflow-hidden shadow-sm mt-3 divide-y divide-[#f5f5f5]">
      <AccordionSection
        title="Item claim process"
        steps={CLAIM_STEPS}
        open={openClaim}
        onToggle={() => setOpenClaim(v => !v)}
      />
      <AccordionSection
        title="Item drop-off process"
        steps={DEPOSIT_STEPS}
        open={openDeposit}
        onToggle={() => setOpenDeposit(v => !v)}
      />
    </div>
  )
}
