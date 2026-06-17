import { useState } from 'react'
import { Bell, Globe, Shield, Palette } from 'lucide-react'
import { Card, CardTitle, CardDescription } from '../../components/ui/Card'
import { Tabs } from '../../components/ui/Tabs'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../hooks/useToast'

const settingsTabs = [
  { id: 'notifications', label: 'Notifications' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'security', label: 'Security' },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('notifications')
  const { addToast } = useToast()

  const handleSave = () => addToast('Settings saved successfully', 'success')

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Settings</h2>
        <p className="text-sm text-text-muted mt-1">Configure your MockMate workspace.</p>
      </div>

      <Tabs tabs={settingsTabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'notifications' && (
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-brand-primary" />
            <div>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what updates you receive.</CardDescription>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: 'New candidate completions', desc: 'Get notified when a candidate finishes an interview' },
              { label: 'Weekly summary reports', desc: 'Receive a weekly digest of hiring activity' },
              { label: 'Score threshold alerts', desc: 'Alert when a candidate scores above your threshold' },
            ].map((item) => (
              <label key={item.label} className="flex items-start gap-3 p-3 rounded-lg hover:bg-bg-subtle cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 rounded text-brand-primary" />
                <div>
                  <p className="text-sm font-medium text-text-primary">{item.label}</p>
                  <p className="text-xs text-text-muted">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'preferences' && (
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-5 h-5 text-brand-primary" />
            <div>
              <CardTitle>Workspace Preferences</CardTitle>
              <CardDescription>Customize your hiring workflow defaults.</CardDescription>
            </div>
          </div>
          <div className="space-y-4">
            <Select
              label="Default Interview Duration"
              options={[
                { value: '15', label: '15 minutes' },
                { value: '30', label: '30 minutes' },
                { value: '45', label: '45 minutes' },
              ]}
              defaultValue="30"
            />
            <Select
              label="Score Threshold for Recommendations"
              options={[
                { value: '70', label: '70% and above' },
                { value: '75', label: '75% and above' },
                { value: '80', label: '80% and above' },
              ]}
              defaultValue="75"
            />
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-text-muted" />
              <Select
                label="Timezone"
                options={[
                  { value: 'utc', label: 'UTC' },
                  { value: 'est', label: 'Eastern Time' },
                  { value: 'pst', label: 'Pacific Time' },
                ]}
                defaultValue="utc"
              />
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-brand-primary" />
            <div>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage security and access settings.</CardDescription>
            </div>
          </div>
          <div className="space-y-4 text-sm text-text-secondary">
            <p>Account security is managed through Clerk. Use the Profile page to update your password and enable two-factor authentication.</p>
            <div className="p-4 bg-bg-subtle rounded-lg">
              <p className="font-medium text-text-primary mb-1">Data Retention</p>
              <p className="text-text-muted">Interview recordings and transcripts are retained for 90 days by default.</p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  )
}
