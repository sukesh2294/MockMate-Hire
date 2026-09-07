import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Card } from './Card'
import { Button } from './Button'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled React Error:', error, errorInfo)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  handleHome = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 bg-bg-base">
          <Card className="max-w-md w-full text-center p-8 space-y-6 border-error/20 bg-bg-card">
            <div className="w-14 h-14 rounded-2xl bg-error/10 text-error flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-text-primary">Something went wrong</h2>
              <p className="text-xs text-text-tertiary leading-relaxed">
                An unexpected application error occurred. You can reload the page or return to the main dashboard.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 rounded-lg bg-bg-subtle border border-border-default text-left font-mono text-[11px] text-text-secondary overflow-x-auto">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <Button variant="outline" className="flex-1 text-xs" onClick={this.handleReload}>
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reload Page
              </Button>
              <Button variant="primary" className="flex-1 text-xs" onClick={this.handleHome}>
                <Home className="w-3.5 h-3.5 mr-1.5" /> Go Home
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
