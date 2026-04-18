import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Mail,
  MessageCircle,
  Package,
  QrCode,
  Search,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'

export const Route = createFileRoute('/help/')({
  component: HelpCenterPage,
})

/* ── Data ─────────────────────────────────────────────────────── */
const CATEGORIES = [
  {
    id: 'getting-started',
    icon: Smartphone,
    label: 'Getting started',
    description: 'Create your account and set up your profile',
  },
  {
    id: 'lost-found',
    icon: Package,
    label: 'Lost & found items',
    description: 'How to report, search and claim items',
  },
  {
    id: 'qr-codes',
    icon: QrCode,
    label: 'QR Codes',
    description: 'Generate, share and manage your QR codes',
  },
  {
    id: 'organisations',
    icon: ShieldCheck,
    label: 'Organisations',
    description: 'Working with verified drop-off centres',
  },
  {
    id: 'account',
    icon: HelpCircle,
    label: 'Account & billing',
    description: 'Profile settings, subscription and payments',
  },
  {
    id: 'privacy',
    icon: ShieldCheck,
    label: 'Privacy & safety',
    description: 'Your data, permissions and safe meetups',
  },
]

const FAQS: Array<{ question: string; answer: string; category: string }> = [
  {
    category: 'getting-started',
    question: 'How do I create a Backtrack account?',
    answer:
      'Download the Backtrack app or visit the website. Tap "Sign up", enter your email address and create a password. You will receive a verification email — click the link to activate your account.',
  },
  {
    category: 'getting-started',
    question: 'Is Backtrack free to use?',
    answer:
      'Yes. The core features — reporting lost items, scanning QR codes, and chatting with organisations — are completely free. A Premium plan is available for power users who need advanced features like unlimited QR codes and priority support.',
  },
  {
    category: 'lost-found',
    question: 'How do I report a lost item?',
    answer:
      'Go to the "Found" section and tap "Report lost item". Fill in a description, upload photos and pin the location where you last had it. Your report is immediately visible to verified organisations in the area.',
  },
  {
    category: 'lost-found',
    question: 'What happens after I report a lost item?',
    answer:
      'Nearby verified organisations are notified. If any organisation has your item in their inventory, they will match it and contact you via the in-app chat. You can track the status of your report in real time.',
  },
  {
    category: 'qr-codes',
    question: 'What is a Backtrack QR code?',
    answer:
      'A Backtrack QR code links to your public profile. Attach it to your belongings — bags, keys, electronics — so that anyone who finds them can scan the code and contact you directly through the app without seeing your personal details.',
  },
  {
    category: 'qr-codes',
    question: 'How many QR codes can I generate?',
    answer:
      'Free accounts can generate up to 3 active QR codes. Premium subscribers get unlimited QR codes plus the ability to add a personalised message to each one.',
  },
  {
    category: 'organisations',
    question: 'How do I chat with an organisation?',
    answer:
      'Find the organisation on the Organisations page and tap "Chat with [name]". If you are not signed in you will be prompted to create a quick account first. Messages are delivered in real time.',
  },
  {
    category: 'account',
    question: 'How do I cancel my Premium subscription?',
    answer:
      'Go to Account → Membership → Billing. Tap "Cancel subscription". Your Premium access continues until the end of the current billing period. You will not be charged again.',
  },
  {
    category: 'privacy',
    question: 'Is my personal information visible when someone scans my QR code?',
    answer:
      'No. Scanners only see the information you choose to display on your public profile — typically your first name and a contact note. Your email, phone number and address are never shown.',
  },
]

const POPULAR = FAQS.slice(0, 4)

/* ── Page ─────────────────────────────────────────────────────── */
function HelpCenterPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<string | null>(null)

  const displayedFaqs = (() => {
    let list = FAQS
    if (activeCategory) list = list.filter((f) => f.category === activeCategory)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q),
      )
    }
    return list
  })()

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <div className="bg-[#0c0c0c] relative overflow-hidden">
        {/* dot-grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* glow */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-12 right-0 w-64 h-64 rounded-full bg-brand-400/10 blur-[80px]" />

        {/* back button */}
        <div className="relative z-10 max-w-screen-lg mx-auto px-6 lg:px-20 pt-6">
          <button
            onClick={() => navigate({ to: '/account' })}
            className="flex items-center gap-2 text-white/50 hover:text-white
                       transition-colors duration-150 cursor-pointer text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to account
          </button>
        </div>

        <div className="relative z-10 max-w-screen-lg mx-auto px-6 lg:px-20 pt-10 pb-14 text-center">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-brand-400 mb-3">
            Help Center
          </p>
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            How can we help?
          </h1>
          <p className="text-white/50 text-[15px] mb-8 font-medium">
            Search our knowledge base or browse by topic
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888] pointer-events-none" />
            <input
              type="text"
              placeholder="Search for answers…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-14 pl-14 pr-5 rounded-2xl bg-white text-[15px] font-medium
                         text-[#111] placeholder:text-[#bbb] outline-none
                         focus:ring-2 focus:ring-brand-400 transition-all duration-150"
            />
          </div>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-6 lg:px-20 py-12 space-y-14">

        {/* ── Categories ── */}
        {!query && (
          <section>
            <h2 className="text-xl font-extrabold text-[#111] mb-6">Browse by topic</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {CATEGORIES.map(({ id, icon: Icon, label, description }) => {
                const active = activeCategory === id
                return (
                  <button
                    key={id}
                    onClick={() => setActiveCategory(active ? null : id)}
                    className={[
                      'flex flex-col items-start gap-3 p-5 rounded-2xl border text-left',
                      'transition-all duration-150 cursor-pointer focus:outline-none',
                      active
                        ? 'border-[#111] bg-[#111] text-white'
                        : 'border-[#DDDDDD] bg-white hover:border-[#111] hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)]',
                    ].join(' ')}
                  >
                    <span className={[
                      'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                      active ? 'bg-white/15' : 'bg-[#F3F4F6]',
                    ].join(' ')}>
                      <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-[#555]'}`} strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className={`text-sm font-bold leading-tight ${active ? 'text-white' : 'text-[#111]'}`}>
                        {label}
                      </p>
                      <p className={`text-xs mt-1 leading-relaxed ${active ? 'text-white/60' : 'text-[#888]'}`}>
                        {description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* ── Popular questions (no filter) ── */}
        {!query && !activeCategory && (
          <section>
            <h2 className="text-xl font-extrabold text-[#111] mb-6">Popular questions</h2>
            <FaqList faqs={POPULAR} openFaq={openFaq} setOpenFaq={setOpenFaq} />
          </section>
        )}

        {/* ── Filtered / search results ── */}
        {(query || activeCategory) && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-[#111]">
                {query
                  ? `Results for "${query}"`
                  : CATEGORIES.find((c) => c.id === activeCategory)?.label}
              </h2>
              {activeCategory && (
                <button
                  onClick={() => setActiveCategory(null)}
                  className="text-sm font-semibold text-[#888] hover:text-[#111]
                             transition-colors cursor-pointer underline underline-offset-2"
                >
                  Clear filter
                </button>
              )}
            </div>

            {displayedFaqs.length > 0 ? (
              <FaqList faqs={displayedFaqs} openFaq={openFaq} setOpenFaq={setOpenFaq} />
            ) : (
              <div className="text-center py-16 flex flex-col items-center gap-3">
                <span className="w-14 h-14 rounded-2xl bg-[#F3F4F6] flex items-center justify-center">
                  <HelpCircle className="w-7 h-7 text-[#ccc]" />
                </span>
                <p className="text-base font-bold text-[#111]">No results found</p>
                <p className="text-sm text-[#888]">Try different keywords or browse by topic above.</p>
              </div>
            )}
          </section>
        )}

        {/* ── Contact ── */}
        <section>
          <div className="h-px bg-[#EBEBEB] mb-12" />
          <h2 className="text-xl font-extrabold text-[#111] mb-2">Still need help?</h2>
          <p className="text-[15px] text-[#666] mb-7">
            Our support team is happy to assist you.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ContactCard
              icon={MessageCircle}
              title="Live chat"
              description="Chat with a support agent in real time."
              cta="Start chat"
              onClick={() => navigate({ to: '/message', search: { selectedId: undefined, fallbackName: undefined, fallbackAvatarUrl: undefined } })}
            />
            <ContactCard
              icon={Mail}
              title="Email support"
              description="Send us an email and we'll reply within 24 hours."
              cta="Send email"
              onClick={() => { window.location.href = 'mailto:support@backtrack.app' }}
            />
          </div>
        </section>

      </div>
    </div>
  )
}

/* ── FAQ accordion list ── */
function FaqList({
  faqs,
  openFaq,
  setOpenFaq,
}: {
  faqs: typeof FAQS
  openFaq: string | null
  setOpenFaq: (q: string | null) => void
}) {
  return (
    <div className="divide-y divide-[#F3F4F6] border border-[#DDDDDD] rounded-2xl overflow-hidden">
      {faqs.map(({ question, answer }) => {
        const open = openFaq === question
        return (
          <div key={question}>
            <button
              onClick={() => setOpenFaq(open ? null : question)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5
                         text-left hover:bg-[#F9F9F9] transition-colors duration-150 cursor-pointer
                         focus:outline-none"
            >
              <p className="text-[15px] font-semibold text-[#111] leading-snug">{question}</p>
              {open
                ? <ChevronDown className="w-4 h-4 text-[#888] shrink-0 transition-transform duration-200 rotate-180" />
                : <ChevronRight className="w-4 h-4 text-[#ccc] shrink-0 group-hover:text-[#888]" />
              }
            </button>
            {open && (
              <div className="px-6 pb-5 -mt-1">
                <p className="text-[15px] text-[#555] leading-relaxed">{answer}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Contact card ── */
function ContactCard({
  icon: Icon,
  title,
  description,
  cta,
  onClick,
}: {
  icon: React.ElementType
  title: string
  description: string
  cta: string
  onClick: () => void
}) {
  return (
    <div className="border border-[#DDDDDD] rounded-2xl p-6 flex flex-col gap-4
                    hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:border-[#ccc]
                    transition-all duration-150">
      <span className="w-11 h-11 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#555]" strokeWidth={1.8} />
      </span>
      <div>
        <p className="text-[15px] font-bold text-[#111]">{title}</p>
        <p className="text-sm text-[#888] mt-0.5 leading-relaxed">{description}</p>
      </div>
      <button
        onClick={onClick}
        className="self-start px-5 py-2.5 rounded-xl bg-[#111] hover:bg-[#333]
                   text-white text-sm font-bold transition-colors duration-150 cursor-pointer"
      >
        {cta}
      </button>
    </div>
  )
}
