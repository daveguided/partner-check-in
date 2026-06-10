import { useState } from 'react'
import { Close } from '@carbon/icons-react'
import type { ActionStatus } from '../types'

interface FeedbackDialogProps {
  customerName: string
  onClose: () => void
  onSubmit: (status: ActionStatus) => void
}

const FEEDBACK_OPTIONS = [
  { id: 'contacted', label: 'Customer already contacted' },
  { id: 'expected',  label: 'Usage change is expected'   },
  { id: 'priority',  label: 'Wrong priority'             },
  { id: 'data',      label: 'Data looks incorrect'       },
  { id: 'other',     label: 'Other'                      },
]

export default function FeedbackDialog({ customerName, onClose, onSubmit }: FeedbackDialogProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!selected) return
    setSubmitted(true)
    setTimeout(() => {
      onSubmit('wrong')
      onClose()
    }, 1800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <div className="text-sm font-semibold text-gray-900">What did the agent get wrong?</div>
            <div className="text-xs text-gray-400 mt-0.5">{customerName}</div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <Close size={14} className="text-gray-400" />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-10 text-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-lg">✓</span>
            </div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Feedback saved</div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Future alerts for this customer will account for expected seasonal production changes.
            </p>
          </div>
        ) : (
          <>
            <div className="px-6 py-5">
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                Your feedback helps the agent improve. This recommendation will be dismissed and won't resurface.
              </p>
              <div className="space-y-2">
                {FEEDBACK_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelected(opt.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors ${
                      selected === opt.id
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/60'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selected === opt.id ? 'border-gray-900' : 'border-gray-300'
                    }`}>
                      {selected === opt.id && (
                        <div className="w-2 h-2 rounded-full bg-gray-900" />
                      )}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-6 pb-5 flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={!selected}
                className="flex-1 bg-gray-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Submit feedback
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
