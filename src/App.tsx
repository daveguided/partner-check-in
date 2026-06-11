import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import type { View } from './components/Layout'
import MorningBriefing from './components/MorningBriefing'
import FeedView from './components/FeedView'
import CustomerList from './components/CustomerList'
import CustomerCaseFile from './components/CustomerCaseFile'
import SitesList from './components/SitesList'
import ContractsList from './components/ContractsList'
import FeedbackDialog from './components/FeedbackDialog'
import BackstagePage from './components/BackstagePage'
import { CUSTOMERS } from './data/mockData'
import type { ActionStatus } from './types'

// ── Hash routing ───────────────────────────────────────────────────────────────
const ROUTABLE_VIEWS: View[] = ['briefing', 'feed', 'customers', 'sites', 'contracts', 'backstage']

function parseHash(): { view: View; customerId: string } {
  const raw = window.location.hash.replace(/^#\/?/, '')
  const [seg = '', id = ''] = raw.split('/')
  if (seg === 'customers' && id && CUSTOMERS.some(c => c.id === id)) {
    return { view: 'case-file', customerId: id }
  }
  const view = ROUTABLE_VIEWS.includes(seg as View) ? (seg as View) : 'briefing'
  return { view, customerId: CUSTOMERS[0].id }
}

function pushHash(view: View, customerId?: string) {
  const path = view === 'case-file' && customerId
    ? `/customers/${customerId}`
    : `/${view === 'briefing' ? '' : view}`
  window.location.hash = path
}

export default function App() {
  const initial = parseHash()
  const [view, setViewState] = useState<View>(initial.view)
  const [selectedId, setSelectedId] = useState<string>(initial.customerId)
  const [fromView, setFromView] = useState<View>('feed')
  const [statuses, setStatuses] = useState<Record<string, ActionStatus>>(() =>
    Object.fromEntries(CUSTOMERS.map((c) => [c.id, c.status]))
  )
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  const selectedCustomer = CUSTOMERS.find((c) => c.id === selectedId) ?? CUSTOMERS[0]

  // Sync hash → state on browser back/forward
  useEffect(() => {
    const onHashChange = () => {
      const { view: v, customerId: id } = parseHash()
      setViewState(v)
      setSelectedId(id)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (v: View) => {
    setViewState(v)
    pushHash(v)
  }

  const handleViewCustomer = (id: string) => {
    setSelectedId(id)
    setFromView(view)
    setViewState('case-file')
    pushHash('case-file', id)
  }

  const handleSelectFromBriefing = (id: string) => {
    setSelectedId(id)
    setFromView('briefing')
    setViewState('case-file')
    pushHash('case-file', id)
  }

  const handleStatusChange = (id: string, status: ActionStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: status }))
  }

  const handleFeedbackSubmit = (status: ActionStatus) => {
    handleStatusChange(selectedId, status)
    setFeedbackOpen(false)
  }

  const pendingCount = CUSTOMERS.filter((c) =>
    (statuses[c.id] ?? c.status) === 'pending' && (c.riskLevel === 'high' || c.riskLevel === 'medium')
  ).length

  return (
    <>
      <Layout activeView={view} onNavigate={navigate} pendingCount={pendingCount}>
        {view === 'briefing' && (
          <MorningBriefing
            statuses={statuses}
            onSelectCustomer={handleSelectFromBriefing}
            onViewFeed={() => navigate('feed')}
          />
        )}
        {view === 'feed' && (
          <FeedView onViewCustomer={handleViewCustomer} />
        )}
        {view === 'customers' && (
          <CustomerList statuses={statuses} onViewCustomer={handleViewCustomer} />
        )}
        {view === 'case-file' && (
          <CustomerCaseFile
            customer={selectedCustomer}
            status={statuses[selectedId] ?? selectedCustomer.status}
            onStatusChange={handleStatusChange}
            onBack={() => navigate(fromView)}
            onFeedbackOpen={() => setFeedbackOpen(true)}
          />
        )}
        {view === 'sites' && <SitesList />}
        {view === 'contracts' && <ContractsList />}
        {view === 'backstage' && <BackstagePage />}
      </Layout>

      {feedbackOpen && (
        <FeedbackDialog
          customerName={selectedCustomer.name}
          onClose={() => setFeedbackOpen(false)}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </>
  )
}
