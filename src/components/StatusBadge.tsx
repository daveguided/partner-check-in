import type { RiskLevel, ActionStatus } from '../types'

interface RiskBadgeProps { level: RiskLevel }
interface ActionBadgeProps { status: ActionStatus }

const RISK_STYLES: Record<RiskLevel, { label: string; className: string }> = {
  'high':         { label: 'High risk',      className: 'bg-red-50 text-red-700 border-red-200' },
  'medium':       { label: 'Medium risk',    className: 'bg-amber-50 text-amber-700 border-amber-200' },
  'opportunity':  { label: 'Opportunity',    className: 'bg-brand-50 text-brand-700 border-brand-200' },
  'renewal':      { label: 'Renewal due',    className: 'bg-blue-50 text-blue-700 border-blue-200' },
  'missing-data': { label: 'Data missing',   className: 'bg-gray-100 text-gray-600 border-gray-200' },
}

const ACTION_STYLES: Record<ActionStatus, { label: string; className: string }> = {
  'pending':  { label: 'Pending',        className: 'bg-gray-100 text-gray-600 border-gray-200' },
  'approved': { label: 'Approved',       className: 'bg-brand-50 text-brand-700 border-brand-200' },
  'snoozed':  { label: 'Snoozed',        className: 'bg-amber-50 text-amber-700 border-amber-200' },
  'wrong':    { label: 'Marked wrong',   className: 'bg-gray-100 text-gray-500 border-gray-200 line-through' },
  'paused':   { label: 'Paused',         className: 'bg-gray-100 text-gray-500 border-gray-200' },
}

const base = 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border'

export function RiskBadge({ level }: RiskBadgeProps) {
  const s = RISK_STYLES[level]
  return <span className={`${base} ${s.className}`}>{s.label}</span>
}

export function ActionBadge({ status }: ActionBadgeProps) {
  const s = ACTION_STYLES[status]
  return <span className={`${base} ${s.className}`}>{s.label}</span>
}
