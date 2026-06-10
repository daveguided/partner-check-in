export type RiskLevel = 'high' | 'medium' | 'opportunity' | 'renewal' | 'missing-data'
export type ActionStatus = 'pending' | 'approved' | 'snoozed' | 'wrong' | 'paused'
export type SignalType = 'invoice' | 'consumption' | 'support' | 'renewal' | 'engagement' | 'meter'
export type DataSourceStatus = 'available' | 'delayed' | 'missing'

export type FeedEventType = 'invoice' | 'consumption' | 'renewal' | 'support' | 'meter' | 'opportunity' | 'engagement'

export interface FeedEvent {
  id: string
  type: FeedEventType
  severity: 'high' | 'medium' | 'low'
  customerId: string
  customerName: string
  sector: string
  title: string
  summary: string
  agentNote?: string
  relativeTime: string
  confidence?: number
  recommendedAction?: string
}

export interface Site {
  id: string
  name: string
  customerId: string
  customerName: string
  postcode: string
  supplyType: 'electricity' | 'gas' | 'both'
  meterStatus: DataSourceStatus
  monthlyKwh: number
  monthlySpend: number
  contractEnd: string
  daysToRenewal: number
}

export interface Contract {
  id: string
  customerId: string
  customerName: string
  plan: string
  supplyType: 'electricity' | 'gas' | 'both'
  ratePencePerKwh: number
  startDate: string
  endDate: string
  daysToRenewal: number
  status: 'active' | 'expiring' | 'expired'
}

export interface Signal {
  id: string
  type: SignalType
  title: string
  description: string
  severity: 'high' | 'medium' | 'low'
  dataSource: string
}

export interface Uncertainty {
  id: string
  description: string
}

export interface DataSource {
  name: string
  status: DataSourceStatus
  lastUpdated: string
  detail?: string
}

export interface InvoicePoint {
  month: string
  amount: number
  forecast?: boolean
}

export interface ConsumptionPoint {
  label: string
  site3: number
  baseline: number
  allSites: number
}

export interface Customer {
  id: string
  name: string
  sector: string
  sites: number
  monthlySpend: number
  invoiceChangePercent: number
  riskLevel: RiskLevel
  confidence: number
  renewalDays: number
  portalLastSeen: string
  supportTickets: number
  recommendedAction: string
  partnerOwner: string
  currentPlan: string
  healthScore: number
  agentSummary: string
  agentHighlight: string
  signals: Signal[]
  uncertainties: Uncertainty[]
  dataSources: DataSource[]
  consumptionSeries: ConsumptionPoint[]
  invoiceSeries: InvoicePoint[]
  status: ActionStatus
  contactName: string
  contactEmail: string
  missingData?: boolean
  requiresHumanReview: boolean
  humanReviewReason?: string
}
