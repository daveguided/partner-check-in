import { ArrowRight, Time, Group, WarningAlt } from '@carbon/icons-react'
import { RiskBadge, ActionBadge } from './StatusBadge'
import { CUSTOMERS } from '../data/mockData'
import type { ActionStatus } from '../types'

interface RiskQueueProps {
  statuses: Record<string, ActionStatus>
  selectedId: string
  onSelectCustomer: (id: string) => void
}

const gbp = (n: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n)

export default function RiskQueue({ statuses, selectedId, onSelectCustomer }: RiskQueueProps) {
  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Risk Queue</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Accounts flagged by the agent. Click any row to open the case file.
        </p>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {/* Column headers */}
        <div className="grid grid-cols-[2fr_1fr_1fr_2fr_1fr_1fr_32px] gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50/60">
          {['Customer', 'Risk', 'Confidence', 'Recommended action', 'Last touchpoint', 'Status', ''].map((h) => (
            <div key={h} className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</div>
          ))}
        </div>

        {/* Rows */}
        {CUSTOMERS.map((customer) => {
          const status = statuses[customer.id] ?? customer.status
          const selected = customer.id === selectedId
          const isMissing = customer.missingData

          return (
            <div
              key={customer.id}
              onClick={() => onSelectCustomer(customer.id)}
              className={`grid grid-cols-[2fr_1fr_1fr_2fr_1fr_1fr_32px] gap-4 px-5 py-4 border-b border-gray-50 last:border-0 cursor-pointer transition-colors group ${
                selected
                  ? 'bg-gray-50 border-l-2 border-l-gray-300'
                  : 'hover:bg-gray-50/70'
              }`}
            >
              {/* Customer */}
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{customer.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400">{customer.sector}</span>
                  <span className="text-gray-200">·</span>
                  <span className="text-xs text-gray-400">{customer.sites} sites</span>
                  {isMissing && (
                    <span className="flex items-center gap-1 text-xs text-amber-600">
                      <WarningAlt size={10} />
                      Data gap
                    </span>
                  )}
                </div>
              </div>

              {/* Risk */}
              <div className="flex items-center">
                <RiskBadge level={customer.riskLevel} />
              </div>

              {/* Confidence */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      customer.confidence >= 80 ? 'bg-brand-500' :
                      customer.confidence >= 60 ? 'bg-amber-400' : 'bg-red-300'
                    }`}
                    style={{ width: `${customer.confidence}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 tabular-nums w-8">{customer.confidence}%</span>
              </div>

              {/* Recommended action */}
              <div className="flex items-center">
                <span className="text-sm text-gray-600 leading-tight">{customer.recommendedAction}</span>
              </div>

              {/* Last touchpoint */}
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Time size={11} />
                {customer.portalLastSeen}
              </div>

              {/* Status */}
              <div className="flex items-center">
                <ActionBadge status={status} />
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-end">
                <ArrowRight size={14} className="text-gray-200 group-hover:text-gray-400 transition-colors" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Spend summary */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-lg px-4 py-3">
          <div className="text-xs text-gray-400 mb-1">Total book ARR</div>
          <div className="text-lg font-semibold text-gray-900">
            {gbp(CUSTOMERS.reduce((a, c) => a + c.monthlySpend * 12, 0))}
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg px-4 py-3">
          <div className="text-xs text-gray-400 mb-1">At-risk accounts value</div>
          <div className="text-lg font-semibold text-red-600">
            {gbp(CUSTOMERS.filter(c => c.riskLevel === 'high' || c.riskLevel === 'medium')
              .reduce((a, c) => a + c.monthlySpend * 12, 0))}
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg px-4 py-3">
          <div className="text-xs text-gray-400 mb-1">Avg confidence score</div>
          <div className="text-lg font-semibold text-gray-900">
            {Math.round(CUSTOMERS.reduce((a, c) => a + c.confidence, 0) / CUSTOMERS.length)}%
          </div>
        </div>
      </div>
    </div>
  )
}
