import { Dashboard, Group, Settings, HelpFilled, Ai, Notification, Location, DocumentTasks } from '@carbon/icons-react'
import type { ReactNode } from 'react'
import TemLogo from './TemLogo'

export type View = 'briefing' | 'feed' | 'customers' | 'case-file' | 'sites' | 'contracts' | 'backstage'

interface LayoutProps {
  children: ReactNode
  activeView: View
  onNavigate: (v: View) => void
  pendingCount: number
}

const SIDEBAR_GRADIENT = 'linear-gradient(180deg, #ff4500 0%, #ff7018 100%)'

const W  = 'rgba(255,255,255,1)'
const W7 = 'rgba(255,255,255,0.75)'
const W5 = 'rgba(255,255,255,0.5)'
const W3 = 'rgba(255,255,255,0.3)'
const W2 = 'rgba(255,255,255,0.2)'
const W1 = 'rgba(255,255,255,0.12)'

type NavItem = { id: View; label: string; icon: typeof Dashboard; badge?: boolean }
const SECTIONS: Array<{ label: string; items: NavItem[] }> = [
  {
    label: 'OVERVIEW',
    items: [
      { id: 'briefing', label: 'Morning Briefing', icon: Dashboard },
    ],
  },
  {
    label: 'ACTIVITY',
    items: [
      { id: 'feed', label: 'Feed', icon: Notification, badge: true },
    ],
  },
  {
    label: 'OBJECTS',
    items: [
      { id: 'customers', label: 'Customers',  icon: Group },
      { id: 'sites',     label: 'Sites',      icon: Location },
      { id: 'contracts', label: 'Contracts',  icon: DocumentTasks },
    ],
  },
]

function NavButton({
  label, icon: Icon, active, pendingCount, badge, onClick,
}: {
  id?: View
  label: string
  icon: typeof Dashboard
  active: boolean
  pendingCount?: number
  badge?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
      style={
        active
          ? { background: W2, color: W }
          : { color: W7 }
      }
      onMouseEnter={(e) => {
        if (!active) {
          ;(e.currentTarget as HTMLButtonElement).style.background = W1
          ;(e.currentTarget as HTMLButtonElement).style.color = W
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
          ;(e.currentTarget as HTMLButtonElement).style.color = W7
        }
      }}
    >
      <Icon size={15} />
      <span className="flex-1 text-left">{label}</span>
      {badge && pendingCount !== undefined && pendingCount > 0 && (
        <span
          className="text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
          style={{ background: 'rgba(255,255,255,0.9)', color: '#ff4500' }}
        >
          {pendingCount}
        </span>
      )}
    </button>
  )
}

export default function Layout({ children, activeView, onNavigate, pendingCount }: LayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside
        className="w-56 flex-shrink-0 flex flex-col h-full"
        style={{ background: SIDEBAR_GRADIENT }}
      >
        {/* Wordmark + role */}
        <div className="px-5 pt-5 pb-4" style={{ borderBottom: `1px solid ${W1}` }}>
          <div className="flex items-center justify-between">
            <TemLogo width={68} className="text-white" />
            <div className="flex items-center gap-1">
              <svg viewBox="0 0 36 36" width="14" height="14" fill="white">
                <path d="M 31.081 21.338 C 25.586 21.835 21.1 25.831 19.87 31.081 L 16.524 31.081 C 15.292 25.824 10.796 21.824 5.29 21.336 L 5.29 18.655 C 11.052 19.08 15.931 22.68 18.185 27.713 C 20.439 22.68 25.318 19.08 31.081 18.655 Z M 18.376 5.292 C 22.38 5.393 25.594 8.671 25.594 12.699 L 25.592 12.89 C 25.49 16.894 22.213 20.108 18.185 20.108 L 17.994 20.105 C 14.054 20.006 10.878 16.83 10.778 12.89 L 10.776 12.699 C 10.776 8.607 14.093 5.29 18.185 5.29 Z M 18.185 8.053 C 15.619 8.053 13.539 10.133 13.539 12.699 C 13.539 15.265 15.619 17.345 18.185 17.345 C 20.751 17.345 22.831 15.265 22.831 12.699 C 22.831 10.133 20.751 8.053 18.185 8.053 Z" />
              </svg>
              <span className="text-[10px] text-white font-medium tracking-wide">Partner</span>
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="px-4 py-3" style={{ borderBottom: `1px solid ${W1}` }}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: W2 }}
            >
              <span className="text-white text-[11px] font-semibold">AM</span>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-white truncate">Alex Morgan</div>
              <div className="text-xs truncate" style={{ color: W5 }}>Partner Account Manager</div>
            </div>
          </div>
        </div>

        {/* Sectioned nav */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-4">
          {SECTIONS.map(({ label, items }) => (
            <div key={label}>
              <p
                className="px-3 pb-1 text-[9px] font-semibold tracking-widest uppercase"
                style={{ color: W3 }}
              >
                {label}
              </p>
              <div className="space-y-0.5">
                {items.map(({ id, label: itemLabel, icon, badge }) => (
                  <NavButton
                    key={id}
                    id={id}
                    label={itemLabel}
                    icon={icon}
                    active={activeView === id || (id === 'customers' && activeView === 'case-file')}
                    pendingCount={pendingCount}
                    badge={badge}
                    onClick={() => onNavigate(id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer nav */}
        <div className="px-2 py-3 space-y-0.5" style={{ borderTop: `1px solid ${W1}` }}>
          {[
            { label: 'Settings',   icon: Settings  },
            { label: 'Help & docs', icon: HelpFilled },
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
              style={{ color: W5 }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = W1
                ;(e.currentTarget as HTMLButtonElement).style.color = W
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                ;(e.currentTarget as HTMLButtonElement).style.color = W5
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}

          {/* Backstage */}
          <button
            onClick={() => onNavigate('backstage')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors mt-1"
            style={
              activeView === 'backstage'
                ? { background: W2, color: W }
                : { color: W5 }
            }
            onMouseEnter={(e) => {
              if (activeView !== 'backstage') {
                ;(e.currentTarget as HTMLButtonElement).style.background = W1
                ;(e.currentTarget as HTMLButtonElement).style.color = W
              }
            }}
            onMouseLeave={(e) => {
              if (activeView !== 'backstage') {
                ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                ;(e.currentTarget as HTMLButtonElement).style.color = W5
              }
            }}
          >
            <Ai size={15} />
            <span className="flex-1 text-left">How this was built</span>
          </button>
        </div>

        {/* Tagline */}
        <div className="px-4 pb-4">
          <p className="text-[10px] leading-tight" style={{ color: W3 }}>
            Power, as it should be.
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
