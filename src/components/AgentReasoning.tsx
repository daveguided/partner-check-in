import { CheckmarkFilled, Time, Warning, ErrorFilled, HelpFilled, Policy } from '@carbon/icons-react'
import type { Customer, DataSourceStatus } from '../types'

interface AgentReasoningProps {
  customer: Customer
}

const SOURCE_ICON: Record<DataSourceStatus, { icon: typeof CheckmarkFilled; className: string; label: string }> = {
  available: { icon: CheckmarkFilled, className: 'text-brand-600', label: 'Available' },
  delayed:   { icon: Time,            className: 'text-amber-500', label: 'Delayed'   },
  missing:   { icon: ErrorFilled,     className: 'text-red-500',   label: 'Missing'   },
}

const SIGNAL_TYPE_LABEL: Record<string, string> = {
  invoice:     'Billing',
  consumption: 'Metering',
  support:     'Support',
  renewal:     'Account',
  engagement:  'Portal',
  meter:       'Metering',
}

const SEVERITY_BAR: Record<string, string> = {
  high:   'bg-red-400',
  medium: 'bg-amber-400',
  low:    'bg-gray-300',
}

const DECISION_STEPS = [
  'Agent scanned 128 sites across 42 customers in the partner book.',
  'Identified accounts with >10% invoice change month-on-month.',
  'Cross-referenced with metering data to find site-level cause.',
  'Checked support ticket history and portal engagement for churn signals.',
  'Checked renewal date proximity.',
  'Scored each customer by combined signal weight × data confidence.',
  'Flagged as "requires human review" due to open billing tickets.',
  'Drafted recommendation: proactive check-in before invoice lands.',
]

export default function AgentReasoning({ customer }: AgentReasoningProps) {
  return (
    <div className="space-y-6">
      {/* Human review requirement */}
      {customer.requiresHumanReview && (
        <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <Policy size={18} className="text-tem-orange flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-amber-800">Human review required before sending</div>
            <p className="text-sm text-amber-700 mt-0.5 leading-relaxed">{customer.humanReviewReason}</p>
          </div>
        </div>
      )}

      {/* Why am I seeing this */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <HelpFilled size={15} className="text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900">Why is this customer flagged?</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{customer.agentSummary}</p>

        <div className="mt-4 pt-4 border-t border-gray-50">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Confidence score</div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${customer.confidence >= 80 ? 'bg-brand-500' : customer.confidence >= 60 ? 'bg-amber-400' : 'bg-red-400'}`}
                style={{ width: `${customer.confidence}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700 tabular-nums w-12">{customer.confidence}%</span>
            <span className="text-xs text-gray-400">
              {customer.confidence >= 80 ? 'High confidence' : customer.confidence >= 60 ? 'Moderate confidence' : 'Low — review required'}
            </span>
          </div>
        </div>
      </div>

      {/* Evidence / signals */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Evidence behind this recommendation</h3>
        <div className="space-y-3">
          {customer.signals.map((signal) => (
            <div key={signal.id} className="flex gap-3">
              <div className="flex flex-col items-center pt-1 flex-shrink-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${SEVERITY_BAR[signal.severity]}`} />
                <div className="w-px flex-1 bg-gray-100 mt-1.5" />
              </div>
              <div className="pb-3 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-800">{signal.title}</span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">
                    {SIGNAL_TYPE_LABEL[signal.type] ?? signal.type}
                  </span>
                  <span className="text-xs text-gray-400">via {signal.dataSource}</span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{signal.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data sources */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Data sources checked</h3>
        <div className="space-y-2">
          {customer.dataSources.map((ds) => {
            const cfg = SOURCE_ICON[ds.status]
            const Icon = cfg.icon
            return (
              <div key={ds.name} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <Icon size={15} className={`${cfg.className} mt-0.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">{ds.name}</span>
                    <span className={`text-xs font-medium ${cfg.className}`}>{cfg.label}</span>
                  </div>
                  {ds.detail && <p className="text-xs text-amber-600 mt-0.5">{ds.detail}</p>}
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">Updated {ds.lastUpdated}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Decision path */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">How the agent reached this recommendation</h3>
        <ol className="space-y-2">
          {DECISION_STEPS.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-600">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-400 text-xs flex items-center justify-center font-medium mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Uncertainties */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Warning size={15} className="text-amber-500" />
          <h3 className="text-sm font-semibold text-gray-900">What the agent is unsure about</h3>
        </div>
        <div className="space-y-3">
          {customer.uncertainties.map((u) => (
            <div key={u.id} className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-300 flex-shrink-0 mt-2" />
              <p className="text-sm text-gray-600 leading-relaxed">{u.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
