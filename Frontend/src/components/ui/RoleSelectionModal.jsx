import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { persistAuthRole } from '../../utils/authRole'
import { Button } from './Button'
import { Modal } from './Modal'

/** @typedef {'recruiter' | 'candidate'} RoleSelection */

const roleCards = [
  {
    role: 'recruiter',
    label: '👨‍💼 Recruiter / HR',
    description: 'Recruiter page will be open. Create interviews, manage candidates, and view reports.',
  },
  {
    role: 'candidate',
    label: '👨‍🎓 Candidate',
    description: 'Candidate page will open. Attend AI interviews and track interview status.',
  },
]

/**
 * Role picker shown from Sign In / Start Hiring actions on the landing page.
 */
export function RoleSelectionModal({
  open,
  actionType,
  selectedRole,
  onSelectRole,
  onClose,
}) {
  const navigate = useNavigate()
  const firstCardRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    firstCardRef.current?.focus()
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  const candidateDisabled = actionType === 'starthiring'
  const hasSelection = Boolean(selectedRole)
  const canContinue = hasSelection && !(candidateDisabled && selectedRole === 'candidate')

  const handleContinue = () => {
    if (!canContinue || !selectedRole) return

    persistAuthRole(selectedRole)

    const query = `?role=${selectedRole}`
    const destination = actionType === 'starthiring' ? `/auth/signup${query}` : `/auth/login${query}`

    onClose()
    navigate(destination)
  }

  return (
    <Modal open={open} onClose={onClose} title="Choose Your Role" size="md">
      <div className="space-y-5">
        <p className="text-sm text-text-tertiary">Select how you want to continue</p>

        <div className="grid gap-4 sm:grid-cols-2" role="listbox" aria-label="Select your role">
          {roleCards.map((card, index) => {
            const isSelected = selectedRole === card.role
            const disabled = candidateDisabled && card.role === 'candidate'
            return (
              <button
                key={card.role}
                ref={index === 0 ? firstCardRef : null}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={disabled}
                onClick={() => !disabled && onSelectRole(card.role)}
                className={
                  `group text-left rounded-3xl border p-5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 ` +
                  ` ${isSelected ? 'border-brand-primary bg-brand-primary/10 shadow-sm' : 'border-border-default bg-bg-base hover:border-brand-primary hover:bg-brand-primary/5'} ` +
                  ` ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`
                }
                aria-pressed={isSelected}
                aria-disabled={disabled}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-text-primary">{card.label}</span>
                  {isSelected && <span className="text-sm text-brand-primary">Selected</span>}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{card.description}</p>
                {disabled && (
                  <p className="mt-4 rounded-2xl bg-warning/10 px-3 py-2 text-xs text-warning">
                    Start Hiring is available only for Recruiters.
                  </p>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" size="md" onClick={onClose}>Cancel</Button>
          <Button size="md" onClick={handleContinue} disabled={!canContinue}>
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  )
}
