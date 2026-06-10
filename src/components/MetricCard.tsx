import type { ReactNode } from 'react'

interface MetricCardProps {
  label: string
  value: string | number
  sub?: string
  icon: ReactNode
  accent?: 'green' | 'amber' | 'red' | 'blue' | 'orange' | 'default'
  onClick?: () => void
}

const ACCENT: Record<string, string> = {
  green:   'text-brand-600 bg-brand-50',
  amber:   'text-amber-600 bg-amber-50',
  red:     'text-red-600 bg-red-50',
  blue:    'text-blue-600 bg-blue-50',
  orange:  'text-tem-orange bg-tem-orange5',
  default: 'text-gray-500 bg-gray-100',
}

export default function MetricCard({ label, value, sub, icon, accent = 'default', onClick }: MetricCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-100 rounded-xl p-5 flex items-start gap-4 ${onClick ? 'cursor-pointer hover:border-gray-200 hover:shadow-sm transition-all' : ''}`}
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${ACCENT[accent]}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-semibold text-gray-900 leading-tight">{value}</div>
        <div className="text-sm text-gray-500 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
      </div>
    </div>
  )
}
