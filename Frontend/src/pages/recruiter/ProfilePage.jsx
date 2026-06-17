import { UserProfile } from '@clerk/clerk-react'
import { Card } from '../../components/ui/Card'

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Profile</h2>
        <p className="text-sm text-text-muted mt-1">Manage your account settings and preferences.</p>
      </div>
      <Card padding={false} className="overflow-hidden">
        <UserProfile
          routing="hash"
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none border-0 w-full',
            },
          }}
        />
      </Card>
    </div>
  )
}
