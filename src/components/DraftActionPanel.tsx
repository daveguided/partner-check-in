import { useState } from 'react'
import { Ai, Checkmark, Edit, Renew, ArrowDown, Time, Close, ChevronRight } from '@carbon/icons-react'
import type { Customer, ActionStatus } from '../types'

interface DraftActionPanelProps {
  customer: Customer
  status: ActionStatus
  onStatusChange: (s: ActionStatus) => void
  onFeedbackOpen: () => void
  onSwitchToPreview: () => void
}

const DRAFT_VERSIONS = {
  standard: {
    subject: 'Quick heads-up on your December energy usage',
    body: `Hi Hannah,

Hope you're well — I wanted to get in touch before your December invoice arrives, as I can see a few things in your account worth flagging.

Your usage this month is tracking about 31% higher than November. Most of that increase is coming from Site 3 (Margate Road), which has been running higher than usual between 6am and 9am over the last couple of weeks. Given the cold snap across the region, this is likely heating-related — but I want to make sure you're aware before the invoice lands, rather than after.

A couple of things worth knowing:
• Your contract is up for renewal in January. This is a good moment to review your tariff and make sure you're on the best available option.
• I can share the half-hourly data for Site 3 if that would help you confirm the cause.

Happy to jump on a quick call this week if useful — just reply to this email and I'll find a time that works.

Best,
Alex Morgan
tem Partner · Hargreaves & Neill Energy`,
  },
  softer: {
    subject: 'Your December energy bill — a quick note from us',
    body: `Hi Hannah,

Just a friendly heads-up before your December invoice arrives.

We've noticed usage at Site 3 has been a little higher than usual over the past couple of weeks — most likely because of the cold weather pushing heating demand up early in the morning. It's worth knowing about so the invoice doesn't come as a surprise.

Your renewal is also coming up in January, so it's a good time to have a quick chat about your options if you'd like.

No action needed from you right now — I just wanted to make sure you had the full picture. Feel free to reach out if you have any questions.

Warm regards,
Alex Morgan
tem Partner`,
  },
  savings: {
    subject: 'December usage alert + a savings opportunity for Fallow & Field',
    body: `Hi Hannah,

I'm reaching out ahead of your December invoice, which is tracking higher than usual — mostly down to Site 3 running hotter in the mornings during the cold snap.

I also want to flag something that might be useful timing: with your renewal coming up in January, I've run a quick tariff review and there may be an opportunity to reduce your annual energy costs. Based on your usage profile, switching to RED Flex could save you in the region of £2,800–£3,200 over the next 12 months.

I'd love to show you the numbers before you renew. Would you have 20 minutes this week for a quick call?

Best,
Alex Morgan
tem Partner · Hargreaves & Neill Energy

P.S. Happy to share the half-hourly data for Site 3 if you'd like to understand the December increase in more detail.`,
  },
}

export default function DraftActionPanel({
  customer, status, onStatusChange, onFeedbackOpen, onSwitchToPreview,
}: DraftActionPanelProps) {
  const [generated, setGenerated] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [draftKey, setDraftKey] = useState<keyof typeof DRAFT_VERSIONS>('standard')
  const [editMode, setEditMode] = useState(false)
  const [editedBody, setEditedBody] = useState('')

  const draft = DRAFT_VERSIONS[draftKey]

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => { setGenerating(false); setGenerated(true) }, 900)
  }

  const handleApprove = () => onStatusChange('approved')
  const handleSnooze = () => onStatusChange('snoozed')

  const handleRegenerate = (key: keyof typeof DRAFT_VERSIONS) => {
    setGenerating(true)
    setDraftKey(key)
    setEditMode(false)
    setTimeout(() => setGenerating(false), 600)
  }

  const handleEdit = () => {
    setEditedBody(draft.body)
    setEditMode(true)
  }

  if (status === 'approved') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mb-4">
          <Checkmark size={22} className="text-brand-600" />
        </div>
        <div className="text-lg font-semibold text-gray-900 mb-2">Check-in approved</div>
        <p className="text-sm text-gray-500 max-w-sm">
          This recommendation has been approved and is ready to send. Your send action would dispatch this from your connected email account.
        </p>
        <button
          onClick={onSwitchToPreview}
          className="mt-6 flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium"
        >
          Preview what the customer sees <ChevronRight size={14} />
        </button>
      </div>
    )
  }

  if (status === 'snoozed') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
          <Time size={22} className="text-amber-600" />
        </div>
        <div className="text-lg font-semibold text-gray-900 mb-2">Snoozed for 7 days</div>
        <p className="text-sm text-gray-500 max-w-sm">
          This recommendation will resurface on 16 December. The agent will check if conditions have changed.
        </p>
        <button
          onClick={() => onStatusChange('pending')}
          className="mt-6 text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Undo snooze
        </button>
      </div>
    )
  }

  if (status === 'wrong') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Close size={22} className="text-gray-400" />
        </div>
        <div className="text-lg font-semibold text-gray-900 mb-2">Recommendation dismissed</div>
        <p className="text-sm text-gray-500 max-w-sm">
          Feedback saved. Future alerts for this customer will account for expected seasonal production changes.
        </p>
        <button
          onClick={() => onStatusChange('pending')}
          className="mt-6 text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Restore recommendation
        </button>
      </div>
    )
  }

  if (!generated) {
    return (
      <div className="space-y-5">
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Ready to draft
          </div>
          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            The agent can draft a proactive check-in email from you to <strong className="text-gray-900">{customer.contactName}</strong> at {customer.name}.
            The email will explain the invoice increase, reference Site 3, and offer a tariff review before renewal.
          </p>
          {customer.requiresHumanReview && (
            <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 mb-5 text-sm text-amber-700 flex items-start gap-2">
              <span className="flex-shrink-0 mt-0.5">⚠</span>
              <span>This draft should be reviewed before sending — open billing tickets mean the customer may already be frustrated.</span>
            </div>
          )}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-60"
          >
            <Ai size={15} className="text-tem-orange" />
            {generating ? 'Drafting…' : 'Generate check-in email'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Draft */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
          <div className="flex items-center gap-2">
            <Ai size={14} className="text-tem-orange" />
            <span className="text-xs font-semibold text-gray-500">
              Agent draft · {draftKey === 'standard' ? 'Standard tone' : draftKey === 'softer' ? 'Softer tone' : 'With savings angle'}
            </span>
          </div>
          <span className="text-xs text-gray-400">Not sent automatically</span>
        </div>

        <div className={`p-5 transition-opacity duration-300 ${generating ? 'opacity-40' : 'opacity-100'}`}>
          <div className="text-xs text-gray-400 mb-1">To</div>
          <div className="text-sm font-medium text-gray-900 mb-3">{customer.contactName} &lt;{customer.contactEmail}&gt;</div>

          <div className="text-xs text-gray-400 mb-1">Subject</div>
          <div className="text-sm font-medium text-gray-900 mb-4 pb-4 border-b border-gray-50">{draft.subject}</div>

          {editMode ? (
            <textarea
              className="w-full text-sm text-gray-700 leading-relaxed border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:border-gray-400 transition-colors"
              rows={14}
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
            />
          ) : (
            <pre className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
              {draft.body}
            </pre>
          )}
        </div>
      </div>

      {/* Primary actions */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleApprove}
          className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Checkmark size={14} />
          Approve
        </button>
        <button
          onClick={handleEdit}
          className="flex items-center gap-2 border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Edit size={14} />
          Edit
        </button>
        {editMode && (
          <button
            onClick={() => setEditMode(false)}
            className="flex items-center gap-2 border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel edit
          </button>
        )}
      </div>

      {/* Secondary actions */}
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Regenerate or adjust</div>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => handleRegenerate('softer')}
            className="flex items-center gap-2.5 text-left px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Renew size={13} className="text-gray-400 flex-shrink-0" />
            Regenerate softer
            <span className="ml-auto text-xs text-gray-400">Less urgent, more reassuring</span>
          </button>
          <button
            onClick={() => handleRegenerate('savings')}
            className="flex items-center gap-2.5 text-left px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ArrowDown size={13} className="text-gray-400 flex-shrink-0" />
            Add savings angle
            <span className="ml-auto text-xs text-gray-400">Include tariff review offer</span>
          </button>
        </div>
      </div>

      {/* Tertiary */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleSnooze}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Time size={13} />
          Snooze 7 days
        </button>
        <button
          onClick={onFeedbackOpen}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Close size={13} />
          Mark recommendation wrong
        </button>
        <button
          onClick={onSwitchToPreview}
          className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 border border-brand-200 px-3 py-2 rounded-lg hover:bg-brand-50 transition-colors ml-auto"
        >
          Preview customer view <ChevronRight size={13} />
        </button>
      </div>
    </div>
  )
}
