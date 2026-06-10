import { WarningAlt, Time, ArrowDown, Ai, ArrowRight, ChevronRight } from '@carbon/icons-react'
import MetricCard from './MetricCard'
import { RiskBadge } from './StatusBadge'
import { MORNING_BRIEFING, CUSTOMERS } from '../data/mockData'
import type { Customer, ActionStatus } from '../types'

interface MorningBriefingProps {
  statuses: Record<string, ActionStatus>
  onSelectCustomer: (id: string) => void
  onViewFeed: () => void
}

const TOP_CUSTOMERS = ['fallow-field', 'wren-co', 'northline']

export default function MorningBriefing({ statuses: _statuses, onSelectCustomer, onViewFeed }: MorningBriefingProps) {
  const b = MORNING_BRIEFING
  const topCustomers = TOP_CUSTOMERS.map(id => CUSTOMERS.find(c => c.id === id)).filter(Boolean) as Customer[]

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{b.date}</p>
        <h1 className="text-2xl font-semibold text-gray-900">Good morning, {b.partnerName}</h1>
        <p className="text-gray-500 mt-1">
          Your agent reviewed <span className="text-gray-700 font-medium">{b.sitesReviewed} customer sites</span> overnight.
          Here's what needs your attention today.
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Customers need attention"
          value={b.customersNeedingAttention}
          icon={<WarningAlt size={16} />}
          accent="orange"
          onClick={onViewFeed}
        />
        <MetricCard
          label="Renewals approaching"
          value={b.renewalsApproaching}
          sub="Next: Wren & Co in 28 days"
          icon={<Time size={16} />}
          accent="amber"
          onClick={onViewFeed}
        />
        <MetricCard
          label="Estimated savings identified"
          value={`£${(b.estimatedSavings / 1000).toFixed(1)}k`}
          sub="Across 2 accounts"
          icon={<ArrowDown size={16} />}
          accent="green"
          onClick={onViewFeed}
        />
        <MetricCard
          label="Billing risks detected"
          value={b.billingRisks}
          sub="2 require human review"
          icon={<WarningAlt size={16} />}
          accent="orange"
          onClick={onViewFeed}
        />
      </div>

      {/* Agent briefing card */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#ff4e00' }}>
            <Ai size={14} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Agent briefing</div>
            <div className="text-xs text-gray-400">Flagged overnight · {b.date}</div>
          </div>
          <span className="ml-auto text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded-md">
            Not sent automatically
          </span>
        </div>
        <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{b.agentBriefing}</div>
      </div>

      {/* Priority list */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Recommended actions</h2>
          <button
            onClick={onViewFeed}
            className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors"
          >
            View feed <ChevronRight size={12} />
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {topCustomers.map((customer) => {
            return (
              <div
                key={customer.id}
                onClick={() => onSelectCustomer(customer.id)}
                className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors group"
              >
                {/* Priority dot */}
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  customer.riskLevel === 'high' ? 'bg-red-400' :
                  customer.riskLevel === 'medium' ? 'bg-amber-400' :
                  customer.riskLevel === 'renewal' ? 'bg-blue-400' : 'bg-brand-400'
                }`} />

                {/* Customer info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{customer.name}</span>
                    <RiskBadge level={customer.riskLevel} />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{customer.agentHighlight}</p>
                </div>

                {/* Confidence */}
                <div className="hidden sm:block text-right flex-shrink-0">
                  <div className="text-xs text-gray-400">Confidence</div>
                  <div className="text-sm font-medium text-gray-700">{customer.confidence}%</div>
                </div>

                {/* Recommended action */}
                <div className="hidden md:block max-w-[180px] flex-shrink-0">
                  <div className="text-xs text-gray-400">Recommended action</div>
                  <div className="text-xs text-gray-700 font-medium leading-tight mt-0.5">{customer.recommendedAction}</div>
                </div>

                <ArrowRight size={15} className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
