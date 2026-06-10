import { useState } from 'react'
import { ArrowLeft, Favorite, Calendar, Receipt, Ticket, View, WarningAlt, ErrorFilled } from '@carbon/icons-react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts'
import { RiskBadge } from './StatusBadge'
import AgentReasoning from './AgentReasoning'
import DraftActionPanel from './DraftActionPanel'
import CustomerPreview from './CustomerPreview'
import type { Customer, ActionStatus } from '../types'

type Tab = 'overview' | 'reasoning' | 'draft' | 'preview'

interface CustomerCaseFileProps {
  customer: Customer
  status: ActionStatus
  onStatusChange: (id: string, status: ActionStatus) => void
  onBack: () => void
  onFeedbackOpen: () => void
}

const gbp = (n: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n)

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview',  label: 'Overview'         },
  { id: 'reasoning', label: 'Agent reasoning'  },
  { id: 'draft',     label: 'Draft action'     },
  { id: 'preview',   label: 'Customer preview' },
]

const InvoiceTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm px-3 py-2 text-xs">
      <div className="font-medium text-gray-700 mb-1">{label}</div>
      <div className="text-gray-900 font-semibold">{gbp(payload[0].value)}</div>
      {payload[0].payload.forecast && <div className="text-gray-400 mt-0.5">Forecast</div>}
    </div>
  )
}

const ConsumptionTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm px-3 py-2 text-xs">
      <div className="font-medium text-gray-700 mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-semibold text-gray-900">{p.value === 0 ? '–' : `${p.value} kWh`}</span>
        </div>
      ))}
    </div>
  )
}

export default function CustomerCaseFile({
  customer, status, onStatusChange, onBack, onFeedbackOpen,
}: CustomerCaseFileProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const healthColor = customer.healthScore >= 75 ? 'text-brand-600' : customer.healthScore >= 50 ? 'text-amber-600' : 'text-red-600'

  return (
    <div className="min-h-screen">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        {/* Back + name row */}
        <div className="px-8 pt-5 pb-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-3"
          >
            <ArrowLeft size={14} />
            Risk Queue
          </button>

          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-semibold text-gray-900">{customer.name}</h1>
                <RiskBadge level={customer.riskLevel} />
                {customer.requiresHumanReview && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md">
                    <WarningAlt size={11} />
                    Human review required
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                <span>{customer.sector}</span>
                <span className="text-gray-200">·</span>
                <span>{customer.sites} sites</span>
                <span className="text-gray-200">·</span>
                <span>{customer.currentPlan}</span>
                <span className="text-gray-200">·</span>
                <span>Owner: {customer.partnerOwner}</span>
              </div>
            </div>
          </div>

          {/* Stats chips */}
          <div className="flex items-center gap-2 flex-wrap pb-4">
            <Chip icon={<Favorite size={12} />} label="Health" value={`${customer.healthScore}/100`} valueClass={healthColor} />
            <Chip icon={<Calendar size={12} />} label="Renewal" value={`${customer.renewalDays} days`}
              valueClass={customer.renewalDays <= 30 ? 'text-amber-600' : 'text-gray-700'} />
            <Chip icon={<Receipt size={12} />} label="Monthly spend" value={gbp(customer.monthlySpend)}
              valueClass={customer.invoiceChangePercent > 15 ? 'text-red-600' : 'text-gray-700'} />
            <Chip icon={<Ticket size={12} />} label="Open tickets" value={String(customer.supportTickets)}
              valueClass={customer.supportTickets > 0 ? 'text-amber-600' : 'text-gray-700'} />
            <Chip icon={<View size={12} />} label="Portal" value={`Last seen ${customer.portalLastSeen}`} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 px-8 border-t border-gray-100">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === id
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-8 py-6 max-w-4xl">
        {activeTab === 'overview' && (
          <OverviewTab customer={customer} status={status} />
        )}
        {activeTab === 'reasoning' && (
          <AgentReasoning customer={customer} />
        )}
        {activeTab === 'draft' && (
          <DraftActionPanel
            customer={customer}
            status={status}
            onStatusChange={(s) => onStatusChange(customer.id, s)}
            onFeedbackOpen={onFeedbackOpen}
            onSwitchToPreview={() => setActiveTab('preview')}
          />
        )}
        {activeTab === 'preview' && (
          <CustomerPreview customer={customer} />
        )}
      </div>
    </div>
  )
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab({ customer }: { customer: Customer; status?: ActionStatus }) {
  const isMissing = customer.missingData

  if (isMissing) {
    return <MissingDataState customer={customer} />
  }

  return (
    <div className="space-y-6">
      {/* Agent recommendation */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recommended next best action</div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
            customer.confidence >= 80 ? 'bg-brand-50 text-brand-700' : 'bg-amber-50 text-amber-700'
          }`}>
            {customer.confidence}% confidence
          </span>
        </div>
        <p className="text-sm font-medium text-gray-900 mb-2">{customer.recommendedAction}</p>
        <p className="text-sm text-gray-600 leading-relaxed">{customer.agentSummary}</p>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">
        <InvoiceChart customer={customer} />
        <ConsumptionChart customer={customer} />
      </div>

      {/* Signals */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Signals detected</div>
        <div className="space-y-3">
          {customer.signals.map((signal) => (
            <div key={signal.id} className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                signal.severity === 'high' ? 'bg-red-400' :
                signal.severity === 'medium' ? 'bg-amber-400' : 'bg-gray-300'
              }`} />
              <div>
                <div className="text-sm font-medium text-gray-800">{signal.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{signal.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function InvoiceChart({ customer }: { customer: Customer }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Invoice trend</div>
      <div className="text-xs text-gray-400 mb-4">Monthly spend · last 6 months</div>
      <div style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={customer.invoiceSeries} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false}
              tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<InvoiceTooltip />} />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
              {customer.invoiceSeries.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.forecast ? '#FCA5A5' : i === customer.invoiceSeries.length - 2 ? '#374151' : '#E5E7EB'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-50">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-sm bg-gray-700 inline-block" />
          Actual
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-sm bg-red-300 inline-block" />
          Forecast
        </div>
      </div>
    </div>
  )
}

function ConsumptionChart({ customer }: { customer: Customer }) {
  const hasGap = customer.consumptionSeries.some(d => d.site3 === 0)
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Site 3 consumption</div>
      <div className="text-xs text-gray-400 mb-4">Weekly kWh · vs baseline</div>
      <div style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={customer.consumptionSeries} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
            <Tooltip content={<ConsumptionTooltip />} />
            <ReferenceLine y={customer.consumptionSeries[0]?.baseline ?? 0}
              stroke="#9CA3AF" strokeDasharray="4 3" strokeWidth={1} />
            <Line dataKey="site3" stroke="#374151" strokeWidth={2} dot={{ r: 3, fill: '#374151' }}
              name="Site 3" connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {hasGap && (
        <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600">
          <WarningAlt size={11} />
          Data gap — meter offline
        </div>
      )}
      {!hasGap && (
        <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-4 h-px bg-gray-700 inline-block" />
            Site 3
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-4 h-px bg-gray-300 inline-block" style={{ borderTop: '1px dashed #9CA3AF' }} />
            Baseline
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Graceful failure state (Atlas Cold Storage) ──────────────────────────────

function MissingDataState({ customer }: { customer: Customer }) {
  return (
    <div className="space-y-5">
      {/* Paused card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <ErrorFilled size={20} className="text-gray-400" />
          </div>
          <div>
            <div className="text-base font-semibold text-gray-900">Recommendation paused</div>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              The agent has identified a 22% invoice increase for this account, but cannot confidently
              explain the cause without complete metering data. Sending a recommendation without this
              data would risk misleading the customer.
            </p>
          </div>
        </div>
      </div>

      {/* Missing data detail */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-3">Data gaps preventing recommendation</div>
        <div className="space-y-3">
          {customer.dataSources.filter(ds => ds.status !== 'available').map(ds => (
            <div key={ds.name} className="flex items-start gap-3">
              <ErrorFilled size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-800">{ds.name}</div>
                <div className="text-xs text-amber-700 mt-0.5">{ds.detail ?? `Last updated: ${ds.lastUpdated}`}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-white border border-amber-100 rounded-lg">
          <div className="text-xs font-semibold text-gray-600 mb-1">What this means</div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Sites 2 and 4 account for approximately 60% of this account's typical consumption.
            Without this data, the agent cannot determine whether the invoice increase reflects
            real consumption, a metering fault, or an invoicing error.
          </p>
        </div>
      </div>

      {/* Confidence */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Agent confidence</div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-red-300 rounded-full" style={{ width: `${customer.confidence}%` }} />
          </div>
          <span className="text-sm font-semibold text-red-600 tabular-nums">{customer.confidence}%</span>
        </div>
        <p className="text-xs text-gray-500">
          Below the 60% threshold required to generate a recommendation. Agent will not act automatically.
        </p>
      </div>

      {/* CTAs */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Available actions</div>
        <div className="flex flex-col gap-2">
          <button className="flex items-center justify-between px-4 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
            <span>Request meter data refresh</span>
            <span className="text-gray-400 text-xs">tem operations notified</span>
          </button>
          <button className="flex items-center justify-between px-4 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            <span>Create manual check-in</span>
            <span className="text-gray-400 text-xs">Bypass agent — write your own</span>
          </button>
          <button className="flex items-center justify-between px-4 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            <span>Snooze until data arrives</span>
            <span className="text-gray-400 text-xs">Re-flagged automatically</span>
          </button>
        </div>
      </div>

      {/* Invoice chart still visible */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Invoice trend</div>
        <div className="text-xs text-amber-600 mb-4 flex items-center gap-1.5">
          <WarningAlt size={11} />
          Metering data incomplete — invoice chart based on billing data only
        </div>
        <div style={{ height: 140 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={customer.invoiceSeries} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false}
                tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} />
              <Tooltip />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {customer.invoiceSeries.map((entry, i) => (
                  <Cell key={i} fill={entry.forecast ? '#FCA5A5' : i === customer.invoiceSeries.length - 2 ? '#374151' : '#E5E7EB'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function Chip({ icon, label, value, valueClass = 'text-gray-700' }: {
  icon: React.ReactNode; label: string; value: string; valueClass?: string
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5">
      <span className="text-gray-400">{icon}</span>
      <span className="text-gray-400">{label}</span>
      <span className={`font-medium ${valueClass}`}>{value}</span>
    </div>
  )
}
