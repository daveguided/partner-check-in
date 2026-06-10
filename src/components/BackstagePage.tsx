import { useState, useEffect, useRef, useCallback } from 'react'
import { Ai, Time, Document, CheckmarkFilled, ChevronRight, Edit, ArrowRight, WarningAlt, Close, Play } from '@carbon/icons-react'

const CANDIDATE = 'David Rennick'
const ROLE = 'Principal Product Design Engineer'
const DATE = 'June 2026'
const ORANGE = '#ff4e00'

// ── Section registry ───────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'section-brief',     num: '01', title: 'The Brief' },
  { id: 'section-strategy',  num: '02', title: 'The Strategic Bet' },
  { id: 'section-built',     num: '03', title: 'What Was Built' },
  { id: 'section-colour',    num: '04', title: 'Colour & Brand' },
  { id: 'section-chronicle', num: '05', title: 'Build Chronicle' },
  { id: 'section-decisions', num: '06', title: 'Design Decisions' },
  { id: 'section-prompts',   num: '07', title: 'Prompts & Direction' },
  { id: 'section-audit',     num: '08', title: 'AI Tooling Audit' },
  { id: 'section-trust',     num: '09', title: 'Trust & Failure' },
  { id: 'section-next',      num: '10', title: "What's Next" },
  { id: 'section-about',     num: '11', title: 'About This Page' },
]

// ── Content data ───────────────────────────────────────────────────────────────
const TIMELINE = [
  { label: 'tem-agent/ created', note: 'Initial working directory and HTML prototype. Never shipped — a thinking tool only.', modal: 'tem-agent' as ModalType },
  { label: 'Vibecoding session abandoned', note: 'Attempted to live-record a 60-minute end-to-end build. ~30 minutes in, abandoned — real-time vibecoding involves a lot of waiting, troubleshooting, and false starts that don\'t translate to compelling video. Pivoted to asynchronous, deliberate iteration instead.', modal: 'video' as ModalType },
  { label: 'bill-seems-wrong/ bootstrapped', note: 'React + Vite scaffold from the HTML prototype. Dark Linear/Revolut aesthetic chosen to match the financial gravity of invoice review.', modal: 'bsw' as ModalType },
  { label: 'Agent panel, confidence scores, anomaly markers', note: 'bill-seems-wrong: AI reasoning panel with 8-step decision chain, uncertainty disclosure, and site-level contribution breakdown.' },
  { label: 'partner-check-in/ built from structured spec', note: '8 screens, 5 mock customers, full agentic workflow from briefing → queue → case file → draft action.' },
  { label: 'tem brand palette applied', note: 'Color tokens scraped directly from tem.energy CSS. No approximations.' },
  { label: 'tem wordmark SVG integrated', note: 'Real logo SVG from tem.energy, currentColor fill for dark/light theme compatibility.' },
  { label: 'IBM Carbon icons → replaced Lucide', note: 'Enterprise-grade icon set. More authoritative for energy infrastructure. 20+ icon mappings resolved.' },
  { label: 'Ubuntu → DM Sans', note: "DM Sans is the closest freely available match to PP Neue Montreal (tem's actual typeface). Optical size axis: 9..40." },
  { label: 'Orange gradient sidebar applied to both apps', note: 'linear-gradient(180deg, #ff4500 0%, #ff7018 100%). White text with rgba opacity scale for hierarchy on colour.' },
  { label: 'Broker SVG icon scraped via puppeteer', note: 'tem.energy/get-in-touch renders via Framer at runtime. Headless Chrome required to resolve symbol IDs from DOM. Icon placed white, 14px, left of "Partner" in nav.' },
  { label: 'Backstage page (this one)', note: 'Transparent documentation of the entire build: strategy, prompts, AI tooling audit, design decisions.' },
  { label: 'OOUX IA refactor', note: 'Risk Queue → Feed (event stream with peek expansion). Customer Accounts → Customers (card grid). Added Sites and Contracts as new first-class objects. Nav sectioned into Overview / Activity / Objects.' },
  { label: 'Backstage enhancements', note: 'Adjacent projects embedded as full-screen modals. Vibecoding session linked. Sticky scroll-to-section nav added.' },
  { label: 'Feed: empty inbox UX', note: 'Card tiles with Dismiss / Snooze actions. Dismiss animation — item collapses and lands in the Done section below the keyline. 100 historical done items with infinite scroll. Empty state: Energy Generator SVG scraped from tem.energy.' },
]

const DECISIONS = [
  { title: 'Two apps, not one screen', body: "The brief asked for one moment. I picked two: bill seems wrong (customer side) and partner proactive check-in (broker side). They're the same event seen from opposite sides. Designing only one misses the system. A broker who checks in before the invoice lands prevents the support ticket entirely." },
  { title: 'Dark for customer, light for broker', body: 'Invoice review carries financial weight — dark UI creates appropriate gravity. The partner workspace is a daytime scanning tool, used rapidly across many accounts. Light, clean, fast to parse. Two aesthetic registers that match two different cognitive contexts.' },
  { title: 'Human review gates everywhere', body: 'Every agent-drafted email is marked "Not sent automatically." Confidence scores are visible, not computed-and-hidden. Data gaps are disclosed as specific blockers. Trust in AI is built through legible uncertainty, not through projection of false confidence.' },
  { title: 'Graceful failure > confident fiction', body: "Atlas Cold Storage has missing meter data. The agent pauses — flagging exactly what's missing, why it matters, what the broker can do. Vague uncertainty is useless. Specific uncertainty is actionable. This is the harder design problem and the more honest product." },
  { title: 'Brand from source, not from screenshots', body: 'Used puppeteer to scrape the live tem.energy DOM — extracting actual CSS token values, the wordmark SVG, and the broker and generator icon SVGs from runtime-rendered Framer symbols. The prototype uses the same brand atoms as tem\'s production site.' },
  { title: 'IBM Carbon over Lucide', body: 'Carbon has different visual DNA: more authoritative, more enterprise-appropriate for an energy platform. Lucide is excellent for consumer tools. For B2B infrastructure, Carbon signals the right things. 20+ icon mappings resolved during the swap.' },
  { title: 'Draft tones as a first-class feature', body: "Three email tones (Standard, Softer, Savings-angle) reflect real broker workflow: some clients want data, some want reassurance, some need to see opportunity. The agent drafts all three. The broker picks. This is agentic UX done right: AI prepares options, human decides." },
  { title: 'Confidence as a UX concept', body: 'Confidence scores are visible on every customer card. Below 60%, the agent requests human review rather than recommending an action. Making confidence a UI concern — not just a backend metric — respects the broker\'s ability to calibrate their own trust in the system.' },
  { title: 'OOUX navigation — objects, not screens', body: "Restructured the IA around nouns (Feed, Customers, Sites, Contracts) not verbs (Risk Queue, Accounts). Each object has a list and a node. Navigation flows: Feed event → peek → Customer node; Customer card → Customer node. Two paths converge on the same node — exactly the OOUX pattern." },
]

const PROMPTS = [
  { num: '01', intent: 'Establishing context by showing, not describing', prompt: "Can you see this project and understand where it came from? I want to flip this HTML prototype into a React app with realistic mock data. Partner-facing tool for monitoring customer energy accounts. The broker should be the hero.", outcome: 'First working React scaffold of the partner workspace' },
  { num: '02', intent: 'Benchmarking visual quality to known premium products', prompt: "I want you to level up the UI to make it look exactly like Linear and Revolut. I'm targeting the exact same design quality.", outcome: 'Dark Linear/Revolut aesthetic applied to bill-seems-wrong' },
  { num: '03', intent: 'Applying real brand values from source', prompt: "[Screenshot of tem color palette from login page] Attached are colour values to use, from the Tem login page. In particular, make use of --orange100 with the icons. While we're on the icons, let's use IBM Carbon icons. Also, let's use Ubuntu Google font for everything.", outcome: 'tem orange palette, Carbon icons, font applied to both apps' },
  { num: '04', intent: 'Correcting typeface to match tem\'s actual brand', prompt: "Actually make the font PP Neue Montreal or the closest free font to it.", outcome: 'DM Sans: optical size 9..40, variable weight — closest free match to PP Neue Montreal' },
  { num: '05', intent: 'Replacing placeholder marks with the real logo', prompt: "This is the tem logo svg: [SVG code paste]", outcome: 'Real tem wordmark SVG with currentColor fill for dark/light theme compatibility' },
  { num: '06', intent: "Matching the existing product's chromatic identity", prompt: "[Screenshot of orange gradient] Can you use this gradient for the background of the main nav bar and inverse the text in it.", outcome: 'Orange gradient sidebar in both apps, white text with rgba opacity hierarchy' },
  { num: '07', intent: "Using tem's own iconographic language for role identification", prompt: "Can you grab the SVG from this page: https://www.tem.energy/get-in-touch in the 'I'm an Energy Broker' card... Then put that SVG small, white, and to the left of the word Partner in the main nav.", outcome: 'Broker icon scraped via puppeteer. Placed white, 14px, left of "Partner" in sidebar header.' },
  { num: '08', intent: 'Restructuring navigation around objects (nouns) rather than views (verbs)', prompt: "Next I'd like to update the IA / main nav and follow a standard OOUX IA approach. Risk Queue — rename this Feed. Elsewhere, change Customer Accounts to Customers... The structure is: Object Menu Item → List of Objects → Object Node. Feel free to create other Objects that we might find in the Tem Partner Portal.", outcome: 'Full OOUX IA: Feed (peek expansion), Customers (cards), Sites, Contracts. Nav sectioned into Overview / Activity / Objects.' },
  { num: '09', intent: 'Making the build process transparent and legible as an artefact in itself', prompt: "I'm building this as part of a design task for Tem. Can you maintain a documentation file of everything I'm doing — the strategy I'm employing and the prompts I'm entering, dressed up with inferred strategic intent. Then link to that in the app as a 'Backstage' page. Help me win the job in any way you can, without hiding Claude's involvement.", outcome: 'This page. The backstage documentation is itself an artefact — making the AI collaboration visible as part of the design process.' },
]

const AUDIT_DIRECTED = [
  'Which moments to prototype (strategic framing)',
  'Two-app system architecture',
  'Visual benchmarks (Linear, Revolut)',
  'Brand sourcing from live site, not screenshots',
  'Mock data structure: 5 customers, specific risk profiles',
  'Graceful failure as a first-class UX concern',
  'Human review gates on all agent outputs',
  'This page — making the collaboration transparent',
]

const AUDIT_CONTRIBUTED = [
  'Graceful failure state for Atlas Cold Storage',
  '8-step agent decision chain in reasoning panel',
  '"Not sent automatically" badge pattern on draft emails',
  'Confidence threshold logic (human review below 60%)',
  'Puppeteer script to resolve Framer runtime SVG symbols',
  'Uncertainty disclosure copy in agent summaries',
  'Broker icon extraction when direct HTML scraping failed',
]

const AUDIT_WRONG = [
  'First partner-check-in: too dark, too neon — wrong aesthetic for daytime workspace',
  'Font: Ubuntu first (corrected to DM Sans)',
  'First SVG extraction: raw HTML only — missed Framer runtime symbols',
  "Several Carbon icon names didn't exist: TrendingUp→ArrowUp, FileSignature→DocumentTasks",
]

const NEXT = [
  'Real-time data feeds (mock data is structured for easy replacement)',
  'Email send flow with actual client integration',
  'Mobile-responsive partner view — morning briefing should work on a phone',
  'Notification system — agent surfaces new risks proactively',
  'A/B data on email tone selection — which tone actually converts',
  'More graceful failure states — what happens when the API is entirely down',
  'Live Vercel deploy with shareable link',
]

// ── Modal types ────────────────────────────────────────────────────────────────
type ModalType = 'bsw' | 'tem-agent' | 'video' | null

const MODAL_META: Record<NonNullable<ModalType>, { title: string; subtitle: string }> = {
  bsw: {
    title: 'bill-seems-wrong',
    subtitle: 'Customer invoice portal · Dark theme · React + TypeScript',
  },
  'tem-agent': {
    title: 'tem-agent — Initial HTML Prototype',
    subtitle: 'The original single-file prototype that seeded the build. Never shipped.',
  },
  video: {
    title: 'Vibecoding Session — Abandoned at 30 min',
    subtitle: 'Playing at 4× speed · No audio',
  },
}

// ── Full-screen modal ──────────────────────────────────────────────────────────
function FullScreenModal({ type, onClose }: { type: NonNullable<ModalType>; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const meta = MODAL_META[type]

  useEffect(() => {
    if (type === 'video' && videoRef.current) {
      videoRef.current.playbackRate = 4
    }
  }, [type])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#0d0e16' }}>
      <div
        className="flex items-center justify-between px-5 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div>
          <div className="text-sm font-semibold text-white">{meta.title}</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{meta.subtitle}</div>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.08)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        >
          <Close size={13} />
          Close (Esc)
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        {type === 'video' ? (
          <video
            ref={videoRef}
            src="/Screen%20Recording%202026-06-09%20at%2010.18.32%20pm.mov"
            autoPlay
            muted
            controls
            className="w-full h-full"
            style={{ objectFit: 'contain' }}
          />
        ) : (
          <iframe
            src={type === 'bsw' ? '/bill-seems-wrong/index.html' : '/tem-agent/index.html'}
            className="w-full h-full border-0"
            title={meta.title}
          />
        )}
      </div>
    </div>
  )
}

// ── Sticky section nav ─────────────────────────────────────────────────────────
function SectionNav({ activeId, onClickSection }: { activeId: string; onClickSection: (id: string) => void }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-3 px-2">Contents</p>
      {SECTIONS.map(({ id, num, title }) => {
        const active = activeId === id
        return (
          <button
            key={id}
            onClick={() => onClickSection(id)}
            className="w-full text-left flex items-start gap-2 px-2 py-1.5 rounded-md transition-colors"
            style={active ? { background: '#fef7f3' } : {}}
            onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '#f9fafb' }}
            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '' }}
          >
            <span className="text-[9px] font-mono font-semibold flex-shrink-0 mt-px" style={{ color: active ? ORANGE : '#d1d5db' }}>{num}</span>
            <span className="text-xs leading-tight" style={{ color: active ? '#111827' : '#9ca3af' }}>{title}</span>
          </button>
        )
      })}
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function SectionLabel({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-8">
      <span className="text-xs font-mono font-medium" style={{ color: ORANGE }}>{num}</span>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </div>
  )
}

function Divider() {
  return <div className="border-t border-gray-100 my-24" />
}

function OpenButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
      style={{ borderColor: '#e5e7eb', color: '#374151' }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background = '#fef7f3'
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = ORANGE
        ;(e.currentTarget as HTMLButtonElement).style.color = ORANGE
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e7eb'
        ;(e.currentTarget as HTMLButtonElement).style.color = '#374151'
      }}
    >
      <Play size={10} />
      {label}
    </button>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function BackstagePage() {
  const [openModal, setOpenModal] = useState<ModalType>(null)
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id)

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    const main = document.querySelector('main')
    if (el && main) {
      main.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return
    const onScroll = () => {
      const scrollTop = main.scrollTop + 120
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id)
        if (el && el.offsetTop <= scrollTop) {
          setActiveSection(SECTIONS[i].id)
          return
        }
      }
    }
    main.addEventListener('scroll', onScroll, { passive: true })
    return () => main.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-full bg-white">
      {openModal && (
        <FullScreenModal type={openModal} onClose={() => setOpenModal(null)} />
      )}

      {/* Hero */}
      <div className="px-8 py-12 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #fff8f2 0%, #fff 60%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Ai size={14} style={{ color: ORANGE }} />
            <span className="text-xs font-medium tracking-wide uppercase" style={{ color: ORANGE }}>Backstage</span>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-3 leading-tight">How this prototype was built</h1>
          <p className="text-gray-500 text-base leading-relaxed max-w-2xl mb-6">
            A transparent account of the strategy, design decisions, AI collaboration, and false starts
            behind this artefact. Including this very sentence, written by Claude.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {[CANDIDATE, ROLE, DATE].map(l => (
              <span key={l} className="text-xs font-medium px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 bg-white">{l}</span>
            ))}
            <span className="text-xs font-medium px-2.5 py-1 rounded-full text-white" style={{ background: ORANGE }}>
              Built with Claude Code
            </span>
          </div>
        </div>
      </div>

      {/* Body: sticky nav + content */}
      <div className="max-w-4xl mx-auto flex gap-8 py-16">

        {/* Sticky section nav */}
        <div className="w-36 flex-shrink-0 pl-6">
          <div className="sticky top-8">
            <SectionNav activeId={activeSection} onClickSection={scrollToSection} />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 pr-8">

          {/* 01 The Brief */}
          <section id="section-brief">
            <SectionLabel num="01" title="The Brief" />
            <div className="text-sm text-gray-600 leading-relaxed space-y-4">
              <p>The design task asked candidates to: pick one <em>"moment that matters"</em> from a list of real partner and customer pain points, conduct user and market research, build a working prototype using AI tools, and present it in a 60-minute demo session.</p>
              <p>The assessment criteria:</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {['AI fluency in prototyping', 'Production readiness of artefacts', 'Problem framing', 'Trust, transparency & graceful failure', 'Systems thinking', 'Communication in the demo session'].map((c) => (
                <div key={c} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckmarkFilled size={14} style={{ color: ORANGE, flexShrink: 0, marginTop: 2 }} />
                  {c}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-5 italic">The stakes: this prototype <em>is</em> the interview.</p>
          </section>

          <Divider />

          {/* 02 Strategic Bet */}
          <section id="section-strategy">
            <SectionLabel num="02" title="The Strategic Bet: Why Two Moments?" />
            <div className="space-y-5 text-sm text-gray-600 leading-relaxed">
              <p>The brief asked for one moment. I picked two — and that was the first deliberate design decision.</p>
              <div className="rounded-xl p-6" style={{ borderLeft: `4px solid ${ORANGE}`, backgroundColor: '#fff8f2' }}>
                <p className="font-medium text-gray-900 mb-3">The insight:</p>
                <p>The customer "bill seems wrong" moment and the partner proactive check-in are <strong>the same event seen from two sides</strong>. When an invoice contains an anomaly: the customer is surprised (trust damage), and the broker doesn't know until the customer calls (relationship damage). Designing only one side misses the system.</p>
                <p className="mt-3">A broker who proactively reaches out before the invoice lands <em>prevents</em> the "bill seems wrong" support ticket. The two UIs are cause and effect.</p>
              </div>
              <p>This framing also shows a wider range of design skill: one dark information-dense UI (reactive), one light operational workspace (proactive), two different agentic UX contexts.</p>
            </div>
          </section>

          <Divider />

          {/* 03 What Was Built */}
          <section id="section-built">
            <SectionLabel num="03" title="What Was Built" />
            <div className="grid grid-cols-1 gap-5">
              {[
                {
                  name: 'bill-seems-wrong',
                  theme: 'Dark / customer-facing',
                  desc: "The customer's moment of doubt. When an invoice looks wrong, this portal surfaces the agent's explanation: what changed, why, how each site contributes. The aesthetic is dark and premium — financial information carries weight.",
                  tags: ['Dark theme', 'Customer-facing', 'Reactive', 'Invoice anomaly'],
                  modal: 'bsw' as ModalType,
                  btnLabel: 'Open prototype',
                },
                {
                  name: 'partner-check-in',
                  theme: 'Light / broker workspace',
                  desc: "The broker's morning workspace. Five mock customers with AI-surfaced risk signals, confidence scores, recommended actions, and draft email copy. Uncertain cases are paused — the agent flags its own data gaps rather than generating confident-but-wrong recommendations.",
                  tags: ['Light theme', 'Broker workspace', 'Proactive', 'OOUX IA', 'Graceful failure'],
                  modal: null as ModalType,
                  btnLabel: null,
                },
                {
                  name: 'tem-agent',
                  theme: 'False start — HTML prototype only',
                  desc: "The initial single-file prototype that seeded the build. Plain HTML, no framework, no bundler. Served as a design sketch to establish the information hierarchy before committing to a React architecture.",
                  tags: ['HTML prototype', 'Never shipped', 'False start'],
                  modal: 'tem-agent' as ModalType,
                  btnLabel: 'View prototype',
                },
              ].map(({ name, theme, desc, tags, modal, btnLabel }) => (
                <div key={name} className="rounded-xl border border-gray-100 p-6 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-mono text-sm font-medium text-gray-900">{name}/</div>
                      <div className="text-xs text-gray-400 mt-0.5">{theme}</div>
                    </div>
                    {modal && btnLabel && (
                      <OpenButton label={btnLabel} onClick={() => setOpenModal(modal)} />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-500">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* 04 Colour & Brand */}
          <section id="section-colour">
            <SectionLabel num="04" title="Colour & Brand" />
            <div className="space-y-5 text-sm text-gray-600 leading-relaxed">
              <p>
                The product is called <strong>Red</strong>. That name is load-bearing — it's not a visual metaphor for
                energy or warmth, it's a declaration that colour is a first-class design asset for this brand.
                Most B2B energy software drains the palette to grey and blue-grey because it feels safer. Red doesn't,
                and this prototype doesn't either.
              </p>

              <div className="rounded-xl p-6" style={{ background: '#fff8f2', border: `1px solid #ffe8d9` }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ background: 'linear-gradient(180deg, #ff4500 0%, #ff7018 100%)' }} />
                  <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ background: '#ff4e00' }} />
                  <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ background: '#ff7018' }} />
                  <div className="w-8 h-8 rounded-lg flex-shrink-0 border border-gray-200" style={{ background: '#fff8f2' }} />
                  <span className="text-xs text-gray-400 ml-2">tem brand tokens, sourced from live CSS</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The orange gradient (<code className="text-xs bg-white px-1 py-0.5 rounded border border-gray-200 text-gray-600">linear-gradient(180deg, #ff4500 → #ff7018)</code>) runs
                  the full height of both app sidebars. It's the single most distinctive visual element. On colour,
                  all text is white with an rgba opacity scale — 100%, 75%, 45%, 22%, 12% — creating a hierarchy
                  without any grey.
                </p>
              </div>

              <p>
                This was a deliberate call, not a default. Applying brand colour at this scale in a B2B
                interface is usually resisted — it feels "too much" against the instinct to subordinate colour
                to data. But in a product named Red, restraint would be the wrong choice. The orange is the
                product. Hiding it would misrepresent the brand.
              </p>
              <p>
                The two apps use colour differently, which was also deliberate. In bill-seems-wrong, the
                orange appears only as an accent — anomaly markers, icon tints — against a dark surface.
                Restraint on dark creates precision. In partner-check-in, it runs the full sidebar and anchors
                every primary action. Confidence on light creates energy. Same brand, different registers.
              </p>
              <p>
                The brand tokens were scraped from the live tem.energy DOM using puppeteer — not approximated
                from screenshots. The prototype uses the same hexadecimal values as the production site.
              </p>
            </div>
          </section>

          <Divider />

          {/* 05 Build Chronicle */}
          <section id="section-chronicle">
            <SectionLabel num="05" title="Build Chronicle" />
            <div className="space-y-5">
              {TIMELINE.map(({ label, note, modal }, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#fef7f3', border: `1.5px solid ${ORANGE}` }}>
                      <CheckmarkFilled size={10} style={{ color: ORANGE }} />
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div className="w-px flex-1 mt-1.5" style={{ background: '#e8e8e8', minHeight: 20 }} />
                    )}
                  </div>
                  <div className="pb-5">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-gray-900">{label}</div>
                      {modal && (
                        <OpenButton
                          label={modal === 'video' ? 'Watch (4×)' : 'Open'}
                          onClick={() => setOpenModal(modal)}
                        />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 leading-relaxed mt-1">{note}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* 06 Design Decisions */}
          <section id="section-decisions">
            <SectionLabel num="06" title="Design Decisions Worth Defending" />
            <div className="space-y-4">
              {DECISIONS.map(({ title, body }) => (
                <div key={title} className="rounded-xl border border-gray-100 p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#fef7f3' }}>
                      <Edit size={12} style={{ color: ORANGE }} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm mb-2">{title}</div>
                      <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* 07 Prompts */}
          <section id="section-prompts">
            <SectionLabel num="07" title="Prompts &amp; Direction" />
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">Actual prompts that shaped the prototype, with the strategic intent behind each. The AI implemented; the design direction was mine.</p>
            <div className="space-y-6">
              {PROMPTS.map(({ num, intent, prompt, outcome }) => (
                <div key={num} className="rounded-xl border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
                    <span className="font-mono text-[10px] font-semibold" style={{ color: ORANGE }}>{num}</span>
                    <span className="text-xs text-gray-500">{intent}</span>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="text-sm leading-relaxed rounded-lg px-4 py-3 font-mono text-gray-700" style={{ background: '#f8f8f8', borderLeft: '3px solid #e8e8e8' }}>
                      "{prompt}"
                    </div>
                    <div className="flex items-start gap-2 text-xs text-gray-500">
                      <ArrowRight size={12} style={{ color: ORANGE, flexShrink: 0, marginTop: 1 }} />
                      <span>{outcome}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* 08 AI Audit */}
          <section id="section-audit">
            <SectionLabel num="08" title="AI Tooling Audit" />
            <p className="text-sm text-gray-600 leading-relaxed mb-8">
              Every line of code in this prototype was written by <strong>Claude Code</strong> — Anthropic's CLI coding agent.
              This wasn't AI-assisted development; it was AI-primary development with human direction.
            </p>
            <div className="grid grid-cols-1 gap-5">
              {[
                { heading: 'What I directed', color: ORANGE, bg: '#fff8f2', items: AUDIT_DIRECTED, icon: <Edit size={14} style={{ color: ORANGE }} /> },
                { heading: 'What Claude contributed unprompted', color: '#16a34a', bg: '#f0fdf4', items: AUDIT_CONTRIBUTED, icon: <Ai size={14} style={{ color: '#16a34a' }} /> },
                { heading: 'Where AI got it wrong first', color: '#92400e', bg: '#fffbeb', items: AUDIT_WRONG, icon: <WarningAlt size={14} style={{ color: '#d97706' }} /> },
              ].map(({ heading, color, bg, items, icon }) => (
                <div key={heading} className="rounded-xl border border-gray-100 p-6" style={{ background: bg }}>
                  <div className="flex items-center gap-2 mb-4">
                    {icon}
                    <span className="text-sm font-semibold" style={{ color }}>{heading}</span>
                  </div>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                        <ChevronRight size={11} style={{ color, flexShrink: 0, marginTop: 2 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* 09 Trust */}
          <section id="section-trust">
            <SectionLabel num="09" title="On Trust, Uncertainty &amp; Graceful Failure" />
            <p className="text-sm text-gray-500 mb-7 leading-relaxed">This is the hardest design problem in the brief. Every agent output in this prototype is designed around three principles:</p>
            <div className="space-y-7">
              {[
                { title: 'Show confidence, not just conclusions', body: "Confidence scores are visible in the UI — not computed-and-hidden in the backend. A 71% confidence on a recommendation means something different to a broker than 95%. Making this visible respects the human's ability to calibrate their own trust." },
                { title: 'Disclose uncertainty specifically', body: "When Atlas Cold Storage's meter data is missing, the agent doesn't say \"I'm not sure.\" It says exactly what's missing, why it matters, and what the broker can do about it. Vague uncertainty is useless. Specific uncertainty is actionable." },
                { title: "Don't send things automatically", body: "Every draft email carries \"Not sent automatically\" in its header. The agent drafts; the human decides. This is both ethically correct and commercially safe. An agent that sends emails autonomously and gets the tone wrong causes far more damage than the original invoice issue." },
              ].map(({ title, body }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-1 rounded-full flex-shrink-0" style={{ background: ORANGE, minHeight: 20 }} />
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-2">{title}</div>
                    <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* 10 What's Next */}
          <section id="section-next">
            <SectionLabel num="10" title="What I'd Do Next" />
            <p className="text-sm text-gray-500 mb-6">Given more time — or the job:</p>
            <ul className="space-y-3">
              {NEXT.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <div className="w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5" style={{ borderColor: '#d1d5db' }} />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <Divider />

          {/* 11 About This Page */}
          <section id="section-about">
            <SectionLabel num="11" title="About This Page" />
            <div className="space-y-5 text-sm text-gray-600 leading-relaxed">
              <p>
                This page exists because I asked Claude to document the process as we worked — framing prompts with
                their strategic intent, maintaining a running record of design decisions and iterations. The goal wasn't
                to produce a polished retrospective after the fact, but to keep a live log of reasoning while it was
                still fresh.
              </p>
              <p>
                The AI was the right tool for that: already involved at every step, so having it narrate the process
                was a natural extension of the collaboration rather than an afterthought. Every design decision on this
                page reflects something that was actually decided in the session — the documentation is concurrent, not reconstructed.
              </p>
              <p>
                The honest version: this kind of transparency is what the role asks for. AI fluency in prototyping means
                working with it as a primary collaborator, not as a code-completion shortcut — and being able to articulate
                exactly what the human brought and what the model brought. That's what this page tries to do.
              </p>
              <p className="text-gray-400 text-xs mt-8">This page is maintained as the prototype evolves. Last updated: June 2026.</p>
            </div>
          </section>

          <div className="h-24" />
        </div>
      </div>
    </div>
  )
}
