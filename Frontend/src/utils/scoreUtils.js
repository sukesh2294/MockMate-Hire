export function getScoreColor(score) {
  if (score >= 90) return 'success'
  if (score >= 75) return 'accent-sky'
  if (score >= 60) return 'warning'
  if (score >= 40) return 'info'
  return 'error'
}

export function getScoreLabel(score) {
  if (score >= 90) return 'Excellent'
  if (score >= 75) return 'Good'
  if (score >= 60) return 'Average'
  if (score >= 40) return 'Below Average'
  return 'Poor'
}

export function getRecommendationBadge(status) {
  const map = {
    highly_recommended: { label: 'Highly Recommended', variant: 'success' },
    recommended: { label: '🟢 Recommended', variant: 'success' },
    review: { label: 'Review Needed', variant: 'warning' },
    maybe: { label: 'Maybe', variant: 'warning' },
    rejected: { label: 'Rejected', variant: 'error' },
    pending: { label: 'Pending', variant: 'warning' },
    active: { label: 'Active', variant: 'primary' },
    completed: { label: 'Completed', variant: 'success' },
    draft: { label: 'Draft', variant: 'default' },
  }
  return map[status] || { label: status, variant: 'default' }
}
