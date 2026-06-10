import { Location, WarningAlt, Time } from '@carbon/icons-react'
import { SITES } from '../data/mockData'

const METER_STATUS = {
  available: { label: 'Live',     bg: 'bg-green-50',  text: 'text-green-700' },
  delayed:   { label: 'Delayed',  bg: 'bg-amber-50',  text: 'text-amber-700' },
  missing:   { label: 'Offline',  bg: 'bg-red-50',    text: 'text-red-700'   },
}

const SUPPLY_LABEL = {
  electricity: 'Electricity',
  gas:         'Gas',
  both:        'Elec + Gas',
}

export default function SitesList() {
  const activeSites = SITES.filter(s => s.meterStatus === 'available').length
  const offlineSites = SITES.filter(s => s.meterStatus === 'missing').length

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Sites</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {SITES.length} sites across {new Set(SITES.map(s => s.customerId)).size} customers ·{' '}
          <span className="text-green-600 font-medium">{activeSites} live</span>
          {offlineSites > 0 && <> · <span className="text-red-500 font-medium">{offlineSites} offline</span></>}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {/* Column headers */}
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50/60">
          {['Site', 'Customer', 'Postcode', 'Supply', 'Meter', 'Monthly kWh', 'Contract end'].map(h => (
            <div key={h} className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</div>
          ))}
        </div>

        {SITES.map(site => {
          const status = METER_STATUS[site.meterStatus]
          const offline = site.meterStatus === 'missing'
          return (
            <div
              key={site.id}
              className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3.5 border-b border-gray-50 last:border-0"
            >
              {/* Site name */}
              <div className="flex items-center gap-2 min-w-0">
                <Location size={13} className="text-gray-300 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-900 truncate">{site.name}</span>
              </div>

              {/* Customer */}
              <div className="flex items-center min-w-0">
                <span className="text-sm text-gray-500 truncate">{site.customerName}</span>
              </div>

              {/* Postcode */}
              <div className="flex items-center">
                <span className="font-mono text-xs text-gray-500">{site.postcode}</span>
              </div>

              {/* Supply type */}
              <div className="flex items-center">
                <span className="text-xs text-gray-600">{SUPPLY_LABEL[site.supplyType]}</span>
              </div>

              {/* Meter status */}
              <div className="flex items-center">
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md ${status.bg} ${status.text}`}>
                  {site.meterStatus === 'missing' && <WarningAlt size={9} />}
                  {status.label}
                </span>
              </div>

              {/* Monthly kWh */}
              <div className="flex items-center">
                {offline
                  ? <span className="text-xs text-gray-300">—</span>
                  : <span className="text-sm text-gray-700 tabular-nums">{site.monthlyKwh.toLocaleString()}</span>
                }
              </div>

              {/* Contract end */}
              <div className="flex items-center gap-1.5">
                <Time size={11} className="text-gray-300" />
                <span className={`text-xs tabular-nums ${site.daysToRenewal <= 42 ? 'text-amber-600 font-medium' : 'text-gray-500'}`}>
                  {site.contractEnd}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Object-level note */}
      <p className="mt-4 text-xs text-gray-400">
        Showing {SITES.length} of {/* customers[0].sites + ... */}33 total sites. Site-level detail view coming in the next sprint.
      </p>
    </div>
  )
}
