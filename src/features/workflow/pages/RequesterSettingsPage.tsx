// src/features/workflow/pages/RequesterSettingsPage.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/features/auth/context/auth-context'
import { toast } from 'sonner'

export default function RequesterSettingsPage() {
  const { user } = useAuth()

  const [form, setForm] = useState({
    name: user?.name || 'Pooja Prasad Upadhye',
    email: user?.email || '',
    department: 'Engineering',
    phone: '',
  })

  const handleSave = () => {
    // In a real app → persist via auth service
    toast.success('Profile settings updated successfully')
    console.log('Saved settings:', form)
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header - same style as Requests page */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Main content card - same structure */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={form.department}
              onChange={e => setForm({ ...form, department: e.target.value })}
            />
          </div>

          {/* Optional: add more fields like phone */}
          <div>
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 ..."
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}