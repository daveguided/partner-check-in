import { ArrowUp, Temperature, Document, Search, ChevronRight } from '@carbon/icons-react'
import TemLogo from './TemLogo'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import type { Customer } from '../types'

interface CustomerPreviewProps {
  customer: Customer
}

const gbp = (n: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n)

export default function CustomerPreview({ customer }: CustomerPreviewProps) {
  const prev = customer.invoiceSeries[customer.invoiceSeries.length - 2]
  const curr = customer.invoiceSeries[customer.invoiceSeries.length - 1]

  return (
    <div className="max-w-lg">
      {/* Context banner */}
      <div className="flex items-center gap-2 mb-5 px-3 py-2 bg-gray-100 rounded-lg">
        <span className="text-xs text-gray-500">
          Customer-facing view — what <strong className="text-gray-700">{customer.contactName}</strong> at {customer.name} would see
          if you send the check-in.
        </span>
      </div>

      {/* Customer portal card */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Portal header */}
        <div className="bg-gray-900 px-5 py-4">
          <div className="flex items-center justify-between">
            <TemLogo width={52} className="text-white" />
            <span className="text-xs text-gray-400">Energy portal</span>
          </div>
        </div>

        <div className="bg-white p-5 space-y-5">
          {/* Alert banner */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <ArrowUp size={18} className="text-tem-orange mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-semibold text-amber-900">Your bill is tracking higher this month</div>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                Your December energy costs are forecast at <strong>{gbp(curr.amount)}</strong>,
                up {customer.invoiceChangePercent}% from {gbp(prev?.amount ?? 0)} in November.
                Your account manager has flagged this before the invoice lands.
              </p>
            </div>
          </div>

          {/* Invoice trend mini chart */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Your monthly spend</div>
            <div style={{ height: 110 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customer.invoiceSeries} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false}
                    tickFormatter={(v) => `£${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => gbp(v)} />
                  <Bar dataKey="amount" radius={[3, 3, 0, 0]}>
                    {customer.invoiceSeries.map((e, i) => (
                      <Cell key={i} fill={e.forecast ? '#FDBA74' : '#E5E7EB'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Here's why */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Here's why</div>
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                <Temperature size={15} className="text-tem-orange flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-800">Cold snap heating demand at Site 3</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Morning electricity use (6am–9am) has been higher than usual over the past two weeks,
                    likely because HVAC systems are working harder in the cold weather.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                <Document size={15} className="text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-800">Unit rate increase from 1 December</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Your energy unit rate stepped up as scheduled in your contract. This adds a small amount to each unit consumed across all sites.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What you can do */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">What you can do</div>
            <div className="space-y-2">
              {[
                { label: 'Review your half-hourly data', detail: 'See exactly when and where energy is being used.' },
                { label: 'Talk to your account manager', detail: 'Alex Morgan can review your tariff ahead of your January renewal.' },
                { label: 'Check HVAC settings at Site 3', detail: 'Adjusting heating start times could reduce morning peaks.' },
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-800">{item.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{item.detail}</div>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* What tem is checking */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Search size={13} className="text-gray-400" />
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">What tem is checking</div>
            </div>
            <ul className="space-y-1.5">
              {[
                'Confirming that the Site 3 usage pattern aligns with weather data',
                'Checking meter data for all sites to ensure nothing is missing',
                'Reviewing whether a tariff change could lower your costs before renewal',
              ].map((item) => (
                <li key={item} className="text-xs text-gray-500 flex gap-2">
                  <span className="text-gray-300 mt-0.5 flex-shrink-0">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-gray-50 text-xs text-gray-400 text-center">
            Power, as it should be. · Bills with nothing to hide. ·{' '}
            <span className="text-brand-600 cursor-pointer hover:underline">View full invoice</span>
          </div>
        </div>
      </div>
    </div>
  )
}
