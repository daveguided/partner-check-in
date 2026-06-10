import { useState } from 'react'
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

export default function App() {
  const [view, setView] = useState<View>('briefing')
  const [selectedId, setSelectedId] = useState<string>(CUSTOMERS[0].id)
  const [fromView, setFromView] = useState<View>('feed')
  const [statuses, setStatuses] = useState<Record<string, ActionStatus>>(() =>
    Object.fromEntries(CUSTOMERS.map((c) => [c.id, c.status]))
  )
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  const selectedCustomer = CUSTOMERS.find((c) => c.id === selectedId) ?? CUSTOMERS[0]

  const handleStatusChange = (id: string, status: ActionStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: status }))
  }

  // Navigate to customer node, remembering which list we came from
  const handleViewCustomer = (id: string) => {
    setSelectedId(id)
    setFromView(view)
    setView('case-file')
  }

  // From morning briefing metric cards / recommended actions
  const handleSelectFromBriefing = (id: string) => {
    setSelectedId(id)
    setFromView('briefing')
    setView('case-file')
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
      <Layout activeView={view} onNavigate={(v) => setView(v)} pendingCount={pendingCount}>
        {view === 'briefing' && (
          <MorningBriefing
            statuses={statuses}
            onSelectCustomer={handleSelectFromBriefing}
            onViewFeed={() => setView('feed')}
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
            onBack={() => setView(fromView)}
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
