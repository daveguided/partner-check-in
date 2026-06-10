import { DocumentTasks, Time, WarningAlt } from '@carbon/icons-react'
import { CONTRACTS } from '../data/mockData'

const SUPPLY_LABEL = {
  electricity: 'Electricity',
  gas:         'Gas',
  both:        'Elec + Gas',
}

const STATUS_META = {
  active:   { label: 'Active',   bg: 'bg-green-50',  text: 'text-green-700' },
  expiring: { label: 'Expiring', bg: 'bg-amber-50',  text: 'text-amber-700' },
  expired:  { label: 'Expired',  bg: 'bg-red-50',    text: 'text-red-700'   },
}

export default function ContractsList() {
  const expiring = CONTRACTS.filter(c => c.status === 'expiring').length

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Contracts</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {CONTRACTS.length} contracts ·{' '}
          {expiring > 0
            ? <span className="text-amber-600 font-medium">{expiring} expiring soon</span>
            : <span className="text-green-600 font-medium">all active</span>
          }
        </p>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {/* Column headers */}
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_2fr_1fr] gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50/60">
          {['Contract ID', 'Customer', 'Plan', 'Supply', 'Rate (p/kWh)', 'Term', 'Status'].map(h => (
            <div key={h} className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</div>
          ))}
        </div>

        {CONTRACTS.map(contract => {
          const status = STATUS_META[contract.status]
          return (
            <div
              key={contract.id}
              className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_2fr_1fr] gap-4 px-5 py-4 border-b border-gray-50 last:border-0"
            >
              {/* Contract ID */}
              <div className="flex items-center gap-2">
                <DocumentTasks size={13} className="text-gray-300 flex-shrink-0" />
                <span className="font-mono text-xs text-gray-700">{contract.id}</span>
              </div>

              {/* Customer */}
              <div className="flex items-center min-w-0">
                <span className="text-sm font-medium text-gray-900 truncate">{contract.customerName}</span>
              </div>

              {/* Plan */}
              <div className="flex items-center">
                <span className="text-sm text-gray-600">{contract.plan}</span>
              </div>

              {/* Supply */}
              <div className="flex items-center">
                <span className="text-xs text-gray-600">{SUPPLY_LABEL[contract.supplyType]}</span>
              </div>

              {/* Rate */}
              <div className="flex items-center">
                <span className="text-sm tabular-nums text-gray-700">{contract.ratePencePerKwh}p</span>
              </div>

              {/* Term */}
              <div className="flex items-center gap-1.5 min-w-0">
                <Time size={11} className="text-gray-300 flex-shrink-0" />
                <span className="text-xs text-gray-500 truncate">{contract.startDate} → {contract.endDate}</span>
              </div>

              {/* Status */}
              <div className="flex items-center">
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md ${status.bg} ${status.text}`}>
                  {contract.status === 'expiring' && <WarningAlt size={9} />}
                  {status.label}
                  {contract.status === 'expiring' && <span className="ml-0.5 font-normal normal-case">({contract.daysToRenewal}d)</span>}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Rate comparison note */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-lg px-4 py-3">
          <div className="text-xs text-gray-400 mb-1">Contracts expiring {'<'} 60 days</div>
          <div className="text-lg font-semibold text-amber-600">{expiring}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg px-4 py-3">
          <div className="text-xs text-gray-400 mb-1">Avg rate (p/kWh)</div>
          <div className="text-lg font-semibold text-gray-900">
            {(CONTRACTS.reduce((a, c) => a + c.ratePencePerKwh, 0) / CONTRACTS.length).toFixed(1)}p
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg px-4 py-3">
          <div className="text-xs text-gray-400 mb-1">Contract node view</div>
          <div className="text-sm text-gray-400">Coming next sprint</div>
        </div>
      </div>
    </div>
  )
}
