import { ArrowRight, WarningAlt } from '@carbon/icons-react'
import { CUSTOMERS } from '../data/mockData'
import { RiskBadge } from './StatusBadge'
import type { ActionStatus } from '../types'

interface CustomerListProps {
  statuses: Record<string, ActionStatus>
  onViewCustomer: (id: string) => void
}

const gbp = (n: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n)

function HealthDot({ score }: { score: number }) {
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
      <span className="text-sm font-semibold tabular-nums" style={{ color }}>{score}</span>
    </div>
  )
}

export default function CustomerList({ statuses: _statuses, onViewCustomer }: CustomerListProps) {
  const totalSpend = CUSTOMERS.reduce((a, c) => a + c.monthlySpend, 0)
  const avgHealth = Math.round(CUSTOMERS.reduce((a, c) => a + c.healthScore, 0) / CUSTOMERS.length)

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {CUSTOMERS.length} accounts · {gbp(totalSpend)}/mo book value · Avg health {avgHealth}
          </p>
        </div>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-3 gap-4">
        {CUSTOMERS.map((customer) => {
          const changePositive = customer.invoiceChangePercent > 0
          const isMissing = customer.missingData

          return (
            <button
              key={customer.id}
              onClick={() => onViewCustomer(customer.id)}
              className="bg-white border border-gray-100 rounded-xl p-5 text-left flex flex-col gap-3 hover:border-gray-200 hover:shadow-sm transition-all group"
            >
              {/* Top row: risk badge + health score */}
              <div className="flex items-center justify-between">
                <RiskBadge level={customer.riskLevel} />
                <HealthDot score={customer.healthScore} />
              </div>

              {/* Name + sector */}
              <div>
                <div className="font-semibold text-gray-900 leading-tight">{customer.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {customer.sector} · {customer.sites} sites
                </div>
              </div>

              {/* Key metrics */}
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">Monthly spend</div>
                  <div className="text-lg font-semibold text-gray-900 tabular-nums">{gbp(customer.monthlySpend)}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400 mb-0.5">vs last month</div>
                  <div className={`text-sm font-semibold tabular-nums ${changePositive ? 'text-red-500' : 'text-green-600'}`}>
                    {changePositive ? '↑' : '↓'} {Math.abs(customer.invoiceChangePercent)}%
                  </div>
                </div>
              </div>

              {/* Renewal + data warning */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  Renewal in <span className="font-medium text-gray-700">{customer.renewalDays}d</span>
                </span>
                {isMissing && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600">
                    <WarningAlt size={10} />
                    Data gap
                  </span>
                )}
                {customer.requiresHumanReview && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-purple-600">
                    Human review
                  </span>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-50 pt-3">
                <p className="text-xs text-gray-500 leading-snug line-clamp-2">{customer.recommendedAction}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0"
                    style={{ background: '#ff4e00' }}
                  >
                    {customer.partnerOwner.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-xs text-gray-400">{customer.partnerOwner}</span>
                </div>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
            </button>
          )
        })}
      </div>

      {/* Summary bar */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        {[
          { label: 'Total book ARR', value: gbp(totalSpend * 12) },
          { label: 'At-risk value', value: gbp(CUSTOMERS.filter(c => c.riskLevel === 'high' || c.riskLevel === 'medium').reduce((a, c) => a + c.monthlySpend * 12, 0)) },
          { label: 'Opportunities', value: gbp(18400) + '/yr' },
          { label: 'Avg confidence', value: `${Math.round(CUSTOMERS.reduce((a, c) => a + c.confidence, 0) / CUSTOMERS.length)}%` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-lg px-4 py-3">
            <div className="text-xs text-gray-400 mb-1">{label}</div>
            <div className="text-base font-semibold text-gray-900">{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
