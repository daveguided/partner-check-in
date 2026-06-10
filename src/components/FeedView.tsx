import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp, ArrowRight, Ai, WarningAlt, Ticket, Renew, ArrowUp, Document, Time, Checkmark } from '@carbon/icons-react'
import { FEED_EVENTS } from '../data/mockData'
import type { FeedEvent, FeedEventType } from '../types'

interface FeedViewProps {
  onViewCustomer: (id: string) => void
}

const TYPE_META: Record<FeedEventType, { label: string; bgClass: string; textClass: string }> = {
  invoice:     { label: 'Invoice',     bgClass: 'bg-amber-50',  textClass: 'text-amber-700'  },
  consumption: { label: 'Consumption', bgClass: 'bg-blue-50',   textClass: 'text-blue-700'   },
  renewal:     { label: 'Renewal',     bgClass: 'bg-purple-50', textClass: 'text-purple-700' },
  support:     { label: 'Support',     bgClass: 'bg-red-50',    textClass: 'text-red-700'    },
  meter:       { label: 'Meter data',  bgClass: 'bg-slate-100', textClass: 'text-slate-600'  },
  opportunity: { label: 'Opportunity', bgClass: 'bg-green-50',  textClass: 'text-green-700'  },
  engagement:  { label: 'Engagement',  bgClass: 'bg-teal-50',   textClass: 'text-teal-700'   },
}

const TYPE_ICON: Record<FeedEventType, typeof WarningAlt> = {
  invoice:     Document,
  consumption: ArrowUp,
  renewal:     Renew,
  support:     Ticket,
  meter:       WarningAlt,
  opportunity: Ai,
  engagement:  Time,
}

const SEVERITY_COLOR: Record<string, string> = {
  high:   '#ff4e00',
  medium: '#f59e0b',
  low:    '#d1d5db',
}

type Filter = 'all' | 'high' | FeedEventType
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all',         label: 'All' },
  { id: 'high',        label: 'High priority' },
  { id: 'invoice',     label: 'Invoice' },
  { id: 'renewal',     label: 'Renewal' },
  { id: 'consumption', label: 'Consumption' },
  { id: 'support',     label: 'Support' },
  { id: 'meter',       label: 'Meter data' },
  { id: 'opportunity', label: 'Opportunity' },
]

function matchesFilter(event: FeedEvent, filter: Filter): boolean {
  if (filter === 'all') return true
  if (filter === 'high') return event.severity === 'high'
  return event.type === filter
}

// ── Historical done items ──────────────────────────────────────────────────────
const HISTORICAL_DONE: FeedEvent[] = (() => {
  const types: FeedEventType[] = ['invoice', 'consumption', 'renewal', 'support', 'meter', 'opportunity', 'engagement']
  const sevs = ['high', 'medium', 'low'] as const
  const customers = [
    { id: 'fallow-field', name: 'Fallow & Field Hospitality', sector: 'Hospitality' },
    { id: 'wren-co',      name: 'Wren & Co',                  sector: 'Retail'       },
    { id: 'northline',    name: 'Northline Logistics',         sector: 'Logistics'    },
    { id: 'atlas-cold',   name: 'Atlas Cold Storage',          sector: 'Industrial'   },
    { id: 'bramble',      name: 'Bramble Home Care',           sector: 'Healthcare'   },
  ]
  const times = ['2h ago', '4h ago', '6h ago', '8h ago', '10h ago', 'Yesterday', '2 days ago', '3 days ago', '4 days ago', '5 days ago', '1 week ago', '10 days ago']
  const titlesByType: Record<FeedEventType, string[]> = {
    invoice:     ['Invoice within forecast', 'Credit note applied', 'Invoice approved and filed', 'Direct debit confirmed'],
    consumption: ['Consumption returned to baseline', 'Night load within range', 'Weekly usage on track', 'Seasonal shift normalised'],
    renewal:     ['Renewal docs sent to customer', 'Renewal confirmed at current rate', 'Renewal call booked', 'Auto-renewal processed'],
    support:     ['Support ticket resolved', 'Billing query answered', 'Meter access issue closed', 'Customer confirmed satisfied'],
    meter:       ['Meter data restored', 'AMR reading confirmed', 'Half-hourly data gap filled', 'Meter health check passed'],
    opportunity: ['Savings note sent to commercial', 'Tariff comparison shared', 'EV charging enquiry logged', 'Solar opportunity referred'],
    engagement:  ['Customer logged into portal', 'Account review completed', 'Welcome call done', 'Quarterly report sent'],
  }
  return Array.from({ length: 100 }, (_, i) => {
    const cust = customers[i % customers.length]
    const type = types[i % types.length]
    return {
      id: `hist-${i}`,
      type,
      severity: sevs[i % sevs.length],
      customerId: cust.id,
      customerName: cust.name,
      sector: cust.sector,
      title: titlesByType[type][i % titlesByType[type].length],
      summary: 'Archived — no further action required.',
      relativeTime: times[i % times.length],
    } as FeedEvent
  })
})()

// ── Generator SVG (energy pinwheel from tem.energy) ────────────────────────────
function GeneratorSVG({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 54.207 32.839 L 57.01 30.036 C 50.392 24.327 41.267 23.059 33.535 26.23 C 36.194 20.013 42.108 15.52 49.136 14.897 L 49.136 10.933 C 40.412 11.576 33.057 17.143 29.837 24.863 C 27.313 18.584 28.315 11.217 32.849 5.802 L 30.045 3 C 24.336 9.62 23.068 18.748 26.243 26.481 C 20.029 23.821 15.539 17.908 14.916 10.883 L 10.952 10.883 C 11.595 19.601 17.154 26.952 24.867 30.175 C 18.589 32.696 11.225 31.692 5.812 27.161 L 3.01 29.964 C 9.634 35.678 18.77 36.943 26.507 33.76 C 23.85 39.982 17.933 44.479 10.902 45.102 L 10.902 49.066 C 19.618 48.423 26.967 42.868 30.192 35.158 C 32.705 41.433 31.699 48.788 27.171 54.197 L 29.974 57 C 35.687 50.378 36.953 41.245 33.773 33.51 C 39.998 36.165 44.498 42.084 45.122 49.117 L 49.086 49.117 C 48.443 40.395 42.88 33.043 35.162 29.821 C 41.438 27.305 48.797 28.31 54.208 32.839 Z"
        fill="rgba(255,78,0,0.13)"
      />
    </svg>
  )
}

// ── Confidence bar ─────────────────────────────────────────────────────────────
function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 80 ? '#22c55e' : value >= 60 ? '#f59e0b' : '#ff4e00'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs font-medium tabular-nums w-8 text-right" style={{ color }}>{value}%</span>
    </div>
  )
}

// ── Active feed row ────────────────────────────────────────────────────────────
function FeedRow({
  event, expanded, dismissing, onToggle, onDismiss, onSnooze, onViewCustomer,
}: {
  event: FeedEvent
  expanded: boolean
  dismissing: boolean
  onToggle: () => void
  onDismiss: () => void
  onSnooze: () => void
  onViewCustomer: (id: string) => void
}) {
  const meta = TYPE_META[event.type]
  const Icon = TYPE_ICON[event.type]

  return (
    <div
      style={{
        maxHeight: dismissing ? '0px' : '700px',
        opacity: dismissing ? 0 : 1,
        marginBottom: dismissing ? '0px' : '6px',
        transform: dismissing ? 'scale(0.98)' : 'none',
        overflow: 'hidden',
        transition: 'max-height 360ms ease, opacity 200ms ease, margin-bottom 360ms ease, transform 200ms ease',
      }}
    >
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">

        {/* ── Compact row ── */}
        <div
          onClick={onToggle}
          className="flex items-center gap-3 px-5 py-3.5 cursor-pointer group transition-colors"
          style={{ background: expanded ? '#fafafa' : 'white' }}
          onMouseEnter={e => { if (!expanded) (e.currentTarget as HTMLElement).style.background = '#fafafa' }}
          onMouseLeave={e => { if (!expanded) (e.currentTarget as HTMLElement).style.background = 'white' }}
        >
          {/* Severity dot */}
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: SEVERITY_COLOR[event.severity] }} />

          {/* Type badge */}
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md flex-shrink-0 ${meta.bgClass} ${meta.textClass}`}>
            <Icon size={9} />
            {meta.label}
          </span>

          {/* Customer + title */}
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 truncate flex-shrink-0 max-w-[160px]">{event.customerName}</span>
            <span className="text-gray-300 flex-shrink-0">·</span>
            <span className="text-sm text-gray-600 truncate">{event.title}</span>
          </div>

          {/* Confidence */}
          {event.confidence !== undefined && (
            <span className="text-xs tabular-nums flex-shrink-0" style={{ color: event.confidence >= 80 ? '#22c55e' : event.confidence >= 60 ? '#f59e0b' : '#ff4e00' }}>
              {event.confidence}%
            </span>
          )}

          {/* Time */}
          <span className="text-xs text-gray-400 flex-shrink-0 w-20 text-right">{event.relativeTime}</span>

          {/* Snooze icon button */}
          <button
            onClick={e => { e.stopPropagation(); onSnooze() }}
            className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 transition-colors"
            style={{ color: '#d1d5db' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#6b7280')}
            onMouseLeave={e => (e.currentTarget.style.color = '#d1d5db')}
            title="Snooze"
          >
            <Time size={13} />
          </button>

          {/* Dismiss icon button */}
          <button
            onClick={e => { e.stopPropagation(); onDismiss() }}
            className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 transition-colors"
            style={{ color: '#d1d5db' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#22c55e')}
            onMouseLeave={e => (e.currentTarget.style.color = '#d1d5db')}
            title="Dismiss"
          >
            <Checkmark size={13} />
          </button>

          {/* Expand chevron */}
          <div className="text-gray-300 group-hover:text-gray-400 transition-colors flex-shrink-0">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>

        {/* ── Peek expansion ── */}
        <div
          style={{ maxHeight: expanded ? '520px' : '0', opacity: expanded ? 1 : 0, overflow: 'hidden', transition: 'max-height 200ms ease, opacity 150ms ease' }}
        >
          <div className="px-5 pb-5 pt-1 space-y-4" style={{ background: '#fafafa' }}>
            <div className="border-t border-gray-100" />

            <p className="text-sm text-gray-700 leading-relaxed">{event.summary}</p>

            {event.agentNote && (
              <div className="flex gap-3 p-4 rounded-lg" style={{ background: '#fff8f2', border: '1px solid #ffe8d9' }}>
                <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#ff4e00' }}>
                  <Ai size={12} className="text-white" />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{event.agentNote}</p>
              </div>
            )}

            <div className="flex items-start justify-between gap-6">
              <div className="space-y-1 flex-1">
                {event.recommendedAction && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Recommended action</div>
                    <div className="text-sm font-medium text-gray-900">{event.recommendedAction}</div>
                  </div>
                )}
              </div>
              {event.confidence !== undefined && (
                <div className="w-36 space-y-1 flex-shrink-0">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Confidence</div>
                  <ConfidenceBar value={event.confidence} />
                </div>
              )}
            </div>

            {/* Peek actions */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={e => { e.stopPropagation(); onDismiss() }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  style={{ background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f3f4f6' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f9fafb' }}
                >
                  <Checkmark size={11} />
                  Dismiss
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onSnooze() }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  style={{ background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f3f4f6' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f9fafb' }}
                >
                  <Time size={11} />
                  Snooze
                </button>
              </div>
              <button
                onClick={e => { e.stopPropagation(); onViewCustomer(event.customerId) }}
                className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg text-white transition-colors"
                style={{ background: '#ff4e00' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#eb5b1d')}
                onMouseLeave={e => (e.currentTarget.style.background = '#ff4e00')}
              >
                View {event.customerName}
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Done row (below keyline) ───────────────────────────────────────────────────
function DoneRow({ event, doneReason }: { event: FeedEvent; doneReason?: 'dismissed' | 'snoozed' }) {
  const meta = TYPE_META[event.type]
  const Icon = TYPE_ICON[event.type]
  return (
    <div className="flex items-center gap-3 px-5 py-3 mb-1.5 rounded-xl border border-gray-100 bg-gray-50/60">
      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-gray-300" />
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md flex-shrink-0 bg-gray-100 text-gray-400">
        <Icon size={9} />
        {meta.label}
      </span>
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className="text-sm font-medium text-gray-400 truncate flex-shrink-0 max-w-[160px]">{event.customerName}</span>
        <span className="text-gray-200 flex-shrink-0">·</span>
        <span className="text-sm text-gray-300 truncate">{event.title}</span>
      </div>
      {doneReason && (
        <span className="text-[10px] text-gray-300 flex-shrink-0 font-medium capitalize">{doneReason}</span>
      )}
      <span className="text-xs text-gray-300 flex-shrink-0 w-20 text-right">{event.relativeTime}</span>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function FeedView({ onViewCustomer }: FeedViewProps) {
  const [activeIds, setActiveIds] = useState<string[]>(() => FEED_EVENTS.map(e => e.id))
  const [dismissingIds, setDismissingIds] = useState<Set<string>>(new Set())
  const [userDone, setUserDone] = useState<Array<{ event: FeedEvent; reason: 'dismissed' | 'snoozed' }>>([])
  const [visibleHistorical, setVisibleHistorical] = useState(25)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<Filter>('all')
  const sentinelRef = useRef<HTMLDivElement>(null)

  const dismiss = (id: string, reason: 'dismissed' | 'snoozed' = 'dismissed') => {
    setDismissingIds(prev => { const n = new Set(prev); n.add(id); return n })
    setTimeout(() => {
      const event = FEED_EVENTS.find(e => e.id === id)!
      setActiveIds(prev => prev.filter(i => i !== id))
      setDismissingIds(prev => { const n = new Set(prev); n.delete(id); return n })
      // Prepend to done pile so it appears at the top
      setUserDone(prev => [{ event, reason }, ...prev])
      setExpandedId(prev => (prev === id ? null : prev))
    }, 370)
  }

  const handleReset = () => {
    setActiveIds(FEED_EVENTS.map(e => e.id))
    setDismissingIds(new Set())
    setUserDone([])
    setExpandedId(null)
    setActiveFilter('all')
  }

  // Infinite scroll — observe relative to the main scrolling container
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const main = document.querySelector('main')
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setVisibleHistorical(prev => Math.min(prev + 25, HISTORICAL_DONE.length))
        }
      },
      { root: main, threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  const isEmpty = activeIds.length === 0
  const totalDone = userDone.length + HISTORICAL_DONE.length
  const highCount = FEED_EVENTS.filter(e => activeIds.includes(e.id) && e.severity === 'high').length

  const visibleActive = FEED_EVENTS.filter(e => {
    if (!activeIds.includes(e.id)) return false
    if (dismissingIds.has(e.id)) return true
    return matchesFilter(e, activeFilter)
  })

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Feed</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {isEmpty
            ? `${totalDone} done · Updated 2 minutes ago`
            : `${activeIds.length} active${highCount > 0 ? ` · ${highCount} high priority` : ''} · ${totalDone} done · Updated 2 minutes ago`}
        </p>
      </div>

      {/* Filter tabs */}
      {!isEmpty && (
        <div className="flex items-center gap-1 mb-5 flex-wrap">
          {FILTERS.map(({ id, label }) => {
            const count =
              id === 'all'  ? activeIds.length :
              id === 'high' ? FEED_EVENTS.filter(e => activeIds.includes(e.id) && e.severity === 'high').length :
              FEED_EVENTS.filter(e => activeIds.includes(e.id) && e.type === id).length
            if (id !== 'all' && count === 0) return null
            const isActive = activeFilter === id
            return (
              <button key={id} onClick={() => setActiveFilter(id)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={isActive ? { background: '#ff4e00', color: '#fff' } : { background: '#f3f4f6', color: '#6b7280' }}
              >
                {label}
                <span className="rounded-full px-1.5 py-px text-[10px] font-semibold"
                  style={isActive ? { background: 'rgba(255,255,255,0.25)', color: '#fff' } : { background: '#e5e7eb', color: '#9ca3af' }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Active items or empty inbox */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-32 text-center select-none">
          <GeneratorSVG size={100} />
          <h2 className="mt-8 text-lg font-medium text-gray-900">All caught up</h2>
          <p className="mt-2 text-sm text-gray-400 max-w-xs leading-relaxed">
            New events will appear here as they're flagged.
          </p>
          <button
            onClick={handleReset}
            className="mt-6 text-xs transition-colors"
            style={{ color: '#d1d5db' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#9ca3af')}
            onMouseLeave={e => (e.currentTarget.style.color = '#d1d5db')}
          >
            Reset active items
          </button>
        </div>
      ) : (
        <div>
          {visibleActive.map(event => (
            <FeedRow
              key={event.id}
              event={event}
              expanded={expandedId === event.id}
              dismissing={dismissingIds.has(event.id)}
              onToggle={() => setExpandedId(prev => (prev === event.id ? null : event.id))}
              onDismiss={() => dismiss(event.id, 'dismissed')}
              onSnooze={() => dismiss(event.id, 'snoozed')}
              onViewCustomer={onViewCustomer}
            />
          ))}
          {visibleActive.filter(e => !dismissingIds.has(e.id)).length === 0 && (
            <div className="py-8 text-center text-sm text-gray-400">No events match this filter.</div>
          )}
        </div>
      )}

      {/* Keyline + done section */}
      <div className="mt-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Done · {totalDone}</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Recently dismissed (always at top of done pile) */}
        {userDone.map(({ event, reason }, i) => (
          <DoneRow key={`done-${event.id}-${i}`} event={event} doneReason={reason} />
        ))}

        {/* Historical done items */}
        {HISTORICAL_DONE.slice(0, visibleHistorical).map(event => (
          <DoneRow key={event.id} event={event} />
        ))}

        {/* Infinite scroll sentinel */}
        {visibleHistorical < HISTORICAL_DONE.length ? (
          <div ref={sentinelRef} className="py-4 text-center text-xs text-gray-300">
            Loading more…
          </div>
        ) : (
          <div className="py-5 text-center text-xs text-gray-300">
            {totalDone} items · Beginning of feed history
          </div>
        )}
      </div>
    </div>
  )
}
